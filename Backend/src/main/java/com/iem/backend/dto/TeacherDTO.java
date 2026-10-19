package com.iem.backend.dto;

import java.time.LocalDate;

public class TeacherDTO {
    private Long id;
    private String prenom;
    private String nom;
    private String email;
    private String telephone;
    private String type;
    private String coursDispense;
    private LocalDate dateEmbauche;
    private Boolean disponible;
    private String journeePedagogique;
    private String fullName;

    public TeacherDTO() {}

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

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}