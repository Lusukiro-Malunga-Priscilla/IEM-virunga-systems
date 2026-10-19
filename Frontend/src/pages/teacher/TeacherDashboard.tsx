// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router";
// import {
//   BookOpen,
//   CalendarCheck,
//   FileText,
//   Layers,
//   Loader2,
//   Megaphone,
//   Users,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { teacherApi, ApiError } from "@/services/teacherApi";

// type Teacher = {
//   id?: number;
//   prenom?: string;
//   nom?: string;
//   email?: string;
//   coursDispense?: string;
//   disponible?: boolean;
// };

// const safe = (v: unknown) => (v == null ? "" : String(v).trim().toLowerCase());

// export default function TeacherDashboard() {
//   const { user } = useAuth();
//   const [teacher, setTeacher] = useState<Teacher | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const firstName = useMemo(() => {
//     if (teacher?.prenom) return teacher.prenom;
//     return (user?.name || user?.email || "Enseignant").split(" ")[0];
//   }, [teacher, user]);

//   useEffect(() => {
//     let cancelled = false;
//     async function load() {
//       if (!user?.email) {
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       setError(null);
//       try {
//         const list = await teacherApi.list();
//         const all: Teacher[] = Array.isArray(list) ? list : [];
//         const me = all.find((t) => safe(t?.email) === safe(user.email));
//         if (cancelled) return;
//         if (me) setTeacher(me);
//         else setTeacher(null);
//       } catch (e) {
//         if (cancelled) return;
//         setTeacher(null);
//         setError(
//           e instanceof ApiError ? e.message : "Impossible de charger vos données."
//         );
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     load();
//     return () => { cancelled = true; };
//   }, [user?.email]);

//   const courseCount = teacher?.coursDispense
//     ? teacher.coursDispense.split(",").filter((c) => c.trim()).length
//     : 0;

//   return (
//     <div className="th-shell">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

//         .th-shell {
//           --navy:#0B2545; --cream:#F6F2E8;
//           --line:#E1D8C3; --text:#221F1B; --muted:#6B6357;
//           --accent:#C8933E; --accent-deep:#A6742A;
//           --ok:#3F6B4E; --err:#B3432B;
//           max-width:1080px; margin:0 auto; padding:40px 32px 64px;
//           color:var(--text); font-family:'IBM Plex Sans',system-ui,sans-serif;
//         }
//         .th-shell *,.th-shell *::before,.th-shell *::after { box-sizing:border-box; }

//         .th-hello { margin-bottom:28px; }
//         .th-hello h1 {
//           font-family:'Fraunces',serif; font-weight:500;
//           font-size:clamp(24px,2.8vw,32px); margin:0 0 6px;
//         }
//         .th-hello p { color:var(--muted); font-size:14px; margin:0; }

//         .th-notice {
//           font-size:13px; padding:11px 13px; border-radius:3px;
//           margin-bottom:20px; line-height:1.5;
//         }
//         .th-notice.error {
//           background:rgba(179,67,43,0.08); color:var(--err);
//           border:1px solid rgba(179,67,43,0.25);
//         }

//         .th-stat-grid {
//           display:grid; grid-template-columns:repeat(4,1fr);
//           gap:16px; margin-bottom:24px;
//         }
//         .th-stat {
//           background:#fff; border:1px solid var(--line);
//           border-radius:4px; padding:18px 20px;
//           border-top:3px solid var(--navy);
//         }
//         .th-stat .label {
//           display:flex; align-items:center; gap:8px;
//           font-size:12.5px; color:var(--muted); margin-bottom:10px;
//         }
//         .th-stat .label svg { color:var(--navy); }
//         .th-stat .value {
//           font-family:'Fraunces',serif; font-size:26px;
//           font-weight:500; color:#141414;
//         }

//         .th-panels {
//           display:grid; grid-template-columns:1.4fr 1fr; gap:20px;
//         }
//         .th-card {
//           background:#fff; border:1px solid var(--line);
//           border-radius:4px; padding:22px 24px;
//         }
//         .th-card h3 {
//           font-family:'Fraunces',serif; font-weight:500; font-size:16px;
//           margin:0 0 16px; display:flex; align-items:center; gap:8px;
//         }
//         .th-card h3 svg { color:var(--accent-deep); }

//         .th-task {
//           display:flex; align-items:flex-start; gap:10px;
//           padding:9px 0; border-top:1px solid var(--line); font-size:13.5px;
//         }
//         .th-task:first-of-type { border-top:none; }
//         .th-task svg { color:var(--accent-deep); flex-shrink:0; margin-top:1px; }

//         .th-empty {
//           text-align:center; color:var(--muted); font-size:13.5px;
//           padding:20px 0; display:flex; align-items:center;
//           justify-content:center; gap:8px;
//         }
//         .th-spin { animation:th-spin .8s linear infinite; }
//         @keyframes th-spin { to { transform:rotate(360deg); } }

//         .th-quick {
//           display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
//           gap:12px; margin-top:20px;
//         }
//         .th-quick a {
//           display:flex; align-items:center; gap:10px;
//           padding:14px 16px; background:#fff; border:1px solid var(--line);
//           border-radius:4px; text-decoration:none; color:var(--text);
//           font-size:13.5px; transition:border-color .15s ease;
//         }
//         .th-quick a:hover { border-color:var(--navy); }
//         .th-quick svg { color:var(--navy); flex-shrink:0; }

//         @media (max-width:900px) {
//           .th-stat-grid { grid-template-columns:repeat(2,1fr); }
//           .th-panels { grid-template-columns:1fr; }
//           .th-shell { padding:24px 16px 48px; }
//         }
//       `}</style>

//       <div className="th-hello">
//         <h1>Bonjour {firstName}.</h1>
//         <p>Voici un aperçu de votre journée à l'IEM Virunga.</p>
//       </div>

//       {error && <div className="th-notice error">{error}</div>}

//       {loading ? (
//         <div className="th-empty">
//           <Loader2 size={16} className="th-spin" /> Chargement…
//         </div>
//       ) : (
//         <>
//           <div className="th-stat-grid">
//             <div className="th-stat">
//               <div className="label"><CalendarCheck size={14} /> Cours aujourd'hui</div>
//               <div className="value">—</div>
//             </div>
//             <div className="th-stat">
//               <div className="label"><Users size={14} /> Élèves suivis</div>
//               <div className="value">—</div>
//             </div>
//             <div className="th-stat">
//               <div className="label"><FileText size={14} /> Tâches en attente</div>
//               <div className="value">—</div>
//             </div>
//             <div className="th-stat">
//               <div className="label"><Layers size={14} /> Cours assignés</div>
//               <div className="value">{courseCount}</div>
//             </div>
//           </div>

//           <div className="th-panels">
//             <section className="th-card">
//               <h3><Megaphone size={17} /> Annonces récentes</h3>
//               <div className="th-empty">Aucune annonce récente.</div>
//             </section>

//             <section className="th-card">
//               <h3><FileText size={17} /> À faire</h3>
//               <div className="th-task">
//                 <FileText size={14} />
//                 <span>Soumettre le rapport journalier avant le départ.</span>
//               </div>
//               <div className="th-task">
//                 <CalendarCheck size={14} />
//                 <span>Enregistrer les présences de la classe en cours.</span>
//               </div>
//               <div className="th-task">
//                 <BookOpen size={14} />
//                 <span>Préparer les supports du prochain cours.</span>
//               </div>
//             </section>
//           </div>

//           <div className="th-quick">
//             <Link to="/teacher/classes"><Layers size={16} /> Mes classes</Link>
//             <Link to="/teacher/attendance"><CalendarCheck size={16} /> Prendre les présences</Link>
//             <Link to="/teacher/reports"><FileText size={16} /> Rapport journalier</Link>
//             <Link to="/teacher/profile"><Users size={16} /> Mon profil</Link>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  CalendarCheck,
  FileText,
  Layers,
  Loader2,
  Megaphone,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { teacherApi, ApiError } from "@/services/teacherApi";

type Teacher = {
  id?: number;
  prenom?: string;
  nom?: string;
  email?: string;
  coursDispense?: string;
  disponible?: boolean;
};

const safe = (v: unknown) => (v == null ? "" : String(v).trim().toLowerCase());

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const firstName = useMemo(() => {
    if (teacher?.prenom) return teacher.prenom;
    return (user?.name || user?.email || "Enseignant").split(" ")[0];
  }, [teacher, user]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const list = await teacherApi.list();
        const all: Teacher[] = Array.isArray(list) ? list : [];
        const me = all.find((t) => safe(t?.email) === safe(user.email));
        if (cancelled) return;
        if (me) setTeacher(me);
        else setTeacher(null);
      } catch (e) {
        if (cancelled) return;
        setTeacher(null);
        setError(e instanceof ApiError ? e.message : "Impossible de charger vos données.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const courseCount = teacher?.coursDispense
    ? teacher.coursDispense.split(",").filter((c) => c.trim()).length
    : 0;

  return (
    <div className="th-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .th-shell {
          --navy:#0B1220; --bg:#F4F6FA; --white:#fff;
          --line:#E7EAF0; --ink:#12141B; --muted:#6B7280;
          --accent:#C8933E; --ok:#1F8B4C; --err:#D0392C;
          max-width:1180px; margin:0 auto; padding:32px 32px 56px;
          color:var(--ink); font-family:'Plus Jakarta Sans',system-ui,sans-serif;
        }
        .th-shell *,.th-shell *::before,.th-shell *::after { box-sizing:border-box; }

        .th-hello { margin-bottom:24px; display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; }
        .th-hello h1 { font-size:clamp(22px,2.6vw,28px); font-weight:800; margin:0 0 6px; letter-spacing:-0.3px; }
        .th-hello p { color:var(--muted); font-size:13.5px; margin:0; }
        .th-hello-btn {
          display:inline-flex; align-items:center; gap:8px;
          background:var(--navy); color:#fff; border:none; border-radius:10px;
          padding:11px 18px; font-size:13.5px; font-weight:600; cursor:pointer;
          text-decoration:none;
        }

        .th-notice {
          font-size:13px; padding:11px 13px; border-radius:8px;
          margin-bottom:20px; line-height:1.5;
        }
        .th-notice.error { background:rgba(208,57,44,0.08); color:var(--err); border:1px solid rgba(208,57,44,0.2); }

        .th-stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:20px; }
        .th-stat {
          border-radius:16px; padding:20px 22px;
          background:var(--white); border:1px solid var(--line);
        }
        .th-stat.hero { background:var(--navy); border-color:var(--navy); color:#fff; }
        .th-stat .label {
          display:flex; align-items:center; justify-content:space-between;
          font-size:12px; color:var(--muted); margin-bottom:22px; font-weight:600;
        }
        .th-stat.hero .label { color:#9AA4BC; }
        .th-stat .icon-badge {
          width:32px; height:32px; border-radius:9px; flex-shrink:0;
          background:var(--bg); display:flex; align-items:center; justify-content:center;
          color:var(--navy);
        }
        .th-stat.hero .icon-badge { background:rgba(255,255,255,0.1); color:#fff; }
        .th-stat .value { font-size:28px; font-weight:800; letter-spacing:-0.5px; }
        .th-stat .sub { font-size:11.5px; color:var(--muted); margin-top:6px; font-weight:500; }
        .th-stat.hero .sub { color:#9AA4BC; }

        .th-panels { display:grid; grid-template-columns:1.4fr 1fr; gap:16px; margin-bottom:16px; }
        .th-card { background:var(--white); border:1px solid var(--line); border-radius:16px; padding:22px 24px; }
        .th-card h3 { font-size:15px; font-weight:700; margin:0 0 16px; display:flex; align-items:center; gap:9px; }
        .th-card h3 svg { color:var(--accent); }

        .th-task { display:flex; align-items:flex-start; gap:10px; padding:10px 0; border-top:1px solid var(--line); font-size:13.5px; }
        .th-task:first-of-type { border-top:none; padding-top:0; }
        .th-task svg { color:var(--accent); flex-shrink:0; margin-top:1px; }

        .th-empty {
          text-align:center; color:var(--muted); font-size:13.5px;
          padding:26px 0; display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .th-spin { animation:th-spin .8s linear infinite; }
        @keyframes th-spin { to { transform:rotate(360deg); } }

        .th-quick { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:14px; }
        .th-quick a {
          display:flex; align-items:center; gap:12px;
          padding:16px 18px; background:var(--white); border:1px solid var(--line);
          border-radius:14px; text-decoration:none; color:var(--ink);
          font-size:13.5px; font-weight:600; transition:border-color .15s ease, transform .15s ease;
        }
        .th-quick a:hover { border-color:var(--navy); transform:translateY(-1px); }
        .th-quick .icon-badge {
          width:34px; height:34px; border-radius:9px; flex-shrink:0;
          background:var(--bg); display:flex; align-items:center; justify-content:center; color:var(--navy);
        }

        @media (max-width:900px) {
          .th-stat-grid { grid-template-columns:repeat(2,1fr); }
          .th-panels { grid-template-columns:1fr; }
          .th-shell { padding:22px 18px 48px; }
        }
      `}</style>

      <div className="th-hello">
        <div>
          <h1>Bonjour {firstName}.</h1>
          <p>Voici un aperçu de votre journée à l'IEM Virunga.</p>
        </div>
        <Link to="/teacher/reports" className="th-hello-btn">
          <FileText size={15} /> Rapport journalier
        </Link>
      </div>

      {error && <div className="th-notice error">{error}</div>}

      {loading ? (
        <div className="th-empty">
          <Loader2 size={16} className="th-spin" /> Chargement…
        </div>
      ) : (
        <>
          <div className="th-stat-grid">
            <div className="th-stat hero">
              <div className="label">
                COURS AUJOURD'HUI
                <div className="icon-badge"><CalendarCheck size={15} /></div>
              </div>
              <div className="value">—</div>
              <div className="sub">Aucun cours planifié</div>
            </div>
            <div className="th-stat">
              <div className="label">
                ÉLÈVES SUIVIS
                <div className="icon-badge"><Users size={15} /></div>
              </div>
              <div className="value">—</div>
              <div className="sub">Toutes classes confondues</div>
            </div>
            <div className="th-stat">
              <div className="label">
                TÂCHES EN ATTENTE
                <div className="icon-badge"><FileText size={15} /></div>
              </div>
              <div className="value">—</div>
              <div className="sub">À traiter aujourd'hui</div>
            </div>
            <div className="th-stat">
              <div className="label">
                COURS ASSIGNÉS
                <div className="icon-badge"><Layers size={15} /></div>
              </div>
              <div className="value">{courseCount}</div>
              <div className="sub">Sur l'année en cours</div>
            </div>
          </div>

          <div className="th-panels">
            <section className="th-card">
              <h3><Megaphone size={16} /> Annonces récentes</h3>
              <div className="th-empty">Aucune annonce récente.</div>
            </section>

            <section className="th-card">
              <h3><FileText size={16} /> À faire</h3>
              <div className="th-task">
                <FileText size={14} />
                <span>Soumettre le rapport journalier avant le départ.</span>
              </div>
              <div className="th-task">
                <CalendarCheck size={14} />
                <span>Enregistrer les présences de la classe en cours.</span>
              </div>
              <div className="th-task">
                <BookOpen size={14} />
                <span>Préparer les supports du prochain cours.</span>
              </div>
            </section>
          </div>

          <div className="th-quick">
            <Link to="/teacher/classes">
              <div className="icon-badge"><Layers size={16} /></div>
              Mes classes <ArrowUpRight size={14} style={{ marginLeft: "auto", color: "#9AA2B4" }} />
            </Link>
            <Link to="/teacher/attendance">
              <div className="icon-badge"><CalendarCheck size={16} /></div>
              Prendre les présences <ArrowUpRight size={14} style={{ marginLeft: "auto", color: "#9AA2B4" }} />
            </Link>
            <Link to="/teacher/reports">
              <div className="icon-badge"><FileText size={16} /></div>
              Rapport journalier <ArrowUpRight size={14} style={{ marginLeft: "auto", color: "#9AA2B4" }} />
            </Link>
            <Link to="/teacher/profile">
              <div className="icon-badge"><Users size={16} /></div>
              Mon profil <ArrowUpRight size={14} style={{ marginLeft: "auto", color: "#9AA2B4" }} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}