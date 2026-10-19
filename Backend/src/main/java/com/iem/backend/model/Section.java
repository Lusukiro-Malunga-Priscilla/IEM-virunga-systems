// Section.java
package com.iem.backend.model;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum Section {
    INFIRMIERE_REFORME("Section Infirmiere de la REFORME", "INF-REF"),
    ACCOUCHEUSE_REFORME("Section Accoucheuse de la REFORME", "ACC-REF"),
    ASSISTANT_PHARMACIE_REFORME("Section Assistant en pharmacie de la REFORME", "PHARM-REF"),
    SANTE_MENTALE_REFORME("Section Sante Mentale de la REFORME", "SM-REF"),
    TECHNIQUE_LABORATOIRE_REFORME("Section Technique de Laboratoire de la REFORME", "LAB-REF");

    private final String displayName;
    private final String code;

    Section(String displayName, String code) {
        this.displayName = displayName;
        this.code = code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getCode() {
        return code;
    }

    public static List<Section> getAllSections() {
        return Arrays.asList(Section.values());
    }

    public static List<String> getDisplayNames() {
        return Arrays.stream(Section.values())
                .map(Section::getDisplayName)
                .collect(Collectors.toList());
    }

    public static Section fromDisplayName(String displayName) {
        if (displayName == null) return null;
        for (Section section : Section.values()) {
            if (section.getDisplayName().equalsIgnoreCase(displayName.trim())) {
                return section;
            }
        }
        return null;
    }

    public static Section fromCode(String code) {
        if (code == null) return null;
        for (Section section : Section.values()) {
            if (section.getCode().equalsIgnoreCase(code.trim())) {
                return section;
            }
        }
        return null;
    }

    public static Section fromValue(String value) {
        if (value == null) return null;
        try {
            return Section.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            return fromDisplayName(value);
        }
    }

    public static boolean isValidSection(String sectionName) {
        if (sectionName == null) return false;
        for (Section section : Section.values()) {
            if (section.name().equalsIgnoreCase(sectionName.trim()) || 
                section.getDisplayName().equalsIgnoreCase(sectionName.trim())) {
                return true;
            }
        }
        return false;
    }
}