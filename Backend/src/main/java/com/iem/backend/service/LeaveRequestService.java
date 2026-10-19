package com.iem.backend.service;

import com.iem.backend.model.LeaveRequest;
import com.iem.backend.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public List<LeaveRequest> findAll() {
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest findById(Long id) {
        return leaveRequestRepository.findById(id).orElseThrow();
    }

    public LeaveRequest save(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest updateStatus(Long id, String status) {
        LeaveRequest existing = leaveRequestRepository.findById(id).orElseThrow();
        existing.setStatus(status);
        return leaveRequestRepository.save(existing);
    }

    public List<LeaveRequest> findByStatus(String status) {
        return leaveRequestRepository.findByStatus(status);
    }
}
