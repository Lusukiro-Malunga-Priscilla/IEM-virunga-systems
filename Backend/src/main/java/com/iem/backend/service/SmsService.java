package com.iem.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${sms.fallback-to-console:true}")
    private boolean fallbackToConsole;

    // Institute's own WhatsApp Business number (RDC / DRC). Used as the
    // sender identity once a real WhatsApp provider (Twilio, Meta Cloud
    // API, etc.) is wired up in sendWhatsapp() below.
    private static final String IEM_WHATSAPP_NUMBER = "+243984274081";

    private static final String DRC_COUNTRY_CODE = "+243";

    /**
     * Send an SMS message.
     * For production, integrate with an SMS provider like Twilio, Africa's Talking, etc.
     */
    public void sendSms(String phoneNumber, String message) {
        dispatch("SMS", phoneNumber, message);
    }

    /**
     * Send a WhatsApp message via the institute's WhatsApp Business number.
     * TODO: integrate with a real WhatsApp Business API provider (Twilio,
     * Meta Cloud API, etc.). Until then this logs the same way as SMS so the
     * message content and delivery attempt are still visible during dev.
     */
    public void sendWhatsapp(String phoneNumber, String message) {
        dispatch("WHATSAPP", phoneNumber, message);
    }

    private void dispatch(String channel, String phoneNumber, String message) {
        if (!smsEnabled) {
            if (fallbackToConsole) {
                System.out.println("[" + channel + " DISPATCH] To=" + phoneNumber + " | Message=" + message);
            }
            return;
        }

        try {
            String formattedNumber = formatPhoneNumber(phoneNumber);

            // TODO: Integrate with actual SMS / WhatsApp provider.
            // For WhatsApp, the sender identity would be IEM_WHATSAPP_NUMBER.
            System.out.println("\uD83D\uDCF1 " + channel + " sent to: " + formattedNumber);
            System.out.println("   Message: " + message);

            if (fallbackToConsole) {
                System.out.println("[" + channel + " FALLBACK] To=" + formattedNumber + " | Message=" + message);
            }
        } catch (Exception e) {
            System.err.println("\u274C Failed to send " + channel + " to " + phoneNumber + ": " + e.getMessage());
            if (fallbackToConsole) {
                System.out.println("[" + channel + " FALLBACK] To=" + phoneNumber + " | Message=" + message);
            }
        }
    }

    /**
     * Format phone number for the SMS/WhatsApp gateway, defaulting to the
     * DRC country code (+243) since IEM Virunga is based in the DRC.
     */
    private String formatPhoneNumber(String phone) {
        if (phone == null || phone.isEmpty()) return phone;

        // Remove all whitespace and special characters except +
        String cleaned = phone.replaceAll("[\\s\\-()]", "");

        // Local numbers starting with 0 (e.g. 0984274081) -> +243984274081
        if (cleaned.startsWith("0") && !cleaned.startsWith("+")) {
            cleaned = DRC_COUNTRY_CODE + cleaned.substring(1);
        }

        // No country code and no leading 00 -> assume DRC
        if (!cleaned.startsWith("+") && !cleaned.startsWith("00")) {
            cleaned = DRC_COUNTRY_CODE + cleaned;
        }

        return cleaned;
    }

    public void sendOtpSms(String phoneNumber, String otp) {
        String message = String.format(
            "IEM Virunga: Your OTP is %s. Valid for 5 minutes.",
            otp
        );
        sendSms(phoneNumber, message);
    }

    public void sendRegistrationConfirmationSms(String phoneNumber, String name, String registrationNumber, String password) {
        sendSms(phoneNumber, registrationConfirmationMessage(name, registrationNumber, password));
    }

    public void sendRegistrationConfirmationWhatsapp(String phoneNumber, String name, String registrationNumber, String password) {
        sendWhatsapp(phoneNumber, registrationConfirmationMessage(name, registrationNumber, password));
    }

    /**
     * Sends the registration confirmation over both SMS and WhatsApp, as
     * requested for new student registrations.
     */
    public void sendRegistrationConfirmationAllChannels(String phoneNumber, String name, String registrationNumber, String password) {
        String message = registrationConfirmationMessage(name, registrationNumber, password);
        sendSms(phoneNumber, message);
        sendWhatsapp(phoneNumber, message);
    }

    private String registrationConfirmationMessage(String name, String registrationNumber, String password) {
        return String.format(
            "Bienvenue %s  IEM Virunga! Matricule: %s, Mot de passe: %s. Connectez-vous sur http://localhost:3000/login",
            name, registrationNumber, password
        );
    }

    public void sendWelcomeSms(String phoneNumber, String firstName, String lastName) {
        String message = String.format(
            "Bienvenue %s %s  IEM Virunga! Nous sommes ravis de vous compter parmi nous.",
            firstName, lastName
        );
        sendSms(phoneNumber, message);

    }

}
