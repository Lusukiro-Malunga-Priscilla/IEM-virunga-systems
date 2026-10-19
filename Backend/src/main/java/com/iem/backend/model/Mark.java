package com.iem.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "marks",
       uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "student_id"}))
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private Double p1;
    private Double p2;
    private Double ex1;
    private Double p3;
    private Double p4;
    private Double ex2;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Mark() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Double getP1() { return p1; } public void setP1(Double p1) { this.p1 = p1; }
    public Double getP2() { return p2; } public void setP2(Double p2) { this.p2 = p2; }
    public Double getEx1() { return ex1; } public void setEx1(Double ex1) { this.ex1 = ex1; }
    public Double getP3() { return p3; } public void setP3(Double p3) { this.p3 = p3; }
    public Double getP4() { return p4; } public void setP4(Double p4) { this.p4 = p4; }
    public Double getEx2() { return ex2; } public void setEx2(Double ex2) { this.ex2 = ex2; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}