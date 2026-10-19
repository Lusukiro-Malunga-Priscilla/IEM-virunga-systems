// package com.iem.backend.service;

// import com.iem.backend.model.Role;
// import com.iem.backend.model.Teacher;
// import com.iem.backend.model.UserAccount;
// import com.iem.backend.repository.TeacherRepository;
// import com.iem.backend.repository.UserAccountRepository;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.time.LocalDate;
// import java.util.List;
// import java.util.Optional;

// @Service
// public class TeacherService {

//     private static final Logger logger = LoggerFactory.getLogger(TeacherService.class);

//     /**
//      * Temporary password assigned to every newly-created teacher.
//      * The teacher is expected to change it after the first login.
//      * Keep this in sync with whatever you tell the admin/teacher.
//      */
//     public static final String DEFAULT_TEMP_PASSWORD = "Temporaire123!";

//     private final TeacherRepository teacherRepository;
//     private final UserAccountRepository userAccountRepository;
//     private final PasswordEncoder passwordEncoder;

//     public TeacherService(TeacherRepository teacherRepository,
//                           UserAccountRepository userAccountRepository,
//                           PasswordEncoder passwordEncoder) {
//         this.teacherRepository = teacherRepository;
//         this.userAccountRepository = userAccountRepository;
//         this.passwordEncoder = passwordEncoder;
//     }

//     public List<Teacher> findAll() {
//         return teacherRepository.findAll();
//     }

//     public Optional<Teacher> findById(Long id) {
//         return teacherRepository.findById(id);
//     }

//     public Optional<Teacher> findByEmail(String email) {
//         return teacherRepository.findByEmail(email);
//     }

//     public List<Teacher> searchTeachers(String search) {
//         return teacherRepository.searchTeachers(search);
//     }

//     public List<Teacher> findByType(String type) {
//         return teacherRepository.findByType(type);
//     }

//     public List<Teacher> findAvailableTeachers() {
//         return teacherRepository.findByDisponibleTrue();
//     }

//     /**
//      * Saves a teacher and, if no UserAccount exists for the email, creates one
//      * with role=TEACHER and the DEFAULT_TEMP_PASSWORD.
//      *
//      * IMPORTANT: when updating an existing teacher (same email), the existing
//      * UserAccount's password is NOT touched  so a teacher who has already
//      * changed their password won't get reset.
//      */
//     @Transactional
//     public Teacher save(Teacher teacher) {
//         String normalizedEmail = teacher.getEmail() == null
//                 ? null
//                 : teacher.getEmail().trim().toLowerCase();

//         if (normalizedEmail == null || normalizedEmail.isEmpty()) {
//             throw new IllegalArgumentException("Email is required.");
//         }
//         teacher.setEmail(normalizedEmail);

//         Optional<UserAccount> existing = userAccountRepository.findByEmail(normalizedEmail);
//         if (existing.isEmpty()) {
//             UserAccount account = new UserAccount();
//             account.setUsername(normalizedEmail);
//             account.setEmail(normalizedEmail);
//             account.setPassword(passwordEncoder.encode(DEFAULT_TEMP_PASSWORD));
//             account.setRole(Role.TEACHER);
//             account.setEnabled(true);
//             userAccountRepository.save(account);
//             logger.info("Created UserAccount for teacher {} with default temp password", normalizedEmail);
//         } else {
//             logger.info("Reusing existing UserAccount for teacher {}", normalizedEmail);
//         }

//         if (teacher.getCreatedAt() == null) teacher.setCreatedAt(LocalDate.now());
//         teacher.setUpdatedAt(LocalDate.now());

//         return teacherRepository.save(teacher);
//     }

//     @Transactional
//     public Teacher update(Long id, Teacher details) {
//         Teacher existing = teacherRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));

//         existing.setPrenom(details.getPrenom());
//         existing.setNom(details.getNom());
//         existing.setTelephone(details.getTelephone());
//         existing.setType(details.getType());
//         existing.setCoursDispense(details.getCoursDispense());
//         existing.setDateEmbauche(details.getDateEmbauche());
//         existing.setDisponible(details.getDisponible());
//         existing.setJourneePedagogique(details.getJourneePedagogique());
//         existing.setUpdatedAt(LocalDate.now());

//         // If the email changed, update it on both the teacher and their UserAccount.
//         if (details.getEmail() != null) {
//             String newEmail = details.getEmail().trim().toLowerCase();
//             String oldEmail = existing.getEmail();
//             if (!newEmail.equals(oldEmail)) {
//                 existing.setEmail(newEmail);
//                 userAccountRepository.findByEmail(oldEmail).ifPresent(acc -> {
//                     acc.setUsername(newEmail);
//                     acc.setEmail(newEmail);
//                     userAccountRepository.save(acc);
//                     logger.info("Updated UserAccount email {} -> {}", oldEmail, newEmail);
//                 });
//             }
//         }

//         return teacherRepository.save(existing);
//     }

//     @Transactional
//     public void deleteById(Long id) {
//         Teacher teacher = teacherRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));

//         userAccountRepository.findByEmail(teacher.getEmail())
//                 .ifPresent(acc -> {
//                     userAccountRepository.delete(acc);
//                     logger.info("Deleted UserAccount for teacher {}", teacher.getEmail());
//                 });

//         teacherRepository.deleteById(id);
//     }

//     @Transactional
//     public Teacher toggleAvailability(Long id) {
//         Teacher teacher = teacherRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));
//         teacher.setDisponible(!Boolean.TRUE.equals(teacher.getDisponible()));
//         teacher.setUpdatedAt(LocalDate.now());
//         return teacherRepository.save(teacher);
//     }

//     @Transactional
//     public void importTeachers(List<Teacher> teachers) {
//         for (Teacher teacher : teachers) {
//             if (teacherRepository.findByEmail(teacher.getEmail()).isEmpty()) {
//                 save(teacher);
//             }
//         }
//     }
// }


package com.iem.backend.service;

import com.iem.backend.model.Role;
import com.iem.backend.model.Teacher;
import com.iem.backend.model.UserAccount;
import com.iem.backend.repository.TeacherRepository;
import com.iem.backend.repository.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Optional;

/**
 * Prerequisite: add `matricule`, `qualification`, `fonction`, `nationality`
 * and `photo` (all String; `photo` should be a TEXT/LONGTEXT column since it
 * stores a base64 data URL) to Teacher.java, with matching getters/setters.
 * See STUDENT_TEACHER_MODEL_CHANGES.md.
 */
@Service
public class TeacherService {

    private static final Logger logger = LoggerFactory.getLogger(TeacherService.class);

    /**
     * Temporary password assigned to every newly-created teacher.
     * The teacher is expected to change it after the first login.
     * Keep this in sync with whatever you tell the admin/teacher.
     */
    public static final String DEFAULT_TEMP_PASSWORD = "Temporaire123!";

    private final TeacherRepository teacherRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherService(TeacherRepository teacherRepository,
                          UserAccountRepository userAccountRepository,
                          PasswordEncoder passwordEncoder) {
        this.teacherRepository = teacherRepository;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Teacher> findAll() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> findById(Long id) {
        return teacherRepository.findById(id);
    }

    public Optional<Teacher> findByEmail(String email) {
        return teacherRepository.findByEmail(email);
    }

    public List<Teacher> searchTeachers(String search) {
        return teacherRepository.searchTeachers(search);
    }

    public List<Teacher> findByType(String type) {
        return teacherRepository.findByType(type);
    }

    public List<Teacher> findAvailableTeachers() {
        return teacherRepository.findByDisponibleTrue();
    }

    /**
     * Saves a teacher and, if no UserAccount exists for the email, creates one
     * with role=TEACHER and the DEFAULT_TEMP_PASSWORD. A matricule is
     * auto-generated (prefix "ENS-") when none is supplied.
     *
     * IMPORTANT: when updating an existing teacher (same email), the existing
     * UserAccount's password is NOT touched  so a teacher who has already
     * changed their password won't get reset.
     */
    @Transactional
    public Teacher save(Teacher teacher) {
        String normalizedEmail = teacher.getEmail() == null
                ? null
                : teacher.getEmail().trim().toLowerCase();

        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }
        teacher.setEmail(normalizedEmail);

        // Auto-generate matricule if missing
        if (teacher.getMatricule() == null || teacher.getMatricule().isEmpty()) {
            teacher.setMatricule(generateMatricule());
            logger.info("Generated matricule {} for teacher {}", teacher.getMatricule(), normalizedEmail);
        }

        Optional<UserAccount> existing = userAccountRepository.findByEmail(normalizedEmail);
        if (existing.isEmpty()) {
            UserAccount account = new UserAccount();
            account.setUsername(normalizedEmail);
            account.setEmail(normalizedEmail);
            account.setPassword(passwordEncoder.encode(DEFAULT_TEMP_PASSWORD));
            account.setRole(Role.TEACHER);
            account.setEnabled(true);
            userAccountRepository.save(account);
            logger.info("Created UserAccount for teacher {} with default temp password", normalizedEmail);
        } else {
            logger.info("Reusing existing UserAccount for teacher {}", normalizedEmail);
        }

        if (teacher.getCreatedAt() == null) teacher.setCreatedAt(LocalDate.now());
        teacher.setUpdatedAt(LocalDate.now());

        return teacherRepository.save(teacher);
    }

    @Transactional
    public Teacher update(Long id, Teacher details) {
        Teacher existing = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));

        existing.setPrenom(details.getPrenom());
        existing.setNom(details.getNom());
        existing.setTelephone(details.getTelephone());
        existing.setType(details.getType());
        existing.setCoursDispense(details.getCoursDispense());
        existing.setDateEmbauche(details.getDateEmbauche());
        if (details.getDisponible() != null) {
            existing.setDisponible(details.getDisponible());
        }
        existing.setJourneePedagogique(details.getJourneePedagogique());
        // NEW fields  matricule is intentionally NOT overwritten here so it
        // stays stable once assigned; edit it directly in the DB if needed.
        if (details.getQualification() != null) existing.setQualification(details.getQualification());
        if (details.getFonction() != null)       existing.setFonction(details.getFonction());
        if (details.getNationality() != null)    existing.setNationality(details.getNationality());
        if (details.getPhoto() != null)           existing.setPhoto(details.getPhoto());
        existing.setUpdatedAt(LocalDate.now());

        // If the email changed, update it on both the teacher and their UserAccount.
        if (details.getEmail() != null) {
            String newEmail = details.getEmail().trim().toLowerCase();
            String oldEmail = existing.getEmail();
            if (!newEmail.equals(oldEmail)) {
                existing.setEmail(newEmail);
                userAccountRepository.findByEmail(oldEmail).ifPresent(acc -> {
                    acc.setUsername(newEmail);
                    acc.setEmail(newEmail);
                    userAccountRepository.save(acc);
                    logger.info("Updated UserAccount email {} -> {}", oldEmail, newEmail);
                });
            }
        }

        return teacherRepository.save(existing);
    }

    @Transactional
    public void deleteById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));

        userAccountRepository.findByEmail(teacher.getEmail())
                .ifPresent(acc -> {
                    userAccountRepository.delete(acc);
                    logger.info("Deleted UserAccount for teacher {}", teacher.getEmail());
                });

        teacherRepository.deleteById(id);
    }

    @Transactional
    public Teacher toggleAvailability(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));
        teacher.setDisponible(!Boolean.TRUE.equals(teacher.getDisponible()));
        teacher.setUpdatedAt(LocalDate.now());
        return teacherRepository.save(teacher);
    }

    @Transactional
    public void importTeachers(List<Teacher> teachers) {
        for (Teacher teacher : teachers) {
            if (teacherRepository.findByEmail(teacher.getEmail()).isEmpty()) {
                save(teacher);
            }
        }
    }

    //  MATRICULE 

    /**
     * Generates a teacher matricule like "ENS-2601", "ENS-2602"... using the
     * current 2-digit year, mirroring StudentService.generateRegistrationNumber.
     */
    public String generateMatricule() {
        String yearDigits = String.valueOf(Year.now().getValue()).substring(2);
        String prefix = "ENS-" + yearDigits;

        long countWithPrefix = teacherRepository.findAll().stream()
                .filter(t -> t.getMatricule() != null && t.getMatricule().startsWith(prefix))
                .count();

        String candidate = "";
        long seq = countWithPrefix + 1;
        while (true) {
            candidate = prefix + String.format("%02d", seq);
            final String currentCandidate = candidate;
            seq++;
            boolean exists = teacherRepository.findAll().stream()
                    .anyMatch(t -> currentCandidate.equals(t.getMatricule()));
            if (!exists) {
                return currentCandidate;
            }
        }
    }
}
