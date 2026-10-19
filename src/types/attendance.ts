// src/types/attendance.ts

export type AttendeeType = 'ADMIN' | 'TEACHER' | 'STUDENT';

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'NOT_MARKED';

/** One person's attendance status for the selected day. */
export interface DailyAttendanceBox {
  userAccountId: number;
  fullName: string;
  status: AttendanceStatus;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  justification?: string | null;
  course?: string | null;
}

export interface StudentRosterItem {
  studentId: number;
  fullName: string;
  registrationNumber?: string;
  matricule?: string;
  studentClass?: string;
  section?: string;
  present?: boolean;
  status?: AttendanceStatus;
  note?: string;
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName?: string;
  courseId?: number;
  courseName?: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface StudentAttendanceHistoryRow {
  date: string;
  courseName: string;
  status: AttendanceStatus;
  note?: string;
}

export interface ClassAttendanceCheckInRequest {
  course: string;
  date: string;
  attendees: {
    userAccountId: number;
    status: AttendanceStatus;
    justification?: string;
  }[];
}

/** Attendance as returned by /api/attendance (list endpoints). */
export interface Attendance {
  id: number;
  userAccountId: number;
  fullName?: string;
  course?: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  justification?: string | null;
}

/** Time of day classes start, used to compute LATE vs PRESENT. */
export const SCHOOL_START_TIME = '07:30';

/** Late threshold in minutes — anything after SCHOOL_START_TIME + this is "LATE". */
export const LATE_THRESHOLD_MINUTES = 15;