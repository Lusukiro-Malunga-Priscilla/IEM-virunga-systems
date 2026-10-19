// src/pages/teacher/TeacherReports.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Save, Trash2, X, FileText } from "lucide-react";
import { reportApi, TeacherReport, ReportPayload } from "@/lib/reportApi";

const todayISO = () => new Date().toISOString().slice(0, 10);

const CLASS_YEARS = ['1ère', '2ème', '3ème', '4ème'];

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

interface ClassOption { value: string; section: string; sectionLabel: string; }
interface SectionOption { value: string; displayName: string; }

const emptyForm = (): ReportPayload => ({
  reportDate: todayISO(),
  summary: "",
  classesTaught: "",
  hoursWorked: null,
  issues: "",
  achievements: "",
});

export default function TeacherReports() {
  const [reports, setReports] = useState<TeacherReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ReportPayload>(emptyForm());

  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo,   setFilterTo]   = useState("");
  const [filterText, setFilterText] = useState("");

  useEffect(() => { load(); loadClasses(); loadSections(); }, []);
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 5000);
    return () => clearTimeout(t);
  }, [banner]);

  const load = async () => {
    setLoading(true); setError(null);
    try { setReports((await reportApi.mine()) || []); }
    catch (e) { setError(e instanceof Error ? e.message : "Erreur de chargement."); }
    finally { setLoading(false); }
  };

  const loadClasses = async () => {
    try {
      const res = await fetch("/api/attendance/classes", { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setClasses(data.classes || data || []);
    } catch {}
  };

  const loadSections = async () => {
    try {
      const res = await fetch("/api/students/sections", { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setSections(data.sections || data || []);
    } catch {}
  };

  const classesForSection = useMemo(() => {
    if (!selectedSection) return classes;
    return classes.filter(c => c.section === selectedSection);
  }, [classes, selectedSection]);

  const toggleClass = (value: string) => {
    setSelectedClasses(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const startCreate = () => {
    setForm(emptyForm());
    setSelectedClasses([]);
    setSelectedSection("");
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (r: TeacherReport) => {
    setForm({
      reportDate: r.reportDate,
      summary: r.summary || "",
      classesTaught: r.classesTaught || "",
      hoursWorked: r.hoursWorked ?? null,
      issues: r.issues || "",
      achievements: r.achievements || "",
    });
    setSelectedClasses((r.classesTaught || "").split(",").map(s => s.trim()).filter(Boolean));
    setSelectedSection("");
    setEditingId(r.id);
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm()); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.summary.trim()) {
      setBanner({ type: "error", text: "Le rÃ©sumÃ© des activitÃ©s est obligatoire." });
      return;
    }
    setSaving(true);
    try {
      const payload: ReportPayload = { ...form, classesTaught: selectedClasses.join(", ") };
      if (editingId) await reportApi.update(editingId, payload);
      else            await reportApi.create(payload);
      setBanner({ type: "success", text: editingId ? "Rapport mis Ã  jour." : "Rapport envoyÃ©." });
      cancelForm();
      await load();
    } catch (e) {
      setBanner({ type: "error", text: e instanceof Error ? e.message : "Erreur inattendue." });
    } finally { setSaving(false); }
  };

  const remove = async (r: TeacherReport) => {
    if (!confirm(`Supprimer le rapport du ${r.reportDate} ?`)) return;
    try { await reportApi.remove(r.id); setBanner({ type: "success", text: "Rapport supprimÃ©." }); await load(); }
    catch (e) { setBanner({ type: "error", text: e instanceof Error ? e.message : "Erreur." }); }
  };

  const filtered = useMemo(() => reports.filter(r => {
    if (filterFrom && r.reportDate < filterFrom) return false;
    if (filterTo   && r.reportDate > filterTo)   return false;
    if (filterText) {
      const q = filterText.toLowerCase();
      return `${r.summary} ${r.classesTaught} ${r.issues} ${r.achievements}`.toLowerCase().includes(q);
    }
    return true;
  }), [reports, filterFrom, filterTo, filterText]);

  const stats = useMemo(() => {
    const today = todayISO();
    const weekAgo = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
    return {
      total: reports.length,
      thisWeek: reports.filter(r => r.reportDate >= weekAgo).length,
      thisMonth: reports.filter(r => r.reportDate.slice(0, 7) === today.slice(0, 7)).length,
      submittedToday: reports.some(r => r.reportDate === today),
    };
  }, [reports]);

  return (
    <div className="tr-wrap">
      <style>{`
        .tr-wrap { font-family: 'IBM Plex Sans', system-ui, sans-serif; color:#221F1B; }
        .tr-head { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:18px; flex-wrap:wrap; }
        .tr-title { font-size:22px; font-weight:700; color:#0B1B3A; margin:0 0 4px; }
        .tr-sub { color:#64748b; font-size:13.5px; margin:0; }
        .tr-stats { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; margin-bottom:18px; }
        .tr-stat { background:#fff; border:1px solid #E4E8EF; border-radius:10px; padding:14px 16px; }
        .tr-stat .k { font-size:11.5px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:#64748B; }
        .tr-stat .v { font-size:22px; font-weight:700; color:#0B1B3A; margin-top:4px; }
        .tr-banner { padding:12px 16px; border-radius:6px; font-size:13.5px; margin-bottom:16px; }
        .tr-banner.success { background:#E6F4EA; color:#14532D; border:1px solid #BFE3CA; }
        .tr-banner.error { background:#FDECEC; color:#7A2626; border:1px solid #F3C6C6; }
        .tr-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 16px; font-size:13.5px; font-weight:600; font-family:inherit; border-radius:6px; cursor:pointer; border:1px solid #0B1B3A; background:#0B1B3A; color:#F3EFE3; }
        .tr-btn:hover:not(:disabled){ background:#15302A; }
        .tr-btn:disabled { opacity:.6; cursor:not-allowed; }
        .tr-btn.ghost { background:#fff; color:#0B1B3A; }
        .tr-btn.danger { background:#fff; color:#9B2C2C; border-color:#F3C6C6; }
        .tr-card { background:#fff; border:1px solid #E4E8EF; border-radius:10px; overflow:hidden; margin-bottom:16px; }
        .tr-form { padding:20px 24px; display:grid; grid-template-columns: 1fr 1fr; gap:14px; }
        .tr-form .full { grid-column: 1 / -1; }
        .tr-field { display:flex; flex-direction:column; gap:6px; }
        .tr-field label { font-size:11.5px; font-weight:600; letter-spacing:.03em; text-transform:uppercase; color:#64748B; }
        .tr-field input, .tr-field textarea, .tr-field select { padding:9px 12px; font-size:13.5px; border:1px solid #E4E8EF; border-radius:6px; font-family:inherit; outline:none; background:#fff; }
        .tr-field input:focus, .tr-field textarea:focus, .tr-field select:focus { border-color:#C8933E; }
        .tr-field textarea { min-height:80px; resize:vertical; }
        .tr-class-box { border:1px solid #E4E8EF; border-radius:6px; padding:10px 12px; min-height:44px; display:flex; flex-wrap:wrap; gap:6px; background:#fff; }
        .tr-chip { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; background:#EEF2F7; color:#0B1B3A; font-size:12.5px; font-weight:600; }
        .tr-chip button { border:none; background:transparent; cursor:pointer; color:#64748B; padding:0; line-height:1; }
        .tr-chip button:hover { color:#9B2C2C; }
        .tr-class-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(150px,1fr)); gap:6px; margin-top:8px; }
        .tr-class-opt { display:flex; align-items:center; gap:6px; padding:6px 8px; border:1px solid #E4E8EF; border-radius:5px; font-size:12.5px; cursor:pointer; }
        .tr-class-opt:hover { background:#F8FAFC; }
        .tr-class-opt input { margin:0; }
        .tr-filters { display:flex; gap:12px; align-items:flex-end; padding:14px 18px; background:#FAFAF8; border-bottom:1px solid #E4E8EF; flex-wrap:wrap; }
        .tr-filters input { padding:8px 10px; border:1px solid #E4E8EF; border-radius:6px; font-size:13px; font-family:inherit; }
        table.tr-table { width:100%; border-collapse:collapse; font-size:13.5px; }
        .tr-table thead th { background:#F1F5F9; text-align:left; padding:11px 14px; font-size:11.5px; font-weight:600; letter-spacing:.04em; color:#64748B; text-transform:uppercase; white-space:nowrap; }
        .tr-table tbody td { padding:11px 14px; border-top:1px solid #E4E8EF; vertical-align:top; }
        .tr-table tbody tr:hover { background:#FAFAF8; }
        .tr-empty { padding:48px 24px; text-align:center; color:#64748B; font-size:13.5px; }
        .tr-badge { display:inline-block; padding:3px 9px; border-radius:999px; font-size:11.5px; font-weight:600; background:#E6F4EA; color:#14532D; }
        .tr-actions { display:flex; gap:6px; }
        .tr-icon { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:6px; border:1px solid #E4E8EF; background:#fff; cursor:pointer; color:#334155; }
        .tr-icon:hover { background:#F1F5F9; }
        .tr-icon.danger { color:#9B2C2C; border-color:#F3C6C6; }
        .spin { animation: tr-spin .9s linear infinite; } @keyframes tr-spin { to { transform: rotate(360deg); } }
        @media (max-width: 720px){ .tr-form { grid-template-columns:1fr; } .tr-stats { grid-template-columns: repeat(2,1fr); } }
      `}</style>

      <div className="tr-head">
        <div>
          <h1 className="tr-title">Rapports journaliers</h1>
          <p className="tr-sub">DÃ©crivez ce que vous avez fait aujourd'hui. L'administration verra ce rapport automatiquement.</p>
        </div>
        {!showForm && (
          <button className="tr-btn" onClick={startCreate}>
            <Plus size={15} /> Nouveau rapport
          </button>
        )}
      </div>

      {banner && <div className={`tr-banner ${banner.type}`}>{banner.text}</div>}

      <div className="tr-stats">
        <div className="tr-stat"><div className="k">Total</div><div className="v">{stats.total}</div></div>
        <div className="tr-stat"><div className="k">Cette semaine</div><div className="v">{stats.thisWeek}</div></div>
        <div className="tr-stat"><div className="k">Ce mois</div><div className="v">{stats.thisMonth}</div></div>
        <div className="tr-stat"><div className="k">Aujourd'hui</div><div className="v">{stats.submittedToday ? "âœ“" : "â€”"}</div></div>
      </div>

      {showForm && (
        <form className="tr-card tr-form" onSubmit={submit}>
          <div className="tr-field">
            <label>Date</label>
            <input type="date" value={form.reportDate} max={todayISO()}
                   onChange={(e) => setForm({ ...form, reportDate: e.target.value })} required />
          </div>
          <div className="tr-field">
            <label>Heures travaillÃ©es</label>
            <input type="number" step="0.5" min="0" max="24"
                   value={form.hoursWorked ?? ""}
                   onChange={(e) => setForm({ ...form, hoursWorked: e.target.value === "" ? null : Number(e.target.value) })} />
          </div>

          <div className="tr-field">
            <label>Section</label>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
              <option value="">Toutes les sections</option>
              {sections.map(s => <option key={s.value} value={s.value}>{s.displayName}</option>)}
            </select>
          </div>

          <div className="tr-field full">
            <label>Classes enseignÃ©es</label>
            <div className="tr-class-box">
              {selectedClasses.length === 0 && <span style={{ color:"#94A3B8", fontSize:13 }}>Aucune classe sÃ©lectionnÃ©e</span>}
              {selectedClasses.map(c => (
                <span key={c} className="tr-chip">
                  {c}
                  <button type="button" onClick={() => toggleClass(c)}><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="tr-class-grid">
              {CLASS_YEARS.map((y) => (
                <label key={y} className="tr-class-opt">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(y)}
                    onChange={() => toggleClass(y)}
                  />
                  {y}
                </label>
              ))}
            </div>
          </div>

          <div className="tr-field full">
            <label>RÃ©sumÃ© des activitÃ©s *</label>
            <textarea value={form.summary}
                      placeholder="DÃ©crivez ce que vous avez fait aujourd'hui..."
                      onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
          </div>
          <div className="tr-field full">
            <label>ProblÃ¨mes / blocages (optionnel)</label>
            <textarea value={form.issues}
                      onChange={(e) => setForm({ ...form, issues: e.target.value })} />
          </div>
          <div className="tr-field full">
            <label>RÃ©alisations (optionnel)</label>
            <textarea value={form.achievements}
                      onChange={(e) => setForm({ ...form, achievements: e.target.value })} />
          </div>
          <div className="full" style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button type="button" className="tr-btn ghost" onClick={cancelForm} disabled={saving}>
              <X size={15} /> Annuler
            </button>
            <button type="submit" className="tr-btn" disabled={saving}>
              {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
              {saving ? "Enregistrementâ€¦" : editingId ? "Mettre Ã  jour" : "Envoyer"}
            </button>
          </div>
        </form>
      )}

      <div className="tr-card">
        <div className="tr-filters">
          <div className="tr-field"><label>Du</label>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} /></div>
          <div className="tr-field"><label>Au</label>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} /></div>
          <div className="tr-field" style={{ flex:1, minWidth:200 }}><label>Recherche</label>
            <input type="text" placeholder="Mot-clÃ©â€¦" value={filterText} onChange={(e) => setFilterText(e.target.value)} /></div>
        </div>

        {loading ? (
          <div className="tr-empty">Chargementâ€¦</div>
        ) : error ? (
          <div className="tr-empty" style={{ color:"#9B2C2C" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className="tr-empty">
            {reports.length === 0 ? "Aucun rapport encore. Cliquez sur Â« Nouveau rapport Â» pour commencer." : "Aucun rapport ne correspond aux filtres."}
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="tr-table">
              <thead>
                <tr><th>Date</th><th>Classes</th><th>Heures</th><th>RÃ©sumÃ©</th><th>Statut</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>{new Date(r.reportDate).toLocaleDateString("fr-FR")}</td>
                    <td>{r.classesTaught || "â€”"}</td>
                    <td>{r.hoursWorked ?? "â€”"}</td>
                    <td style={{ maxWidth:380 }}>{r.summary?.slice(0, 140) || "â€”"}{r.summary && r.summary.length > 140 ? "â€¦" : ""}</td>
                    <td><span className="tr-badge">{r.status || "SUBMITTED"}</span></td>
                    <td>
                      <div className="tr-actions">
                        <button type="button" className="tr-icon" title="Modifier" onClick={() => startEdit(r)}>
                          <FileText size={14} />
                        </button>
                        <button type="button" className="tr-icon danger" title="Supprimer" onClick={() => remove(r)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}