export type Audience = 'ALL' | 'STAFF' | 'TEACHERS' | 'STUDENTS';

export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface AnnouncementReply {
  id: number;
  authorUsername: string;
  authorName: string;
  authorRole: Role | string;
  message: string;
  createdAt: string; // ISO datetime
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  audience: Audience;
  allowReplies: boolean;
  sendEmail: boolean;
  sendSms: boolean;
  authorUsername?: string;
  authorName?: string;
  createdAt: string; // ISO datetime
  replies?: AnnouncementReply[];
}

export interface AnnouncementDraft {
  title: string;
  message: string;
  audience: Audience;
  allowReplies: boolean;
  sendEmail: boolean;
  sendSms: boolean;
  authorUsername?: string;
  authorName?: string;
}

/** Sentence-case labels shown in the UI — keep the backend enum values separate from copy. */
export const AUDIENCE_LABEL: Record<Audience, string> = {
  ALL: 'Everyone',
  STAFF: 'Staff',
  TEACHERS: 'Teachers only',
  STUDENTS: 'Students only',
};

export const AUDIENCE_HINT: Record<Audience, string> = {
  ALL: 'Visible to admins, teachers and students',
  STAFF: 'Visible to admins and teachers',
  TEACHERS: 'Visible to teachers only',
  STUDENTS: 'Visible to students only',
};