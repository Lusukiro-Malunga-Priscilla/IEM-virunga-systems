package com.iem.backend.repository;

import com.iem.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmail(String email);
    
    Optional<Employee> findByUserAccountId(Long userAccountId);
    
    Optional<Employee> findByUserAccount_Username(String username);
    
    List<Employee> findByPositionContainingIgnoreCase(String position);
    
    List<Employee> findByPosition(String position);
    
    List<Employee> findByStatus(String status);
    
    List<Employee> findByDepartment(String department);
    
    List<Employee> findByPositionAndStatus(String position, String status);
    
    boolean existsByEmail(String email);
}