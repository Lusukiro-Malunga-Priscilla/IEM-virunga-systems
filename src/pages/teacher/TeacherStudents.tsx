import React, { useEffect, useMemo, useState } from "react";
import { loadStudents, type Student } from "../bulletinStore";

const NAVY = "#0B1B3A";
const MUTED = "#64748b";

const SECTIONS = [
  { value: "",                      displayName: "Toutes les sections" },
  { value: "INFIRMIERE",            displayName: "Section Infirmiere" },
  { value: "ACCOUCHEUSE",           displayName: "Section Accoucheuse" },
  { value: "ASSISTANT_PHARMACIE",   displayName: "Section Assistant en pharmacie" },
  { value: "SANTE_MENTALE",         displayName: "Section Sante Mentale" },
  { value: "TECHNIQUE_LABORATOIRE", displayName: "Section Technique de Laboratoire" },
];

const CLASSES = ["Toutes les classes", "1ere", "2eme", "3eme", "4eme"];

export default function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classeFilter, setClasseFilter] = useState("Toutes les classes");
  const [sectionFilter, setSectionFilter] = useState("");

  useEffect(() => {
    loadStudents().then((s) => { setStudents(s); setLoading(false); });
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s: any) => {
      if (classeFilter !== "Toutes les classes" && s.classe !== classeFilter) return false;
      if (sectionFilter && (s.section || "") !== sectionFilter) return false;
      if (q && !String(s.name).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [students, classeFilter, sectionFilter, search]);

  if (loading) return <div style={{ padding: 24, color: MUTED }}>Chargement...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Eleves</h1>
      <p style={{ color: MUTED, marginBottom: 16 }}>{visible.length} eleve(s)</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          placeholder="Rechercher un eleve..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, minWidth: 220 }}
        />
        <select
          value={classeFilter}
          onChange={(e) => setClasseFilter(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 }}
        >
          {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 }}
        >
          {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.displayName}</option>)}
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff",
                      border: "1px solid #e4e0d6", borderRadius: 12, overflow: "hidden" }}>
        <thead style={{ background: "#f7f6f2" }}>
          <tr>
            <th style={{ textAlign: "left", padding: "10px 14px", color: NAVY, fontSize: 13 }}>Nom</th>
            <th style={{ textAlign: "left", padding: "10px 14px", color: NAVY, fontSize: 13 }}>Classe</th>
            <th style={{ textAlign: "left", padding: "10px 14px", color: NAVY, fontSize: 13 }}>Section</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((s: any) => (
            <tr key={s.id} style={{ borderTop: "1px solid #e4e0d6" }}>
              <td style={{ padding: "10px 14px", fontSize: 14 }}>{s.name}</td>
              <td style={{ padding: "10px 14px", fontSize: 14, color: MUTED }}>{s.classe}</td>
              <td style={{ padding: "10px 14px", fontSize: 14, color: MUTED }}>{s.section || "—"}</td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr><td colSpan={3} style={{ padding: 20, color: MUTED, textAlign: "center" }}>Aucun eleve</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
