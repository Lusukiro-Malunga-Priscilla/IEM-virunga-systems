package com.iem.backend.controller;

import com.iem.backend.dto.CourseAssignmentDTO;
import com.iem.backend.model.Course;
import com.iem.backend.service.CourseAssignmentService;
import com.iem.backend.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseAssignmentService courseAssignmentService;
    private final CourseService courseService;

    public CourseController(CourseAssignmentService courseAssignmentService, CourseService courseService) {
        this.courseAssignmentService = courseAssignmentService;
        this.courseService = courseService;
    }

    @GetMapping
    public List<CourseAssignmentDTO> getCourses(
            @RequestParam(name = "section", required = false) String section,
            @RequestParam(name = "classe", required = false) String classe
    ) {
        return courseAssignmentService.findAll(section, classe);
    }

    @PostMapping
    public ResponseEntity<CourseAssignmentDTO> createAssignment(@RequestBody CourseAssignmentDTO input) {
        return ResponseEntity.ok(courseAssignmentService.create(input));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable("id") Long id) {
        courseAssignmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/catalog")
    public List<Course> getCatalog() {
        return courseService.findAll();
    }

    @GetMapping("/catalog/{id}")
    public ResponseEntity<Course> getCatalogEntry(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(courseService.findById(id));
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/catalog/{id}")
    public ResponseEntity<Course> updateCatalogEntry(
            @PathVariable("id") Long id,
            @RequestBody Course update) {
        try {
            return ResponseEntity.ok(courseService.update(id, update));
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/catalog/{id}")
    public ResponseEntity<Void> deleteCatalogEntry(@PathVariable("id") Long id) {
        try {
            courseService.findById(id);
            courseService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }
}