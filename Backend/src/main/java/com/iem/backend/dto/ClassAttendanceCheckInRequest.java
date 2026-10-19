package com.iem.backend.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * Body of POST /api/attendance/class-check-in
 * Sent once by the teacher after they finish clicking through their class list.
 */
public class ClassAttendanceCheckInRequest {

    /** Username of the teacher submitting the attendance (for audit / class lookup). */
    private String teacherUsername;

    private String course;

    /** Defaults to today on the backend if null. */
    private LocalDate date;

    private List<ClassAttendanceEntryDto> entries;

    public String getTeacherUsername() {
        return teacherUsername;
    }

    public void setTeacherUsername(String teacherUsername) {
        this.teacherUsername = teacherUsername;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<ClassAttendanceEntryDto> getEntries() {
        return entries;
    }

    public void setEntries(List<ClassAttendanceEntryDto> entries) {
        this.entries = entries;
    }
}