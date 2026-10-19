package com.iem.backend.service;

import com.iem.backend.model.Course;
import com.iem.backend.model.Mark;
import com.iem.backend.model.Student;
import com.iem.backend.repository.CourseRepository;
import com.iem.backend.repository.MarkRepository;
import com.iem.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class MarkService {

    private final MarkRepository repo;
    private final CourseRepository courseRepo;
    private final StudentRepository studentRepo;

    public MarkService(MarkRepository repo, CourseRepository courseRepo, StudentRepository studentRepo) {
        this.repo = repo;
        this.courseRepo = courseRepo;
        this.studentRepo = studentRepo;
    }

    @Transactional(readOnly = true)
    public Map<String, Map<String, Double>> registerForCourse(Long courseId) {
        Map<String, Map<String, Double>> out = new LinkedHashMap<>();
        for (Mark m : repo.findByCourseId(courseId)) {
            Map<String, Double> row = new LinkedHashMap<>();
            row.put("p1",  m.getP1());
            row.put("p2",  m.getP2());
            row.put("ex1", m.getEx1());
            row.put("p3",  m.getP3());
            row.put("p4",  m.getP4());
            row.put("ex2", m.getEx2());
            out.put(String.valueOf(m.getStudent().getId()), row);
        }
        return out;
    }

    @Transactional
    public void saveRegister(Long courseId, Map<String, Map<String, Double>> register) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));
        for (Map.Entry<String, Map<String, Double>> e : register.entrySet()) {
            Long studentId = Long.valueOf(e.getKey());
            Student student = studentRepo.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
            Mark m = repo.findByCourseIdAndStudentId(courseId, studentId).orElseGet(() -> {
                Mark nm = new Mark();
                nm.setCourse(course);
                nm.setStudent(student);
                return nm;
            });
            Map<String, Double> r = e.getValue();
            if (r != null) {
                m.setP1 (r.get("p1"));
                m.setP2 (r.get("p2"));
                m.setEx1(r.get("ex1"));
                m.setP3 (r.get("p3"));
                m.setP4 (r.get("p4"));
                m.setEx2(r.get("ex2"));
            }
            repo.save(m);
        }
    }

    @Transactional(readOnly = true)
    public List<Mark> marksForStudent(Long studentId) {
        return repo.findByStudentId(studentId);
    }
}