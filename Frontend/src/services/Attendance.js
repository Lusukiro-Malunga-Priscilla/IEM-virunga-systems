export type AttendeeType = 'STUDENT' | 'TEACHER';

export type BoxStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'NOT_MARKED';

export interface Attendance {
  id: number;
  date: string; // ISO yyyy-MM-dd
  checkInTime: string | null;
  checkOutTime: string | null;
  present: boolean;
  late: boolean;
  justification: string | null;
  attendeeType: AttendeeType;
  course: string | null;
  userAccount?: {
    id: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  };
}

export interface StudentRosterItem {
  id: number; // userAccountId
  fullName: string;
}

export interface ClassAttendanceEntry {
  studentUserAccountId: number;
  present: boolean;
  late: boolean;
  justification: string;
}

export interface ClassAttendanceCheckInRequest {
  teacherUsername: string;
  course: string;
  date?: string; // yyyy-MM-dd, defaults to today server-side
  entries: ClassAttendanceEntry[];
}

export interface DailyAttendanceBox {
  userAccountId: number;
  fullName: string;
  status: BoxStatus;
  checkInTime: string | null;
  checkOutTime: string | null;
  justification: string | null;
  course: string | null;
}

/** 07:30 — used client-side to warn the teacher live, in addition to the backend's own check. */
export const SCHOOL_START_TIME = '07:30';