package com.iem.backend.dto;

/**
 * One line inside a teacher's class attendance submission.
 * The teacher builds a list of these (one per student) client-side by
 * clicking each student's box, then posts the whole list at once.
 */
public class ClassAttendanceEntryDto {

    private Long studentUserAccountId;
    private boolean present;

    /**
     * Optional manual "late" flag from the UI. The backend will ALSO compute
     * lateness automatically from the check-in time vs school start (7:30),
     * so this is mostly a UI hint / used when checkInTime is not "now"
     * (e.g. teacher back-filling attendance).
     */
    private boolean late;

    private String justification;

    public Long getStudentUserAccountId() {
        return studentUserAccountId;
    }

    public void setStudentUserAccountId(Long studentUserAccountId) {
        this.studentUserAccountId = studentUserAccountId;
    }

    public boolean isPresent() {
        return present;
    }

    public void setPresent(boolean present) {
        this.present = present;
    }

    public boolean isLate() {
        return late;
    }

    public void setLate(boolean late) {
        this.late = late;
    }

    public String getJustification() {
        return justification;
    }

    public void setJustification(String justification) {
        this.justification = justification;
    }
}