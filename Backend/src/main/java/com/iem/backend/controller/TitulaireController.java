package com.iem.backend.controller;

import com.iem.backend.model.Student;
import com.iem.backend.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/titulaires")
public class TitulaireController {

    private final StudentRepository studentRepository;

    public TitulaireController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping("/class/{className}/students")
    public List<Student> getStudentsForClass(@PathVariable("className") String className) {
        return studentRepository.findAll().stream()
                .filter(student -> className.equalsIgnoreCase(student.getStudentClass()))
                .collect(Collectors.toList());
    }

    @GetMapping("/student/{studentId}/details")
    public Student getStudentDetails(@PathVariable("studentId") Long studentId) {
        return studentRepository.findById(studentId).orElse(null);
    }
}
