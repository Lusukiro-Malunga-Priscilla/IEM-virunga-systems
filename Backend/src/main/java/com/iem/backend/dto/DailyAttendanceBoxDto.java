package com.iem.backend.dto;

import java.time.LocalDateTime;

/**
 * One "box" in the admin daily attendance board (one per student or teacher).
 * status drives the color on the frontend:
 *   PRESENT      -> green
 *   LATE         -> orange (present but arrived after 07:30)
 *   ABSENT       -> red
 *   NOT_MARKED   -> grey (roster member the teacher hasn't clicked yet / no roster info)
 */
public class DailyAttendanceBoxDto {

    private Long userAccountId;
    private String fullName;
    private String status; // PRESENT | LATE | ABSENT | NOT_MARKED
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String justification;
    private String course;

    public DailyAttendanceBoxDto() {
    }

    public DailyAttendanceBoxDto(Long userAccountId, String fullName, String status,
                                  LocalDateTime checkInTime, LocalDateTime checkOutTime,
                                  String justification, String course) {
        this.userAccountId = userAccountId;
        this.fullName = fullName;
        this.status = status;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.justification = justification;
        this.course = course;
    }

    public Long getUserAccountId() {
        return userAccountId;
    }

    public void setUserAccountId(Long userAccountId) {
        this.userAccountId = userAccountId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public String getJustification() {
        return justification;
    }

    public void setJustification(String justification) {
        this.justification = justification;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }
}