// src/pages/Dashboard.tsx
// Real-data admin dashboard for IEM Virunga.
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Search, Bell, Users, GraduationCap, CreditCard,
  CalendarCheck, TrendingUp, FileBarChart,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────
const T = {
  navy:     '#0B1B3A',
  navyGrad: 'linear-gradient(135deg, #0F2547 0%, #060F22 100%)',
  brand:    '#1E40AF',
  page:     '#F7F8FB',
  card:     '#FFFFFF',
  border:   '#E8EAF0',
  text:     '#0F172A',
  muted:    '#64748B',
  faint:    '#94A3B8',
  green:    '#10B981',
  amber:    '#F59E0B',
  red:      '#EF4444',
  shadow:   '0 1px 3px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.04)',
};

// ─────────────────────────────────────────────────────────────
// SCOPED CSS
// ─────────────────────────────────────────────────────────────
const CSS = `
.iemv-dash, .iemv-dash * { box-sizing: border-box; }
.iemv-dash { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }

.iemv-search:focus { outline: none; border-color: ${T.brand}; box-shadow: 0 0 0 3px rgba(30,64,175,0.10); }

.iemv-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: ${T.navy}; color: #fff; border: 0; cursor: pointer;
  padding: 10px 18px; border-radius: 10px;
  font-size: 13.5px; font-weight: 600; font-family: inherit;
  transition: transform .12s ease, opacity .12s ease;
}
.iemv-btn:hover { opacity: .92; transform: translateY(-1px); }

.iemv-iconbtn {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 10px;
  background: ${T.card}; border: 1px solid ${T.border};
  cursor: pointer; color: ${T.muted};
  transition: background .12s ease;
}
.iemv-iconbtn:hover { background: #F1F3F8; }

.iemv-card { transition: box-shadow .15s ease, transform .15s ease; }
.iemv-card:hover { box-shadow: 0 4px 12px rgba(15,23,42,0.07), 0 16px 40px rgba(15,23,42,0.06); }

.iemv-grid-kpi { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.iemv-grid-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
@media (max-width: 1100px) { .iemv-grid-kpi { grid-template-columns: 1fr 1fr; } }
@media (max-width: 900px) {
  .iemv-grid-kpi, .iemv-grid-charts { grid-template-columns: 1fr; }
  .iemv-topbar { flex-direction: column; align-items: stretch !important; }
}
`;

// ─────────────────────────────────────────────────────────────
// SPARKLINE (pure SVG)
// ─────────────────────────────────────────────────────────────
function Sparkline({ values, min, max, color }: { values: number[]; min: number; max: number; color: string }) {
  const w = 300, h = 60;
  if (!values || values.length < 2) {
    return <div style={{ height: 60, background: '#F1F5F9', borderRadius: 6 }} />;
  }
  const span = Math.max(1, max - min);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * h;
    return `${x.toFixed(1)},${Math.max(0, Math.min(h, y)).toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
      <polyline points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill={color} fillOpacity="0.09" stroke="none" />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  try {
    const token =
      localStorage.getItem('scolagest-auth-token') ||
      sessionStorage.getItem('scolagest-auth-token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch { return {}; }
}

interface DashboardData {
  students: any[];
  teachers: any[];
  payments: any[];
  attendance: { classes?: any[] };
  loading: boolean;
}

function useDashboardData(): DashboardData {
  const [students, setStudents]     = useState<any[]>([]);
  const [teachers, setTeachers]     = useState<any[]>([]);
  const [payments, setPayments]     = useState<any[]>([]);
  const [attendance, setAttendance] = useState<{ classes?: any[] }>({});
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    let cancelled = false;
    const h = authHeaders();
    const today = new Date().toISOString().slice(0, 10);

    Promise.all([
      fetch('/api/students', { headers: h }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/teachers', { headers: h }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/payments/summary', { headers: h }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`/api/attendance/board-by-class?date=${today}`, { headers: h })
        .then(r => r.ok ? r.json() : { classes: [] }).catch(() => ({ classes: [] })),
    ]).then(([s, t, p, a]) => {
      if (cancelled) return;
      setStudents(Array.isArray(s) ? s : []);
      setTeachers(Array.isArray(t) ? t : []);
      setPayments(Array.isArray(p) ? p : []);
      setAttendance(a || { classes: [] });
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return { students, teachers, payments, attendance, loading };
}

// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const { students, teachers, payments, attendance, loading } = useDashboardData();

  const initials = useMemo(() => {
    const n = user?.name?.trim();
    if (!n) return 'DG';
    const p = n.split(/\s+/);
    return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase() || 'DG';
  }, [user?.name]);

  const displayName = user?.name || 'Direction generale';

  // Computed stats
  const enrolled      = students.length;
  const activeCount   = students.filter(s => s.active !== false).length;
  const teacherCount  = teachers.length;
  const availableCnt  = teachers.filter(t => t.disponible || t.available).length;
  const collected     = payments.reduce((sum, p) => sum + (Number(p.paidAmount) || 0), 0);
  const totalBilled   = payments.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);

  const classRows: any[] = (attendance.classes as any[]) || [];
  const attTotal     = classRows.reduce((s, c) => s + (Number(c.total) || 0), 0);
  const attPresent   = classRows.reduce((s, c) => s + (Number(c.present) || 0), 0);
  const attRate      = attTotal ? Math.round((attPresent / attTotal) * 100) : 0;

  const kpis = [
    {
      label: 'Eleves inscrits',
      value: loading ? '...' : String(enrolled),
      hint:  loading ? '' : `${activeCount} actifs`,
      icon:  Users,
    },
    {
      label: 'Enseignants',
      value: loading ? '...' : String(teacherCount),
      hint:  loading ? '' : `${availableCnt} disponibles`,
      icon:  GraduationCap,
    },
    {
      label: 'Frais encaisses',
      value: loading ? '...' : collected.toLocaleString('fr-FR') + ' $',
      hint:  loading ? '' : (totalBilled > 0
              ? `${Math.round((collected / totalBilled) * 100)} % du previsionnel`
              : `${payments.length} paiements`),
      icon:  CreditCard,
    },
    {
      label: 'Taux de presence',
      value: loading ? '...' : attRate + ' %',
      hint:  loading ? '' : `${attPresent} / ${attTotal} aujourd'hui`,
      icon:  CalendarCheck,
    },
  ];

  // Card style tokens
  const cardBase: React.CSSProperties = {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    boxShadow: T.shadow,
  };
  const chipStyle: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 9,
    background: '#EFF3FB',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };

  // Per-class rows for the "reussite" panel
  const parClasse = classRows
    .map(c => ({
      classe: c.studentClass || c.classe || '?',
      taux: c.total ? Math.round(((c.present || 0) / c.total) * 100) : 0,
    }))
    .slice(0, 6);

  return (
    <>
      <style>{CSS}</style>

      <div className="iemv-dash" style={{ flex: 1, minWidth: 0, background: T.page, minHeight: '100vh' }}>
        {/* Top bar */}
        <div
          className="iemv-topbar"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 28px',
            background: T.card,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div style={{ position: 'relative', flex: 1, maxWidth: 640 }}>
            <Search size={18} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: T.faint }} />
            <input
              className="iemv-search"
              placeholder="Rechercher un eleve, un cours, un paiement..."
              style={{
                width: '100%', height: 44,
                padding: '0 16px 0 44px', borderRadius: 10,
                border: `1px solid ${T.border}`, background: '#FBFCFE',
                fontSize: 13.5, color: T.text, fontFamily: 'inherit',
              }}
            />
          </div>

          <button className="iemv-iconbtn" title="Notifications">
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: 9, right: 10,
              width: 7, height: 7, borderRadius: '50%',
              background: T.red, border: `2px solid ${T.card}`,
            }} />
          </button>

          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 14px 6px 6px',
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 12, flexShrink: 0,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: T.navy, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
            }}>{initials}</div>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{displayName}</div>
              <div style={{ fontSize: 11.5, color: T.muted }}>Annee scolaire 2026 - 2027</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 28, maxWidth: 1400 }}>
          {/* Title row */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 20,
            flexWrap: 'wrap', marginBottom: 22,
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>
                Tableau de bord
              </h1>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: T.muted }}>
                Synthese de l'etablissement pour l'annee scolaire 2026 - 2027.
              </p>
            </div>
            <button className="iemv-btn">
              <FileBarChart size={16} strokeWidth={2} />
              Generer un rapport
            </button>
          </div>

          {/* KPI grid — smaller cards */}
          <div className="iemv-grid-kpi" style={{ marginBottom: 18 }}>
            {kpis.map(kpi => (
              <div
                key={kpi.label}
                className="iemv-card"
                style={{
                  ...cardBase,
                  padding: 18,
                  minHeight: 128,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.09em', textTransform: 'uppercase',
                    color: T.muted,
                  }}>{kpi.label}</span>
                  <div style={chipStyle}>
                    <kpi.icon size={16} strokeWidth={2} style={{ color: T.navy }} />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{
                    fontSize: 28, fontWeight: 800,
                    letterSpacing: '-0.03em', lineHeight: 1, color: T.text,
                  }}>{kpi.value}</div>
                  {kpi.hint && (
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>{kpi.hint}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="iemv-grid-charts">
            {/* Moyenne / presence */}
            <div className="iemv-card" style={{ ...cardBase, padding: 22 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>
                Evolution des moyennes
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: T.muted }}>
                Moyenne generale et taux de presence
              </p>

              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>Moyenne generale</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>--</span>
                </div>
                <Sparkline values={[]} min={0} max={20} color={T.brand} />
              </div>

              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>Taux de presence</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{attRate} %</span>
                </div>
                <Sparkline
                  values={classRows.slice(0, 6).map(c => c.total ? (c.present / c.total) * 100 : 0)}
                  min={0} max={100} color={T.green}
                />
              </div>
            </div>

            {/* Reussite par classe */}
            <div className="iemv-card" style={{ ...cardBase, padding: 22 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>
                Presence par classe
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: T.muted }}>
                Pourcentage de presents aujourd'hui
              </p>

              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {loading && <div style={{ fontSize: 13, color: T.muted }}>Chargement...</div>}
                {!loading && parClasse.length === 0 && (
                  <div style={{ fontSize: 13, color: T.muted }}>Aucune donnee de presence pour aujourd'hui.</div>
                )}
                {parClasse.map(c => (
                  <div key={c.classe}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{c.classe}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{c.taux} %</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 99, background: '#EEF1F6', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${c.taux}%`, borderRadius: 99,
                        background: c.taux >= 80 ? T.green : c.taux >= 70 ? T.brand : T.amber,
                        transition: 'width .5s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}