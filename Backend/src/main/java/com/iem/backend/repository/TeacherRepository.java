package com.iem.backend.repository;

import com.iem.backend.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Optional<Teacher> findByEmail(String email);

    Optional<Teacher> findByPrenomAndNom(String prenom, String nom);

    List<Teacher> findByType(String type);

    List<Teacher> findByCoursDispense(String coursDispense);

    List<Teacher> findByDisponibleTrue();

    @Query("SELECT t FROM Teacher t WHERE " +
           "LOWER(t.prenom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.nom)    LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.email)  LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Teacher> searchTeachers(@Param("search") String search);

    @Query("SELECT t FROM Teacher t WHERE t.type = :type AND t.disponible = true")
    List<Teacher> findAvailableByType(@Param("type") String type);
}