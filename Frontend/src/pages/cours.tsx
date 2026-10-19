// src/pages/cours.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search, Plus, X, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { courseApi, Course, CoursePayload } from '../lib/courseApi';

const YEAR_LABELS: Record<string, string> = {
  '0': 'Toutes les classes',
  '1': '1ere annee',
  '2': '2eme annee',
  '3': '3eme annee',
  '4': '4eme annee',
};

const EMPTY_FORM: CoursePayload = {
  code: '',
  name: '',
  description: '',
  year: 0,
};

export default function Cours() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<CoursePayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 5000);
    return () => clearTimeout(t);
  }, [banner]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await courseApi.listCatalog();
      setCourses(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Impossible de charger les cours.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(c => {
      const matchYear = !yearFilter || String(c.year ?? 0) === yearFilter;
      const matchQuery =
        !q ||
        (c.code || '').toLowerCase().includes(q) ||
        (c.name || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q);
      return matchYear && matchQuery;
    });
  }, [courses, query, yearFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({
      code: c.code,
      name: c.name,
      description: c.description || '',
      year: c.year ?? 0,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const update = (key: keyof CoursePayload, value: any) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) {
      setBanner({ type: 'error', text: 'Le code et l\'intitule sont obligatoires.' });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await courseApi.updateCatalog(editing.id, form);
        setBanner({ type: 'success', text: 'Cours mis a jour.' });
      } else {
        await courseApi.createCatalog(form);
        setBanner({ type: 'success', text: 'Cours ajoute.' });
      }
      closeForm();
      await load();
    } catch (e: any) {
      setBanner({ type: 'error', text: e?.message || 'Erreur lors de l\'enregistrement.' });
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: Course) {
    if (!confirm(`Supprimer le cours "${c.name}" (${c.code}) ?`)) return;
    try {
      await courseApi.removeCatalog(c.id);
      setBanner({ type: 'success', text: 'Cours supprime.' });
      await load();
    } catch (e: any) {
      setBanner({ type: 'error', text: e?.message || 'Erreur lors de la suppression.' });
    }
  }

  return (
    <div style={{ padding: '24px 32px', fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0B1B3A', margin: 0 }}>Cours</h1>
        <p style={{ color: '#64748b', fontSize: 13.5, marginTop: 4 }}>
          Catalogue complet des cours par annee.
        </p>
      </div>

      {banner && (
        <div style={{
          padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 13.5,
          background: banner.type === 'success' ? '#E6F4EA' : '#FDECEC',
          color: banner.type === 'success' ? '#14532D' : '#7A2626',
          border: `1px solid ${banner.type === 'success' ? '#BFE3CA' : '#F3C6C6'}`,
        }}>
          {banner.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 400 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher par code, nom, description..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 36px', fontSize: 13.5,
              border: '1px solid #cbd5e1', borderRadius: 6, outline: 'none',
            }}
          />
        </div>

        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          style={{ padding: '9px 12px', fontSize: 13.5, border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff', minWidth: 200 }}
        >
          <option value="">Toutes les annees</option>
          <option value="1">1ere annee</option>
          <option value="2">2eme annee</option>
          <option value="3">3eme annee</option>
          <option value="4">4eme annee</option>
          <option value="0">Toutes les classes</option>
        </select>

        <button
          onClick={openAdd}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', fontSize: 13.5, fontWeight: 600,
            background: '#0B1B3A', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
          }}
        >
          <Plus size={15} /> Ajouter un cours
        </button>
      </div>

      {error && (
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px',
          background: '#FDECEC', color: '#7A2626', borderRadius: 6, marginBottom: 16, fontSize: 13,
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <BookOpen size={18} /> Aucun cours pour cette selection.
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead style={{ background: '#f1f5f9' }}>
              <tr>
                <th style={th}>Code</th>
                <th style={th}>Intitule</th>
                <th style={th}>Description</th>
                <th style={th}>Annee</th>
                <th style={{ ...th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eef2f7' }}>
                  <td style={td}>
                    <span style={{
                      display: 'inline-block', padding: '3px 8px', borderRadius: 4,
                      fontSize: 11.5, fontWeight: 600, color: '#0B1B3A', background: '#e2e8f0',
                    }}>
                      {c.code}
                    </span>
                  </td>
                  <td style={{ ...td, fontWeight: 500 }}>{c.name}</td>
                  <td style={{ ...td, color: '#64748b' }}>{c.description || '-'}</td>
                  <td style={td}>{YEAR_LABELS[String(c.year ?? 0)] || '-'}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <button onClick={() => openEdit(c)} style={iconBtn} title="Modifier">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => remove(c)} style={{ ...iconBtn, color: '#b91c1c' }} title="Supprimer">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div
          onClick={closeForm}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          }}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={save}
            style={{
              background: '#fff', borderRadius: 10, padding: 28, width: '100%', maxWidth: 520,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#0B1B3A' }}>
                {editing ? 'Modifier le cours' : 'Ajouter un cours'}
              </h2>
              <button type="button" onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={labelStyle}>
                Code *
                <input
                  value={form.code}
                  onChange={e => update('code', e.target.value)}
                  placeholder="MATH-101"
                  required
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Intitule *
                <input
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Mathematiques"
                  required
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Description
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </label>

              <label style={labelStyle}>
                Annee
                <select
                  value={String(form.year ?? 0)}
                  onChange={e => update('year', Number(e.target.value))}
                  style={inputStyle}
                >
                  <option value="0">Toutes les classes</option>
                  <option value="1">1ere annee</option>
                  <option value="2">2eme annee</option>
                  <option value="3">3eme annee</option>
                  <option value="4">4eme annee</option>
                </select>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button type="button" onClick={closeForm} style={secondaryBtn} disabled={saving}>
                Annuler
              </button>
              <button type="submit" style={primaryBtn} disabled={saving}>
                {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                {saving ? 'Enregistrement...' : editing ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: 'left', padding: '11px 14px', fontSize: 11.5,
  fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em',
};
const td: React.CSSProperties = { padding: '12px 14px', verticalAlign: 'middle' };
const iconBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', color: '#475569',
  padding: 6, marginLeft: 4, borderRadius: 4,
};
const labelStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 6,
  fontSize: 12.5, fontWeight: 500, color: '#0B1B3A',
};
const inputStyle: React.CSSProperties = {
  padding: '9px 12px', fontSize: 13.5, border: '1px solid #cbd5e1',
  borderRadius: 6, outline: 'none', fontFamily: 'inherit',
};
const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '9px 18px', fontSize: 13.5, fontWeight: 600,
  background: '#0B1B3A', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
};
const secondaryBtn: React.CSSProperties = {
  padding: '9px 18px', fontSize: 13.5, fontWeight: 500,
  background: '#fff', color: '#0B1B3A', border: '1px solid #cbd5e1',
  borderRadius: 6, cursor: 'pointer',
};