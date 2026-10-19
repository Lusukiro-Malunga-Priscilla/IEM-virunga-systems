package com.iem.backend.repository;

import com.iem.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    /** Utilis pour retrouver (ou crer) un cours par son code lors de l'ajout d'une attribution. */
    Optional<Course> findByCode(String code);
}