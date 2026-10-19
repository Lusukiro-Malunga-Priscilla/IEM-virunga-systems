import React, { useEffect, useMemo, useState } from "react";
import {
  COURSES, STUDENTS, CURRENT_TEACHER_ID, EMPTY,
  getRegister, saveRegister, sem1, sem2, total, courseMax,
  type Marks,
} from "./bulletinStore";

const NAVY = "#0B1B3A";
type Field = keyof Marks;
const COLS: { key: Field; label: string; exam: boolean }[] = [
  { key: "p1", label: "1ère P", exam: false },
  { key: "p2", label: "2ème P", exam: false },
  { key: "ex1", label: "Exam", exam: true },
  { key: "p3", label: "3ème P", exam: false },
  { key: "p4", label: "4ème P", exam: false },
  { key: "ex2", label: "Exam", exam: true },
];

export default function TeacherCourses() {
  // only the courses of the logged-in teacher
  const myCourses = useMemo(() => COURSES.filter((c) => c.teacherId === CURRENT_TEACHER_ID), []);
  const [courseId, setCourseId] = useState(myCourses[0]?.id ?? "");
  const [rows, setRows] = useState<Record<string, Marks>>({});
  const [status, setStatus] = useState<"" | "saved" | "error">("");

  const course = myCourses.find((c) => c.id === courseId);
  // TODO: replace with the students enrolled in this course
  const students = STUDENTS;

  useEffect(() => {
    if (!courseId) return;
    setStatus("");
    getRegister(courseId).then(setRows);
  }, [courseId]);

  if (!course) return <div style={{ padding: 24 }}>Aucun cours assigné.</div>;

  const maxOf = (exam: boolean) => (exam ? course.examMax : course.periodMax);

  function setMark(studentId: string, field: Field, raw: string, max: number) {
    let v: number | null = raw === "" ? null : Number(raw);
    if (v !== null && (isNaN(v) || v < 0)) return;
    if (v !== null && v > max) v = max; // never above the maximum
    setStatus("");
    setRows((r) => ({ ...r, [studentId]: { ...(r[studentId] ?? EMPTY), [field]: v } }));
  }

  async function save() {
    try {
      await saveRegister(course!.id, rows);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  const th: React.CSSProperties = { padding: "8px 6px", border: "1px solid #cbd5e1", background: "#f1f5f9", fontSize: 12 };
  const td: React.CSSProperties = { padding: 4, border: "1px solid #e2e8f0", textAlign: "center", fontSize: 13 };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Cours</h1>
      <p style={{ color: "#64748b", marginBottom: 16 }}>
        Saisissez les points de chaque élève. L'administration les retrouve dans le bulletin.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontWeight: 600 }}
        >
          {myCourses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span style={{ color: "#64748b", fontSize: 13 }}>
          Maxima : périodes {course.periodMax} · examens {course.examMax} · total {courseMax(course)}
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: 760, width: "100%" }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: "left" }}>Élève</th>
              {COLS.map((c, i) => (
                <th key={i} style={th}>
                  {c.label}
                  <div style={{ fontWeight: 400, color: "#64748b" }}>/{maxOf(c.exam)}</div>
                </th>
              ))}
              <th style={th}>Tot. 1</th>
              <th style={th}>Tot. 2</th>
              <th style={th}>T.G</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const m = rows[s.id] ?? EMPTY;
              return (
                <tr key={s.id}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600, color: NAVY }}>{s.name}</td>
                  {COLS.map((c, i) => (
                    <td key={i} style={td}>
                      <input
                        type="number"
                        min={0}
                        max={maxOf(c.exam)}
                        value={m[c.key] ?? ""}
                        onChange={(e) => setMark(s.id, c.key, e.target.value, maxOf(c.exam))}
                        aria-label={`${s.name} ${c.label}`}
                        style={{ width: 56, padding: 6, textAlign: "center", border: "1px solid #cbd5e1", borderRadius: 4 }}
                      />
                    </td>
                  ))}
                  <td style={td}>{sem1(m)}</td>
                  <td style={td}>{sem2(m)}</td>
                  <td style={{ ...td, fontWeight: 700 }}>{total(m)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={save}
          style={{ background: NAVY, color: "#fff", border: 0, borderRadius: 6, padding: "10px 18px", fontWeight: 600, cursor: "pointer" }}
        >
          Enregistrer les points
        </button>
        {status === "saved" && <span style={{ color: "#15803d" }}>Points enregistrés.</span>}
        {status === "error" && <span style={{ color: "#b91c1c" }}>Échec de l'enregistrement. Réessayez.</span>}
      </div>
    </div>
  );
}