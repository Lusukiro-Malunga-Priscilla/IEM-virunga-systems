package com.iem.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioNotificationGateway implements NotificationGateway {

    private static final Logger log = LoggerFactory.getLogger(TwilioNotificationGateway.class);

    @Value("${app.notification.twilio.enabled:false}")
    private boolean enabled;

    @Value("${app.notification.twilio.account-sid:}")
    private String accountSid;

    @Value("${app.notification.twilio.auth-token:}")
    private String authToken;

    @Value("${app.notification.twilio.from-number:}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        if (enabled && !accountSid.isBlank() && !authToken.isBlank()) {
            Twilio.init(accountSid, authToken);
        }
    }

    @Override
    public boolean send(String to, String body, String channel) {
        if (!enabled) {
            log.warn("Twilio notifications are disabled. Message not sent to {}.", to);
            return false;
        }

        if (accountSid.isBlank() || authToken.isBlank() || fromNumber.isBlank()) {
            log.warn("Twilio credentials are incomplete. Message not sent to {}.", to);
            return false;
        }

        try {
            String normalizedTo = normalizePhone(to, channel);
            String normalizedFrom = normalizePhone(fromNumber, channel);
            Message.creator(new PhoneNumber(normalizedTo), new PhoneNumber(normalizedFrom), body).create();
            log.info("Sent {} notification to {}", channel, to);
            return true;
        } catch (Exception ex) {
            log.error("Failed to send {} notification to {}: {}", channel, to, ex.getMessage());
            return false;
        }
    }

    private String normalizePhone(String value, String channel) {
        String normalized = value == null ? "" : value.trim();
        if (channel != null && channel.equalsIgnoreCase("whatsapp") && !normalized.startsWith("whatsapp:")) {
            return "whatsapp:" + normalized;
        }
        return normalized;
    }
}
