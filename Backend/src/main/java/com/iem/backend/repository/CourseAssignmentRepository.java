package com.iem.backend.repository;

import com.iem.backend.model.CourseAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, Long> {

    List<CourseAssignment> findBySection(String section);

    List<CourseAssignment> findByClasse(String classe);

    List<CourseAssignment> findBySectionAndClasse(String section, String classe);
}