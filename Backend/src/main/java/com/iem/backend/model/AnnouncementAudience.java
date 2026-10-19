package com.iem.backend.model;

/**
 * Who an announcement is targeted at.
 *
 * ALL      -> visible to everyone: admins, teachers and students
 * STAFF    -> "personnel"  visible to admins and teachers only
 * TEACHERS -> visible to teachers only (and admins, for management purposes)
 * STUDENTS -> visible to students only (and admins, for management purposes)
 */
public enum AnnouncementAudience {
    ALL,
    STAFF,
    TEACHERS,
    STUDENTS
}