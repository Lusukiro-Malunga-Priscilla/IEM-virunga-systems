package com.iem.backend.service;

import com.iem.backend.dto.CourseAssignmentDTO;
import com.iem.backend.model.Course;
import com.iem.backend.model.CourseAssignment;
import com.iem.backend.model.Teacher;
import com.iem.backend.repository.CourseAssignmentRepository;
import com.iem.backend.repository.CourseRepository;
import com.iem.backend.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * NOTE : suppose l'existence de com.iem.backend.model.Teacher et
 * com.iem.backend.repository.TeacherRepository (dj utiliss par votre
 * TeacherController). Adaptez le package/nom si ncessaire.
 */
@Service
public class CourseAssignmentService {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    private final CourseAssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;

    public CourseAssignmentService(
            CourseAssignmentRepository assignmentRepository,
            CourseRepository courseRepository,
            TeacherRepository teacherRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
    }

    public List<CourseAssignmentDTO> findAll(String section, String classe) {
        List<CourseAssignment> rows;
        boolean hasSection = section != null && !section.isBlank();
        boolean hasClasse = classe != null && !classe.isBlank();

        if (hasSection && hasClasse) {
            rows = assignmentRepository.findBySectionAndClasse(section, classe);
        } else if (hasSection) {
            rows = assignmentRepository.findBySection(section);
        } else if (hasClasse) {
            rows = assignmentRepository.findByClasse(classe);
        } else {
            rows = assignmentRepository.findAll();
        }

        return rows.stream().map(this::toDto).collect(Collectors.toList());
    }

    public CourseAssignmentDTO create(CourseAssignmentDTO input) {
        // Trouve le cours par code, ou le cre s'il n'existe pas encore dans le catalogue.
        Course course = courseRepository.findByCode(input.getCode())
                .orElseGet(() -> {
                    Course c = new Course();
                    c.setCode(input.getCode());
                    c.setName(input.getName());
                    c.setDescription(input.getDescription());
                    return courseRepository.save(c);
                });

        // Si le cours existait dj mais que le nom/description a chang, on les met  jour.
        boolean courseChanged = false;
        if (input.getName() != null && !input.getName().equals(course.getName())) {
            course.setName(input.getName());
            courseChanged = true;
        }
        if (input.getDescription() != null && !input.getDescription().equals(course.getDescription())) {
            course.setDescription(input.getDescription());
            courseChanged = true;
        }
        if (courseChanged) {
            course = courseRepository.save(course);
        }

        CourseAssignment assignment = new CourseAssignment();
        assignment.setCourse(course);
        assignment.setSection(input.getSection());
        assignment.setClasse(input.getClasse());
        assignment.setJour(input.getJour());
        assignment.setVolumeHoraire(input.getVolumeHoraire());
        assignment.setCoefficient(input.getCoefficient());

        if (input.getHeureDebut() != null && !input.getHeureDebut().isBlank()) {
            assignment.setHeureDebut(LocalTime.parse(input.getHeureDebut()));
        }
        if (input.getHeureFin() != null && !input.getHeureFin().isBlank()) {
            assignment.setHeureFin(LocalTime.parse(input.getHeureFin()));
        }

        if (input.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(input.getTeacherId())
                    .orElseThrow(() -> new IllegalArgumentException("Enseignant introuvable: " + input.getTeacherId()));
            assignment.setTeacher(teacher);
        }

        CourseAssignment saved = assignmentRepository.save(assignment);
        return toDto(saved);
    }

    public void delete(Long id) {
        assignmentRepository.deleteById(id);
    }

    private CourseAssignmentDTO toDto(CourseAssignment a) {
        CourseAssignmentDTO dto = new CourseAssignmentDTO();
        dto.setId(a.getId());
        dto.setCourseId(a.getCourse().getId());
        dto.setCode(a.getCourse().getCode());
        dto.setName(a.getCourse().getName());
        dto.setDescription(a.getCourse().getDescription());
        dto.setSection(a.getSection());
        dto.setClasse(a.getClasse());
        dto.setJour(a.getJour());
        dto.setVolumeHoraire(a.getVolumeHoraire());
        dto.setCoefficient(a.getCoefficient());

        if (a.getHeureDebut() != null) {
            dto.setHeureDebut(a.getHeureDebut().format(TIME_FORMAT));
        }
        if (a.getHeureFin() != null) {
            dto.setHeureFin(a.getHeureFin().format(TIME_FORMAT));
        }

        if (a.getTeacher() != null) {
            dto.setTeacherId(a.getTeacher().getId());
            // Suppose que Teacher expose getPrenom() / getNom(), comme utilis dans Enseignants.jsx.
            dto.setEnseignant((a.getTeacher().getPrenom() + " " + a.getTeacher().getNom()).trim());
        }

        return dto;
    }
}