package com.iem.backend.service;

import com.iem.backend.dto.StudentPaymentSummaryDTO;
import com.iem.backend.model.Payment;
import com.iem.backend.model.Student;
import com.iem.backend.repository.PaymentRepository;
import com.iem.backend.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_PARTIAL = "PARTIAL";
    private static final String STATUS_PAID    = "PAID";

    public static final double ANNUAL_FEE = 300.0;

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final EmailService emailService;

    public PaymentService(PaymentRepository paymentRepository,
                          StudentRepository studentRepository,
                          EmailService emailService) {
        this.paymentRepository = paymentRepository;
        this.studentRepository = studentRepository;
        this.emailService = emailService;
    }

    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> findByStudentId(Long studentId) {
        return paymentRepository.findByStudentId(studentId)
                .stream()
                .sorted(Comparator.comparing(Payment::getPaymentDate).thenComparing(Payment::getId))
                .toList();
    }

    public List<Payment> findByStatus(String status) {
        return paymentRepository.findByStatus(status);
    }

    private double sumPaid(Long studentId) {
        return paymentRepository.findByStudentId(studentId).stream()
                .mapToDouble(p -> p.getPaidAmount() != null ? p.getPaidAmount() : 0.0)
                .sum();
    }

    public List<StudentPaymentSummaryDTO> getPaymentSummary() {
        List<Student> students = studentRepository.findAll();
        List<StudentPaymentSummaryDTO> summary = new ArrayList<>();

        for (Student student : students) {
            double paid = sumPaid(student.getId());
            double remaining = Math.max(0, ANNUAL_FEE - paid);

            String status;
            if (remaining <= 0) status = STATUS_PAID;
            else if (paid > 0)  status = STATUS_PARTIAL;
            else                status = STATUS_PENDING;

            Payment latest = paymentRepository.findByStudentId(student.getId()).stream()
                    .max(Comparator.comparing(Payment::getPaymentDate).thenComparing(Payment::getId))
                    .orElse(null);

            StudentPaymentSummaryDTO dto = new StudentPaymentSummaryDTO();
            dto.setStudentId(student.getId());
            dto.setRegistrationNumber(student.getRegistrationNumber());
            dto.setFullName(student.getFullName());
            dto.setStudentClass(student.getStudentClass());
            dto.setSection(student.getSection());
            dto.setTotalAmount(ANNUAL_FEE);
            dto.setPaidAmount(paid);
            dto.setRemainingAmount(remaining);
            dto.setStatus(status);
            dto.setLastPaymentDate(latest != null && latest.getPaymentDate() != null
                    ? latest.getPaymentDate().toString()
                    : null);

            summary.add(dto);
        }

        return summary;
    }

    @Transactional
    public Payment addPayment(Long studentId, Double amount, Double ignoredTotalOverride) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Eleve introuvable."));

        double installment = amount != null ? amount : 0.0;
        if (installment <= 0) {
            throw new RuntimeException("Le montant doit etre superieur a 0.");
        }

        double alreadyPaid = sumPaid(studentId);
        if (alreadyPaid >= ANNUAL_FEE) {
            throw new RuntimeException("Le montant annuel est deja entierement paye.");
        }

        double capped = Math.min(installment, ANNUAL_FEE - alreadyPaid);
        double newPaid = alreadyPaid + capped;
        double newRemaining = Math.max(0, ANNUAL_FEE - newPaid);

        String status = newRemaining <= 0 ? STATUS_PAID
                       : newPaid > 0     ? STATUS_PARTIAL
                       :                   STATUS_PENDING;

        Payment payment = new Payment();
        payment.setStudent(student);
        payment.setPaidAmount(capped);
        payment.setTotalAmount(ANNUAL_FEE);
        payment.setRemainingAmount(newRemaining);
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus(status);

        Payment saved = paymentRepository.save(payment);

        boolean justCompleted = STATUS_PAID.equals(status) && newPaid >= ANNUAL_FEE;
        if (justCompleted && student.getEmail() != null && !student.getEmail().isBlank()) {
            try {
                emailService.sendPaymentConfirmation(
                        student.getEmail(),
                        student.getFullName(),
                        newPaid,
                        newRemaining,
                        ANNUAL_FEE
                );
            } catch (Exception e) {
                logger.error("Echec email confirmation paiement {} : {}", student.getEmail(), e.getMessage(), e);
            }
        }

        return saved;
    }

    @Transactional
    public Payment save(Payment payment) {
        if (payment.getStudent() != null && payment.getStudent().getId() != null) {
            Student student = studentRepository.findById(payment.getStudent().getId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            payment.setStudent(student);
        }
        if (payment.getTotalAmount() == null) payment.setTotalAmount(ANNUAL_FEE);
        if (payment.getPaidAmount() == null) payment.setPaidAmount(0.0);

        double already = payment.getId() == null
                ? sumPaid(payment.getStudent().getId())
                : sumPaid(payment.getStudent().getId()) - (payment.getPaidAmount() != null ? payment.getPaidAmount() : 0.0);

        double newPaid = already + payment.getPaidAmount();
        payment.setRemainingAmount(Math.max(0, ANNUAL_FEE - newPaid));
        payment.setStatus(payment.getRemainingAmount() <= 0 ? STATUS_PAID
                        : newPaid > 0 ? STATUS_PARTIAL
                        : STATUS_PENDING);

        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDate.now());
        }
        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment update(Long id, Payment paymentDetails) {
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (paymentDetails.getPaidAmount() != null) existing.setPaidAmount(paymentDetails.getPaidAmount());
        if (paymentDetails.getPaymentDate() != null) existing.setPaymentDate(paymentDetails.getPaymentDate());

        existing.setTotalAmount(ANNUAL_FEE);

        double already = sumPaid(existing.getStudent().getId()) - (existing.getPaidAmount() != null ? existing.getPaidAmount() : 0.0);
        double newPaid = already + existing.getPaidAmount();
        existing.setRemainingAmount(Math.max(0, ANNUAL_FEE - newPaid));
        existing.setStatus(existing.getRemainingAmount() <= 0 ? STATUS_PAID
                        : newPaid > 0 ? STATUS_PARTIAL
                        : STATUS_PENDING);

        return paymentRepository.save(existing);
    }

    @Transactional
    public void deleteById(Long id) {
        paymentRepository.deleteById(id);
    }
}