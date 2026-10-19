package com.iem.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TeacherReportRequest {
    public LocalDate reportDate;
    public String summary;
    public String classesTaught;
    public BigDecimal hoursWorked;
    public String issues;
    public String achievements;
}