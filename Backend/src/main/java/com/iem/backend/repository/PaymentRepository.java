package com.iem.backend.repository;

import com.iem.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentId(Long studentId);
    List<Payment> findByStatus(String status);
    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
    List<Payment> findByStudentIdAndStatus(Long studentId, String status);
}