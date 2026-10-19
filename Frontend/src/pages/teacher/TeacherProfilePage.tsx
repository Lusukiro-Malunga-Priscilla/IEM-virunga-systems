// import { useEffect, useMemo, useState } from "react";
// import {
//   BookOpen,
//   CalendarDays,
//   CheckCircle2,
//   ClipboardList,
//   Clock,
//   GraduationCap,
//   Loader2,
//   Mail,
//   Phone,
//   XCircle,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { teacherApi, ApiError } from "@/services/teacherApi";

// type Teacher = {
//   id?: number;
//   prenom?: string;
//   nom?: string;
//   email?: string;
//   telephone?: string;
//   type?: string;
//   coursDispense?: string;
//   journeePedagogique?: string;
//   dateEmbauche?: string;
//   disponible?: boolean;
// };

// const safe = (v: unknown) => (v == null ? "" : String(v).trim().toLowerCase());

// export default function TeacherProfilePage() {
//   const { user } = useAuth();
//   const [teacher, setTeacher] = useState<Teacher | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fullName = useMemo(() => {
//     if (teacher?.prenom || teacher?.nom) {
//       return `${teacher.prenom ?? ""} ${teacher.nom ?? ""}`.trim();
//     }
//     return user?.name || user?.email || "Enseignant";
//   }, [teacher, user]);

//   const initials = useMemo(() => {
//     const parts = fullName.split(" ").filter(Boolean);
//     return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "IE";
//   }, [fullName]);

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
//         else {
//           setTeacher(null);
//           setError(
//             "Aucune fiche enseignant n'est liée à cet email. Contactez l'administration."
//           );
//         }
//       } catch (e) {
//         if (cancelled) return;
//         setTeacher(null);
//         setError(
//           e instanceof ApiError
//             ? e.message
//             : "Impossible de charger votre fiche enseignant."
//         );
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [user?.email]);

//   return (
//     <div className="tp-shell">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

//         .tp-shell {
//           --navy:#0B2545; --cream:#F6F2E8;
//           --line:#E1D8C3; --text:#221F1B; --muted:#6B6357;
//           --accent:#C8933E; --accent-deep:#A6742A;
//           --ok:#3F6B4E; --err:#B3432B;
//           max-width:1080px; margin:0 auto; padding:40px 32px 64px;
//           color:var(--text); font-family:'IBM Plex Sans',system-ui,sans-serif;
//         }
//         .tp-shell *,.tp-shell *::before,.tp-shell *::after { box-sizing:border-box; }

//         .tp-hello { margin-bottom:28px; }
//         .tp-hello h1 {
//           font-family:'Fraunces',serif; font-weight:500;
//           font-size:clamp(24px,2.8vw,32px); margin:0 0 6px;
//         }
//         .tp-hello p { color:var(--muted); font-size:14px; margin:0; }

//         .tp-grid { display:grid; grid-template-columns:repeat(12,1fr); gap:20px; }

//         .tp-card {
//           background:#fff; border:1px solid var(--line);
//           border-radius:4px; padding:22px 24px;
//         }
//         .tp-card h2 {
//           font-family:'Fraunces',serif; font-weight:500;
//           font-size:17px; margin:0 0 16px;
//           display:flex; align-items:center; gap:8px;
//         }
//         .tp-card h2 svg { color:var(--accent-deep); }

//         .tp-card-profile { grid-column:span 5; }
//         .tp-card-status  { grid-column:span 3; }
//         .tp-card-courses { grid-column:span 4; }
//         .tp-card-details { grid-column:span 12; }

//         .tp-profile-row { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
//         .tp-profile-avatar {
//           width:64px; height:64px; border-radius:50%;
//           background:var(--navy); color:var(--cream);
//           display:flex; align-items:center; justify-content:center;
//           font-family:'Fraunces',serif; font-size:22px; font-weight:500; flex-shrink:0;
//         }
//         .tp-profile-info h3 {
//           font-family:'Fraunces',serif; font-weight:500;
//           font-size:19px; margin:0 0 4px;
//         }
//         .tp-profile-info p { margin:0; font-size:13px; color:var(--muted); }

//         .tp-kv {
//           display:flex; align-items:center; gap:10px;
//           font-size:13.5px; padding:8px 0;
//           border-top:1px solid var(--line);
//         }
//         .tp-kv:first-of-type { border-top:none; }
//         .tp-kv svg { color:var(--muted); flex-shrink:0; }
//         .tp-kv strong { font-weight:500; color:var(--text); }
//         .tp-kv span { color:var(--muted); }

//         .tp-status-pill {
//           display:inline-flex; align-items:center; gap:8px;
//           padding:8px 14px; border-radius:999px;
//           font-size:13px; font-weight:500;
//           background:rgba(63,107,78,0.10); color:var(--ok);
//           border:1px solid rgba(63,107,78,0.25);
//         }
//         .tp-status-pill.off {
//           background:rgba(179,67,43,0.08); color:var(--err);
//           border-color:rgba(179,67,43,0.25);
//         }

//         .tp-course-list { list-style:none; margin:0; padding:0; }
//         .tp-course-item {
//           display:flex; align-items:flex-start; gap:10px;
//           padding:10px 0; border-top:1px solid var(--line); font-size:13.5px;
//         }
//         .tp-course-item:first-child { border-top:none; }
//         .tp-course-item svg { color:var(--accent-deep); margin-top:2px; flex-shrink:0; }
//         .tp-course-item strong { display:block; font-weight:500; color:var(--text); }
//         .tp-course-item small { color:var(--muted); font-size:12.5px; }

//         .tp-empty {
//           text-align:center; color:var(--muted); font-size:13.5px;
//           padding:24px 0; display:flex; align-items:center;
//           justify-content:center; gap:8px;
//         }
//         .tp-spin { animation:tp-spin .8s linear infinite; }
//         @keyframes tp-spin { to { transform:rotate(360deg); } }

//         .tp-notice {
//           font-size:13px; padding:11px 13px; border-radius:3px;
//           margin-bottom:20px; line-height:1.5;
//         }
//         .tp-notice.error {
//           background:rgba(179,67,43,0.08); color:var(--err);
//           border:1px solid rgba(179,67,43,0.25);
//         }

//         @media (max-width:900px) {
//           .tp-card-profile,.tp-card-status,.tp-card-courses { grid-column:span 12; }
//           .tp-shell { padding:24px 16px 48px; }
//         }
//       `}</style>

//       <div className="tp-hello">
//         <h1>Mon profil</h1>
//         <p>Vos informations personnelles et votre activité d'enseignement.</p>
//       </div>

//       {error && <div className="tp-notice error">{error}</div>}

//       {loading ? (
//         <div className="tp-empty">
//           <Loader2 size={16} className="tp-spin" /> Chargement…
//         </div>
//       ) : !teacher ? (
//         <div className="tp-empty">Aucune fiche enseignant à afficher.</div>
//       ) : (
//         <div className="tp-grid">
//           <section className="tp-card tp-card-profile">
//             <h2><GraduationCap size={18} /> Identité</h2>
//             <div className="tp-profile-row">
//               <div className="tp-profile-avatar">{initials}</div>
//               <div className="tp-profile-info">
//                 <h3>{fullName}</h3>
//                 <p>{teacher.type ?? "Enseignant"}</p>
//               </div>
//             </div>
//             <div className="tp-kv">
//               <Mail size={14} />
//               <strong>{teacher.email ?? user?.email ?? "—"}</strong>
//             </div>
//             <div className="tp-kv">
//               <Phone size={14} />
//               <strong>{teacher.telephone ?? "—"}</strong>
//             </div>
//             <div className="tp-kv">
//               <CalendarDays size={14} />
//               <span>Date d'embauche :</span>
//               <strong>{teacher.dateEmbauche ?? "—"}</strong>
//             </div>
//           </section>

//           <section className="tp-card tp-card-status">
//             <h2><CheckCircle2 size={18} /> Disponibilité</h2>
//             <div className={teacher.disponible ? "tp-status-pill" : "tp-status-pill off"}>
//               {teacher.disponible ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
//               {teacher.disponible ? "Disponible" : "Indisponible"}
//             </div>
//           </section>

//           <section className="tp-card tp-card-courses">
//             <h2><BookOpen size={18} /> Cours dispensés</h2>
//             {teacher.coursDispense ? (
//               <ul className="tp-course-list">
//                 {teacher.coursDispense.split(",").map((c, i) => (
//                   <li key={i} className="tp-course-item">
//                     <BookOpen size={14} />
//                     <div>
//                       <strong>{c.trim()}</strong>
//                       <small>Session en cours</small>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="tp-empty">Aucun cours renseigné.</div>
//             )}
//           </section>

//           <section className="tp-card tp-card-details">
//             <h2><ClipboardList size={18} /> Journée pédagogique</h2>
//             {teacher.journeePedagogique ? (
//               <p style={{ margin:0, fontSize:14, lineHeight:1.6 }}>
//                 {teacher.journeePedagogique}
//               </p>
//             ) : (
//               <div className="tp-empty">
//                 <Clock size={16} /> Aucune note pédagogique pour le moment.
//               </div>
//             )}
//           </section>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { teacherApi, ApiError } from "@/services/teacherApi";

type Teacher = {
  id?: number;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  type?: string;
  coursDispense?: string;
  journeePedagogique?: string;
  dateEmbauche?: string;
  disponible?: boolean;
};

const safe = (v: unknown) => (v == null ? "" : String(v).trim().toLowerCase());

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fullName = useMemo(() => {
    if (teacher?.prenom || teacher?.nom) {
      return `${teacher.prenom ?? ""} ${teacher.nom ?? ""}`.trim();
    }
    return user?.name || user?.email || "Enseignant";
  }, [teacher, user]);

  const initials = useMemo(() => {
    const parts = fullName.split(" ").filter(Boolean);
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "IE";
  }, [fullName]);

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
        else {
          setTeacher(null);
          setError("Aucune fiche enseignant n'est liée à cet email. Contactez l'administration.");
        }
      } catch (e) {
        if (cancelled) return;
        setTeacher(null);
        setError(e instanceof ApiError ? e.message : "Impossible de charger votre fiche enseignant.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  return (
    <div className="tp-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .tp-shell {
          --navy:#0B1220; --bg:#F4F6FA; --white:#fff;
          --line:#E7EAF0; --ink:#12141B; --muted:#6B7280;
          --accent:#C8933E; --ok:#1F8B4C; --err:#D0392C;
          max-width:1180px; margin:0 auto; padding:32px 32px 56px;
          color:var(--ink); font-family:'Plus Jakarta Sans',system-ui,sans-serif;
        }
        .tp-shell *,.tp-shell *::before,.tp-shell *::after { box-sizing:border-box; }

        .tp-hello { margin-bottom:24px; }
        .tp-hello h1 { font-size:clamp(22px,2.6vw,28px); font-weight:800; margin:0 0 6px; letter-spacing:-0.3px; }
        .tp-hello p { color:var(--muted); font-size:13.5px; margin:0; }

        .tp-grid { display:grid; grid-template-columns:repeat(12,1fr); gap:16px; }

        .tp-card { background:var(--white); border:1px solid var(--line); border-radius:16px; padding:22px 24px; }
        .tp-card h2 { font-size:15px; font-weight:700; margin:0 0 16px; display:flex; align-items:center; gap:9px; }
        .tp-card h2 svg { color:var(--accent); }

        .tp-card-profile { grid-column:span 5; }
        .tp-card-status  { grid-column:span 3; }
        .tp-card-courses { grid-column:span 4; }
        .tp-card-details { grid-column:span 12; }

        .tp-profile-row { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
        .tp-profile-avatar {
          width:60px; height:60px; border-radius:16px;
          background:var(--navy); color:#fff;
          display:flex; align-items:center; justify-content:center;
          font-size:19px; font-weight:800; flex-shrink:0;
        }
        .tp-profile-info h3 { font-size:17px; font-weight:800; margin:0 0 4px; }
        .tp-profile-info p { margin:0; font-size:12.5px; color:var(--muted); font-weight:500; }

        .tp-kv { display:flex; align-items:center; gap:10px; font-size:13.5px; padding:9px 0; border-top:1px solid var(--line); }
        .tp-kv:first-of-type { border-top:none; }
        .tp-kv svg { color:var(--muted); flex-shrink:0; }
        .tp-kv strong { font-weight:600; color:var(--ink); }
        .tp-kv span { color:var(--muted); }

        .tp-status-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:9px 15px; border-radius:999px; font-size:13px; font-weight:600;
          background:rgba(31,139,76,0.08); color:var(--ok); border:1px solid rgba(31,139,76,0.2);
        }
        .tp-status-pill.off { background:rgba(208,57,44,0.08); color:var(--err); border-color:rgba(208,57,44,0.2); }

        .tp-course-list { list-style:none; margin:0; padding:0; }
        .tp-course-item { display:flex; align-items:flex-start; gap:10px; padding:11px 0; border-top:1px solid var(--line); font-size:13.5px; }
        .tp-course-item:first-child { border-top:none; padding-top:0; }
        .tp-course-item svg { color:var(--accent); margin-top:2px; flex-shrink:0; }
        .tp-course-item strong { display:block; font-weight:600; color:var(--ink); }
        .tp-course-item small { color:var(--muted); font-size:12px; }

        .tp-empty {
          text-align:center; color:var(--muted); font-size:13.5px;
          padding:26px 0; display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .tp-spin { animation:tp-spin .8s linear infinite; }
        @keyframes tp-spin { to { transform:rotate(360deg); } }

        .tp-notice {
          font-size:13px; padding:11px 13px; border-radius:8px;
          margin-bottom:20px; line-height:1.5;
        }
        .tp-notice.error { background:rgba(208,57,44,0.08); color:var(--err); border:1px solid rgba(208,57,44,0.2); }

        @media (max-width:900px) {
          .tp-card-profile,.tp-card-status,.tp-card-courses { grid-column:span 12; }
          .tp-shell { padding:22px 18px 48px; }
        }
      `}</style>

      <div className="tp-hello">
        <h1>Mon profil</h1>
        <p>Vos informations personnelles et votre activité d'enseignement.</p>
      </div>

      {error && <div className="tp-notice error">{error}</div>}

      {loading ? (
        <div className="tp-empty">
          <Loader2 size={16} className="tp-spin" /> Chargement…
        </div>
      ) : !teacher ? (
        <div className="tp-empty">Aucune fiche enseignant à afficher.</div>
      ) : (
        <div className="tp-grid">
          <section className="tp-card tp-card-profile">
            <h2><GraduationCap size={17} /> Identité</h2>
            <div className="tp-profile-row">
              <div className="tp-profile-avatar">{initials}</div>
              <div className="tp-profile-info">
                <h3>{fullName}</h3>
                <p>{teacher.type ?? "Enseignant"}</p>
              </div>
            </div>
            <div className="tp-kv">
              <Mail size={14} />
              <strong>{teacher.email ?? user?.email ?? "—"}</strong>
            </div>
            <div className="tp-kv">
              <Phone size={14} />
              <strong>{teacher.telephone ?? "—"}</strong>
            </div>
            <div className="tp-kv">
              <CalendarDays size={14} />
              <span>Date d'embauche :</span>
              <strong>{teacher.dateEmbauche ?? "—"}</strong>
            </div>
          </section>

          <section className="tp-card tp-card-status">
            <h2><CheckCircle2 size={17} /> Disponibilité</h2>
            <div className={teacher.disponible ? "tp-status-pill" : "tp-status-pill off"}>
              {teacher.disponible ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {teacher.disponible ? "Disponible" : "Indisponible"}
            </div>
          </section>

          <section className="tp-card tp-card-courses">
            <h2><BookOpen size={17} /> Cours dispensés</h2>
            {teacher.coursDispense ? (
              <ul className="tp-course-list">
                {teacher.coursDispense.split(",").map((c, i) => (
                  <li key={i} className="tp-course-item">
                    <BookOpen size={14} />
                    <div>
                      <strong>{c.trim()}</strong>
                      <small>Session en cours</small>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="tp-empty">Aucun cours renseigné.</div>
            )}
          </section>

          <section className="tp-card tp-card-details">
            <h2><ClipboardList size={17} /> Journée pédagogique</h2>
            {teacher.journeePedagogique ? (
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{teacher.journeePedagogique}</p>
            ) : (
              <div className="tp-empty">
                <Clock size={16} /> Aucune note pédagogique pour le moment.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}