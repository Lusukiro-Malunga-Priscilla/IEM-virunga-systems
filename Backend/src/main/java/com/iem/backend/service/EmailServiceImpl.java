package com.iem.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
        logger.info(">>> EmailServiceImpl bean constructed with mailSender={}", mailSender);
    }

    @Override
    public void sendSimpleMessage(String to, String subject, String body) {
        logger.info(">>> EmailServiceImpl.sendSimpleMessage START to={} subject={}", to, subject);
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            logger.info(">>> About to call mailSender.send() for {}", to);
            mailSender.send(msg);
            logger.info(">>> mailSender.send() returned OK for {}", to);
        } catch (Exception e) {
            logger.error(">>> mailSender.send() THREW for {}: {}", to, e.getMessage(), e);
            throw e;
        }
        logger.info(">>> EmailServiceImpl.sendSimpleMessage END to={}", to);
    }

    @Override
    public void sendOtpEmail(String to, String otp) {
        sendSimpleMessage(to, "Votre code de vrification",
                "Votre code OTP est : " + otp + "\nIl expire dans 10 minutes.");
    }

    @Override
    public void sendWelcomeEmail(String to, String firstName, String lastName,
                                 String role, String password) {
        String body = "Bonjour " + firstName + " " + lastName + ",\n\n"
                + "Votre compte (" + role + ") a t cr.\n"
                + "Identifiant : " + to + "\n"
                + "Mot de passe : " + password + "\n\n"
                + "Merci de le changer aprs votre premire connexion.";
        sendSimpleMessage(to, "Bienvenue sur IEM", body);
    }

    @Override
    public void sendRegistrationConfirmation(String to, String name,
                                             String registrationNumber,
                                             String password) {
        logger.info(">>> EmailServiceImpl.sendRegistrationConfirmation START to={} name={} reg={}",
                to, name, registrationNumber);
        String subject = "Confirmation d'inscription - IEM";
        String body = "Bonjour " + name + ",\n\n"
                + "Votre inscription a t enregistre avec succs.\n\n"
                + "Voici vos identifiants de connexion :\n"
                + "----------------------------------------\n"
                + "Matricule (identifiant) : " + registrationNumber + "\n"
                + "Email                    : " + to + "\n"
                + "Mot de passe initial     : " + password + "\n"
                + "----------------------------------------\n\n"
                + "Connectez-vous puis changez votre mot de passe.\n\n"
                + "Cordialement,\n"
                + "L'administration IEM";
        sendSimpleMessage(to, subject, body);
        logger.info(">>> EmailServiceImpl.sendRegistrationConfirmation END to={}", to);
    }

    @Override
    public void sendResetEmail(String to, String token) {
        sendSimpleMessage(to, "Rinitialisation de mot de passe",
                "Utilisez ce lien pour rinitialiser votre mot de passe :\n"
                        + "http://localhost:5173/reset-password?token=" + token);
    }

    @Override
    public void sendPaymentConfirmation(String to, String studentName, double paidAmount,
                                         double remainingAmount, double totalAmount) {
        logger.info(">>> EmailServiceImpl.sendPaymentConfirmation START to={} student={} paid={} remaining={}",
                to, studentName, paidAmount, remainingAmount);

        String subject = "Confirmation de paiement - IEM";
        String body = "Bonjour " + studentName + ",\n\n"
                + "Nous confirmons la rception de votre paiement.\n\n"
                + "Rcapitulatif :\n"
                + "----------------------------------------\n"
                + "Montant total annuel : " + formatAmount(totalAmount) + "\n"
                + "Montant pay          : " + formatAmount(paidAmount) + "\n"
                + "Montant restant       : " + formatAmount(remainingAmount) + "\n"
                + "----------------------------------------\n\n"
                + (remainingAmount <= 0
                    ? "Votre dossier est intgralement sold. Merci pour votre confiance !\n\n"
                    : "Il vous reste un solde  rgler avant la fin de l'anne acadmique.\n\n")
                + "Cordialement,\n"
                + "L'administration IEM";

        sendSimpleMessage(to, subject, body);
        logger.info(">>> EmailServiceImpl.sendPaymentConfirmation END to={}", to);
    }

    private String formatAmount(double amount) {
        return String.format(Locale.US, "%.2f $", amount);
    }
}
