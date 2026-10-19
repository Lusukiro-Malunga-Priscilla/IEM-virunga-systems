package com.iem.backend.repository;

import com.iem.backend.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findAllByOrderByExamDateDesc();
    List<Exam> findByCreatedByTeacherIdOrderByExamDateDesc(Long teacherId);
    List<Exam> findByStudentClassOrderByExamDateDesc(String studentClass);
    List<Exam> findByStatusOrderByExamDateDesc(String status);
    List<Exam> findByExamDateBetweenOrderByExamDateDesc(LocalDate from, LocalDate to);
}