package com.iem.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EntityScan(basePackages = "com.iem.backend.model")
@EnableJpaRepositories(basePackages = "com.iem.backend.repository")
public class IemBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(IemBackendApplication.class, args);
    }
}