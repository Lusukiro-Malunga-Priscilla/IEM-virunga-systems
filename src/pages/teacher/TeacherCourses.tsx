import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  EMPTY, loadCourses, loadStudents, getRegister, saveRegister,
  sem1, sem2, total, courseMax,
  type Marks, type Course, type Student,
} from "../bulletinStore";
import { useAuth } from "@/context/AuthContext";

const NAVY = "#0B1B3A";
const MUTED = "#64748b";
const BORDER = "#e4e0d6";

type Field = keyof Marks;
const COLS: { key: Field; label: string; exam: boolean }[] = [
  { key: "p1",  label: "1ère P", exam: false },
  { key: "p2",  label: "2ème P", exam: false },
  { key: "ex1", label: "Exam",   exam: true  },
  { key: "p3",  label: "3ème P", exam: false },
  { key: "p4",  label: "4ème P", exam: false },
  { key: "ex2", label: "Exam",   exam: true  },
];

/* ---------- Document storage helpers ---------- */
type CourseDoc = {
  name: string;      // original filename
  type: string;      // MIME
  size: number;      // bytes
  html?: string;     // rendered HTML (for .docx preview)
  text?: string;     // plain text (for .txt / fallback)
  dataUrl?: string;  // base64 (for download)
  uploadedAt: number;
};
const docKey = (courseId: string) => `course-doc:${courseId}`;

function saveCourseDoc(courseId: string, doc: CourseDoc) {
  try { localStorage.setItem(docKey(courseId), JSON.stringify(doc)); } catch {}
}
function loadCourseDoc(courseId: string): CourseDoc | null {
  try {
    const raw = localStorage.getItem(docKey(courseId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function removeCourseDoc(courseId: string) {
  try { localStorage.removeItem(docKey(courseId)); } catch {}
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function TeacherCourses() {
  const { user } = useAuth() as any;
  const CURRENT_TEACHER_ID = user?.id ?? user?.username ?? "";

  const [COURSES, setCourses]   = useState<Course[]>([]);
  const [STUDENTS, setStudents] = useState<Student[]>([]);
  const [courseId, setCourseId] = useState("");
  const [rows, setRows]         = useState<Record<string, Marks>>({});
  const [status, setStatus]     = useState<"" | "saved" | "error">("");

  const [doc, setDoc]               = useState<CourseDoc | null>(null);
  const [docStatus, setDocStatus]   = useState<"" | "uploading" | "done" | "error">("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([loadCourses(), loadStudents()]).then(([c, s]) => {
      setCourses(c);
      setStudents(s);
    });
  }, []);

  const myCourses = useMemo(
    () => COURSES.filter((c) => c.teacherId === CURRENT_TEACHER_ID),
    [COURSES, CURRENT_TEACHER_ID]
  );

  useEffect(() => {
    if (!courseId && myCourses[0]) setCourseId(myCourses[0].id);
  }, [myCourses, courseId]);

  const course = myCourses.find((c) => c.id === courseId);
  const students = STUDENTS;

  useEffect(() => {
    if (!courseId) return;
    setStatus("");
    getRegister(courseId).then(setRows);
    setDoc(loadCourseDoc(courseId));
    setDocStatus("");
  }, [courseId]);

  if (!course) return <div style={{ padding: 24 }}>Aucun cours assigné.</div>;

  const maxOf = (exam: boolean) => (exam ? course.examMax : course.periodMax);

  function setMark(studentId: string, field: Field, raw: string, max: number) {
    let v: number | null = raw === "" ? null : Number(raw);
    if (v !== null && (isNaN(v) || v < 0)) return;
    if (v !== null && v > max) v = max;
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

  /* ---------- Document upload ---------- */
  async function onUpload(file: File) {
    if (!course) return;
    setDocStatus("uploading");
    try {
      const lower = file.name.toLowerCase();
      const dataUrl = await fileToDataUrl(file);
      let html: string | undefined;
      let text: string | undefined;

      if (lower.endsWith(".docx")) {
        const mammoth = await import("mammoth/mammoth.browser" as any);
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        html = result.value;
      } else if (lower.endsWith(".txt")) {
        text = await file.text();
      }

      const newDoc: CourseDoc = {
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        html,
        text,
        dataUrl,
        uploadedAt: Date.now(),
      };
      saveCourseDoc(course.id, newDoc);
      setDoc(newDoc);
      setDocStatus("done");
    } catch (err) {
      console.error(err);
      setDocStatus("error");
    }
  }

  function onDeleteDoc() {
    if (!course) return;
    if (!window.confirm("Supprimer le document de ce cours ?")) return;
    removeCourseDoc(course.id);
    setDoc(null);
    setDocStatus("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function humanSize(bytes: number) {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  }

  const th: React.CSSProperties = { padding: "8px 6px", border: "1px solid #cbd5e1", background: "#f1f5f9", fontSize: 12 };
  const td: React.CSSProperties = { padding: 4, border: "1px solid #e2e8f0", textAlign: "center", fontSize: 13 };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Cours</h1>
      <p style={{ color: MUTED, marginBottom: 16 }}>
        Saisissez les points de chaque élève. L'administration les retrouve dans le bulletin.
      </p>

      {/* ---------- Course picker ---------- */}
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
        <span style={{ color: MUTED, fontSize: 13 }}>
          Maxima : périodes {course.periodMax} · examens {course.examMax} · total {courseMax(course)}
        </span>
      </div>

      {/* ---------- Résumé du cours (Word upload) ---------- */}
      <section style={{
        border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16,
        marginBottom: 20, background: "#fbfaf6"
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
          Résumé du cours (document Word)
        </h2>
        <p style={{ color: MUTED, fontSize: 13, marginBottom: 12 }}>
          Importez un document Word (.docx), PDF ou texte contenant le résumé de ce cours.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.doc,.pdf,.txt"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
          style={{ marginBottom: 8 }}
        />

        {docStatus === "uploading" && <span style={{ color: MUTED }}>Import en cours…</span>}
        {docStatus === "done"      && <span style={{ color: "#15803d" }}>Document importé.</span>}
        {docStatus === "error"     && <span style={{ color: "#b91c1c" }}>Échec de l'import.</span>}

        {doc && (
          <div style={{
            marginTop: 12, padding: 12, borderRadius: 8, background: "#fff",
            border: `1px solid ${BORDER}`, display: "flex", gap: 12,
            alignItems: "center", justifyContent: "space-between", flexWrap: "wrap"
          }}>
            <div>
              <div style={{ fontWeight: 600, color: NAVY }}>{doc.name}</div>
              <div style={{ color: MUTED, fontSize: 12 }}>
                {humanSize(doc.size)} · importé le {new Date(doc.uploadedAt).toLocaleString()}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {doc.dataUrl && (
                <a
                  href={doc.dataUrl}
                  download={doc.name}
                  style={{
                    background: NAVY, color: "#fff", padding: "6px 14px",
                    borderRadius: 6, textDecoration: "none", fontSize: 13, fontWeight: 600
                  }}
                >
                  Télécharger
                </a>
              )}
              <button
                onClick={onDeleteDoc}
                style={{
                  background: "#fff", color: "#a32020", border: "1px solid #a32020",
                  padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        )}

        {doc?.html && (
          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: "pointer", color: NAVY, fontWeight: 600 }}>
              Aperçu du résumé
            </summary>
            <div
              style={{ marginTop: 8, padding: 12, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, maxHeight: 400, overflow: "auto" }}
              dangerouslySetInnerHTML={{ __html: doc.html }}
            />
          </details>
        )}
        {doc?.text && (
          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: "pointer", color: NAVY, fontWeight: 600 }}>
              Aperçu du résumé
            </summary>
            <pre style={{ marginTop: 8, padding: 12, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, maxHeight: 400, overflow: "auto", whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13 }}>
              {doc.text}
            </pre>
          </details>
        )}
      </section>

      {/* ---------- Notes table ---------- */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: 760, width: "100%" }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: "left" }}>Élève</th>
              {COLS.map((c, i) => (
                <th key={i} style={th}>
                  {c.label}
                  <div style={{ fontWeight: 400, color: MUTED }}>/{maxOf(c.exam)}</div>
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