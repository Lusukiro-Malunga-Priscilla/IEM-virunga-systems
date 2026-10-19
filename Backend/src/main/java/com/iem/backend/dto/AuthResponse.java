package com.iem.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String username;
    private String email;
    private Long id;
    private boolean success;
    private String message;

    // Constructor for backward compatibility
    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
        this.success = true;
    }
}