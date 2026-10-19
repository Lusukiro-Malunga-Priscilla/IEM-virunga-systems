package com.iem.backend.controller;

import com.iem.backend.model.Mark;
import com.iem.backend.service.MarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marks")
public class MarkController {

    private final MarkService service;

    public MarkController(MarkService service) { this.service = service; }

    @GetMapping("/register/{courseId}")
    public Map<String, Map<String, Double>> registerForCourse(@PathVariable("courseId") Long courseId) {
        return service.registerForCourse(courseId);
    }

    @PostMapping("/register/{courseId}")
    public ResponseEntity<?> saveRegister(@PathVariable("courseId") Long courseId,
                                          @RequestBody Map<String, Map<String, Double>> register) {
        try {
            service.saveRegister(courseId, register);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}")
    public List<Mark> marksForStudent(@PathVariable("studentId") Long studentId) {
        return service.marksForStudent(studentId);
    }
}