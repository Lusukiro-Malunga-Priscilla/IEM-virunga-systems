package com.iem.backend.controller;

import com.iem.backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-registration-confirmation")
    public ResponseEntity<?> sendRegistrationConfirmation(@RequestBody Map<String, String> data) {
        try {
            emailService.sendRegistrationConfirmation(
                data.get("email"),
                data.get("name"),
                data.get("registrationNumber"),
                data.get("password")
            );
            return ResponseEntity.ok(Map.of("success", true, "message", "Email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/send-welcome")
    public ResponseEntity<?> sendWelcomeEmail(@RequestBody Map<String, String> data) {
        try {
            String email = data.getOrDefault("email", "");
            String firstName = data.getOrDefault("firstName", data.getOrDefault("name", ""));
            String lastName = data.getOrDefault("lastName", "");
            String role = data.getOrDefault("role", "USER");
            String password = data.getOrDefault("password", "");

            emailService.sendWelcomeEmail(email, firstName, lastName, role, password);
            return ResponseEntity.ok(Map.of("success", true, "message", "Welcome email sent"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}