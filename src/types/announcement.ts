// src/types/announcement.ts

export type Audience = 'ALL' | 'STAFF' | 'TEACHERS' | 'STUDENTS';

export const AUDIENCE_LABEL: Record<Audience, string> = {
  ALL:      'Tout le monde',
  STAFF:    'Administration',
  TEACHERS: 'Enseignants',
  STUDENTS: '\u00C9l\u00E8ves',
};

export const AUDIENCE_HINT: Record<Audience, string> = {
  ALL:      'Visible par tous les utilisateurs de la plateforme.',
  STAFF:    'Visible uniquement par le personnel administratif.',
  TEACHERS: 'Visible uniquement par les enseignants.',
  STUDENTS: 'Visible uniquement par les \u00E9l\u00E8ves.',
};

/** Mirrors com.iem.backend.model.Role */
export type Role = 'ADMIN' | 'TEACHER' | 'TITULAIRE' | 'STUDENT';

/** Full announcement as returned by the backend */
export interface Announcement {
  id: number;
  title: string;
  message: string;
  audience: Audience;
  allowReplies: boolean;
  sendEmail: boolean;
  sendSms: boolean;
  authorUsername: string;
  authorName: string;
  createdAt: string;
  replies?: AnnouncementReply[];
}

/** Payload for create / update */
export interface AnnouncementDraft {
  title: string;
  message: string;
  audience: Audience;
  allowReplies: boolean;
  sendEmail: boolean;
  sendSms: boolean;
  authorUsername: string;
  authorName: string;
}

/** Reply / comment attached to an announcement */
export interface AnnouncementReply {
  id: number;
  announcementId?: number;
  authorUsername: string;
  authorName: string;
  authorRole?: Role | string;
  message: string;
  createdAt: string;
}