// src/pages/Library.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Loader2, X, Save, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { bookApi, Book } from "@/lib/bookApi";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponible",
  ISSUED:    "Emprunte",
};

const emptyBook = (): Book => ({
  bookName: "",
  bookId: "",
  author: "",
  status: "AVAILABLE",
  issuerCardId: "",
});

export default function Library() {
  const [rows, setRows] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Book>(emptyBook());
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 5000);
    return () => clearTimeout(t);
  }, [banner]);

  const load = async (search?: string) => {
    setLoading(true); setError(null);
    try {
      const data = await bookApi.list(search);
      setRows(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de charger les livres.");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const available = rows.filter(r => (r.status || "").toUpperCase() === "AVAILABLE").length;
    const issued    = rows.filter(r => (r.status || "").toUpperCase() === "ISSUED").length;
    return { total: rows.length, available, issued };
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(r => {
      if (statusFilter && (r.status || "").toUpperCase() !== statusFilter) return false;
      if (!needle) return true;
      const hay = `${r.bookName || ""} ${r.bookId || ""} ${r.author || ""} ${r.issuerCardId || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q, statusFilter]);

  const openCreate = () => {
    setForm(emptyBook());
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (b: Book) => {
    setForm({ ...emptyBook(), ...b });
    setEditingId(b.id ?? null);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyBook()); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bookName.trim()) { setBanner({ type: "error", text: "Le nom du livre est obligatoire." }); return; }
    if (!form.bookId.trim())   { setBanner({ type: "error", text: "L identifiant du livre est obligatoire." }); return; }
    if (form.status === "ISSUED" && !form.issuerCardId?.trim()) {
      setBanner({ type: "error", text: "Le numero de carte de l emprunteur est obligatoire pour un livre emprunte." });
      return;
    }

    setSaving(true);
    try {
      const payload: Book = { ...form };
      if (payload.status === "AVAILABLE") payload.issuerCardId = null;

      if (editingId) await bookApi.update(editingId, payload);
      else           await bookApi.create(payload);

      setBanner({ type: "success", text: editingId ? "Livre mis a jour." : "Livre ajoute." });
      closeForm();
      await load();
    } catch (e) {
      setBanner({ type: "error", text: e instanceof Error ? e.message : "Erreur inattendue." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (b: Book) => {
    if (b.id == null) return;
    if (!confirm(`Supprimer le livre "${b.bookName}" ?`)) return;
    try {
      await bookApi.remove(b.id);
      setBanner({ type: "success", text: "Livre supprime." });
      await load();
    } catch (e) {
      setBanner({ type: "error", text: e instanceof Error ? e.message : "Erreur." });
    }
  };

  return (
    <div className="lib-wrap">
      <style>{`
        .lib-wrap { font-family:'IBM Plex Sans',system-ui,sans-serif; color:#221F1B; }
        .lib-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:18px; flex-wrap:wrap; }
        .lib-title { font-size:22px; font-weight:700; color:#0B1B3A; margin:0 0 4px; }
        .lib-sub { color:#64748B; font-size:13.5px; margin:0; }
        .lib-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:18px; }
        .lib-stat { background:#fff; border:1px solid #E4E8EF; border-radius:10px; padding:14px 16px; display:flex; gap:12px; align-items:center; }
        .lib-stat .ico { width:36px; height:36px; border-radius:9px; display:inline-flex; align-items:center; justify-content:center; }
        .lib-stat .k { font-size:11.5px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:#64748B; }
        .lib-stat .v { font-size:20px; font-weight:700; color:#0B1B3A; margin-top:2px; }
        .lib-banner { padding:12px 16px; border-radius:6px; font-size:13.5px; margin-bottom:16px; }
        .lib-banner.success { background:#E6F4EA; color:#14532D; border:1px solid #BFE3CA; }
        .lib-banner.error { background:#FDECEC; color:#7A2626; border:1px solid #F3C6C6; }
        .lib-btn { display:inline-flex; align-items:center; gap:8px; padding:9px 14px; font-size:13.5px; font-weight:600; font-family:inherit; border-radius:6px; cursor:pointer; border:1px solid #0B1B3A; background:#0B1B3A; color:#F3EFE3; }
        .lib-btn:hover:not(:disabled) { background:#15302A; }
        .lib-btn:disabled { opacity:.6; cursor:not-allowed; }
        .lib-btn.ghost { background:#fff; color:#0B1B3A; }
        .lib-btn.ghost:hover:not(:disabled) { background:#F1F5F9; }
        .lib-btn.danger { background:#fff; color:#9B2C2C; border-color:#F3C6C6; }
        .lib-btn.danger:hover:not(:disabled) { background:#FDECEC; }
        .lib-card { background:#fff; border:1px solid #E4E8EF; border-radius:10px; overflow:hidden; margin-bottom:16px; }
        .lib-filters { display:flex; gap:12px; align-items:center; padding:14px 18px; background:#FAFAF8; border-bottom:1px solid #E4E8EF; flex-wrap:wrap; }
        .lib-search { position:relative; flex:1; min-width:220px; }
        .lib-search input { width:100%; padding:8px 12px 8px 34px; border:1px solid #E4E8EF; border-radius:6px; font-size:13px; font-family:inherit; }
        .lib-search svg { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94A3B8; }
        .lib-select { padding:8px 10px; border:1px solid #E4E8EF; border-radius:6px; font-size:13px; font-family:inherit; }
        table.lib-table { width:100%; border-collapse:collapse; font-size:13.5px; }
        .lib-table thead th { background:#F1F5F9; text-align:left; padding:11px 14px; font-size:11.5px; font-weight:600; letter-spacing:.04em; color:#64748B; text-transform:uppercase; white-space:nowrap; }
        .lib-table tbody td { padding:11px 14px; border-top:1px solid #E4E8EF; }
        .lib-table tbody tr:hover { background:#FAFAF8; }
        .lib-badge { display:inline-block; padding:3px 9px; border-radius:999px; font-size:11px; font-weight:600; }
        .lib-badge.available { background:#E6F4EA; color:#14532D; }
        .lib-badge.issued { background:#FEF3C7; color:#92400E; }
        .lib-actions { display:flex; gap:6px; }
        .lib-icon-btn { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:6px; border:1px solid #E4E8EF; background:#fff; cursor:pointer; color:#334155; }
        .lib-icon-btn:hover { background:#F1F5F9; }
        .lib-icon-btn.danger { color:#9B2C2C; border-color:#F3C6C6; }
        .lib-empty { padding:48px 24px; text-align:center; color:#94A3B8; font-size:13.5px; }
        .lib-form { padding:20px 24px; display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .lib-field { display:flex; flex-direction:column; gap:6px; }
        .lib-field.full { grid-column: 1 / -1; }
        .lib-field label { font-size:11.5px; font-weight:600; letter-spacing:.03em; text-transform:uppercase; color:#64748B; }
        .lib-field input, .lib-field select { padding:9px 12px; font-size:13.5px; border:1px solid #E4E8EF; border-radius:6px; font-family:inherit; outline:none; background:#fff; }
        .lib-field input:focus, .lib-field select:focus { border-color:#C8933E; }
        .lib-form-actions { display:flex; gap:8px; justify-content:flex-end; grid-column:1 / -1; }
        .spin { animation: lib-spin .9s linear infinite; }
        @keyframes lib-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="lib-head">
        <div>
          <h1 className="lib-title">Bibliotheque</h1>
          <p className="lib-sub">Gerez les livres, les auteurs et les emprunts.</p>
        </div>
        {!showForm && (
          <button className="lib-btn" onClick={openCreate}>
            <Plus size={15} /> Ajouter un livre
          </button>
        )}
      </div>

      {banner && <div className={`lib-banner ${banner.type}`}>{banner.text}</div>}

      <div className="lib-stats">
        <div className="lib-stat">
          <div className="ico" style={{ background:"#EEF2F7", color:"#0B1B3A" }}><BookOpen size={18} /></div>
          <div><div className="k">Total livres</div><div className="v">{stats.total}</div></div>
        </div>
        <div className="lib-stat">
          <div className="ico" style={{ background:"#E6F4EA", color:"#14532D" }}><CheckCircle2 size={18} /></div>
          <div><div className="k">Disponibles</div><div className="v">{stats.available}</div></div>
        </div>
        <div className="lib-stat">
          <div className="ico" style={{ background:"#FEF3C7", color:"#92400E" }}><AlertCircle size={18} /></div>
          <div><div className="k">Empruntes</div><div className="v">{stats.issued}</div></div>
        </div>
      </div>

      {showForm && (
        <form className="lib-card lib-form" onSubmit={submit}>
          <div className="lib-field">
            <label>Nom du livre *</label>
            <input type="text" value={form.bookName}
              onChange={(e) => setForm({ ...form, bookName: e.target.value })}
              placeholder="Ex. Harry Potter 1" required />
          </div>
          <div className="lib-field">
            <label>Identifiant du livre *</label>
            <input type="text" value={form.bookId}
              onChange={(e) => setForm({ ...form, bookId: e.target.value })}
              placeholder="Ex. 0001" required />
          </div>
          <div className="lib-field full">
            <label>Auteur</label>
            <input type="text" value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Ex. JK Rowling" />
          </div>
          <div className="lib-field">
            <label>Statut</label>
            <select value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="AVAILABLE">Disponible</option>
              <option value="ISSUED">Emprunte</option>
            </select>
          </div>
          {form.status === "ISSUED" && (
            <div className="lib-field">
              <label>Numero de carte *</label>
              <input type="text" value={form.issuerCardId || ""}
                onChange={(e) => setForm({ ...form, issuerCardId: e.target.value })}
                placeholder="Ex. PG-10981" required />
            </div>
          )}
          <div className="lib-form-actions">
            <button type="button" className="lib-btn ghost" onClick={closeForm} disabled={saving}>
              <X size={15} /> Annuler
            </button>
            <button type="submit" className="lib-btn" disabled={saving}>
              {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
              {saving ? "Enregistrement..." : editingId ? "Mettre a jour" : "Ajouter"}
            </button>
          </div>
        </form>
      )}

      <div className="lib-card">
        <div className="lib-filters">
          <div className="lib-search">
            <Search size={15} />
            <input type="text" placeholder="Rechercher un livre, un auteur, un identifiant..."
              value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="lib-select" value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="AVAILABLE">Disponibles</option>
            <option value="ISSUED">Empruntes</option>
          </select>
        </div>

        {loading ? (
          <div className="lib-empty"><Loader2 size={16} className="spin" /> Chargement...</div>
        ) : error ? (
          <div className="lib-empty" style={{ color:"#9B2C2C" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className="lib-empty">Aucun livre enregistre.</div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="lib-table">
              <thead>
                <tr>
                  <th>Nom du livre</th>
                  <th>Identifiant</th>
                  <th>Auteur</th>
                  <th>Statut</th>
                  <th>Carte emprunteur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const st = (b.status || "AVAILABLE").toUpperCase();
                  const cls = st === "ISSUED" ? "issued" : "available";
                  return (
                    <tr key={b.id}>
                      <td style={{ fontWeight:600, color:"#0B1B3A" }}>{b.bookName}</td>
                      <td>{b.bookId || "-"}</td>
                      <td>{b.author || "-"}</td>
                      <td><span className={`lib-badge ${cls}`}>{STATUS_LABEL[st] || st}</span></td>
                      <td>{b.issuerCardId || "-"}</td>
                      <td>
                        <div className="lib-actions">
                          <button className="lib-icon-btn" title="Modifier" onClick={() => openEdit(b)}>
                            <Pencil size={14} />
                          </button>
                          <button className="lib-icon-btn danger" title="Supprimer" onClick={() => remove(b)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
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