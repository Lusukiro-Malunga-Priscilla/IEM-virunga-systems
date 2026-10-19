package com.iem.backend.model;

import jakarta.persistence.*;

/**
 * Le "catalogue" : un cours identifi par son code (MATH-601, FRA-601, ...).
 * Les informations de section / classe / enseignant / horaire / volume /
 * coefficient vivent dsormais dans CourseAssignment, car un mme cours
 * peut tre dispens dans plusieurs sections et classes.
 *
 * Inchang par rapport  votre version actuelle.
 */
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String code;
    private String description;

    @Column(name = "year")
    private Integer year;

    public Course() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    @Column(name = "period_max")
    private Integer periodMax = 10;

    @Column(name = "exam_max")
    private Integer examMax = 20;

    public Integer getPeriodMax() { return periodMax; }
    public void setPeriodMax(Integer periodMax) { this.periodMax = periodMax; }

    public Integer getExamMax() { return examMax; }
    public void setExamMax(Integer examMax) { this.examMax = examMax; }
}