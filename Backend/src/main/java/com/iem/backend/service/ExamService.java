package com.iem.backend.service;

import com.iem.backend.model.Exam;
import com.iem.backend.model.Teacher;
import com.iem.backend.repository.ExamRepository;
import com.iem.backend.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExamService {

    private final ExamRepository repo;
    private final TeacherRepository teacherRepo;

    public ExamService(ExamRepository repo, TeacherRepository teacherRepo) {
        this.repo = repo;
        this.teacherRepo = teacherRepo;
    }

    @Transactional(readOnly = true)
    public List<Exam> listAll() {
        return repo.findAllByOrderByExamDateDesc();
    }

    @Transactional(readOnly = true)
    public List<Exam> listForTeacher(Long teacherId) {
        return repo.findByCreatedByTeacherIdOrderByExamDateDesc(teacherId);
    }

    @Transactional(readOnly = true)
    public Exam getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Exam not found: " + id));
    }

    @Transactional
    public Exam create(Exam exam, Long teacherId) {
        if (teacherId != null) {
            Teacher t = teacherRepo.findById(teacherId)
                    .orElseThrow(() -> new RuntimeException("Teacher not found: " + teacherId));
            exam.setCreatedByTeacher(t);
        }
        if (exam.getStatus() == null) exam.setStatus("DRAFT");
        return repo.save(exam);
    }

    @Transactional
    public Exam update(Long id, Exam patch) {
        Exam e = getById(id);
        if (patch.getTitle() != null)         e.setTitle(patch.getTitle());
        if (patch.getSubject() != null)       e.setSubject(patch.getSubject());
        if (patch.getStudentClass() != null)  e.setStudentClass(patch.getStudentClass());
        if (patch.getExamDate() != null)      e.setExamDate(patch.getExamDate());
        if (patch.getExamType() != null)      e.setExamType(patch.getExamType());
        if (patch.getMaxScore() != null)      e.setMaxScore(patch.getMaxScore());
        if (patch.getDuration() != null)      e.setDuration(patch.getDuration());
        if (patch.getDescription() != null)   e.setDescription(patch.getDescription());
        if (patch.getStatus() != null)        e.setStatus(patch.getStatus());
        return repo.save(e);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}