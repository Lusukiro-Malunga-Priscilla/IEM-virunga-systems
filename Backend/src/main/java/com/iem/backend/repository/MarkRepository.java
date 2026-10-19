package com.iem.backend.repository;

import com.iem.backend.model.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByCourseId(Long courseId);
    List<Mark> findByStudentId(Long studentId);
    Optional<Mark> findByCourseIdAndStudentId(Long courseId, Long studentId);
}