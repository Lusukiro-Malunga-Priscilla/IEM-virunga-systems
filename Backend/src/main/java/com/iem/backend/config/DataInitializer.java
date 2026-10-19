package com.iem.backend.config;

import com.iem.backend.model.Course;
import com.iem.backend.model.Role;
import com.iem.backend.model.UserAccount;
import com.iem.backend.repository.CourseRepository;
import com.iem.backend.repository.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initializeData(UserAccountRepository userAccountRepository,
                                     CourseRepository courseRepository,
                                     PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                logger.info("=========================================");
                logger.info(" DataInitializer: Initializing data...");
                logger.info("=========================================");

                // =============================================================
                // CREATE ONLY ONE USER: iemvirunga96@gmail.com
                // =============================================================
                String username = "iemvirunga96@gmail.com";
                String password = "IemVirunga2026!";
                Role role = Role.ADMIN;

                if (!userAccountRepository.existsByUsername(username)) {
                    UserAccount admin = new UserAccount();
                    admin.setUsername(username);
                    admin.setEmail(username);
                    admin.setPassword(passwordEncoder.encode(password));
                    admin.setRole(role);
                    admin.setEnabled(true);
                    userAccountRepository.save(admin);
                    logger.info(" Created admin user: {} / {}", username, password);
                } else {
                    logger.info(" User already exists: {}", username);
                }

                // =============================================================
                // DO NOT CREATE ANY OTHER USERS
                // =============================================================

                long totalUsers = userAccountRepository.count();
                logger.info(" Total users in database: {}", totalUsers);

                // Only initialize courses if none exist
                if (courseRepository.count() == 0) {
                    logger.info(" Creating default courses...");
                    
                    Course math = new Course();
                    math.setName("Mathematics");
                    math.setCode("MATH101");
                    math.setDescription("General mathematics course");
                    courseRepository.save(math);

                    Course english = new Course();
                    english.setName("English");
                    english.setCode("ENG101");
                    english.setDescription("English communication");
                    courseRepository.save(english);
                    
                    logger.info(" Default courses created successfully.");
                } else {
                    logger.info(" Courses already exist. Skipping course creation.");
                }
                
                logger.info("=========================================");
                logger.info(" Available Users:");
                logger.info("   iemvirunga96@gmail.com / IemVirunga2026!");
                logger.info("=========================================");
                
            } catch (Exception e) {
                logger.error("DataInitializer failed to populate initial data; continuing without seeding.", e);
            }
        };
    }
}