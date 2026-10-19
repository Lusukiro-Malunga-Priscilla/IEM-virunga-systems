// src/pages/Reports.tsx — Admin view of all teacher reports
import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Download, X, Calendar, Clock, FileText, AlertCircle, Award, User } from "lucide-react";
import { reportApi, TeacherReport } from "@/lib/reportApi";

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthAgoISO = () => new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);

export default function Reports() {
  const [reports, setReports] = useState<TeacherReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<TeacherReport | null>(null);

  const [filterFrom, setFilterFrom] = useState(monthAgoISO());
  const [filterTo, setFilterTo]     = useState(todayISO());
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterText, setFilterText] = useState("");

  useEffect(() => { load(); }, [filterFrom, filterTo, filterTeacher]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawer(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const data = await reportApi.list({
        from: filterFrom || undefined,
        to:   filterTo   || undefined,
        teacherId: filterTeacher ? Number(filterTeacher) : undefined,
      });
      setReports(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  const teachers = useMemo(() => {
    const map = new Map<number, string>();
    reports.forEach(r => { if (r.teacherId != null) map.set(r.teacherId, r.teacherName || `#${r.teacherId}`); });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [reports]);

  const filtered = useMemo(() => {
    if (!filterText) return reports;
    const q = filterText.toLowerCase();
    return reports.filter(r =>
      `${r.teacherName} ${r.summary} ${r.classesTaught} ${r.issues}`.toLowerCase().includes(q)
    );
  }, [reports, filterText]);

  const stats = useMemo(() => {
    const today = todayISO();
    const total = filtered.length;
    const todayCount = filtered.filter(r => r.reportDate === today).length;
    const uniq = new Set(filtered.filter(r => r.reportDate === today).map(r => r.teacherId)).size;
    return { total, todayCount, uniq };
  }, [filtered]);

  const exportCsv = () => {
    const rows = [
      ["Date", "Enseignant", "Classes", "Heures", "Résumé", "Problèmes", "Réalisations", "Statut"],
      ...filtered.map(r => [
        r.reportDate,
        r.teacherName || "",
        r.classesTaught || "",
        r.hoursWorked ?? "",
        (r.summary || "").replace(/\n/g, " "),
        (r.issues || "").replace(/\n/g, " "),
        (r.achievements || "").replace(/\n/g, " "),
        r.status || "",
      ]),
    ];
    const csv = rows.map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapports-${filterFrom}-${filterTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rp-wrap">
      <style>{`
        .rp-wrap { font-family: 'IBM Plex Sans', system-ui, sans-serif; color:#221F1B; }
        .rp-head { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:18px; flex-wrap:wrap; }
        .rp-title { font-size:22px; font-weight:700; color:#0B1B3A; margin:0 0 4px; }
        .rp-sub   { color:#64748b; font-size:13.5px; margin:0; }
        .rp-stats { display:grid; grid-template-columns: repeat(3,1fr); gap:12px; margin-bottom:18px; }
        .rp-stat  { background:#fff; border:1px solid #E4E8EF; border-radius:10px; padding:14px 16px; }
        .rp-stat .k { font-size:11.5px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:#64748B; }
        .rp-stat .v { font-size:22px; font-weight:700; color:#0B1B3A; margin-top:4px; }
        .rp-card { background:#fff; border:1px solid #E4E8EF; border-radius:10px; overflow:hidden; }
        .rp-filters { display:flex; gap:12px; align-items:flex-end; padding:14px 18px; background:#FAFAF8; border-bottom:1px solid #E4E8EF; flex-wrap:wrap; }
        .rp-field { display:flex; flex-direction:column; gap:6px; }
        .rp-field label { font-size:11.5px; font-weight:600; letter-spacing:.03em; text-transform:uppercase; color:#64748B; }
        .rp-field input, .rp-field select { padding:8px 10px; border:1px solid #E4E8EF; border-radius:6px; font-size:13px; font-family:inherit; }
        .rp-btn { display:inline-flex; align-items:center; gap:8px; padding:9px 14px; font-size:13.5px; font-weight:600; font-family:inherit; border-radius:6px; cursor:pointer; border:1px solid #0B1B3A; background:#0B1B3A; color:#F3EFE3; }
        .rp-btn.ghost { background:#fff; color:#0B1B3A; }
        table.rp-table { width:100%; border-collapse:collapse; font-size:13.5px; }
        .rp-table thead th { background:#F1F5F9; text-align:left; padding:11px 14px; font-size:11.5px; font-weight:600; letter-spacing:.04em; color:#64748B; text-transform:uppercase; white-space:nowrap; }
        .rp-table tbody td { padding:11px 14px; border-top:1px solid #E4E8EF; vertical-align:top; }
        .rp-table tbody tr { cursor:pointer; }
        .rp-table tbody tr:hover { background:#FAFAF8; }
        .rp-empty { padding:48px 24px; text-align:center; color:#64748B; font-size:13.5px; }
        .rp-drawer-bg { position:fixed; inset:0; background:rgba(11,27,58,.35); z-index:60; }
        .rp-drawer { position:fixed; top:0; right:0; bottom:0; width:min(520px,100vw); background:#fff; box-shadow:-12px 0 40px rgba(0,0,0,.15); z-index:61; display:flex; flex-direction:column; }
        .rp-drawer-head { padding:20px 24px; border-bottom:1px solid #E4E8EF; display:flex; justify-content:space-between; align-items:center; }
        .rp-drawer-body { padding:20px 24px; overflow:auto; }
        .rp-drawer-title { font-size:16px; font-weight:700; color:#0B1B3A; }
        .rp-drawer-meta { color:#64748B; font-size:12.5px; margin-top:2px; }
        .rp-section { margin-bottom:18px; }
        .rp-section h4 { font-size:11.5px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:#64748B; margin:0 0 6px; }
        .rp-section p { font-size:13.5px; line-height:1.55; margin:0; white-space:pre-wrap; }
        .spin { animation: rp-spin .9s linear infinite; } @keyframes rp-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="rp-head">
        <div>
          <h1 className="rp-title">Rapports des enseignants</h1>
          <p className="rp-sub">Vue globale des rapports journaliers soumis par les enseignants.</p>
        </div>
        <button className="rp-btn ghost" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download size={15} /> Exporter CSV
        </button>
      </div>

      <div className="rp-stats">
        <div className="rp-stat"><div className="k">Total (filtré)</div><div className="v">{stats.total}</div></div>
        <div className="rp-stat"><div className="k">Aujourd'hui</div><div className="v">{stats.todayCount}</div></div>
        <div className="rp-stat"><div className="k">Enseignants aujourd'hui</div><div className="v">{stats.uniq}</div></div>
      </div>

      <div className="rp-card">
        <div className="rp-filters">
          <div className="rp-field"><label>Du</label>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} /></div>
          <div className="rp-field"><label>Au</label>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} /></div>
          <div className="rp-field"><label>Enseignant</label>
            <select value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)}>
              <option value="">Tous</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select></div>
          <div className="rp-field" style={{ flex:1, minWidth:180 }}>
            <label>Recherche</label>
            <input type="text" placeholder="Mot-clé…" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="rp-empty">Chargement…</div>
        ) : error ? (
          <div className="rp-empty" style={{ color:"#9B2C2C" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className="rp-empty">Aucun rapport sur la période.</div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Date</th><th>Enseignant</th><th>Classes</th>
                  <th>Heures</th><th>Résumé</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} onClick={() => setDrawer(r)}>
                    <td>{new Date(r.reportDate).toLocaleDateString("fr-FR")}</td>
                    <td style={{ fontWeight:600 }}>{r.teacherName || "—"}</td>
                    <td>{r.classesTaught || "—"}</td>
                    <td>{r.hoursWorked ?? "—"}</td>
                    <td style={{ maxWidth:440 }}>{r.summary?.slice(0,120) || "—"}{r.summary && r.summary.length > 120 ? "…" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {drawer && (
        <>
          <div className="rp-drawer-bg" onClick={() => setDrawer(null)} />
          <aside className="rp-drawer">
            <div className="rp-drawer-head">
              <div>
                <div className="rp-drawer-title">{drawer.teacherName}</div>
                <div className="rp-drawer-meta">
                  {new Date(drawer.reportDate).toLocaleDateString("fr-FR", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
                  {drawer.hoursWorked ? ` · ${drawer.hoursWorked}h` : ""}
                </div>
              </div>
              <button className="rp-btn ghost" onClick={() => setDrawer(null)}><X size={15} /></button>
            </div>
            <div className="rp-drawer-body">
              {drawer.classesTaught && (
                <div className="rp-section"><h4>Classes enseignées</h4><p>{drawer.classesTaught}</p></div>
              )}
              <div className="rp-section"><h4>Résumé</h4><p>{drawer.summary || "—"}</p></div>
              {drawer.issues && <div className="rp-section"><h4>Problèmes / blocages</h4><p>{drawer.issues}</p></div>}
              {drawer.achievements && <div className="rp-section"><h4>Réalisations</h4><p>{drawer.achievements}</p></div>}
              <div className="rp-section"><h4>Statut</h4><p>{drawer.status || "SUBMITTED"}</p></div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}