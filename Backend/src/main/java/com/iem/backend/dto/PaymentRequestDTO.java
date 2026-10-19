package com.iem.backend.dto;

public class PaymentRequestDTO {

    private Long studentId;
    private Double amount;        // installment being paid now
    private Double totalAmount;   // annual total; required the first time a student is billed

    public PaymentRequestDTO() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
}