// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Users,
//   UserPlus,
//   Search,
//   Mail,
//   Phone,
//   CheckCircle2,
//   X,
//   AlertCircle,
//   Loader2,
//   BookOpen,
//   CalendarDays,
// } from "lucide-react";
// import { teacherApi, ApiError } from "../services/teacherApi";

// /**
//  * IEM Virunga — Gestion des enseignants
//  * Palette: blanc / bleu marine / noir
//  *
//  * Backend (Spring Boot TeacherController):
//  *   GET   /api/teachers                          -> list
//  *   POST  /api/teachers                          -> create (+ email + SMS + WhatsApp)
//  *   PATCH /api/teachers/{id}/toggle-availability -> flip availability
//  */

// const EMPTY_FORM = {
//   prenom: "",
//   nom: "",
//   email: "",
//   telephone: "",
//   type: "Permanent",
//   coursDispense: "",
//   dateEmbauche: "",
//   journeePedagogique: "",
// };

// const safe = (v) => (v == null ? "" : String(v).toLowerCase());

// export default function Enseignants() {
//   const [view, setView] = useState("list"); // 'list' | 'register'
//   const [teachers, setTeachers] = useState([]);
//   const [loadingList, setLoadingList] = useState(true);
//   const [listError, setListError] = useState(null);
//   const [query, setQuery] = useState("");
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [confirmation, setConfirmation] = useState(null);

//   useEffect(() => {
//     loadTeachers();
//   }, []);

//   async function loadTeachers() {
//     setLoadingList(true);
//     setListError(null);
//     try {
//       const data = await teacherApi.list();
//       setTeachers(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setListError(
//         err instanceof ApiError
//           ? err.message
//           : "Impossible de charger les enseignants."
//       );
//     } finally {
//       setLoadingList(false);
//     }
//   }

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return teachers;
//     return teachers.filter((t) => {
//       return (
//         safe(t?.prenom).includes(q) ||
//         safe(t?.nom).includes(q) ||
//         safe(t?.email).includes(q) ||
//         safe(t?.coursDispense).includes(q)
//       );
//     });
//   }, [teachers, query]);

//   function updateField(key, value) {
//     setForm((f) => ({ ...f, [key]: value }));
//     if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
//   }

//   function validate() {
//     const next = {};
//     if (!form.prenom.trim()) next.prenom = "Le prénom est requis.";
//     if (!form.nom.trim()) next.nom = "Le nom est requis.";
//     if (!form.email.trim()) next.email = "L'email est requis.";
//     else if (!/^\S+@\S+\.\S+$/.test(form.email))
//       next.email = "Format d'email invalide.";
//     else if (
//       teachers.some((t) => safe(t?.email) === form.email.trim().toLowerCase())
//     )
//       next.email = "Un enseignant utilise déjà cet email.";
//     if (!form.type) next.type = "Le type est requis.";
//     setErrors(next);
//     return Object.keys(next).length === 0;
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!validate()) return;
//     setSubmitting(true);
//     setSubmitError(null);

//     try {
//       const saved = await teacherApi.create(form);
//       setTeachers((prev) => [saved, ...prev]);
//       setConfirmation(saved);
//       setForm(EMPTY_FORM);
//     } catch (err) {
//       if (err instanceof ApiError && err.status === 409) {
//         setErrors((e) => ({
//           ...e,
//           email: "Un enseignant utilise déjà cet email.",
//         }));
//       } else if (err instanceof ApiError && err.status === 400) {
//         setSubmitError("Certains champs requis sont manquants ou invalides.");
//       } else {
//         setSubmitError(
//           err instanceof ApiError
//             ? err.message
//             : "Impossible d'enregistrer l'enseignant."
//         );
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   async function toggleAvailability(id) {
//     // Optimistic update, reverted on failure
//     setTeachers((prev) =>
//       prev.map((t) =>
//         t.id === id ? { ...t, disponible: !t.disponible } : t
//       )
//     );
//     try {
//       const updated = await teacherApi.toggleAvailability(id);
//       setTeachers((prev) => prev.map((t) => (t.id === id ? updated : t)));
//     } catch (err) {
//       setTeachers((prev) =>
//         prev.map((t) =>
//           t.id === id ? { ...t, disponible: !t.disponible } : t
//         )
//       );
//       setListError("La mise à jour du statut a échoué. Réessayez.");
//     }
//   }

//   return (
//     <div className="iem-app">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

//         .iem-app {
//           --white: #ffffff;
//           --mist: #f4f6fa;
//           --line: #e0e5ed;
//           --navy: #0e2a4a;
//           --navy-deep: #081a30;
//           --navy-soft: #e7edf6;
//           --black: #0a0a0a;
//           --muted: #5b6472;
//           font-family: 'IBM Plex Sans', sans-serif;
//           color: var(--black);
//           background: var(--white);
//           min-height: 100vh;
//           box-sizing: border-box;
//         }
//         .iem-app *, .iem-app *::before, .iem-app *::after { box-sizing: inherit; }

//         /* ---------- Top bar (replaces the old sidebar) ---------- */
//         .iem-topbar {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 16px;
//           padding: 16px 32px;
//           background: var(--navy-deep);
//           color: var(--white);
//           border-bottom: 1px solid var(--line);
//         }
//         .iem-mark {
//           font-family: 'Fraunces', serif;
//           font-size: 20px;
//           font-weight: 600;
//           line-height: 1.15;
//           letter-spacing: 0.2px;
//         }
//         .iem-mark span {
//           display: block;
//           font-size: 12px;
//           font-weight: 400;
//           color: #9fb2cc;
//           margin-top: 2px;
//         }
//         .iem-topnav { display: flex; gap: 8px; }
//         .iem-topnav button {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           background: transparent;
//           border: none;
//           cursor: pointer;
//           color: #c7d3e3;
//           font-size: 14px;
//           font-family: inherit;
//           padding: 8px 12px;
//           border-radius: 6px;
//           transition: background 0.15s ease, color 0.15s ease;
//         }
//         .iem-topnav button:hover { background: rgba(255,255,255,0.06); color: #fff; }
//         .iem-topnav button.active { background: var(--navy); color: #fff; }

//         /* ---------- Main ---------- */
//         .iem-main {
//           flex: 1;
//           padding: 40px 48px;
//           max-width: 980px;
//           margin: 0 auto;
//         }
//         .iem-header {
//           margin-bottom: 28px;
//           display: flex;
//           align-items: flex-end;
//           justify-content: space-between;
//           gap: 24px;
//         }
//         .iem-title {
//           font-family: 'Fraunces', serif;
//           font-size: 28px;
//           font-weight: 600;
//           margin: 0 0 6px;
//         }
//         .iem-subtitle {
//           color: var(--muted);
//           font-size: 14px;
//           margin: 0;
//           max-width: 52ch;
//         }

//         .iem-btn-primary {
//           background: var(--navy);
//           color: var(--white);
//           border: none;
//           font-family: inherit;
//           font-size: 14px;
//           font-weight: 500;
//           padding: 10px 18px;
//           border-radius: 6px;
//           cursor: pointer;
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           transition: background 0.15s ease;
//         }
//         .iem-btn-primary:hover { background: var(--navy-deep); }
//         .iem-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

//         /* ---------- Search ---------- */
//         .iem-search {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           border: 1px solid var(--line);
//           border-radius: 6px;
//           padding: 8px 12px;
//           margin-bottom: 18px;
//           max-width: 340px;
//           background: var(--mist);
//         }
//         .iem-search input {
//           border: none;
//           background: transparent;
//           outline: none;
//           font-family: inherit;
//           font-size: 14px;
//           width: 100%;
//           color: var(--black);
//         }
//         .iem-search svg { color: var(--muted); flex-shrink: 0; }

//         /* ---------- Table ---------- */
//         .iem-table { width: 100%; border-collapse: collapse; }
//         .iem-table thead tr { border-bottom: 2px solid var(--navy); }
//         .iem-table th {
//           text-align: left;
//           font-size: 12px;
//           font-weight: 600;
//           color: var(--navy);
//           padding: 10px 14px;
//           letter-spacing: 0.2px;
//         }
//         .iem-table td {
//           padding: 14px;
//           font-size: 14px;
//           border-bottom: 1px solid var(--line);
//           vertical-align: middle;
//         }
//         .iem-table tbody tr:hover { background: var(--mist); }
//         .iem-name { font-weight: 600; }
//         .iem-contact {
//           color: var(--muted);
//           font-size: 13px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .iem-contact + .iem-contact { margin-top: 3px; }

//         .iem-status {
//           display: inline-flex;
//           align-items: center;
//           gap: 7px;
//           font-size: 13px;
//           cursor: pointer;
//           border: none;
//           background: none;
//           font-family: inherit;
//           padding: 0;
//         }
//         .iem-dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 50%;
//           background: var(--navy);
//           flex-shrink: 0;
//         }
//         .iem-dot.off { background: transparent; border: 1.5px solid var(--muted); }
//         .iem-status .label-on { color: var(--navy); }
//         .iem-status .label-off { color: var(--muted); }

//         .iem-empty {
//           text-align: center;
//           padding: 48px 0;
//           color: var(--muted);
//           font-size: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//         }

//         /* ---------- Form ---------- */
//         .iem-form { max-width: 560px; }
//         .iem-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 18px 20px;
//           margin-bottom: 22px;
//         }
//         .iem-field { display: flex; flex-direction: column; gap: 6px; }
//         .iem-field.full { grid-column: 1 / -1; }
//         .iem-field label { font-size: 13px; font-weight: 500; color: var(--navy); }
//         .iem-field input, .iem-field select, .iem-field textarea {
//           font-family: inherit;
//           font-size: 14px;
//           padding: 10px 12px;
//           border: 1px solid var(--line);
//           border-radius: 6px;
//           outline: none;
//           background: var(--white);
//           color: var(--black);
//           transition: border-color 0.15s ease;
//         }
//         .iem-field input:focus, .iem-field select:focus, .iem-field textarea:focus {
//           border-color: var(--navy);
//         }
//         .iem-field textarea { resize: vertical; min-height: 72px; }
//         .iem-error {
//           font-size: 12px;
//           color: var(--black);
//           background: var(--mist);
//           border-left: 2px solid var(--navy);
//           padding: 4px 8px;
//         }

//         .iem-confirm {
//           display: flex;
//           align-items: flex-start;
//           gap: 10px;
//           background: var(--navy-soft);
//           border: 1px solid var(--navy);
//           border-radius: 6px;
//           padding: 14px 16px;
//           margin-bottom: 22px;
//           font-size: 13px;
//           color: var(--navy-deep);
//         }
//         .iem-confirm svg { flex-shrink: 0; margin-top: 1px; color: var(--navy); }
//         .iem-confirm-close {
//           margin-left: auto;
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: var(--navy);
//           font-family: inherit;
//           font-size: 13px;
//         }
//         .iem-confirm-warn {
//           background: var(--mist);
//           border-color: var(--black);
//           color: var(--black);
//         }
//         .iem-confirm-warn svg { color: var(--black); }
//         .iem-confirm-warn .iem-confirm-close {
//           color: var(--black);
//           text-decoration: underline;
//         }

//         .iem-spin { animation: iem-spin 0.8s linear infinite; }
//         @keyframes iem-spin { to { transform: rotate(360deg); } }

//         .iem-form-actions { display: flex; gap: 10px; }
//         .iem-btn-ghost {
//           background: transparent;
//           border: 1px solid var(--line);
//           color: var(--black);
//           font-family: inherit;
//           font-size: 14px;
//           padding: 10px 18px;
//           border-radius: 6px;
//           cursor: pointer;
//         }
//         .iem-btn-ghost:hover { border-color: var(--navy); color: var(--navy); }

//         /* small screens */
//         @media (max-width: 640px) {
//           .iem-main { padding: 24px 16px; }
//           .iem-grid { grid-template-columns: 1fr; }
//           .iem-header { flex-direction: column; align-items: flex-start; }
//           .iem-topbar { flex-direction: column; align-items: flex-start; }
//         }
//       `}</style>

//       {/* ---------- Top bar (replaces the old sidebar) ---------- */}
//       <header className="iem-topbar">
//         <div className="iem-mark">
//           IEM Virunga
//           <span>Espace administration</span>
//         </div>
//         <nav className="iem-topnav">
//           <button
//             className={view === "list" ? "active" : ""}
//             onClick={() => setView("list")}
//           >
//             <Users size={16} /> Enseignants
//           </button>
//           <button
//             className={view === "register" ? "active" : ""}
//             onClick={() => {
//               setView("register");
//               setConfirmation(null);
//             }}
//           >
//             <UserPlus size={16} /> Nouvel enseignant
//           </button>
//         </nav>
//       </header>

//       <main className="iem-main">
//         {view === "list" && (
//           <>
//             <div className="iem-header">
//               <div>
//                 <h1 className="iem-title">Enseignants</h1>
//                 <p className="iem-subtitle">
//                   {teachers.length} enseignant{teachers.length > 1 ? "s" : ""}{" "}
//                   enregistré{teachers.length > 1 ? "s" : ""}. Cliquez sur le
//                   statut pour basculer la disponibilité.
//                 </p>
//               </div>
//               <button
//                 className="iem-btn-primary"
//                 onClick={() => setView("register")}
//               >
//                 <UserPlus size={16} /> Enregistrer un enseignant
//               </button>
//             </div>

//             <div className="iem-search">
//               <Search size={16} />
//               <input
//                 placeholder="Rechercher par nom, email ou cours"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//               />
//             </div>

//             {listError && (
//               <div className="iem-confirm iem-confirm-warn">
//                 <AlertCircle size={18} />
//                 <div>{listError}</div>
//                 <button className="iem-confirm-close" onClick={loadTeachers}>
//                   Réessayer
//                 </button>
//               </div>
//             )}

//             {loadingList ? (
//               <div className="iem-empty">
//                 <Loader2 size={16} className="iem-spin" /> Chargement des
//                 enseignants...
//               </div>
//             ) : (
//               <>
//                 <table className="iem-table">
//                   <thead>
//                     <tr>
//                       <th>Enseignant</th>
//                       <th>Cours dispensé</th>
//                       <th>Type</th>
//                       <th>Contact</th>
//                       <th>Statut</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filtered.map((t) => (
//                       <tr key={t.id}>
//                         <td className="iem-name">
//                           {t.prenom} {t.nom}
//                         </td>
//                         <td>{t.coursDispense || "—"}</td>
//                         <td>{t.type}</td>
//                         <td>
//                           <div className="iem-contact">
//                             <Mail size={12} /> {t.email}
//                           </div>
//                           {t.telephone && (
//                             <div className="iem-contact">
//                               <Phone size={12} /> {t.telephone}
//                             </div>
//                           )}
//                         </td>
//                         <td>
//                           <button
//                             className="iem-status"
//                             onClick={() => toggleAvailability(t.id)}
//                           >
//                             <span
//                               className={`iem-dot ${
//                                 t.disponible ? "" : "off"
//                               }`}
//                             />
//                             <span
//                               className={
//                                 t.disponible ? "label-on" : "label-off"
//                               }
//                             >
//                               {t.disponible ? "Disponible" : "Indisponible"}
//                             </span>
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {filtered.length === 0 && (
//                   <div className="iem-empty">
//                     Aucun enseignant ne correspond à cette recherche.
//                   </div>
//                 )}
//               </>
//             )}
//           </>
//         )}

//         {view === "register" && (
//           <>
//             <div className="iem-header">
//               <div>
//                 <h1 className="iem-title">Nouvel enseignant</h1>
//                 <p className="iem-subtitle">
//                   Un compte est créé automatiquement et un email avec le mot de
//                   passe temporaire est envoyé à l'enseignant. Un SMS et un
//                   message WhatsApp sont également envoyés si un numéro de
//                   téléphone est renseigné.
//                 </p>
//               </div>
//             </div>

//             {confirmation && (
//               <div className="iem-confirm">
//                 <CheckCircle2 size={18} />
//                 <div>
//                   Compte créé pour {confirmation.prenom} {confirmation.nom}. Un
//                   email contenant le mot de passe temporaire a été envoyé à{" "}
//                   <strong>{confirmation.email}</strong>
//                   {confirmation.telephone ? (
//                     <>
//                       , et un SMS / WhatsApp a été envoyé au{" "}
//                       <strong>{confirmation.telephone}</strong>
//                     </>
//                   ) : null}
//                   .
//                 </div>
//                 <button
//                   className="iem-confirm-close"
//                   onClick={() => setConfirmation(null)}
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             )}

//             {submitError && (
//               <div className="iem-confirm iem-confirm-warn">
//                 <AlertCircle size={18} />
//                 <div>{submitError}</div>
//                 <button
//                   className="iem-confirm-close"
//                   onClick={() => setSubmitError(null)}
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             )}

//             <form className="iem-form" onSubmit={handleSubmit}>
//               <div className="iem-grid">
//                 <div className="iem-field">
//                   <label>Prénom</label>
//                   <input
//                     value={form.prenom}
//                     onChange={(e) => updateField("prenom", e.target.value)}
//                   />
//                   {errors.prenom && (
//                     <span className="iem-error">{errors.prenom}</span>
//                   )}
//                 </div>
//                 <div className="iem-field">
//                   <label>Nom</label>
//                   <input
//                     value={form.nom}
//                     onChange={(e) => updateField("nom", e.target.value)}
//                   />
//                   {errors.nom && (
//                     <span className="iem-error">{errors.nom}</span>
//                   )}
//                 </div>

//                 <div className="iem-field full">
//                   <label>Email</label>
//                   <input
//                     type="email"
//                     value={form.email}
//                     onChange={(e) => updateField("email", e.target.value)}
//                   />
//                   {errors.email && (
//                     <span className="iem-error">{errors.email}</span>
//                   )}
//                 </div>

//                 <div className="iem-field">
//                   <label>Téléphone</label>
//                   <input
//                     value={form.telephone}
//                     onChange={(e) => updateField("telephone", e.target.value)}
//                     placeholder="+243 98 427 4081"
//                   />
//                 </div>
//                 <div className="iem-field">
//                   <label>Type</label>
//                   <select
//                     value={form.type}
//                     onChange={(e) => updateField("type", e.target.value)}
//                   >
//                     <option>Permanent</option>
//                     <option>Partiel</option>
//                     <option>Vacataire</option>
//                   </select>
//                 </div>

//                 <div className="iem-field">
//                   <label>
//                     <BookOpen
//                       size={12}
//                       style={{ verticalAlign: "-2px", marginRight: 4 }}
//                     />
//                     Cours dispensé
//                   </label>
//                   <input
//                     value={form.coursDispense}
//                     onChange={(e) =>
//                       updateField("coursDispense", e.target.value)
//                     }
//                     placeholder="Mathématiques, Physique, ..."
//                   />
//                 </div>
//                 <div className="iem-field">
//                   <label>
//                     <CalendarDays
//                       size={12}
//                       style={{ verticalAlign: "-2px", marginRight: 4 }}
//                     />
//                     Date d'embauche
//                   </label>
//                   <input
//                     type="date"
//                     value={form.dateEmbauche}
//                     onChange={(e) =>
//                       updateField("dateEmbauche", e.target.value)
//                     }
//                   />
//                 </div>

//                 <div className="iem-field full">
//                   <label>Journée pédagogique</label>
//                   <textarea
//                     value={form.journeePedagogique}
//                     onChange={(e) =>
//                       updateField("journeePedagogique", e.target.value)
//                     }
//                     placeholder="Observations liées aux journées pédagogiques, formations, etc."
//                   />
//                 </div>
//               </div>

//               <div className="iem-form-actions">
//                 <button
//                   type="submit"
//                   className="iem-btn-primary"
//                   disabled={submitting}
//                 >
//                   {submitting ? "Enregistrement..." : "Enregistrer l'enseignant"}
//                 </button>
//                 <button
//                   type="button"
//                   className="iem-btn-ghost"
//                   onClick={() => setView("list")}
//                 >
//                   Annuler
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  BookOpen,
  CalendarDays,
  Camera,
  ImagePlus,
  UserRound,
  Pencil,
  Trash2,
  IdCard,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { teacherApi, ApiError } from "../services/teacherApi";

/**
 * IEM Virunga — Gestion des enseignants
 * Palette: blanc / bleu marine / noir
 *
 * Backend (Spring Boot TeacherController):
 *   GET    /api/teachers                          -> list
 *   POST   /api/teachers                          -> create (+ email + SMS + WhatsApp)
 *   PUT    /api/teachers/{id}                     -> update
 *   PATCH  /api/teachers/{id}/toggle-availability -> flip availability
 *   DELETE /api/teachers/{id}                     -> delete
 *
 * Teacher objects now also carry:
 *   - matricule: string (auto-generated server-side, e.g. "ENS-2601")
 *   - qualification: string (e.g. "Licence en sciences infirmières")
 *   - fonction: string (e.g. "Chef de section", "Titulaire de cours")
 *   - nationality: string
 *   - photo: string (base64 data URL, e.g. "data:image/jpeg;base64,...")
 */

const EMPTY_FORM = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  type: "Permanent",
  coursDispense: "",
  dateEmbauche: "",
  journeePedagogique: "",
  matricule: "",
  qualification: "",
  fonction: "",
  nationality: "Congolaise (RDC)",
  photo: "",
};

const MAX_PHOTO_BYTES = 3 * 1024 * 1024; // 3 MB safety cap

const safe = (v) => (v == null ? "" : String(v).toLowerCase());

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

function initialsOf(prenom, nom) {
  const a = (prenom || "").trim()[0];
  const b = (nom || "").trim()[0];
  const s = `${a || ""}${b || ""}`.toUpperCase();
  return s || "?";
}

export default function Enseignants() {
  const [view, setView] = useState("list"); // 'list' | 'register'
  const [teachers, setTeachers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const cameraInputRef = useRef(null);
  const importPhotoInputRef = useRef(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    setLoadingList(true);
    setListError(null);
    try {
      const data = await teacherApi.list();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      setListError(
        err instanceof ApiError
          ? err.message
          : "Impossible de charger les enseignants."
      );
    } finally {
      setLoadingList(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => {
      return (
        safe(t?.prenom).includes(q) ||
        safe(t?.nom).includes(q) ||
        safe(t?.email).includes(q) ||
        safe(t?.coursDispense).includes(q) ||
        safe(t?.matricule).includes(q) ||
        safe(t?.fonction).includes(q)
      );
    });
  }, [teachers, query]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  }

  async function handlePhotoFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSubmitError("Veuillez choisir un fichier image (JPEG, PNG...).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setSubmitError("La photo est trop volumineuse (3 Mo maximum).");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((f) => ({ ...f, photo: dataUrl }));
      setSubmitError(null);
    } catch {
      setSubmitError("Impossible de lire cette image. Réessayez.");
    }
  }

  function removePhoto() {
    setForm((f) => ({ ...f, photo: "" }));
  }

  function startAdd() {
    setEditingTeacher(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitError(null);
    setConfirmation(null);
    setView("register");
  }

  function startEdit(teacher) {
    setEditingTeacher(teacher);
    setForm({
      prenom: teacher.prenom || "",
      nom: teacher.nom || "",
      email: teacher.email || "",
      telephone: teacher.telephone || "",
      type: teacher.type || "Permanent",
      coursDispense: teacher.coursDispense || "",
      dateEmbauche: teacher.dateEmbauche || "",
      journeePedagogique: teacher.journeePedagogique || "",
      matricule: teacher.matricule || "",
      qualification: teacher.qualification || "",
      fonction: teacher.fonction || "",
      nationality: teacher.nationality || "",
      photo: teacher.photo || "",
    });
    setErrors({});
    setSubmitError(null);
    setConfirmation(null);
    setView("register");
  }

  function validate() {
    const next = {};
    if (!form.prenom.trim()) next.prenom = "Le prénom est requis.";
    if (!form.nom.trim()) next.nom = "Le nom est requis.";
    if (!form.email.trim()) next.email = "L'email est requis.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Format d'email invalide.";
    else if (
      teachers.some(
        (t) =>
          safe(t?.email) === form.email.trim().toLowerCase() &&
          (!editingTeacher || t.id !== editingTeacher.id)
      )
    )
      next.email = "Un enseignant utilise déjà cet email.";
    if (!form.type) next.type = "Le type est requis.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (editingTeacher) {
        const saved = await teacherApi.update(editingTeacher.id, form);
        setTeachers((prev) => prev.map((t) => (t.id === editingTeacher.id ? saved : t)));
        setEditingTeacher(null);
        setForm(EMPTY_FORM);
        setView("list");
      } else {
        const saved = await teacherApi.create(form);
        setTeachers((prev) => [saved, ...prev]);
        setConfirmation(saved);
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors((e) => ({
          ...e,
          email: "Un enseignant utilise déjà cet email.",
        }));
      } else if (err instanceof ApiError && err.status === 400) {
        setSubmitError("Certains champs requis sont manquants ou invalides.");
      } else {
        setSubmitError(
          err instanceof ApiError
            ? err.message
            : "Impossible d'enregistrer l'enseignant."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleAvailability(id) {
    // Optimistic update, reverted on failure
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, disponible: !t.disponible } : t
      )
    );
    try {
      const updated = await teacherApi.toggleAvailability(id);
      setTeachers((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, disponible: !t.disponible } : t
        )
      );
      setListError("La mise à jour du statut a échoué. Réessayez.");
    }
  }

  async function removeTeacher(teacher) {
    if (
      !window.confirm(
        `Supprimer ${teacher.prenom} ${teacher.nom} ? Cette action est irréversible.`
      )
    )
      return;
    try {
      await teacherApi.remove(teacher.id);
      setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
    } catch (err) {
      setListError(
        err instanceof ApiError ? err.message : "Échec de la suppression."
      );
    }
  }

  return (
    <div className="iem-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .iem-app {
          --white: #ffffff;
          --mist: #f4f6fa;
          --line: #e0e5ed;
          --navy: #0e2a4a;
          --navy-deep: #081a30;
          --navy-soft: #e7edf6;
          --black: #0a0a0a;
          --muted: #5b6472;
          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--black);
          background: var(--white);
          min-height: 100vh;
          box-sizing: border-box;
        }
        .iem-app *, .iem-app *::before, .iem-app *::after { box-sizing: inherit; }

        /* ---------- Top bar (replaces the old sidebar) ---------- */
        .iem-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 32px;
          background: var(--navy-deep);
          color: var(--white);
          border-bottom: 1px solid var(--line);
        }
        .iem-mark {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: 0.2px;
        }
        .iem-mark span {
          display: block;
          font-size: 12px;
          font-weight: 400;
          color: #9fb2cc;
          margin-top: 2px;
        }
        .iem-topnav { display: flex; gap: 8px; }
        .iem-topnav button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #c7d3e3;
          font-size: 14px;
          font-family: inherit;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .iem-topnav button:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .iem-topnav button.active { background: var(--navy); color: #fff; }

        /* ---------- Main ---------- */
        .iem-main {
          flex: 1;
          padding: 40px 48px;
          max-width: 980px;
          margin: 0 auto;
        }
        .iem-header {
          margin-bottom: 28px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }
        .iem-title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 6px;
        }
        .iem-subtitle {
          color: var(--muted);
          font-size: 14px;
          margin: 0;
          max-width: 52ch;
        }

        .iem-btn-primary {
          background: var(--navy);
          color: var(--white);
          border: none;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 18px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease;
        }
        .iem-btn-primary:hover { background: var(--navy-deep); }
        .iem-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ---------- Search ---------- */
        .iem-search {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 18px;
          max-width: 340px;
          background: var(--mist);
        }
        .iem-search input {
          border: none;
          background: transparent;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          width: 100%;
          color: var(--black);
        }
        .iem-search svg { color: var(--muted); flex-shrink: 0; }

        /* ---------- Table ---------- */
        .iem-table { width: 100%; border-collapse: collapse; }
        .iem-table thead tr { border-bottom: 2px solid var(--navy); }
        .iem-table th {
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: var(--navy);
          padding: 10px 14px;
          letter-spacing: 0.2px;
        }
        .iem-table td {
          padding: 14px;
          font-size: 14px;
          border-bottom: 1px solid var(--line);
          vertical-align: middle;
        }
        .iem-table tbody tr:hover { background: var(--mist); }
        .iem-name { font-weight: 600; }
        .iem-matricule { color: var(--muted); font-size: 12.5px; }
        .iem-contact {
          color: var(--muted);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .iem-contact + .iem-contact { margin-top: 3px; }

        .iem-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--navy);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
          flex-shrink: 0;
        }
        .iem-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .iem-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          cursor: pointer;
          border: none;
          background: none;
          font-family: inherit;
          padding: 0;
        }
        .iem-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--navy);
          flex-shrink: 0;
        }
        .iem-dot.off { background: transparent; border: 1.5px solid var(--muted); }
        .iem-status .label-on { color: var(--navy); }
        .iem-status .label-off { color: var(--muted); }

        .iem-row-actions { display: flex; gap: 4px; justify-content: flex-end; }
        .iem-icon-btn {
          background: none; border: none; cursor: pointer;
          color: var(--muted);
          padding: 6px; border-radius: 5px; display: inline-flex;
        }
        .iem-icon-btn:hover { background: var(--mist); color: var(--navy); }
        .iem-icon-btn.danger:hover { color: #9B2C2C; }

        .iem-empty {
          text-align: center;
          padding: 48px 0;
          color: var(--muted);
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* ---------- Form ---------- */
        .iem-form { max-width: 560px; }

        .iem-photo-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
          padding-bottom: 22px;
          border-bottom: 1px dashed var(--line);
        }
        .iem-photo-preview {
          width: 76px; height: 76px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--mist);
          border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          color: var(--muted);
          flex-shrink: 0;
        }
        .iem-photo-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .iem-photo-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .iem-btn-ghost-sm {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--black);
          font-family: inherit;
          font-size: 12.5px;
          padding: 7px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .iem-btn-ghost-sm:hover { border-color: var(--navy); color: var(--navy); }

        .iem-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 20px;
          margin-bottom: 22px;
        }
        .iem-field { display: flex; flex-direction: column; gap: 6px; }
        .iem-field.full { grid-column: 1 / -1; }
        .iem-field label { font-size: 13px; font-weight: 500; color: var(--navy); }
        .iem-field input, .iem-field select, .iem-field textarea {
          font-family: inherit;
          font-size: 14px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 6px;
          outline: none;
          background: var(--white);
          color: var(--black);
          transition: border-color 0.15s ease;
        }
        .iem-field input:focus, .iem-field select:focus, .iem-field textarea:focus {
          border-color: var(--navy);
        }
        .iem-field input:disabled {
          background: var(--mist);
          color: var(--muted);
        }
        .iem-field textarea { resize: vertical; min-height: 72px; }
        .iem-error {
          font-size: 12px;
          color: var(--black);
          background: var(--mist);
          border-left: 2px solid var(--navy);
          padding: 4px 8px;
        }

        .iem-confirm {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: var(--navy-soft);
          border: 1px solid var(--navy);
          border-radius: 6px;
          padding: 14px 16px;
          margin-bottom: 22px;
          font-size: 13px;
          color: var(--navy-deep);
        }
        .iem-confirm svg { flex-shrink: 0; margin-top: 1px; color: var(--navy); }
        .iem-confirm-close {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--navy);
          font-family: inherit;
          font-size: 13px;
        }
        .iem-confirm-warn {
          background: var(--mist);
          border-color: var(--black);
          color: var(--black);
        }
        .iem-confirm-warn svg { color: var(--black); }
        .iem-confirm-warn .iem-confirm-close {
          color: var(--black);
          text-decoration: underline;
        }

        .iem-spin { animation: iem-spin 0.8s linear infinite; }
        @keyframes iem-spin { to { transform: rotate(360deg); } }

        .iem-form-actions { display: flex; gap: 10px; }
        .iem-btn-ghost {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--black);
          font-family: inherit;
          font-size: 14px;
          padding: 10px 18px;
          border-radius: 6px;
          cursor: pointer;
        }
        .iem-btn-ghost:hover { border-color: var(--navy); color: var(--navy); }

        /* small screens */
        @media (max-width: 640px) {
          .iem-main { padding: 24px 16px; }
          .iem-grid { grid-template-columns: 1fr; }
          .iem-header { flex-direction: column; align-items: flex-start; }
          .iem-topbar { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* ---------- Top bar (replaces the old sidebar) ---------- */}
      <header className="iem-topbar">
        <div className="iem-mark">
          IEM Virunga
          <span>Espace administration</span>
        </div>
        <nav className="iem-topnav">
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            <Users size={16} /> Enseignants
          </button>
          <button
            className={view === "register" ? "active" : ""}
            onClick={startAdd}
          >
            <UserPlus size={16} /> Nouvel enseignant
          </button>
        </nav>
      </header>

      <main className="iem-main">
        {view === "list" && (
          <>
            <div className="iem-header">
              <div>
                <h1 className="iem-title">Enseignants</h1>
                <p className="iem-subtitle">
                  {teachers.length} enseignant{teachers.length > 1 ? "s" : ""}{" "}
                  enregistré{teachers.length > 1 ? "s" : ""}. Cliquez sur le
                  statut pour basculer la disponibilité.
                </p>
              </div>
              <button className="iem-btn-primary" onClick={startAdd}>
                <UserPlus size={16} /> Enregistrer un enseignant
              </button>
            </div>

            <div className="iem-search">
              <Search size={16} />
              <input
                placeholder="Rechercher par nom, matricule, email ou cours"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {listError && (
              <div className="iem-confirm iem-confirm-warn">
                <AlertCircle size={18} />
                <div>{listError}</div>
                <button className="iem-confirm-close" onClick={loadTeachers}>
                  Réessayer
                </button>
              </div>
            )}

            {loadingList ? (
              <div className="iem-empty">
                <Loader2 size={16} className="iem-spin" /> Chargement des
                enseignants...
              </div>
            ) : (
              <>
                <table className="iem-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Enseignant</th>
                      <th>Matricule</th>
                      <th>Cours dispensé</th>
                      <th>Fonction</th>
                      <th>Type</th>
                      <th>Contact</th>
                      <th>Statut</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div className="iem-avatar">
                            {t.photo ? (
                              <img src={t.photo} alt={`${t.prenom} ${t.nom}`} />
                            ) : (
                              initialsOf(t.prenom, t.nom)
                            )}
                          </div>
                        </td>
                        <td className="iem-name">
                          {t.prenom} {t.nom}
                        </td>
                        <td className="iem-matricule">{t.matricule || "—"}</td>
                        <td>{t.coursDispense || "—"}</td>
                        <td>{t.fonction || "—"}</td>
                        <td>{t.type}</td>
                        <td>
                          <div className="iem-contact">
                            <Mail size={12} /> {t.email}
                          </div>
                          {t.telephone && (
                            <div className="iem-contact">
                              <Phone size={12} /> {t.telephone}
                            </div>
                          )}
                        </td>
                        <td>
                          <button
                            className="iem-status"
                            onClick={() => toggleAvailability(t.id)}
                          >
                            <span
                              className={`iem-dot ${
                                t.disponible ? "" : "off"
                              }`}
                            />
                            <span
                              className={
                                t.disponible ? "label-on" : "label-off"
                              }
                            >
                              {t.disponible ? "Disponible" : "Indisponible"}
                            </span>
                          </button>
                        </td>
                        <td>
                          <div className="iem-row-actions">
                            <button
                              className="iem-icon-btn"
                              title="Modifier"
                              onClick={() => startEdit(t)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              className="iem-icon-btn danger"
                              title="Supprimer"
                              onClick={() => removeTeacher(t)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <div className="iem-empty">
                    Aucun enseignant ne correspond à cette recherche.
                  </div>
                )}
              </>
            )}
          </>
        )}

        {view === "register" && (
          <>
            <div className="iem-header">
              <div>
                <h1 className="iem-title">
                  {editingTeacher ? "Modifier l'enseignant" : "Nouvel enseignant"}
                </h1>
                <p className="iem-subtitle">
                  {editingTeacher
                    ? "Mettez à jour les informations de cet enseignant."
                    : "Un compte est créé automatiquement et un email avec le mot de passe temporaire est envoyé à l'enseignant. Un SMS et un message WhatsApp sont également envoyés si un numéro de téléphone est renseigné."}
                </p>
              </div>
            </div>

            {confirmation && (
              <div className="iem-confirm">
                <CheckCircle2 size={18} />
                <div>
                  Compte créé pour {confirmation.prenom} {confirmation.nom}. Un
                  email contenant le mot de passe temporaire a été envoyé à{" "}
                  <strong>{confirmation.email}</strong>
                  {confirmation.telephone ? (
                    <>
                      , et un SMS / WhatsApp a été envoyé au{" "}
                      <strong>{confirmation.telephone}</strong>
                    </>
                  ) : null}
                  .
                </div>
                <button
                  className="iem-confirm-close"
                  onClick={() => setConfirmation(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {submitError && (
              <div className="iem-confirm iem-confirm-warn">
                <AlertCircle size={18} />
                <div>{submitError}</div>
                <button
                  className="iem-confirm-close"
                  onClick={() => setSubmitError(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <form className="iem-form" onSubmit={handleSubmit}>
              {/* Photo capture / import */}
              <div className="iem-photo-row">
                <div className="iem-photo-preview">
                  {form.photo ? (
                    <img src={form.photo} alt="Photo de l'enseignant" />
                  ) : (
                    <UserRound size={30} />
                  )}
                </div>
                <div className="iem-photo-actions">
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    style={{ display: "none" }}
                    onChange={handlePhotoFile}
                  />
                  <input
                    ref={importPhotoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoFile}
                  />
                  <button
                    type="button"
                    className="iem-btn-ghost-sm"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera size={14} /> Prendre une photo
                  </button>
                  <button
                    type="button"
                    className="iem-btn-ghost-sm"
                    onClick={() => importPhotoInputRef.current?.click()}
                  >
                    <ImagePlus size={14} /> Importer
                  </button>
                  {form.photo && (
                    <button
                      type="button"
                      className="iem-btn-ghost-sm"
                      onClick={removePhoto}
                    >
                      <X size={14} /> Retirer
                    </button>
                  )}
                </div>
              </div>

              <div className="iem-grid">
                <div className="iem-field">
                  <label>Prénom</label>
                  <input
                    value={form.prenom}
                    onChange={(e) => updateField("prenom", e.target.value)}
                  />
                  {errors.prenom && (
                    <span className="iem-error">{errors.prenom}</span>
                  )}
                </div>
                <div className="iem-field">
                  <label>Nom</label>
                  <input
                    value={form.nom}
                    onChange={(e) => updateField("nom", e.target.value)}
                  />
                  {errors.nom && (
                    <span className="iem-error">{errors.nom}</span>
                  )}
                </div>

                <div className="iem-field full">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                  {errors.email && (
                    <span className="iem-error">{errors.email}</span>
                  )}
                </div>

                <div className="iem-field">
                  <label>Téléphone</label>
                  <input
                    value={form.telephone}
                    onChange={(e) => updateField("telephone", e.target.value)}
                    placeholder="+243 98 427 4081"
                  />
                </div>
                <div className="iem-field">
                  <label>Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value)}
                  >
                    <option>Permanent</option>
                    <option>Partiel</option>
                    <option>Vacataire</option>
                  </select>
                </div>

                <div className="iem-field">
                  <label>
                    <IdCard
                      size={12}
                      style={{ verticalAlign: "-2px", marginRight: 4 }}
                    />
                    Matricule{" "}
                    {!editingTeacher && (
                      <span style={{ color: "var(--muted)", fontWeight: 400 }}>
                        (auto si vide)
                      </span>
                    )}
                  </label>
                  <input
                    value={form.matricule}
                    onChange={(e) => updateField("matricule", e.target.value)}
                    placeholder="Ex. ENS-2601"
                    disabled={!!editingTeacher}
                  />
                </div>
                <div className="iem-field">
                  <label>Nationalité</label>
                  <input
                    value={form.nationality}
                    onChange={(e) => updateField("nationality", e.target.value)}
                    placeholder="Ex. Congolaise (RDC)"
                  />
                </div>

                <div className="iem-field">
                  <label>
                    <GraduationCap
                      size={12}
                      style={{ verticalAlign: "-2px", marginRight: 4 }}
                    />
                    Qualification
                  </label>
                  <input
                    value={form.qualification}
                    onChange={(e) => updateField("qualification", e.target.value)}
                    placeholder="Ex. Licence en Sciences Infirmières"
                  />
                </div>
                <div className="iem-field">
                  <label>
                    <Briefcase
                      size={12}
                      style={{ verticalAlign: "-2px", marginRight: 4 }}
                    />
                    Fonction
                  </label>
                  <input
                    value={form.fonction}
                    onChange={(e) => updateField("fonction", e.target.value)}
                    placeholder="Ex. Chef de section, Titulaire de cours"
                  />
                </div>

                <div className="iem-field">
                  <label>
                    <BookOpen
                      size={12}
                      style={{ verticalAlign: "-2px", marginRight: 4 }}
                    />
                    Cours dispensé
                  </label>
                  <input
                    value={form.coursDispense}
                    onChange={(e) =>
                      updateField("coursDispense", e.target.value)
                    }
                    placeholder="Mathématiques, Physique, ..."
                  />
                </div>
                <div className="iem-field">
                  <label>
                    <CalendarDays
                      size={12}
                      style={{ verticalAlign: "-2px", marginRight: 4 }}
                    />
                    Date d'embauche
                  </label>
                  <input
                    type="date"
                    value={form.dateEmbauche}
                    onChange={(e) =>
                      updateField("dateEmbauche", e.target.value)
                    }
                  />
                </div>

                <div className="iem-field full">
                  <label>Journée pédagogique</label>
                  <textarea
                    value={form.journeePedagogique}
                    onChange={(e) =>
                      updateField("journeePedagogique", e.target.value)
                    }
                    placeholder="Observations liées aux journées pédagogiques, formations, etc."
                  />
                </div>
              </div>

              <div className="iem-form-actions">
                <button
                  type="submit"
                  className="iem-btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Enregistrement..."
                    : editingTeacher
                    ? "Mettre à jour"
                    : "Enregistrer l'enseignant"}
                </button>
                <button
                  type="button"
                  className="iem-btn-ghost"
                  onClick={() => {
                    setEditingTeacher(null);
                    setView("list");
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}