package com.iem.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    private String telephone;

    @Column(nullable = false)
    private String type; // Permanent, Partiel, Vacataire

    @Column(name = "cours_dispense")
    private String coursDispense;

    @Column(name = "date_embauche")
    private LocalDate dateEmbauche;

    @Column(nullable = false)
    private Boolean disponible = true;

    @Column(name = "journee_pedagogique", columnDefinition = "TEXT")
    private String journeePedagogique;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    public Teacher() {
        this.createdAt = LocalDate.now();
        this.updatedAt = LocalDate.now();
    }

    // ---- Getters / Setters ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCoursDispense() { return coursDispense; }
    public void setCoursDispense(String coursDispense) { this.coursDispense = coursDispense; }

    public LocalDate getDateEmbauche() { return dateEmbauche; }
    public void setDateEmbauche(LocalDate dateEmbauche) { this.dateEmbauche = dateEmbauche; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public String getJourneePedagogique() { return journeePedagogique; }
    public void setJourneePedagogique(String journeePedagogique) { this.journeePedagogique = journeePedagogique; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

    public LocalDate getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

    public String getFullName() {
        return this.prenom + " " + this.nom;
    }

    @Column(name = "matricule", length = 50)
    private String matricule;

    @Column(name = "qualification", length = 150)
    private String qualification;

    @Column(name = "fonction", length = 100)
    private String fonction;

    @Column(name = "nationality", length = 80)
    private String nationality;

    @Column(name = "photo", columnDefinition = "VARCHAR(MAX)")
    private String photo;

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getFonction() { return fonction; }
    public void setFonction(String fonction) { this.fonction = fonction; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
}