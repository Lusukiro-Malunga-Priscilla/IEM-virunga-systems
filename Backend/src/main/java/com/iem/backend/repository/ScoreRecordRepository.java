package com.iem.backend.repository;

import com.iem.backend.model.ScoreRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScoreRecordRepository extends JpaRepository<ScoreRecord, Long> {
    List<ScoreRecord> findByStudentId(Long studentId);
    List<ScoreRecord> findByCourseId(Long courseId);
    List<ScoreRecord> findByCourseIdAndSemester(Long courseId, Integer semester);
    Optional<ScoreRecord> findByStudentIdAndCourseIdAndSemester(Long studentId, Long courseId, Integer semester);
}