package com.iem.backend.dto;

import com.iem.backend.model.Teacher;
import com.iem.backend.model.TeacherReport;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TeacherReportResponse {
    public Long id;
    public LocalDate reportDate;
    public String summary;
    public String classesTaught;
    public BigDecimal hoursWorked;
    public String issues;
    public String achievements;
    public String status;
    public Long teacherId;
    public String teacherName;
    public String teacherEmail;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public static TeacherReportResponse from(TeacherReport r) {
        TeacherReportResponse d = new TeacherReportResponse();
        d.id = r.getId();
        d.reportDate = r.getReportDate();
        d.summary = r.getSummary();
        d.classesTaught = r.getClassesTaught();
        d.hoursWorked = r.getHoursWorked();
        d.issues = r.getIssues();
        d.achievements = r.getAchievements();
        d.status = r.getStatus();
        d.createdAt = r.getCreatedAt();
        d.updatedAt = r.getUpdatedAt();
        Teacher t = r.getTeacher();
        if (t != null) {
            d.teacherId = t.getId();
            String pn = t.getPrenom();
            String nm = t.getNom();
            d.teacherName = ((pn == null ? "" : pn) + " " + (nm == null ? "" : nm)).trim();
            if (d.teacherName.isEmpty()) d.teacherName = "Teacher #" + d.teacherId;
            d.teacherEmail = t.getEmail();
        }
        return d;
    }
}