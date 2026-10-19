package com.iem.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * GET /api/sections
 *
 * Ajoutez ce contrleur UNIQUEMENT si vous n'avez pas dj d'endpoint
 * /api/sections ailleurs dans votre backend. S'il existe dj, ignorez ce
 * fichier (ou faites-en une source de vrit unique en base si vous
 * prfrez grer les sections dynamiquement plus tard).
 */
@RestController
@RequestMapping("/api/sections")
public class SectionController {

    @GetMapping
    public List<Map<String, String>> listSections() {
        return List.of(
                Map.of("id", "infirmiere", "nom", "Section Infirmire de la RFORME"),
                Map.of("id", "accoucheuse", "nom", "Section Accoucheuse de la RFORME"),
                Map.of("id", "pharmacie", "nom", "Section Assistant en pharmacie de la RFORME"),
                Map.of("id", "sante-mentale", "nom", "Section Sant Mentale de la RFORME"),
                Map.of("id", "labo", "nom", "Section Technique de Laboratoire de la RFORME")
        );
    }
}