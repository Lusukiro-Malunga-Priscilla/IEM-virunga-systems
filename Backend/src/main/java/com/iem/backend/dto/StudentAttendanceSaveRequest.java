package com.iem.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class StudentAttendanceSaveRequest {

    private LocalDate date;
    private String studentClass;
    private String section;
    private List<Record> records;

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStudentClass() { return studentClass; }
    public void setStudentClass(String studentClass) { this.studentClass = studentClass; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public List<Record> getRecords() { return records; }
    public void setRecords(List<Record> records) { this.records = records; }

    public static class Record {
        private Long studentId;
        private String status;   // PRESENT, ABSENT, LATE
        private String justification;

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getJustification() { return justification; }
        public void setJustification(String justification) { this.justification = justification; }
    }
}