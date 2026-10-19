package com.iem.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "scores", uniqueConstraints = @UniqueConstraint(
        columnNames = {"student_id", "course_id", "semester"}))
public class ScoreRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // 1 = premier semestre, 2 = second semestre
    private Integer semester;

    // TR. JOURNAL columns (1ere P. / 2e P. or 3e P. / 4e P.)
    private Double period1;
    private Double period2;

    // EXAM column
    private Double examScore;

    private String remarks;

    public ScoreRecord() {
    }

    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public Double getPeriod1() { return period1; }
    public void setPeriod1(Double period1) { this.period1 = period1; }
    public Double getPeriod2() { return period2; }
    public void setPeriod2(Double period2) { this.period2 = period2; }
    public Double getExamScore() { return examScore; }
    public void setExamScore(Double examScore) { this.examScore = examScore; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    // TOT. column = P1 + P2 + EXAM
    @Transient
    public double getTotal() {
        return (period1 == null ? 0 : period1)
             + (period2 == null ? 0 : period2)
             + (examScore == null ? 0 : examScore);
    }
}