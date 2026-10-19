package com.iem.backend.repository;

import com.iem.backend.model.TeacherReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TeacherReportRepository extends JpaRepository<TeacherReport, Long> {
    List<TeacherReport> findByTeacherIdOrderByReportDateDesc(Long teacherId);
    Optional<TeacherReport> findByTeacherIdAndReportDate(Long teacherId, LocalDate date);
    List<TeacherReport> findAllByOrderByReportDateDesc();
    List<TeacherReport> findByReportDateBetweenOrderByReportDateDesc(LocalDate from, LocalDate to);
    List<TeacherReport> findByTeacherIdAndReportDateBetweenOrderByReportDateDesc(Long teacherId, LocalDate from, LocalDate to);
}