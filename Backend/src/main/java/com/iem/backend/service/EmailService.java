package com.iem.backend.service;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String body);
    
    void sendOtpEmail(String to, String otp);
    
    void sendWelcomeEmail(String to, String firstName, String lastName, String role, String password);
    
    void sendRegistrationConfirmation(String to, String name, String registrationNumber, String password);
    
    void sendResetEmail(String to, String token);

     void sendPaymentConfirmation(String to, String studentName, double paidAmount,
                                  double remainingAmount, double totalAmount);
    
}