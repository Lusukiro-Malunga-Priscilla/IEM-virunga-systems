package com.iem.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 4000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_audience")
    private AnnouncementAudience audience = AnnouncementAudience.ALL;

    /** Whether recipients are allowed to reply/comment on this announcement. */
    private boolean allowReplies = true;

    private boolean sendEmail;
    private boolean sendSms;

    private String authorUsername;
    private String authorName;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "announcement", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"announcement", "hibernateLazyInitializer", "handler"})
    private List<AnnouncementReply> replies = new ArrayList<>();

    public Announcement() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AnnouncementAudience getAudience() {
        return audience;
    }

    public void setAudience(AnnouncementAudience audience) {
        this.audience = audience;
    }

    public boolean isAllowReplies() {
        return allowReplies;
    }

    public void setAllowReplies(boolean allowReplies) {
        this.allowReplies = allowReplies;
    }

    public boolean isSendEmail() {
        return sendEmail;
    }

    public void setSendEmail(boolean sendEmail) {
        this.sendEmail = sendEmail;
    }

    public boolean isSendSms() {
        return sendSms;
    }

    public void setSendSms(boolean sendSms) {
        this.sendSms = sendSms;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<AnnouncementReply> getReplies() {
        return replies;
    }

    public void setReplies(List<AnnouncementReply> replies) {
        this.replies = replies;
    }
}
