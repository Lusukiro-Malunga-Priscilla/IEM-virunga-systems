package com.iem.backend.repository;

import com.iem.backend.model.Attendance;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByUserAccountId(Long userAccountId, Sort sort);

    List<Attendance> findByUserAccountIdAndDate(Long userAccountId, LocalDate date);

    List<Attendance> findByUserAccountIdAndDateAndCourse(Long userAccountId, LocalDate date, String course);

    List<Attendance> findByAttendeeTypeIgnoreCase(String attendeeType, Sort sort);

    List<Attendance> findByAttendeeTypeIgnoreCaseAndDate(String attendeeType, LocalDate date, Sort sort);

    List<Attendance> findByDate(LocalDate date, Sort sort);

    List<Attendance> findByDateBetween(LocalDate from, LocalDate to, Sort sort);

    List<Attendance> findByCourseIgnoreCaseAndDate(String course, LocalDate date, Sort sort);

}

