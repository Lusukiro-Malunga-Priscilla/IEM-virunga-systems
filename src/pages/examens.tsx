// src/pages/examens.tsx - admin read-only view of all exams
import React, { useEffect, useMemo, useState } from "react";
import { Search, Loader2, Download, Paperclip } from "lucide-react";
import { examApi, Exam } from "@/lib/examApi";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Brouillon", PUBLISHED: "Publie", CLOSED: "Ferme",
};

export default function Examens() {
  const [rows, setRows] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true); setError(null);
    examApi.listAll()
      .then(d => setRows(d || []))
      .catch(e => setError(e instanceof Error ? e.message : "Erreur de chargement."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const published = rows.filter(r => (r.status || "").toUpperCase() === "PUBLISHED").length;
    const byTeacher = new Set(rows.map(r => r.createdByTeacher?.id).filter(Boolean)).size;
    return { total, published, byTeacher };
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(r => {
      if (statusFilter && (r.status || "").toUpperCase() !== statusFilter) return false;
      if (!needle) return true;
      const t = r.createdByTeacher;
      const teacherName = t ? `${t.prenom || ""} ${t.nom || ""}` : "";
      return `${r.title} ${r.subject} ${r.studentClass} ${teacherName}`.toLowerCase().includes(needle);
    });
  }, [rows, q, statusFilter]);

  const exportCsv = () => {
    const lines = [
      ["Date", "Titre", "Matiere", "Classe", "Type", "Max", "Statut", "Enseignant"],
      ...filtered.map(r => [
        r.examDate, r.title, r.subject || "", r.studentClass || "",
        r.examType, String(r.maxScore), r.status,
        r.createdByTeacher ? `${r.createdByTeacher.prenom || ""} ${r.createdByTeacher.nom || ""}`.trim() : "",
      ]),
    ];
    const csv = lines.map(l => l.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `examens-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="exa-wrap">
      <style>{`
        .exa-wrap { font-family:'IBM Plex Sans',system-ui,sans-serif; color:#221F1B; }
        .exa-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:18px; flex-wrap:wrap; }
        .exa-title { font-size:22px; font-weight:700; color:#0B1B3A; margin:0 0 4px; }
        .exa-sub { color:#64748B; font-size:13.5px; margin:0; }
        .exa-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:18px; }
        .exa-stat { background:#fff; border:1px solid #E4E8EF; border-radius:10px; padding:14px 16px; }
        .exa-stat .k { font-size:11.5px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:#64748B; }
        .exa-stat .v { font-size:22px; font-weight:700; color:#0B1B3A; margin-top:4px; }
        .exa-btn { display:inline-flex; align-items:center; gap:8px; padding:9px 14px; font-size:13.5px; font-weight:600; font-family:inherit; border-radius:6px; cursor:pointer; border:1px solid #0B1B3A; background:#fff; color:#0B1B3A; }
        .exa-card { background:#fff; border:1px solid #E4E8EF; border-radius:10px; overflow:hidden; }
        .exa-filters { display:flex; gap:12px; align-items:center; padding:14px 18px; background:#FAFAF8; border-bottom:1px solid #E4E8EF; flex-wrap:wrap; }
        .exa-search { position:relative; flex:1; min-width:220px; }
        .exa-search input { width:100%; padding:8px 12px 8px 34px; border:1px solid #E4E8EF; border-radius:6px; font-size:13px; font-family:inherit; }
        .exa-search svg { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94A3B8; }
        .exa-select { padding:8px 10px; border:1px solid #E4E8EF; border-radius:6px; font-size:13px; font-family:inherit; }
        table.exa-table { width:100%; border-collapse:collapse; font-size:13.5px; }
        .exa-table thead th { background:#F1F5F9; text-align:left; padding:11px 14px; font-size:11.5px; font-weight:600; letter-spacing:.04em; color:#64748B; text-transform:uppercase; white-space:nowrap; }
        .exa-table tbody td { padding:11px 14px; border-top:1px solid #E4E8EF; }
        .exa-table tbody tr:hover { background:#FAFAF8; }
        .exa-badge { display:inline-block; padding:3px 9px; border-radius:999px; font-size:11px; font-weight:600; }
        .exa-badge.draft { background:#F1F5F9; color:#475569; }
        .exa-badge.published { background:#E6F4EA; color:#14532D; }
        .exa-badge.closed { background:#FDECEC; color:#9B2C2C; }
        .exa-empty { padding:48px 24px; text-align:center; color:#94A3B8; font-size:13.5px; }
        .spin { animation: exa-spin .9s linear infinite; }
        @keyframes exa-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="exa-head">
        <div>
          <h1 className="exa-title">Examens</h1>
          <p className="exa-sub">Vue globale de tous les examens crees par les enseignants.</p>
        </div>
        <button className="exa-btn" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download size={15} /> Exporter CSV
        </button>
      </div>

      <div className="exa-stats">
        <div className="exa-stat"><div className="k">Total examens</div><div className="v">{stats.total}</div></div>
        <div className="exa-stat"><div className="k">Publies</div><div className="v">{stats.published}</div></div>
        <div className="exa-stat"><div className="k">Enseignants</div><div className="v">{stats.byTeacher}</div></div>
      </div>

      <div className="exa-card">
        <div className="exa-filters">
          <div className="exa-search">
            <Search size={15} />
            <input type="text" placeholder="Rechercher un titre, une matiere, un enseignant..."
              value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="exa-select" value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="DRAFT">Brouillons</option>
            <option value="PUBLISHED">Publies</option>
            <option value="CLOSED">Fermes</option>
          </select>
        </div>

        {loading ? (
          <div className="exa-empty"><Loader2 size={16} className="spin" /> Chargement...</div>
        ) : error ? (
          <div className="exa-empty" style={{ color:"#9B2C2C" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className="exa-empty">Aucun examen enregistre.</div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="exa-table">
              <thead>
                <tr>
                  <th>Date</th><th>Titre</th><th>Matiere</th><th>Classe</th>
                  <th>Type</th><th>Max</th><th>Statut</th><th>Enseignant</th>
                  <th>Fichier</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const st = (r.status || "DRAFT").toUpperCase();
                  const cls = st === "PUBLISHED" ? "published" : st === "CLOSED" ? "closed" : "draft";
                  const t = r.createdByTeacher;
                  const teacherName = t ? `${t.prenom || ""} ${t.nom || ""}`.trim() : "-";
                  return (
                    <tr key={r.id}>
                      <td>{r.examDate}</td>
                      <td style={{ fontWeight:600, color:"#0B1B3A" }}>{r.title}</td>
                      <td>{r.subject || "-"}</td>
                      <td>{r.studentClass || "-"}</td>
                      <td>{r.examType}</td>
                      <td>{r.maxScore}</td>
                      <td><span className={`exa-badge ${cls}`}>{STATUS_LABEL[st] || st}</span></td>
                      <td>{teacherName || "-"}</td>
                      <td>
                        {r.attachmentUrl ? (
                          <a href={r.attachmentUrl} download={r.attachmentName || "exam"} title={r.attachmentName || "Fichier joint"} style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#C8933E", textDecoration: "none", fontWeight: 600 }}>
                            <Download size={14} /> Telecharger
                          </a>
                        ) : (
                          <span style={{ color: "#94A3B8" }}>â€”</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
