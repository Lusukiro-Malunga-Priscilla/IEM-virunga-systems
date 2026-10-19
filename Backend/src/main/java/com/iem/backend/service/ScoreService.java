package com.iem.backend.service;

import com.iem.backend.model.Course;
import com.iem.backend.model.ScoreRecord;
import com.iem.backend.model.Student;
import com.iem.backend.repository.CourseRepository;
import com.iem.backend.repository.ScoreRecordRepository;
import com.iem.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreRecordRepository scoreRecordRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public ScoreService(ScoreRecordRepository scoreRecordRepository,
                         StudentRepository studentRepository,
                         CourseRepository courseRepository) {
        this.scoreRecordRepository = scoreRecordRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<ScoreRecord> findAll() {
        return scoreRecordRepository.findAll();
    }

    public List<ScoreRecord> findByStudentId(Long studentId) {
        return scoreRecordRepository.findByStudentId(studentId);
    }

    public List<ScoreRecord> findByCourseId(Long courseId) {
        return scoreRecordRepository.findByCourseId(courseId);
    }

    /**
     * Used by the teacher screen: returns the scores already entered
     * for a given course + semester, so the input grid can be pre-filled.
     */
    public List<ScoreRecord> findByCourseAndSemester(Long courseId, Integer semester) {
        return scoreRecordRepository.findByCourseIdAndSemester(courseId, semester);
    }

    public ScoreRecord recordScore(Long studentId, Long courseId, ScoreRecord scoreData) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        Course course = courseRepository.findById(courseId).orElseThrow();
        scoreData.setStudent(student);
        scoreData.setCourse(course);
        return scoreRecordRepository.save(scoreData);
    }

    public ScoreRecord updateScore(Long id, ScoreRecord update) {
        ScoreRecord existing = scoreRecordRepository.findById(id).orElseThrow();
        existing.setPeriod1(update.getPeriod1());
        existing.setPeriod2(update.getPeriod2());
        existing.setExamScore(update.getExamScore());
        existing.setRemarks(update.getRemarks());
        return scoreRecordRepository.save(existing);
    }

    /**
     * Create-or-update in one call. This is what the teacher's grid calls
     * every time a cell is saved: it looks up any existing record for
     * (student, course, semester) and overwrites it, otherwise creates one.
     */
    public ScoreRecord saveOrUpdate(Long studentId, Long courseId, Integer semester, ScoreRecord scoreData) {
        return scoreRecordRepository
                .findByStudentIdAndCourseIdAndSemester(studentId, courseId, semester)
                .map(existing -> {
                    existing.setPeriod1(scoreData.getPeriod1());
                    existing.setPeriod2(scoreData.getPeriod2());
                    existing.setExamScore(scoreData.getExamScore());
                    existing.setRemarks(scoreData.getRemarks());
                    return scoreRecordRepository.save(existing);
                })
                .orElseGet(() -> {
                    Student student = studentRepository.findById(studentId).orElseThrow();
                    Course course = courseRepository.findById(courseId).orElseThrow();
                    scoreData.setStudent(student);
                    scoreData.setCourse(course);
                    scoreData.setSemester(semester);
                    return scoreRecordRepository.save(scoreData);
                });
    }
}