package com.iem.backend.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String username;
    private String password;

    public String getEmail() {
        return email != null ? email : username;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUsername() {
        return username != null ? username : email;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
}