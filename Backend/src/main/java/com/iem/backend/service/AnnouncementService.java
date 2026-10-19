package com.iem.backend.service;

import com.iem.backend.model.Announcement;
import com.iem.backend.model.AnnouncementAudience;
import com.iem.backend.model.AnnouncementReply;
import com.iem.backend.model.Role;
import com.iem.backend.model.UserAccount;
import com.iem.backend.repository.AnnouncementReplyRepository;
import com.iem.backend.repository.AnnouncementRepository;
import com.iem.backend.repository.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    private static final Logger log = LoggerFactory.getLogger(AnnouncementService.class);
    private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "createdAt");

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementReplyRepository announcementReplyRepository;
    private final SmsNotificationService smsNotificationService;
    private final UserAccountRepository userAccountRepository;
    private final EmailService emailService;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                                AnnouncementReplyRepository announcementReplyRepository,
                                SmsNotificationService smsNotificationService,
                                UserAccountRepository userAccountRepository,
                                EmailService emailService) {
        this.announcementRepository = announcementRepository;
        this.announcementReplyRepository = announcementReplyRepository;
        this.smsNotificationService = smsNotificationService;
        this.userAccountRepository = userAccountRepository;
        this.emailService = emailService;
    }

    public List<Announcement> findAll() {
        return announcementRepository.findAll(NEWEST_FIRST);
    }

    /**
     * Returns only the announcements a given role is allowed to see.
     * ADMIN sees everything (it's the management view).
     * TEACHER sees ALL + STAFF + TEACHERS.
     * STUDENT sees ALL + STUDENTS.
     */
    public List<Announcement> findVisibleFor(String role) {
        String normalized = role == null ? "" : role.trim().toUpperCase();

        if (normalized.equals("ADMIN")) {
            return findAll();
        }
        if (normalized.equals("TEACHER")) {
            return announcementRepository.findByAudienceIn(
                    List.of(AnnouncementAudience.ALL, AnnouncementAudience.STAFF, AnnouncementAudience.TEACHERS),
                    NEWEST_FIRST);
        }
        if (normalized.equals("STUDENT")) {
            return announcementRepository.findByAudienceIn(
                    List.of(AnnouncementAudience.ALL, AnnouncementAudience.STUDENTS),
                    NEWEST_FIRST);
        }
        // Unknown role: fall back to the public/general announcements only.
        return announcementRepository.findByAudienceIn(List.of(AnnouncementAudience.ALL), NEWEST_FIRST);
    }

    public Announcement findById(Long id) {
        return announcementRepository.findById(id).orElseThrow();
    }

    public Announcement save(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public Announcement saveAndNotify(Announcement announcement) {
        Announcement saved = announcementRepository.save(announcement);
        notifyRecipients(saved);
        return saved;
    }

    public void deleteById(Long id) {
        announcementRepository.deleteById(id);
    }

    public List<AnnouncementReply> findReplies(Long announcementId) {
        return announcementReplyRepository.findByAnnouncementIdOrderByCreatedAtAsc(announcementId);
    }

    public AnnouncementReply addReply(Long announcementId, AnnouncementReply reply) {
        Announcement announcement = findById(announcementId);
        if (!announcement.isAllowReplies()) {
            throw new IllegalStateException("Replies are disabled for this announcement");
        }
        reply.setAnnouncement(announcement);
        return announcementReplyRepository.save(reply);
    }

    private void notifyRecipients(Announcement announcement) {
        if (announcement == null) return;

        AnnouncementAudience audience = announcement.getAudience();

        // 1) Resolve recipients by audience
        List<UserAccount> recipients;
        switch (audience) {
            case ALL      -> recipients = userAccountRepository.findAll();
            case STAFF    -> recipients = userAccountRepository.findByRoleIn(
                                List.of(Role.ADMIN, Role.TEACHER, Role.TITULAIRE));
            case TEACHERS -> recipients = userAccountRepository.findByRoleIn(
                                List.of(Role.TEACHER, Role.TITULAIRE));
            case STUDENTS -> recipients = userAccountRepository.findByRole(Role.STUDENT);
            default       -> recipients = List.of();
        }

        // 2) Keep only enabled users with an email
        recipients = recipients.stream()
                .filter(UserAccount::isEnabled)
                .filter(u -> u.getEmail() != null && !u.getEmail().isBlank())
                .toList();

        log.info("Announcement '{}' audience={} -> {} email recipients",
                announcement.getTitle(), audience, recipients.size());

        // 3) Send emails if the flag is set
        if (announcement.isSendEmail()) {
            for (UserAccount u : recipients) {
                try {
                    emailService.sendSimpleMessage(
                            u.getEmail(),
                            announcement.getTitle(),
                            announcement.getMessage()
                    );
                    log.info("Emailed announcement '{}' to {}", announcement.getTitle(), u.getEmail());
                } catch (Exception e) {
                    log.error("Failed to email {}: {}", u.getEmail(), e.getMessage());
                }
            }
        }

        // 4) SMS for students (existing path)
        boolean reachesStudents = audience == AnnouncementAudience.STUDENTS
                               || audience == AnnouncementAudience.ALL;
        if (reachesStudents && announcement.isSendSms()) {
            log.info("Announcement '{}' reaches students: sending SMS.", announcement.getTitle());
            smsNotificationService.sendStudentNotification(announcement);
        }
    }
}
