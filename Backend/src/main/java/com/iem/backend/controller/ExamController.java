package com.iem.backend.controller;

import com.iem.backend.model.Exam;
import com.iem.backend.model.Teacher;
import com.iem.backend.model.UserAccount;
import com.iem.backend.repository.TeacherRepository;
import com.iem.backend.repository.UserAccountRepository;
import com.iem.backend.service.ExamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService service;
    private final UserAccountRepository userRepo;
    private final TeacherRepository teacherRepo;

    public ExamController(ExamService service,
                          UserAccountRepository userRepo,
                          TeacherRepository teacherRepo) {
        this.service = service;
        this.userRepo = userRepo;
        this.teacherRepo = teacherRepo;
    }

    /** Resolve the logged-in user to a Teacher row, creating one if needed. */
    private Teacher resolveTeacher(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        UserAccount user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found: " + auth.getName()));

        return teacherRepo.findByEmail(user.getEmail())
                .orElseGet(() -> {
                    Teacher t = new Teacher();
                    t.setEmail(user.getEmail());
                    t.setPrenom(user.getFirstName() != null ? user.getFirstName() : user.getUsername());
                    t.setNom(user.getLastName() != null ? user.getLastName() : "-");
                    return teacherRepo.save(t);
                });
    }

    @GetMapping
    public List<Exam> listAll() {
        return service.listAll();
    }

    @GetMapping("/me")
    public List<Exam> listMine(Authentication auth) {
        return service.listForTeacher(resolveTeacher(auth).getId());
    }

    @GetMapping("/teacher/{teacherId}")
    public List<Exam> listForTeacher(@PathVariable("teacherId") Long teacherId) {
        return service.listForTeacher(teacherId);
    }

    @GetMapping("/{id}")
    public Exam getById(@PathVariable("id") Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<?> create(Authentication auth, @RequestBody Exam exam) {
        try {
            Teacher t = resolveTeacher(auth);
            return ResponseEntity.ok(service.create(exam, t.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody Exam patch) {
        try {
            return ResponseEntity.ok(service.update(id, patch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** Bulk import exams from a JSON array (parsed client-side from a CSV). */
    @PostMapping("/import")
    public ResponseEntity<?> bulkImport(Authentication auth, @RequestBody List<Exam> exams) {
        try {
            Teacher t = resolveTeacher(auth);
            List<Exam> created = new ArrayList<>();
            List<String> errors = new ArrayList<>();
            int idx = 1;
            for (Exam e : exams) {
                try {
                    if (e.getTitle() == null || e.getTitle().isBlank()) {
                        errors.add("Ligne " + idx + ": titre manquant");
                        idx++;
                        continue;
                    }
                    if (e.getExamDate() == null) e.setExamDate(LocalDate.now());
                    if (e.getMaxScore() == null) e.setMaxScore(20.0);
                    if (e.getExamType() == null || e.getExamType().isBlank()) e.setExamType("EXAM");
                    if (e.getStatus() == null || e.getStatus().isBlank()) e.setStatus("DRAFT");
                    created.add(service.create(e, t.getId()));
                } catch (Exception ex) {
                    errors.add("Ligne " + idx + ": " + ex.getMessage());
                }
                idx++;
            }
            Map<String, Object> result = new HashMap<>();
            result.put("imported", created.size());
            result.put("errors", errors);
            result.put("exams", created);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}