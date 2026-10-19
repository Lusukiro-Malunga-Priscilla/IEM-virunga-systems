// // src/pages/presences.tsx
// import React, { useState } from 'react';
// import AdminDailyAttendance from '../components/AdminDailyAttendance';
// import { AttendeeType } from '../types/attendance';

// const TABS: { key: AttendeeType; label: string }[] = [
//   { key: 'STUDENT', label: 'Eleves' },
//   { key: 'TEACHER', label: 'Enseignants' },
//   { key: 'ADMIN',   label: 'Administration' },
// ];

// export default function Presences() {
//   const [tab, setTab] = useState<AttendeeType>('STUDENT');

//   return (
//     <div style={{ padding: 24 }}>
//       <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0B1B3A', marginBottom: 6 }}>
//         Presences
//       </h1>
//       <p style={{ color: '#64748b', marginBottom: 16 }}>
//         Journal de presence - filtrez par date, classe ou personne.
//       </p>

//       <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
//         {TABS.map(t => (
//           <button
//             key={t.key}
//             onClick={() => setTab(t.key)}
//             style={{
//               padding: '8px 14px',
//               border: '1px solid #cbd5e1',
//               borderRadius: 6,
//               cursor: 'pointer',
//               background: tab === t.key ? '#0B1B3A' : 'transparent',
//               color: tab === t.key ? '#fff' : '#0B1B3A',
//             }}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       <AdminDailyAttendance attendeeType={tab} />
//     </div>
//   );
// }


// src/pages/presences.tsx
import React, { useEffect, useMemo, useState } from "react";
import { History, Search, X, Loader2 } from "lucide-react";
import AdminDailyAttendance from "../components/AdminDailyAttendance";
import { AttendeeType } from "../types/attendance";

const API_BASE = "";

const TABS: { key: AttendeeType; label: string }[] = [
  { key: "STUDENT", label: "\u00C9l\u00E8ves" },
  { key: "TEACHER", label: "Enseignants" },
  { key: "ADMIN",   label: "Administration" },
];

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
function authHeaders(): Record<string, string> {
  try {
    const keys = ["scolagest-auth-token", "token", "access_token", "accessToken", "jwt"];
    for (const k of keys) {
      const v = localStorage.getItem(k) || sessionStorage.getItem(k);
      if (v && JWT_PATTERN.test(v)) return { Authorization: `Bearer ${v}` };
    }
  } catch {}
  return {};
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgoISO = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

// ─────────────────────────────────────────────────────────────
// HISTORY MODAL
// ─────────────────────────────────────────────────────────────

interface HistoryGroup {
  date?: string;
  studentClass: string;
  section: string;
  sectionLabel: string;
  total: number;
  present: number;
  late: number;
  absent: number;
  students: {
    userAccountId: number;
    fullName: string;
    status: string;
    checkInTime: string | null;
    justification?: string | null;
  }[];
}

function HistoryModal({ onClose }: { onClose: () => void }) {
  const [from, setFrom] = useState(daysAgoISO(7));
  const [to, setTo]     = useState(todayISO());
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [classes, setClasses] = useState<{ value: string; section: string; sectionLabel: string }[]>([]);
  const [rows, setRows] = useState<HistoryGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/attendance/classes`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : { classes: [] })
      .then(d => setClasses(d.classes || []))
      .catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ from, to });
    if (studentClass) params.set("studentClass", studentClass);
    if (section)      params.set("section", section);

    fetch(`${API_BASE}/api/attendance/history?${params.toString()}`, {
      headers: authHeaders(),
    })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`Erreur ${r.status}`)))
      .then(d => { if (!cancelled) setRows(d.classes || []); })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur de chargement.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [from, to, studentClass, section]);

  const totalPresent = rows.reduce((s, g) => s + (g.present || 0), 0);
  const totalAbsent  = rows.reduce((s, g) => s + (g.absent  || 0), 0);
  const totalLate    = rows.reduce((s, g) => s + (g.late    || 0), 0);

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={modalHead}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0B1B3A" }}>
              Historique des pr\u00E9sences
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              Filtr\u00E9 par date, classe et section.
            </p>
          </div>
          <button onClick={onClose} style={closeBtn}><X size={18} /></button>
        </div>

        <div style={filterBar}>
          <label style={labelStyle}>
            Du
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Au
            <input type="date" value={to} onChange={e => setTo(e.target.value)} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Classe
            <select value={studentClass} onChange={e => { setStudentClass(e.target.value); setSection(""); }} style={inputStyle}>
              <option value="">Toutes les classes</option>
              {Array.from(new Set(classes.map(c => c.value))).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </label>
          <label style={labelStyle}>
            Section
            <select value={section} onChange={e => setSection(e.target.value)} style={inputStyle}>
              <option value="">Toutes les sections</option>
              {classes
                .filter(c => !studentClass || c.value === studentClass)
                .map(c => (
                  <option key={c.section} value={c.section}>{c.sectionLabel || c.section}</option>
                ))}
            </select>
          </label>

          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={chipStyle("#E6F4EA", "#14532D")}>{totalPresent} pr\u00E9sents</span>
            <span style={chipStyle("#FEF3C7", "#92400E")}>{totalLate} retards</span>
            <span style={chipStyle("#FDECEC", "#9B2C2C")}>{totalAbsent} absents</span>
          </div>
        </div>

        <div style={{ padding: "20px 24px", maxHeight: "60vh", overflowY: "auto", background: "#F9FAFC" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
              <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Chargement...
            </div>
          )}
          {error && <p style={{ color: "#dc2626" }}>{error}</p>}
          {!loading && !error && rows.length === 0 && (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: 40 }}>
              Aucune pr\u00E9sence enregistr\u00E9e pour cette p\u00E9riode.
            </p>
          )}

          {rows.map((g, i) => (
            <div key={`${g.studentClass}-${g.section}-${g.date || ""}-${i}`} style={groupCard}>
              <div style={groupHead}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0B1B3A" }}>
                    Classe {g.studentClass}
                    {g.sectionLabel ? ` \u00B7 ${g.sectionLabel}` : ""}
                  </div>
                  {g.date && (
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{g.date}</div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={chipStyle("#E6F4EA", "#14532D")}>{g.present} P</span>
                  <span style={chipStyle("#FEF3C7", "#92400E")}>{g.late} R</span>
                  <span style={chipStyle("#FDECEC", "#9B2C2C")}>{g.absent} A</span>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ background: "#F1F5F9" }}>
                  <tr>
                    <th style={th}>Nom</th>
                    <th style={th}>Statut</th>
                    <th style={th}>Heure</th>
                    <th style={th}>Justification</th>
                  </tr>
                </thead>
                <tbody>
                  {g.students.map(s => (
                    <tr key={s.userAccountId} style={{ borderTop: "1px solid #eef2f7" }}>
                      <td style={td}>{s.fullName}</td>
                      <td style={td}>
                        <span style={statusChip(s.status)}>{statusLabel(s.status)}</span>
                      </td>
                      <td style={td}>{s.checkInTime ? String(s.checkInTime).slice(0, 5) : "-"}</td>
                      <td style={td}>{s.justification || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STUDENT SEARCH MODAL
// ─────────────────────────────────────────────────────────────

interface StudentHit {
  id: number;
  fullName: string;
  registrationNumber?: string;
  userAccountId?: number;
  studentClass?: string;
  section?: string;
}

function StudentSearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<StudentHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<StudentHit | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setHits([]); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/students/search?name=${encodeURIComponent(query.trim())}`, {
        headers: authHeaders(),
      })
        .then(r => r.ok ? r.json() : Promise.reject(new Error(`Erreur ${r.status}`)))
        .then(d => { if (!cancelled) setHits(Array.isArray(d) ? d : []); })
        .catch((e: unknown) => {
          if (!cancelled) setError(e instanceof Error ? e.message : "Erreur de recherche.");
        })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [query]);

  useEffect(() => {
    if (!selected) { setHistory([]); return; }
    const uid = selected.userAccountId || selected.id;
    let cancelled = false;
    setHistoryLoading(true);
    fetch(`${API_BASE}/api/attendance/user/${uid}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then((d: any[]) => { if (!cancelled) setHistory(Array.isArray(d) ? d : []); })
      .catch(() => { if (!cancelled) setHistory([]); })
      .finally(() => { if (!cancelled) setHistoryLoading(false); });
    return () => { cancelled = true; };
  }, [selected]);

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={modalHead}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0B1B3A" }}>
              Rechercher un \u00E9l\u00E8ve
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              Voir tout l'historique de pr\u00E9sence d'un \u00E9l\u00E8ve.
            </p>
          </div>
          <button onClick={onClose} style={closeBtn}><X size={18} /></button>
        </div>

        <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              autoFocus
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(null); }}
              placeholder="Nom, matricule ou e-mail..."
              style={{ ...inputStyle, width: "100%", paddingLeft: 36 }}
            />
          </div>
        </div>

        <div style={{ padding: "20px 24px", maxHeight: "60vh", overflowY: "auto", background: "#F9FAFC" }}>
          {loading && <p style={{ color: "#64748b" }}>Recherche...</p>}
          {error && <p style={{ color: "#dc2626" }}>{error}</p>}

          {!selected && hits.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {hits.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelected(h)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#0B1B3A" }}>{h.fullName}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {h.registrationNumber || ""}
                    {h.studentClass ? ` \u00B7 Classe ${h.studentClass}` : ""}
                  </div>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1B3A" }}>{selected.fullName}</div>
                  <div style={{ fontSize: 12.5, color: "#64748b" }}>
                    {selected.registrationNumber || ""} \u00B7 Classe {selected.studentClass || "-"}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: "transparent", border: "1px solid #cbd5e1", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12.5 }}
                >
                  Changer d'\u00E9l\u00E8ve
                </button>
              </div>

              {historyLoading ? (
                <p style={{ color: "#64748b" }}>Chargement de l'historique...</p>
              ) : history.length === 0 ? (
                <p style={{ color: "#94a3b8", textAlign: "center", padding: 30 }}>
                  Aucune pr\u00E9sence enregistr\u00E9e pour cet \u00E9l\u00E8ve.
                </p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead style={{ background: "#F1F5F9" }}>
                    <tr>
                      <th style={th}>Date</th>
                      <th style={th}>Statut</th>
                      <th style={th}>Heure</th>
                      <th style={th}>Cours</th>
                      <th style={th}>Justification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history
                      .slice()
                      .sort((a: any, b: any) => String(b.date).localeCompare(String(a.date)))
                      .map((r: any) => (
                        <tr key={r.id} style={{ borderTop: "1px solid #eef2f7" }}>
                          <td style={td}>{r.date}</td>
                          <td style={td}>
                            <span style={statusChip(statusOf(r))}>{statusLabel(statusOf(r))}</span>
                          </td>
                          <td style={td}>
                            {r.checkInTime ? String(r.checkInTime).slice(11, 16) : "-"}
                          </td>
                          <td style={td}>{r.course || "-"}</td>
                          <td style={td}>{r.justification || "-"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function statusOf(r: any): string {
  if (r.present === false) return "ABSENT";
  if (r.late === true) return "LATE";
  return "PRESENT";
}
function statusLabel(s: string) {
  if (s === "ABSENT") return "Absent";
  if (s === "LATE")   return "Retard";
  return "Pr\u00E9sent";
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function Presences() {
  const [tab, setTab] = useState<AttendeeType>("STUDENT");
  const [showHistory, setShowHistory] = useState(false);
  const [showSearch, setShowSearch]   = useState(false);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1B3A", margin: 0 }}>
            Pr\u00E9sences
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0" }}>
            Journal de pr\u00E9sence \u2014 filtrez par date, classe ou personne.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setShowHistory(true)} style={toolbarBtn}>
            <History size={16} /> Historique
          </button>
          <button onClick={() => setShowSearch(true)} style={toolbarBtn}>
            <Search size={16} /> Rechercher un \u00E9l\u00E8ve
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              cursor: "pointer",
              background: tab === t.key ? "#0B1B3A" : "transparent",
              color: tab === t.key ? "#fff" : "#0B1B3A",
              fontWeight: tab === t.key ? 600 : 500,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AdminDailyAttendance attendeeType={tab} />

      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      {showSearch  && <StudentSearchModal onClose={() => setShowSearch(false)} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0,
  background: "rgba(15,23,42,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 50, padding: 20,
};
const modal: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  width: "100%",
  maxWidth: 900,
  maxHeight: "90vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
};
const modalHead: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "18px 24px",
  borderBottom: "1px solid #e2e8f0",
};
const closeBtn: React.CSSProperties = {
  background: "transparent", border: "none", cursor: "pointer", color: "#64748b", padding: 4,
};
const filterBar: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end",
  padding: "16px 24px",
  background: "#F8FAFC",
  borderBottom: "1px solid #e2e8f0",
};
const labelStyle: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: 4,
  fontSize: 11.5, fontWeight: 600, letterSpacing: "0.03em",
  textTransform: "uppercase", color: "#64748b",
};
const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 13.5,
  border: "1px solid #cbd5e1",
  borderRadius: 6,
  outline: "none",
  fontFamily: "inherit",
  background: "#fff",
};
const toolbarBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "9px 16px",
  fontSize: 13.5,
  fontWeight: 600,
  border: "1px solid #0B1B3A",
  borderRadius: 8,
  background: "#0B1B3A",
  color: "#fff",
  cursor: "pointer",
};
const groupCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  overflow: "hidden",
  marginBottom: 16,
};
const groupHead: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "12px 16px",
  background: "#F1F5F9",
  borderBottom: "1px solid #e2e8f0",
};
const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 14px",
  fontSize: 11.5, fontWeight: 600, color: "#64748B",
  textTransform: "uppercase", letterSpacing: "0.04em",
};
const td: React.CSSProperties = { padding: "10px 14px", verticalAlign: "middle" };

function chipStyle(bg: string, fg: string): React.CSSProperties {
  return {
    background: bg, color: fg,
    borderRadius: 999,
    padding: "3px 10px",
    fontSize: 12, fontWeight: 600,
  };
}
function statusChip(s: string): React.CSSProperties {
  if (s === "ABSENT") return chipStyle("#FDECEC", "#9B2C2C");
  if (s === "LATE")   return chipStyle("#FEF3C7", "#92400E");
  return chipStyle("#E6F4EA", "#14532D");
}