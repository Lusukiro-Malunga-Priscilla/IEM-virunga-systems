package com.iem.backend.model;

import jakarta.persistence.*;
import java.time.LocalTime;

/**
 * Une "attribution" : un Course donn, enseign par un Teacher (optionnel),
 * dans une section + une classe donnes,  un jour/horaire donn, avec un
 * volume horaire et un coefficient.
 *
 * Un mme Course peut avoir plusieurs CourseAssignment (une par
 * section/classe/horaire dans laquelle il est dispens).
 *
 * NOTE : cette classe suppose l'existence d'une entit
 * com.iem.backend.model.Teacher avec une cl primaire Long id et des champs
 * prenom / nom (dduits de Enseignants.jsx). Adaptez l'import / les champs
 * si votre entit Teacher est diffrente.
 */
@Entity
@Table(name = "course_assignments")
public class CourseAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher; // peut tre null si le cours n'est pas encore assign

    @Column(nullable = false)
    private String section; // id de section, ex: "infirmiere"

    @Column(nullable = false)
    private String classe; // ex: "6me A"

    private String jour; // ex: "Lundi"

    @Column(name = "heure_debut")
    private LocalTime heureDebut;

    @Column(name = "heure_fin")
    private LocalTime heureFin;

    @Column(name = "volume_horaire")
    private Integer volumeHoraire; // heures / semaine

    private Integer coefficient;

    public CourseAssignment() {
    }

    public Long getId() {
        return id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getClasse() {
        return classe;
    }

    public void setClasse(String classe) {
        this.classe = classe;
    }

    public String getJour() {
        return jour;
    }

    public void setJour(String jour) {
        this.jour = jour;
    }

    public LocalTime getHeureDebut() {
        return heureDebut;
    }

    public void setHeureDebut(LocalTime heureDebut) {
        this.heureDebut = heureDebut;
    }

    public LocalTime getHeureFin() {
        return heureFin;
    }

    public void setHeureFin(LocalTime heureFin) {
        this.heureFin = heureFin;
    }

    public Integer getVolumeHoraire() {
        return volumeHoraire;
    }

    public void setVolumeHoraire(Integer volumeHoraire) {
        this.volumeHoraire = volumeHoraire;
    }

    public Integer getCoefficient() {
        return coefficient;
    }

    public void setCoefficient(Integer coefficient) {
        this.coefficient = coefficient;
    }
}