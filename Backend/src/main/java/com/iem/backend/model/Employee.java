package com.iem.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
public class Employee {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    private String position;
    private String status;
    
    @Column(name = "employment_type")
    private String employmentType;
    
    private String department;
    
    @Column(name = "date_of_employment")
    private LocalDate dateOfEmployment;
    
    @Column(name = "assigned_courses")
    private String assignedCourses;
    
    @Column(name = "assigned_classes")
    private String assignedClasses;
    
    @Column(name = "pedagogic_day")
    private String pedagogicDay;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    private String address;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private UserAccount userAccount;
    
    // Getters and Setters - ALL of them!
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public LocalDate getDateOfEmployment() { return dateOfEmployment; }
    public void setDateOfEmployment(LocalDate dateOfEmployment) { this.dateOfEmployment = dateOfEmployment; }
    
    public String getAssignedCourses() { return assignedCourses; }
    public void setAssignedCourses(String assignedCourses) { this.assignedCourses = assignedCourses; }
    
    public String getAssignedClasses() { return assignedClasses; }
    public void setAssignedClasses(String assignedClasses) { this.assignedClasses = assignedClasses; }
    
    public String getPedagogicDay() { return pedagogicDay; }
    public void setPedagogicDay(String pedagogicDay) { this.pedagogicDay = pedagogicDay; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public UserAccount getUserAccount() { return userAccount; }
    public void setUserAccount(UserAccount userAccount) { this.userAccount = userAccount; }
}