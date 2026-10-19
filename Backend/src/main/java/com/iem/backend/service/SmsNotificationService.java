package com.iem.backend.service;

import com.iem.backend.model.Announcement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsNotificationService {

    private static final Logger log = LoggerFactory.getLogger(SmsNotificationService.class);

    private final NotificationGateway notificationGateway;
    private final String studentPhone;
    private final String channel;

    public SmsNotificationService(NotificationGateway notificationGateway,
                                  @Value("${app.notification.student-phone:+250790003592}") String studentPhone,
                                  @Value("${app.notification.channel:sms}") String channel) {
        this.notificationGateway = notificationGateway;
        this.studentPhone = studentPhone;
        this.channel = channel;
    }

    public boolean sendStudentNotification(Announcement announcement) {
        if (announcement == null) {
            return false;
        }

        String body = buildBody(announcement);
        boolean sent = notificationGateway.send(studentPhone, body, channel);
        if (!sent) {
            log.warn("Student notification could not be dispatched to {}. Check provider configuration.", studentPhone);
        }
        return sent;
    }

    private String buildBody(Announcement announcement) {
        String title = announcement.getTitle() == null ? "IEM Notification" : announcement.getTitle();
        String message = announcement.getMessage() == null ? "" : announcement.getMessage();
        return "IEM Notification\nTitle: " + title + "\n" + message;
    }
}
