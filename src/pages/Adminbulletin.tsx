import React, { useEffect, useState } from "react";
import {
  COURSES, STUDENTS, EMPTY, getRegister, sem1, sem2, total, courseMax,
  type Course, type Marks,
} from "./bulletinStore";

const NAVY = "#0B1B3A";
type Line = { course: Course; m: Marks };

export default function AdminBulletin() {
  const [studentId, setStudentId] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(false);
  const student = STUDENTS.find((s) => s.id === studentId);

  // Load this student's marks from EVERY teacher's register
  useEffect(() => {
    if (!studentId) return setLines([]);
    setLoading(true);
    Promise.all(
      COURSES.map(async (course) => {
        const reg = await getRegister(course.id);
        return { course, m: reg[studentId] ?? EMPTY };
      })
    ).then((l) => {
      setLines(l);
      setLoading(false);
    });
  }, [studentId]);

  const gMax = lines.reduce((a, l) => a + courseMax(l.course), 0);
  const gTot = lines.reduce((a, l) => a + total(l.m), 0);
  const pct = gMax ? ((gTot / gMax) * 100).toFixed(1) : "0";

  const cell = (v: number | null) => (v === null ? "" : v);

  // Download = opens a printable bulletin (choose "Save as PDF" in the print dialog)
  function download() {
    if (!student) return;
    const rows = lines
      .map(
        ({ course: c, m }) => `<tr><td style="text-align:left">${c.name}</td>
        <td>${cell(m.p1)}</td><td>${cell(m.p2)}</td><td>${cell(m.ex1)}</td><td>${sem1(m)}</td>
        <td>${cell(m.p3)}</td><td>${cell(m.p4)}</td><td>${cell(m.ex2)}</td><td>${sem2(m)}</td>
        <td><b>${total(m)}</b></td><td>${courseMax(c)}</td></tr>`
      )
      .join("");
    const w = window.open("", "_blank");
    if (!w) return alert("Autorisez les fenêtres pop-up pour télécharger le bulletin.");
    w.document.write(`<html><head><title>Bulletin ${student.name}</title>
      <style>body{font-family:Arial;padding:24px;font-size:12px}h2,h3,p{text-align:center;margin:4px}
      table{width:100%;border-collapse:collapse;margin-top:14px}td,th{border:1px solid #000;padding:4px;text-align:center}
      th{background:#eee}</style></head><body>
      <h3>REPUBLIQUE DEMOCRATIQUE DU CONGO</h3>
      <p>MINISTERE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET PROFESSIONNEL</p>
      <h2>BULLETIN — ${student.classe}</h2>
      <p><b>Élève :</b> ${student.name}</p>
      <table><tr><th rowspan="2">BRANCHE</th><th colspan="4">PREMIER SEMESTRE</th><th colspan="4">SECOND SEMESTRE</th>
        <th rowspan="2">T.G</th><th rowspan="2">MAX</th></tr>
        <tr><th>1è P</th><th>2è P</th><th>EXAM</th><th>TOT</th><th>3è P</th><th>4è P</th><th>EXAM</th><th>TOT</th></tr>
        ${rows}
        <tr><th style="text-align:left">TOTAUX</th><th colspan="3"></th><th>${lines.reduce((a, l) => a + sem1(l.m), 0)}</th>
        <th colspan="3"></th><th>${lines.reduce((a, l) => a + sem2(l.m), 0)}</th><th>${gTot}</th><th>${gMax}</th></tr>
        <tr><th style="text-align:left">POURCENTAGE</th><th colspan="10">${pct} %</th></tr></table>
      <script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  }

  const th: React.CSSProperties = { padding: "8px 6px", border: "1px solid #cbd5e1", background: "#f1f5f9", fontSize: 12 };
  const td: React.CSSProperties = { padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center", fontSize: 13 };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Notes et bulletin</h1>
      <p style={{ color: "#64748b", marginBottom: 16 }}>
        Choisissez un élève pour voir les points saisis par chaque enseignant.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 6, minWidth: 260 }}
        >
          <option value="">Sélectionner un élève…</option>
          {STUDENTS.map((s) => (
            <option key={s.id} value={s.id}>{s.name} — {s.classe}</option>
          ))}
        </select>
        <button
          onClick={download}
          disabled={!student}
          style={{
            background: student ? NAVY : "#94a3b8", color: "#fff", border: 0, borderRadius: 6,
            padding: "8px 18px", fontWeight: 600, cursor: student ? "pointer" : "not-allowed",
          }}
        >
          Télécharger le bulletin
        </button>
      </div>

      {!student && <p style={{ color: "#64748b" }}>Aucun élève sélectionné.</p>}
      {student && loading && <p>Chargement…</p>}

      {student && !loading && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 820 }}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }} rowSpan={2}>Branche</th>
                <th style={th} colSpan={4}>Premier semestre</th>
                <th style={th} colSpan={4}>Second semestre</th>
                <th style={th} rowSpan={2}>T.G</th>
                <th style={th} rowSpan={2}>Max</th>
              </tr>
              <tr>
                {["1è P", "2è P", "Exam", "Tot", "3è P", "4è P", "Exam", "Tot"].map((h, i) => (
                  <th key={i} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map(({ course: c, m }) => (
                <tr key={c.id}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600, color: NAVY }}>{c.name}</td>
                  <td style={td}>{cell(m.p1)}</td><td style={td}>{cell(m.p2)}</td>
                  <td style={td}>{cell(m.ex1)}</td><td style={td}>{sem1(m)}</td>
                  <td style={td}>{cell(m.p3)}</td><td style={td}>{cell(m.p4)}</td>
                  <td style={td}>{cell(m.ex2)}</td><td style={td}>{sem2(m)}</td>
                  <td style={{ ...td, fontWeight: 700 }}>{total(m)}</td>
                  <td style={td}>{courseMax(c)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ ...td, textAlign: "left", fontWeight: 700 }} colSpan={9}>
                  Total général · {pct} %
                </td>
                <td style={{ ...td, fontWeight: 700 }}>{gTot}</td>
                <td style={{ ...td, fontWeight: 700 }}>{gMax}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}