package com.iem.backend.service;

public interface NotificationGateway {
    boolean send(String to, String body, String channel);
}
