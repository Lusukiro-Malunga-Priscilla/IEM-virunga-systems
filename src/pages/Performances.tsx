// src/pages/Performances.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Loader2, ArrowUp, ArrowDown } from "lucide-react";

const JWT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
function getToken(): string | null {
  for (const s of [localStorage, sessionStorage]) {
    for (let i = 0; i < s.length; i++) {
      const v = s.getItem(s.key(i) || "");
      if (v && JWT.test(v)) return v;
      try { const p = JSON.parse(v || ""); for (const iv of Object.values(p)) if (typeof iv === "string" && JWT.test(iv)) return iv; } catch {}
    }
  }
  return null;
}
function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
function usd(n: number | null | undefined) {
  const v = Number(n || 0);
  return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function num(n: number | null | undefined) {
  return Number(n || 0);
}

interface Summary {
  studentId: number;
  registrationNumber: string;
  fullName: string;
  studentClass: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
}
interface Attendance {
  id: number;
  date: string;
  present: boolean;
  late: boolean;
  userAccountId?: number;
}
interface Report {
  id: number;
  teacherId: number;
  teacherName: string;
  reportDate: string;
}

export default function Performances() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [s, a, r] = await Promise.all([
        fetch("/api/payments/summary", { headers: authHeaders() }).then(x => x.ok ? x.json() : []),
        fetch("/api/attendance",        { headers: authHeaders() }).then(x => x.ok ? x.json() : []),
        fetch("/api/reports",           { headers: authHeaders() }).then(x => x.ok ? x.json() : []),
      ]);
      setSummaries(s || []);
      setAttendance(a || []);
      setReports(r || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  // Totals (used by the TOTAL table)
  const totals = useMemo(() => {
    let budget = 0, spent = 0, remaining = 0;
    for (const s of summaries) {
      budget    += num(s.totalAmount);
      spent     += num(s.paidAmount);
      remaining += num(s.remainingAmount);
    }
    return { budget, spent, remaining };
  }, [summaries]);

  // Highest / lowest payment allocation
  const allocation = useMemo(() => {
    if (!summaries.length) return { high: null as Summary | null, low: null as Summary | null };
    const sorted = [...summaries].sort((a, b) => num(b.paidAmount) - num(a.paidAmount));
    return {
      high: sorted[0],
      low:  sorted[sorted.length - 1],
    };
  }, [summaries]);

  // Attendance breakdown for donut
  const attendanceBreak = useMemo(() => {
    let present = 0, late = 0, absent = 0;
    for (const a of attendance) {
      if (a.present) present++;
      else if (a.late) late++;
      else absent++;
    }
    return { present, late, absent, total: present + late + absent };
  }, [attendance]);

  // Student "risk" = attendance rate
  const risks = useMemo(() => {
    const byStudent = new Map<number, { present: number; total: number }>();
    for (const a of attendance) {
      const id = a.userAccountId ?? 0;
      if (!id) continue;
      const cur = byStudent.get(id) || { present: 0, total: 0 };
      cur.total++;
      if (a.present) cur.present++;
      byStudent.set(id, cur);
    }
    let low = 0, medium = 0, high = 0;
    for (const v of byStudent.values()) {
      const rate = v.total ? v.present / v.total : 0;
      if (rate >= 0.8) low++;
      else if (rate >= 0.5) medium++;
      else high++;
    }
    return { low, medium, high };
  }, [attendance]);

  // Top 10 students by paid amount (bar chart)
  const topPaid = useMemo(() => {
    return [...summaries]
      .sort((a, b) => num(b.paidAmount) - num(a.paidAmount))
      .slice(0, 10);
  }, [summaries]);

  const maxPaid = useMemo(
    () => Math.max(1, ...topPaid.map(s => num(s.paidAmount))),
    [topPaid]
  );

  if (loading) {
    return (
      <div style={{ padding: 24, display: "flex", gap: 8, alignItems: "center", color: "#64748b" }}>
        <Loader2 size={18} className="spin" /> Chargement...
        <style>{`.spin{animation:sp .9s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }
  if (error) return <div style={{ padding: 24, color: "#9B2C2C" }}>{error}</div>;

  const donutTotal = Math.max(1, attendanceBreak.total);
  const presentPct = Math.round((attendanceBreak.present / donutTotal) * 100);
  const latePct    = Math.round((attendanceBreak.late    / donutTotal) * 100);
  const absentPct  = Math.round((attendanceBreak.absent  / donutTotal) * 100);

  return (
    <div className="pd-page">
      <style>{`
        .pd-page {
          --navy: #0B1B3A;
          --navy-soft: #1B2E52;
          --cream: #F6F2E8;
          --paper: #FFFFFF;
          --line: #E4E8EF;
          --terra: #B0532F;
          --rust:  #8B3A1F;
          --ink:   #221F1B;
          --muted: #6B6357;
          font-family: 'IBM Plex Sans', system-ui, sans-serif;
          color: var(--ink);
          background: var(--cream);
          padding: 20px;
          min-height: 100%;
        }
        .pd-grid {
          display: grid;
          grid-template-columns: 260px 1fr 1.6fr;
          gap: 14px;
        }
        @media (max-width: 1100px) {
          .pd-grid { grid-template-columns: 1fr 1fr; }
          .pd-grid > .pd-right { grid-column: 1 / -1; }
        }
        @media (max-width: 720px) {
          .pd-grid { grid-template-columns: 1fr; }
        }

        .pd-card {
          background: var(--paper);
          border: 1px solid var(--line);
          display: flex;
          flex-direction: column;
        }
        .pd-header {
          background: var(--navy);
          color: #F3EFE3;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          padding: 10px 14px;
        }
        .pd-header.terra { background: var(--terra); }
        .pd-body { padding: 14px; flex: 1; }

        .pd-title-card {
          background: var(--navy);
          color: #F3EFE3;
          padding: 28px 18px;
          text-align: center;
        }
        .pd-title-card h1 {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: .12em;
          margin: 0;
          line-height: 1.35;
        }
        .pd-title-card .sub {
          font-size: 11px;
          opacity: .7;
          letter-spacing: .08em;
          margin-top: 6px;
        }

        table.pd-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        .pd-table thead th {
          background: var(--navy);
          color: #F3EFE3;
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .05em;
          padding: 7px 8px;
          text-align: left;
        }
        .pd-table tbody td {
          padding: 10px 8px;
          border-bottom: 1px solid var(--line);
          font-weight: 600;
          font-size: 13px;
        }
        .pd-table tbody tr:last-child td { border-bottom: none; }
        .pd-table .val { color: var(--navy); }

        .pd-alloc {
          display: grid;
          grid-template-columns: 44px 1fr 1fr;
          border-top: 1px solid var(--line);
        }
        .pd-alloc .arrows {
          background: var(--navy);
          color: #F3EFE3;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          padding: 10px 0;
        }
        .pd-alloc .who {
          padding: 8px 10px;
          border-left: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .pd-alloc .who:last-child { border-bottom: none; }
        .pd-alloc .who .name {
          font-size: 12px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 6px;
          min-height: 28px;
        }
        .pd-alloc .who .amt {
          font-size: 15px;
          font-weight: 800;
          color: var(--ink);
        }

        .pd-donut {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 0;
        }
        .pd-donut svg { width: 160px; height: 160px; }
        .pd-legend {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
          font-size: 12px;
        }
        .pd-legend-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pd-swatch {
          width: 10px; height: 10px; border-radius: 2px;
        }
        .pd-legend-row .pct {
          margin-left: auto;
          color: var(--muted);
          font-size: 11.5px;
        }

        .pd-risk-row {
          display: grid;
          grid-template-columns: 60px 1fr 30px;
          gap: 10px;
          align-items: center;
          margin-bottom: 14px;
          font-size: 12px;
        }
        .pd-risk-row .label { color: var(--muted); font-weight: 600; }
        .pd-risk-row .bar {
          height: 22px;
          background: var(--navy);
          min-width: 4px;
        }
        .pd-risk-row .count { color: var(--navy); font-weight: 700; text-align: right; }

        .pd-bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          height: 260px;
          padding: 10px 0 26px;
          border-left: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          position: relative;
        }
        .pd-bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
          position: relative;
        }
        .pd-bar-col .bar {
          width: 100%;
          max-width: 34px;
          background: var(--navy);
          transition: opacity .15s;
        }
        .pd-bar-col .bar:hover { opacity: .8; }
        .pd-bar-col .bar-label {
          position: absolute;
          bottom: -24px;
          font-size: 9.5px;
          color: var(--muted);
          text-align: center;
          line-height: 1.15;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pd-bar-col .val {
          position: absolute;
          top: -18px;
          font-size: 10px;
          color: var(--navy);
          font-weight: 600;
          white-space: nowrap;
        }
      `}</style>

      <div className="pd-grid">

        {/* ---------- LEFT COLUMN ---------- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="pd-card pd-title-card">
            <h1>PERFORMANCE<br/>DASHBOARD</h1>
            <div className="sub">IEM VIRUNGA</div>
          </div>

          <div className="pd-card">
            <div className="pd-header">TOTAL</div>
            <div className="pd-body" style={{ padding: 0 }}>
              <table className="pd-table">
                <thead>
                  <tr>
                    <th>Total</th>
                    <th>Paye</th>
                    <th>Reste</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="val">{usd(totals.budget)}</td>
                    <td className="val">{usd(totals.spent)}</td>
                    <td className="val">{usd(totals.remaining)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pd-header" style={{ marginTop: 0 }}>Plus haut / Plus bas</div>
              <div className="pd-alloc">
                <div className="arrows">
                  <ArrowUp size={22} />
                  <ArrowDown size={22} />
                </div>
                <div className="who">
                  <div className="name">{allocation.high?.fullName || "-"}</div>
                  <div className="amt">{usd(allocation.high?.paidAmount)}</div>
                </div>
                <div className="who">
                  <div className="name">{allocation.low?.fullName || "-"}</div>
                  <div className="amt">{usd(allocation.low?.paidAmount)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- CENTER COLUMN ---------- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="pd-card">
            <div className="pd-header">STATUT DES PRESENCES</div>
            <div className="pd-body">
              {attendanceBreak.total === 0 ? (
                <div style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, padding: "30px 0" }}>
                  Aucune presence enregistree.
                </div>
              ) : (
                <>
                  <div className="pd-donut">
                    <Donut
                      segments={[
                        { value: attendanceBreak.present, color: "#0B1B3A" },
                        { value: attendanceBreak.late,    color: "#B0532F" },
                        { value: attendanceBreak.absent,  color: "#D9CBB8" },
                      ]}
                      size={160}
                    />
                  </div>
                  <div className="pd-legend">
                    <div className="pd-legend-row">
                      <div className="pd-swatch" style={{ background:"#0B1B3A" }} />
                      <span>Present</span>
                      <span className="pct">{attendanceBreak.present} ({presentPct}%)</span>
                    </div>
                    <div className="pd-legend-row">
                      <div className="pd-swatch" style={{ background:"#B0532F" }} />
                      <span>Retard</span>
                      <span className="pct">{attendanceBreak.late} ({latePct}%)</span>
                    </div>
                    <div className="pd-legend-row">
                      <div className="pd-swatch" style={{ background:"#D9CBB8" }} />
                      <span>Absent</span>
                      <span className="pct">{attendanceBreak.absent} ({absentPct}%)</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pd-card">
            <div className="pd-header">RISQUES</div>
            <div className="pd-body">
              <RiskBar label="Faible" count={risks.low}    max={Math.max(1, risks.low, risks.medium, risks.high)} />
              <RiskBar label="Moyen"  count={risks.medium} max={Math.max(1, risks.low, risks.medium, risks.high)} />
              <RiskBar label="Eleve"  count={risks.high}   max={Math.max(1, risks.low, risks.medium, risks.high)} />
            </div>
          </div>
        </div>

        {/* ---------- RIGHT COLUMN ---------- */}
        <div className="pd-right" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="pd-card" style={{ flex: 1 }}>
            <div className="pd-header">PAIEMENTS PAR ELEVE (TOP 10)</div>
            <div className="pd-body">
              {topPaid.length === 0 ? (
                <div style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, padding: "60px 0" }}>
                  Aucun paiement enregistre.
                </div>
              ) : (
                <div className="pd-bar-chart">
                  {topPaid.map(s => {
                    const h = (num(s.paidAmount) / maxPaid) * 100;
                    return (
                      <div key={s.studentId} className="pd-bar-col">
                        <div className="val">{usd(s.paidAmount)}</div>
                        <div className="bar" style={{ height: `${h}%` }} title={`${s.fullName}: ${usd(s.paidAmount)}`} />
                        <div className="bar-label">{(s.fullName || "-").split(" ").slice(0, 2).join(" ")}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Donut({
  segments, size = 160,
}: { segments: { value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 4, sw = 26;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {segments.map((seg, i) => {
          const frac = Math.max(0, seg.value) / total;
          const dash = frac * C;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none" stroke={seg.color} strokeWidth={sw}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-acc}
            />
          );
          acc += dash;
          return el;
        })}
      </g>
    </svg>
  );
}

function RiskBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max ? (count / max) * 100 : 0;
  return (
    <div className="pd-risk-row">
      <span className="label">{label}</span>
      <div className="bar" style={{ width: `${Math.max(6, pct)}%` }} />
      <span className="count">{count}</span>
    </div>
  );
}