import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  Home,
  Library,
  LogOut,
  Megaphone,
  NotebookPen,
  PenSquare,
  UserCog,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const TOKEN_KEY = "scolagest-auth-token";

type NavItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    items: [{ key: "dashboard", label: "Tableau de bord", icon: Home }],
  },
  {
    title: "Scolarité",
    items: [
      { key: "courses", label: "Mes cours", icon: BookOpen },
      { key: "grades", label: "Mes notes", icon: NotebookPen },
      { key: "attendance", label: "Mes présences", icon: CalendarCheck },
      { key: "exams", label: "Examens", icon: PenSquare },
    ],
  },
  {
    title: "Ressources",
    items: [
      { key: "announcements", label: "Annonces", icon: Megaphone },
      { key: "library", label: "Bibliothèque", icon: Library },
      { key: "reports", label: "Mes bulletins", icon: FileText },
    ],
  },
  {
    title: "Compte",
    items: [{ key: "profile", label: "Mon profil", icon: UserCog }],
  },
];

function authHeaders(extra: Record<string, string> = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const h: Record<string, string> = { ...extra };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

type DashboardSummary = {
  todaysClassCount?: number;
  averageGrade?: number;
  pendingTaskCount?: number;
  recentAnnouncements?: { id: number; title: string; date: string }[];
};

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fullName = useMemo(
    () => user?.name || user?.email || "Élève",
    [user]
  );

  const initials = useMemo(() => {
    const parts = fullName.split(" ").filter(Boolean);
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "EL";
  }, [fullName]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/students/me/dashboard`, {
          headers: authHeaders(),
        });
        if (res.ok) {
          setSummary((await res.json()) as DashboardSummary);
        } else {
          setSummary(null);
        }
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleLogout() {
    logout();
    toast({ title: "Déconnexion", description: "À bientôt." });
    navigate({ to: "/login" });
  }

  return (
    <div className="sd-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .sd-shell {
          --navy:#0A1B33; --navy-deep:#061224; --navy-mid:#12294A;
          --white:#FFFFFF; --off:#F4F6F9;
          --black:#141414; --ink:#1C1C1C; --muted:#6E7580;
          --line:#E4E7EC; --line-dark:rgba(255,255,255,0.09);
          --accent:#2F6FED;
          --ok:#1E6B45; --warn:#8A5A00; --err:#8C2C22;
          min-height:100vh; display:flex; background:var(--off); color:var(--ink);
          font-family:'IBM Plex Sans',system-ui,sans-serif;
        }
        .sd-shell *,.sd-shell *::before,.sd-shell *::after { box-sizing:border-box; }

        /* Sidebar */
        .sd-sidebar {
          width:264px; flex-shrink:0; background:var(--navy);
          color:var(--white); display:flex; flex-direction:column;
          position:sticky; top:0; height:100vh;
        }
        .sd-brand {
          display:flex; align-items:center; gap:12px;
          padding:22px 20px; border-bottom:1px solid var(--line-dark);
        }
        .sd-brand-glyph {
          width:38px; height:38px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          border:1.5px solid var(--white);
          font-family:'Fraunces',serif; font-size:14px; font-weight:500;
        }
        .sd-brand-text { line-height:1.3; }
        .sd-brand-text strong {
          display:block; font-family:'Fraunces',serif; font-size:14px;
          font-weight:500; letter-spacing:0.2px;
        }
        .sd-brand-text span { font-size:11.5px; color:#93A0B5; }

        .sd-nav { flex:1; overflow-y:auto; padding:14px 12px 12px; }
        .sd-nav-title {
          font-size:11px; color:#7C8AA1; padding:16px 10px 6px;
          letter-spacing:0.3px;
        }
        .sd-nav-title:first-child { padding-top:6px; }
        .sd-nav-item {
          width:100%; display:flex; align-items:center; gap:11px;
          padding:9px 12px; margin:1px 0; border:none; background:transparent;
          color:#C4CCDA; font-family:inherit; font-size:13.5px;
          border-radius:5px; cursor:pointer; text-align:left;
          border-left:2px solid transparent;
        }
        .sd-nav-item svg { flex-shrink:0; color:#7C8AA1; }
        .sd-nav-item:hover { background:rgba(255,255,255,0.05); color:var(--white); }
        .sd-nav-item.active {
          background:var(--navy-mid); color:var(--white);
          border-left:2px solid var(--white);
        }
        .sd-nav-item.active svg { color:var(--white); }

        .sd-sidebar-foot { padding:14px 12px; border-top:1px solid var(--line-dark); }
        .sd-logout {
          width:100%; display:flex; align-items:center; gap:10px;
          padding:9px 12px; background:transparent; color:#C4CCDA;
          border:1px solid var(--line-dark); border-radius:5px;
          font-family:inherit; font-size:13.5px; cursor:pointer;
        }
        .sd-logout:hover { background:rgba(255,255,255,0.06); color:var(--white); }

        /* Main */
        .sd-main { flex:1; min-width:0; }
        .sd-topbar {
          display:flex; align-items:center; justify-content:space-between;
          padding:18px 36px; background:var(--white); border-bottom:1px solid var(--line);
        }
        .sd-topbar h1 {
          font-family:'Fraunces',serif; font-weight:500; font-size:19px; margin:0;
        }
        .sd-userchip { display:flex; align-items:center; gap:10px; }
        .sd-avatar {
          width:34px; height:34px; border-radius:50%; background:var(--navy);
          color:var(--white); display:flex; align-items:center; justify-content:center;
          font-weight:600; font-size:13px;
        }
        .sd-userchip-text { font-size:13px; line-height:1.3; }
        .sd-userchip-text small { display:block; color:var(--muted); font-size:11.5px; }

        .sd-content { max-width:1180px; padding:32px 36px 64px; }

        .sd-hello { margin-bottom:28px; }
        .sd-hello h2 {
          font-family:'Fraunces',serif; font-weight:500;
          font-size:clamp(24px,2.6vw,30px); margin:0 0 6px;
        }
        .sd-hello p { color:var(--muted); font-size:14px; margin:0; }

        .sd-stat-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px;
        }
        .sd-stat {
          background:var(--white); border:1px solid var(--line); border-radius:4px;
          padding:18px 20px; border-top:3px solid var(--navy);
        }
        .sd-stat .sd-stat-label {
          display:flex; align-items:center; gap:8px; font-size:12.5px;
          color:var(--muted); margin-bottom:10px;
        }
        .sd-stat .sd-stat-label svg { color:var(--navy); }
        .sd-stat .sd-stat-value {
          font-family:'Fraunces',serif; font-size:28px; font-weight:500; color:var(--black);
        }

        .sd-panels { display:grid; grid-template-columns:1.4fr 1fr; gap:20px; }
        .sd-card {
          background:var(--white); border:1px solid var(--line); border-radius:4px;
          padding:22px 24px;
        }
        .sd-card h3 {
          font-family:'Fraunces',serif; font-weight:500; font-size:16px;
          margin:0 0 16px; display:flex; align-items:center; gap:8px;
        }
        .sd-card h3 svg { color:var(--navy); }

        .sd-list-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:10px 0; border-top:1px solid var(--line); font-size:13.5px;
        }
        .sd-list-row:first-of-type { border-top:none; }
        .sd-list-row .muted { color:var(--muted); font-size:12.5px; }

        .sd-empty {
          text-align:center; color:var(--muted); font-size:13.5px; padding:20px 0;
        }

        .sd-task-item {
          display:flex; align-items:flex-start; gap:10px; padding:9px 0;
          border-top:1px solid var(--line); font-size:13.5px;
        }
        .sd-task-item:first-of-type { border-top:none; }
        .sd-task-item svg { color:var(--warn); flex-shrink:0; margin-top:1px; }

        @media (max-width:960px) {
          .sd-shell { flex-direction:column; }
          .sd-sidebar { width:100%; height:auto; position:relative; flex-direction:row; overflow-x:auto; }
          .sd-brand { border-bottom:none; }
          .sd-nav { display:flex; padding:10px; }
          .sd-nav-title { display:none; }
          .sd-sidebar-foot { display:none; }
          .sd-stat-grid { grid-template-columns:repeat(2,1fr); }
          .sd-panels { grid-template-columns:1fr; }
          .sd-content { padding:24px 18px 48px; }
          .sd-topbar { padding:16px 18px; }
        }
      `}</style>

      <aside className="sd-sidebar">
        <div className="sd-brand">
          <div className="sd-brand-glyph">IEMV</div>
          <div className="sd-brand-text">
            <strong>IEM Virunga</strong>
            <span>Espace élève</span>
          </div>
        </div>

        <nav className="sd-nav">
          {NAV.map((section, i) => (
            <div key={i}>
              {section.title && <div className="sd-nav-title">{section.title}</div>}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    className={`sd-nav-item${active === item.key ? " active" : ""}`}
                    onClick={() => setActive(item.key)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sd-sidebar-foot">
          <button className="sd-logout" onClick={handleLogout}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="sd-main">
        <header className="sd-topbar">
          <h1>Tableau de bord</h1>
          <div className="sd-userchip">
            <div className="sd-avatar">{initials}</div>
            <div className="sd-userchip-text">
              {fullName}
              <small>{user?.email}</small>
            </div>
          </div>
        </header>

        <main className="sd-content">
          <div className="sd-hello">
            <h2>Bonjour {fullName.split(" ")[0]}.</h2>
            <p>Voici un aperçu de votre parcours à l'IEM Virunga.</p>
          </div>

          <div className="sd-stat-grid">
            <div className="sd-stat">
              <div className="sd-stat-label"><CalendarDays size={14} /> Cours aujourd'hui</div>
              <div className="sd-stat-value">{loading ? "—" : summary?.todaysClassCount ?? 0}</div>
            </div>
            <div className="sd-stat">
              <div className="sd-stat-label"><NotebookPen size={14} /> Moyenne générale</div>
              <div className="sd-stat-value">
                {loading ? "—" : summary?.averageGrade != null ? `${summary.averageGrade}%` : "—"}
              </div>
            </div>
            <div className="sd-stat">
              <div className="sd-stat-label"><ClipboardList size={14} /> Devoirs en attente</div>
              <div className="sd-stat-value">{loading ? "—" : summary?.pendingTaskCount ?? 0}</div>
            </div>
            <div className="sd-stat">
              <div className="sd-stat-label"><GraduationCap size={14} /> Ma classe</div>
              <div className="sd-stat-value">{loading ? "—" : "—"}</div>
            </div>
          </div>

          <div className="sd-panels">
            <section className="sd-card">
              <h3><Megaphone size={17} /> Annonces récentes</h3>
              {loading ? (
                <div className="sd-empty">Chargement…</div>
              ) : summary?.recentAnnouncements?.length ? (
                summary.recentAnnouncements.map((a) => (
                  <div className="sd-list-row" key={a.id}>
                    <span>{a.title}</span>
                    <span className="muted">{a.date}</span>
                  </div>
                ))
              ) : (
                <div className="sd-empty">Aucune annonce récente.</div>
              )}
            </section>

            <section className="sd-card">
              <h3><ClipboardList size={17} /> À faire</h3>
              <div className="sd-task-item">
                <FileText size={14} />
                <span>Rendre le devoir de mathématiques pour vendredi.</span>
              </div>
              <div className="sd-task-item">
                <BookOpen size={14} />
                <span>Réviser le chapitre 3 pour le contrôle.</span>
              </div>
              <div className="sd-task-item">
                <NotebookPen size={14} />
                <span>Consulter les notes du dernier examen.</span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}