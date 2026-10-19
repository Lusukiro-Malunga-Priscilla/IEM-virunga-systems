// // src/pages/teacher/Teacherattendance.tsx
// import React, { useState } from 'react';
// import TeacherSelfAttendance from '../../components/TeacherSelfAttendance';
// import TeacherStudentAttendance from '../../components/TeacherStudentAttendance';

// const TABS = [
//   { key: 'self',     label: 'Ma presence' },
//   { key: 'students', label: 'Presence des eleves' },
// ] as const;

// type Tab = typeof TABS[number]['key'];

// export default function TeacherAttendance() {
//   const [tab, setTab] = useState<Tab>('self');

//   return (
//     <div style={{ padding: 24 }}>
//       <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0B1B3A', marginBottom: 6 }}>
//         Presences
//       </h1>
//       <p style={{ color: '#64748b', marginBottom: 16 }}>
//         Enregistrez votre presence et marquez celle de vos eleves.
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

//       {tab === 'self' && <TeacherSelfAttendance />}
//       {tab === 'students' && <TeacherStudentAttendance />}
//     </div>
//   );
// }

// src/components/TeacherStudentAttendance.tsx
import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Clock3, Loader2, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ------------------------------------------------------------------ */
/*  Presence des eleves — cote enseignant                              */
/*  Connects to:                                                       */
/*    GET  /api/attendance/classes                                     */
/*         -> { classes: [{ value, section, sectionLabel }] }          */
/*         (one entry per class the teacher can take attendance for,   */
/*          each tagged with the section it belongs to)                */
/*    GET  /api/attendance/roster?studentClass=&section=&date=         */
/*         -> { students: [...], existingAttendance: { [id]: status } }*/
/*    POST /api/attendance/students                                    */
/*         body: { date, studentClass, section, records:[{studentId,status}] } */
/*         The backend must (1) persist the records so they show up in */
/*         the admin attendance board, and (2) send the SMS + email    */
/*         confirmation to each student's phone/email on file.         */
/* ------------------------------------------------------------------ */

const API_BASE = "";

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
function isJwtLike(value: unknown): value is string {
  return typeof value === "string" && JWT_PATTERN.test(value);
}
function findTokenInStorage(storage: Storage): string | null {
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key) continue;
    const raw = storage.getItem(key);
    if (!raw) continue;
    if (isJwtLike(raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        for (const v of Object.values(parsed)) {
          if (isJwtLike(v)) return v as string;
        }
      }
    } catch {
      // not JSON, ignore
    }
  }
  return null;
}

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

interface ClassOption {
  value: string; // studentClass, e.g. "6eme A"
  section: string; // section code, e.g. "INFIRMIERE"
  sectionLabel: string; // display name of the section
}

interface RosterStudent {
  id: number;
  registrationNumber: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const STATUS_META: Record<AttendanceStatus, { label: string; className: string }> = {
  PRESENT: { label: "Présent", className: "present" },
  ABSENT: { label: "Absent", className: "absent" },
  LATE: { label: "Retard", className: "late" },
};

export default function TeacherStudentAttendance() {
  const authCtx = useAuth() as any;

  const authToken = useMemo(() => {
    const fromContext =
      authCtx?.token || authCtx?.user?.token || authCtx?.accessToken || authCtx?.session?.token;
    if (isJwtLike(fromContext)) return fromContext;
    return findTokenInStorage(localStorage) || findTokenInStorage(sessionStorage);
  }, [authCtx]);

  const authHeaders = (): Record<string, string> =>
    authToken ? { Authorization: `Bearer ${authToken}` } : {};

  const [date, setDate] = useState(todayISO());
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [selectedClassValue, setSelectedClassValue] = useState("");

  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [records, setRecords] = useState<Record<number, AttendanceStatus>>({});

  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const selectedClass = classes.find((c) => c.value === selectedClassValue) || null;

  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 6000);
    return () => clearTimeout(t);
  }, [banner]);

  useEffect(() => {
    if (selectedClass) {
      loadRoster(selectedClass, date);
    } else {
      setRoster([]);
      setRecords({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassValue, date]);

  const loadClasses = async () => {
    setLoadingClasses(true);
    try {
      const res = await fetch(`${API_BASE}/api/attendance/classes`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setClasses(data.classes || data || []);
    } catch {
      setBanner({
        type: "error",
        text: "Impossible de charger la liste des classes. Vérifiez votre connexion.",
      });
    } finally {
      setLoadingClasses(false);
    }
  };

  const loadRoster = async (cls: ClassOption, forDate: string) => {
    setLoadingRoster(true);
    try {
      const params = new URLSearchParams({
        studentClass: cls.value,
        section: cls.section,
        date: forDate,
      });
      const res = await fetch(`${API_BASE}/api/attendance/roster?${params.toString()}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Impossible de charger la liste des élèves de cette classe.");
      const data = await res.json();
      const students: RosterStudent[] = data.students || data;
      setRoster(students);

      const existing: Record<number, AttendanceStatus> = data.existingAttendance || {};
      const next: Record<number, AttendanceStatus> = {};
      students.forEach((s) => {
        next[s.id] = existing[s.id] || "PRESENT";
      });
      setRecords(next);
    } catch (e) {
      setBanner({ type: "error", text: e instanceof Error ? e.message : "Erreur de chargement." });
      setRoster([]);
      setRecords({});
    } finally {
      setLoadingRoster(false);
    }
  };

  const setStatus = (studentId: number, status: AttendanceStatus) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: AttendanceStatus) => {
    const next: Record<number, AttendanceStatus> = {};
    roster.forEach((s) => (next[s.id] = status));
    setRecords(next);
  };

  const handleSave = async () => {
    if (!selectedClass || roster.length === 0) return;
    setSaving(true);
    try {
      const payload = {
        date,
        studentClass: selectedClass.value,
        section: selectedClass.section,
        records: roster.map((s) => ({
          studentId: s.id,
          status: records[s.id] || "PRESENT",
        })),
      };

      const res = await fetch(`${API_BASE}/api/attendance/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Échec de l'enregistrement de la présence.");

      setBanner({
        type: "success",
        text: `Présence enregistrée pour ${roster.length} élève(s). Une notification par SMS et e-mail a été envoyée à chaque élève.`,
      });
    } catch (e) {
      setBanner({ type: "error", text: e instanceof Error ? e.message : "Erreur inattendue." });
    } finally {
      setSaving(false);
    }
  };

  const presentCount = roster.filter((s) => records[s.id] === "PRESENT").length;
  const absentCount = roster.filter((s) => records[s.id] === "ABSENT").length;
  const lateCount = roster.filter((s) => records[s.id] === "LATE").length;

  return (
    <div className="tsa-wrap">
      <style>{`
        .tsa-wrap {
          --color-panel: #15302A;
          --color-panel-alt: #1D3F35;
          --color-bg: #F6F2E8;
          --color-text: #221F1B;
          --color-text-muted: #6B6357;
          --color-accent: #C8933E;
          --color-border: #E4E8EF;
          --color-present: #14532D;
          --color-present-bg: #E6F4EA;
          --color-absent: #9B2C2C;
          --color-absent-bg: #FDECEC;
          --color-late: #92400E;
          --color-late-bg: #FEF3C7;

          font-family: 'IBM Plex Sans', system-ui, sans-serif;
          color: var(--color-text);
        }

        .tsa-banner {
          margin-bottom: 16px;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 13.5px;
          line-height: 1.5;
        }
        .tsa-banner.success { background: #E6F4EA; color: #14532D; border: 1px solid #BFE3CA; }
        .tsa-banner.error { background: #FDECEC; color: #7A2626; border: 1px solid #F3C6C6; }

        .tsa-card {
          background: #fff;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          overflow: hidden;
        }

        .tsa-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: flex-end;
          padding: 20px 24px;
          border-bottom: 1px solid var(--color-border);
          background: #FAFAF8;
        }

        .tsa-field { display: flex; flex-direction: column; gap: 6px; min-width: 200px; }
        .tsa-field label {
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }
        .tsa-field select, .tsa-field input {
          padding: 9px 12px;
          font-size: 13.5px;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-family: inherit;
          background: #fff;
          color: var(--color-text);
          outline: none;
        }
        .tsa-field select:focus-visible, .tsa-field input:focus-visible { border-color: var(--color-accent); }
        .tsa-field select:disabled, .tsa-field input:disabled { background: #F1F5F9; color: var(--color-text-muted); }

        .tsa-summary {
          margin-left: auto;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .tsa-chip {
          font-size: 12px;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 999px;
        }
        .tsa-chip.present { background: var(--color-present-bg); color: var(--color-present); }
        .tsa-chip.absent { background: var(--color-absent-bg); color: var(--color-absent); }
        .tsa-chip.late { background: var(--color-late-bg); color: var(--color-late); }

        .tsa-bulk {
          display: flex;
          gap: 8px;
          padding: 14px 24px;
          border-bottom: 1px solid var(--color-border);
        }
        .tsa-bulk-btn {
          font-size: 12.5px;
          font-weight: 600;
          padding: 7px 12px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: #fff;
          cursor: pointer;
          color: var(--color-text);
        }
        .tsa-bulk-btn:hover { border-color: var(--color-panel); }

        table.tsa-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .tsa-table thead th {
          background: #F1F5F9;
          text-align: left;
          padding: 12px 16px;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #64748B;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .tsa-table tbody td {
          padding: 12px 16px;
          border-top: 1px solid var(--color-border);
          vertical-align: middle;
        }
        .tsa-table tbody tr:hover { background: #FAFAF8; }
        .tsa-matricule { color: var(--color-text-muted); font-size: 12.5px; }
        .tsa-name { font-weight: 600; }
        .tsa-contact { color: var(--color-text-muted); font-size: 12.5px; }

        .tsa-status-group { display: flex; gap: 6px; }
        .tsa-status-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          border: 1px solid var(--color-border);
          background: #fff;
          color: var(--color-text-muted);
          cursor: pointer;
        }
        .tsa-status-btn.active.present { background: var(--color-present-bg); color: var(--color-present); border-color: #BFE3CA; }
        .tsa-status-btn.active.absent { background: var(--color-absent-bg); color: var(--color-absent); border-color: #F3C6C6; }
        .tsa-status-btn.active.late { background: var(--color-late-bg); color: var(--color-late); border-color: #FDE68A; }

        .tsa-empty { padding: 48px 24px; text-align: center; color: var(--color-text-muted); font-size: 13.5px; }

        .tsa-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-top: 1px solid var(--color-border);
        }
        .tsa-footer-note { font-size: 12.5px; color: var(--color-text-muted); max-width: 460px; }

        .tsa-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 13.5px;
          font-weight: 600;
          font-family: inherit;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid var(--color-panel);
          background: var(--color-panel);
          color: #F3EFE3;
        }
        .tsa-save-btn:hover:not(:disabled) { background: var(--color-panel-alt); }
        .tsa-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spin { animation: tsa-spin 0.9s linear infinite; }
        @keyframes tsa-spin { to { transform: rotate(360deg); } }

        @media (max-width: 720px) {
          .tsa-controls { flex-direction: column; align-items: stretch; }
          .tsa-summary { margin-left: 0; }
          .tsa-footer { flex-direction: column; align-items: stretch; gap: 12px; }
        }
      `}</style>

      {banner && <div className={`tsa-banner ${banner.type}`}>{banner.text}</div>}

      <div className="tsa-card">
        <div className="tsa-controls">
          <div className="tsa-field">
            <label>Classe</label>
            <select
              value={selectedClassValue}
              onChange={(e) => setSelectedClassValue(e.target.value)}
              disabled={loadingClasses}
            >
              <option value="">
                {loadingClasses ? "Chargement…" : "Sélectionner la classe…"}
              </option>
              {classes.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.value}
                </option>
              ))}
            </select>
          </div>

          <div className="tsa-field">
            <label>Section</label>
            <input type="text" value={selectedClass?.sectionLabel || ""} disabled placeholder="—" />
          </div>

          <div className="tsa-field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          {roster.length > 0 && (
            <div className="tsa-summary">
              <span className="tsa-chip present">{presentCount} présent(s)</span>
              <span className="tsa-chip absent">{absentCount} absent(s)</span>
              <span className="tsa-chip late">{lateCount} retard(s)</span>
            </div>
          )}
        </div>

        {selectedClass && roster.length > 0 && (
          <div className="tsa-bulk">
            <button className="tsa-bulk-btn" onClick={() => markAll("PRESENT")}>
              Marquer tous présents
            </button>
            <button className="tsa-bulk-btn" onClick={() => markAll("ABSENT")}>
              Marquer tous absents
            </button>
          </div>
        )}

        {!selectedClass ? (
          <div className="tsa-empty">Sélectionnez une classe pour afficher la liste des élèves.</div>
        ) : loadingRoster ? (
          <div className="tsa-empty">Chargement de la liste des élèves…</div>
        ) : roster.length === 0 ? (
          <div className="tsa-empty">Aucun élève actif trouvé dans cette classe.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tsa-table">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom complet</th>
                  <th>Contact</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((s) => {
                  const status = records[s.id] || "PRESENT";
                  return (
                    <tr key={s.id}>
                      <td className="tsa-matricule">{s.registrationNumber}</td>
                      <td className="tsa-name">{s.fullName}</td>
                      <td className="tsa-contact">
                        {s.email}
                        {(s.phoneNumber || s.phone) && (
                          <>
                            <br />
                            {s.phoneNumber || s.phone}
                          </>
                        )}
                      </td>
                      <td>
                        <div className="tsa-status-group">
                          {(["PRESENT", "ABSENT", "LATE"] as AttendanceStatus[]).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`tsa-status-btn ${
                                status === opt ? `active ${STATUS_META[opt].className}` : ""
                              }`}
                              onClick={() => setStatus(s.id, opt)}
                            >
                              {opt === "PRESENT" && <CheckCircle2 size={13} />}
                              {opt === "ABSENT" && <XCircle size={13} />}
                              {opt === "LATE" && <Clock3 size={13} />}
                              {STATUS_META[opt].label}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedClass && roster.length > 0 && (
          <div className="tsa-footer">
            <p className="tsa-footer-note">
              À l'enregistrement, chaque élève recevra automatiquement un SMS et un e-mail de
              confirmation à son numéro et son adresse enregistrés dans son dossier.
            </p>
            <button className="tsa-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
              {saving ? "Enregistrement…" : "Enregistrer la présence"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}