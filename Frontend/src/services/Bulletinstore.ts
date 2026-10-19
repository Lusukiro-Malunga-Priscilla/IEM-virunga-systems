// bulletinStore.ts — shared data layer.
// Uses localStorage now. Replace the 4 functions at the bottom with your API calls
// (e.g. GET/POST /api/marks?courseId=...) and nothing else has to change.

export type Course = {
  id: string;
  name: string;          // shown on the bulletin, e.g. "RELIGION"
  teacherId: string;
  periodMax: number;     // max of 1ère P, 2ème P, 3ème P, 4ème P (e.g. 10)
  examMax: number;       // max of each exam (e.g. 20)
};

export type Student = { id: string; name: string; classe: string };

// One row of the register: marks of ONE student in ONE course
export type Marks = {
  p1: number | null; p2: number | null; ex1: number | null;   // 1st semester
  p3: number | null; p4: number | null; ex2: number | null;   // 2nd semester
};

export const EMPTY: Marks = { p1: null, p2: null, ex1: null, p3: null, p4: null, ex2: null };

// ---- Demo data (replace with your database) ----
export const CURRENT_TEACHER_ID = "t1"; // take this from your auth/session

export const COURSES: Course[] = [
  { id: "c1", name: "RELIGION", teacherId: "t1", periodMax: 10, examMax: 20 },
  { id: "c2", name: "EDUC. CIV & MORALE", teacherId: "t1", periodMax: 10, examMax: 20 },
  { id: "c3", name: "DACTYLOGRAPHIE", teacherId: "t2", periodMax: 20, examMax: 40 },
  { id: "c4", name: "DROIT", teacherId: "t2", periodMax: 20, examMax: 40 },
  { id: "c5", name: "MATHEMATIQUES", teacherId: "t3", periodMax: 40, examMax: 80 },
];

export const STUDENTS: Student[] = [
  { id: "s1", name: "ELANGA BONGONDA", classe: "5ème H.T.A" },
  { id: "s2", name: "MBANDAKA JEAN", classe: "5ème H.T.A" },
];

// ---- Storage (localStorage version) ----
const key = (courseId: string) => `marks:${courseId}`;
type Register = Record<string, Marks>; // studentId -> Marks

export async function getRegister(courseId: string): Promise<Register> {
  try {
    return JSON.parse(localStorage.getItem(key(courseId)) || "{}");
  } catch {
    return {};
  }
}

export async function saveRegister(courseId: string, data: Register): Promise<void> {
  localStorage.setItem(key(courseId), JSON.stringify(data));
}

// ---- Helpers used by both pages ----
const n = (v: number | null | undefined) => (typeof v === "number" ? v : 0);

export const sem1 = (m: Marks) => n(m.p1) + n(m.p2) + n(m.ex1);
export const sem2 = (m: Marks) => n(m.p3) + n(m.p4) + n(m.ex2);
export const total = (m: Marks) => sem1(m) + sem2(m);
export const courseMax = (c: Course) => 4 * c.periodMax + 2 * c.examMax;