// // import { useState, useEffect } from "react";

// // const KEY = "feuille-notes-examen-iem-virunga";
// // const COURSES = [
// //   "Communication orale",
// //   "Orth. & Grammaire",
// //   "Production écrite",
// //   "Lecture expliquée",
// //   "Communication créole",
// // ];

// // const blankRows = (n: number) =>
// //   Array.from({ length: n }, () => ({ nom: "", notes: COURSES.map(() => "") }));

// // const initial = () => ({
// //   school: "IEM/VIRUNGA",
// //   address: "Institut d'Enseignement Médical du Virunga",
// //   phone: "Tél. : +243 · Nord-Kivu, RDC",
// //   title: "FEUILLE DE NOTES",
// //   subtitle: "EXAMEN",
// //   info: { classe: "", cours: "", trimestre: "", date: "" },
// //   max: [10, 10, 10, 10, 10],
// //   rows: blankRows(20),
// // });

// // const n = (v: any) => (v === "" || isNaN(+v) ? 0 : +v);

// // export default function TeacherScores() {
// //   const [d, setD] = useState<any>(() => {
// //     try {
// //       const s = localStorage.getItem(KEY);
// //       return s ? JSON.parse(s) : initial();
// //     } catch {
// //       return initial();
// //     }
// //   });

// //   useEffect(() => {
// //     try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
// //   }, [d]);

// //   const set = (k: string, v: any) => setD((p: any) => ({ ...p, [k]: v }));
// //   const setInfo = (k: string, v: any) => setD((p: any) => ({ ...p, info: { ...p.info, [k]: v } }));
// //   const setMax = (i: number, v: any) =>
// //     setD((p: any) => ({ ...p, max: p.max.map((m: any, j: number) => (j === i ? v : m)) }));
// //   const setNom = (r: number, v: any) =>
// //     setD((p: any) => ({ ...p, rows: p.rows.map((x: any, i: number) => (i === r ? { ...x, nom: v } : x)) }));
// //   const setNote = (r: number, c: number, v: any) =>
// //     setD((p: any) => ({
// //       ...p,
// //       rows: p.rows.map((x: any, i: number) =>
// //         i === r ? { ...x, notes: x.notes.map((y: any, j: number) => (j === c ? v : y)) } : x
// //       ),
// //     }));
// //   const addRow = () => setD((p: any) => ({ ...p, rows: [...p.rows, ...blankRows(1)] }));
// //   const delRow = () => setD((p: any) => ({ ...p, rows: p.rows.slice(0, -1) }));
// //   const reset = () => window.confirm("Effacer toutes les données ?") && setD(initial());

// //   const totalMax = d.max.reduce((a: any, b: any) => a + n(b), 0);

// //   return (
// //     <div className="fn-page">
// //       <style>{css}</style>

// //       <div className="fn-tools no-print">
// //         <button onClick={() => window.print()}>Imprimer / PDF</button>
// //         <button onClick={addRow}>+ Ajouter une ligne</button>
// //         <button onClick={delRow}>− Retirer la dernière ligne</button>
// //         <button className="danger" onClick={reset}>Réinitialiser</button>
// //       </div>

// //       <div className="fn-sheet">
// //         <div className="fn-head">
// //           <div className="fn-box fn-school">
// //             <input className="school" value={d.school} onChange={(e) => set("school", e.target.value)} />
// //             <input value={d.address} onChange={(e) => set("address", e.target.value)} />
// //             <input value={d.phone} onChange={(e) => set("phone", e.target.value)} />
// //           </div>

// //           <div className="fn-title">
// //             <input className="t1" value={d.title} onChange={(e) => set("title", e.target.value)} />
// //             <input className="t2" value={d.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
// //           </div>

// //           <div className="fn-box fn-info">
// //             {[
// //               ["Classe", "classe"],
// //               ["Cours", "cours"],
// //               ["Trimestre", "trimestre"],
// //               ["Date", "date"],
// //             ].map(([label, key]) => (
// //               <label key={key}>
// //                 <span>{label} :</span>
// //                 <input value={d.info[key]} onChange={(e) => setInfo(key, e.target.value)} />
// //               </label>
// //             ))}
// //           </div>
// //         </div>

// //         <table className="fn-table">
// //           <thead>
// //             <tr>
// //               <th className="dark num">N°</th>
// //               <th className="dark nom">Nom et Prénom</th>
// //               {COURSES.map((c, i) => (
// //                 <th key={c} className="light">
// //                   <div>{c}</div>
// //                   <div className="max">
// //                     ( / <input value={d.max[i]} onChange={(e) => setMax(i, e.target.value)} /> )
// //                   </div>
// //                 </th>
// //               ))}
// //               <th className="dark total">
// //                 <div>Total</div>
// //                 <div>( / {totalMax} )</div>
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {d.rows.map((r: any, ri: number) => {
// //               const total = r.notes.reduce((a: any, b: any) => a + n(b), 0);
// //               const filled = r.notes.some((x: any) => x !== "");
// //               return (
// //                 <tr key={ri}>
// //                   <td className="num">{ri + 1}</td>
// //                   <td className="nom">
// //                     <input value={r.nom} onChange={(e) => setNom(ri, e.target.value)} />
// //                   </td>
// //                   {r.notes.map((v: any, ci: number) => (
// //                     <td key={ci}>
// //                       <input
// //                         className={`note ${n(v) > n(d.max[ci]) ? "over" : ""}`}
// //                         inputMode="decimal"
// //                         value={v}
// //                         onChange={(e) => setNote(ri, ci, e.target.value)}
// //                       />
// //                     </td>
// //                   ))}
// //                   <td className="tot">{filled ? total : ""}</td>
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

// // const css = `
// // .fn-page{background:#e8ecf2;padding:16px;min-height:100vh;font-family:Arial,Helvetica,sans-serif}
// // .fn-tools{max-width:1100px;margin:0 auto 12px;display:flex;gap:8px;flex-wrap:wrap}
// // .fn-tools button{font:inherit;font-size:13px;padding:6px 12px;border:1px solid #0b4086;background:#0b4086;color:#fff;border-radius:4px;cursor:pointer}
// // .fn-tools button.danger{background:#fff;color:#a32020;border-color:#a32020}
// // .fn-sheet{max-width:1100px;margin:0 auto;background:#fff;border-radius:18px;padding:14px 14px 18px;box-shadow:0 2px 10px rgba(0,0,0,.18);overflow-x:auto}
// // .fn-sheet input{font:inherit;border:0;background:transparent;outline:none;min-width:0;color:inherit}
// // .fn-sheet input:focus{background:#fff9d6}
// // .fn-head{display:grid;grid-template-columns:1.25fr 1.15fr .95fr;gap:20px;align-items:stretch;margin-bottom:14px;min-width:820px}
// // .fn-box{border:1.5px solid #2b5aa3;border-radius:10px;padding:8px 12px}
// // .fn-school{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#0b2f66}
// // .fn-school input{width:100%;text-align:center;font-size:15px;font-weight:bold}
// // .fn-school input.school{font-family:"Times New Roman",Georgia,serif;font-size:25px;font-weight:bold;color:#12285a}
// // .fn-title{background:#0b4086;color:#fff;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 10px;border:2px solid #07295a}
// // .fn-title input{width:100%;text-align:center;font-weight:bold}
// // .fn-title .t1{font-family:"Times New Roman",Georgia,serif;font-size:32px}
// // .fn-title .t2{font-size:30px;letter-spacing:.5px}
// // .fn-info{display:flex;flex-direction:column;justify-content:space-between;color:#12285a}
// // .fn-info label{display:flex;align-items:baseline;gap:6px;font-size:15px;font-weight:bold}
// // .fn-info label input{flex:1;border-bottom:1px dotted #555;font-weight:normal;font-size:14px}
// // .fn-table{width:100%;border-collapse:collapse;border:2px solid #0b4086;min-width:820px;table-layout:fixed}
// // .fn-table th{border:1px solid #fff;font-size:13px;padding:6px 4px;line-height:1.4}
// // .fn-table th.dark{background:#0b4086;color:#fff;font-size:17px}
// // .fn-table th.light{background:#c3defa;color:#12306b}
// // .fn-table th.num{width:46px}
// // .fn-table th.total{width:130px}
// // .fn-table th.total div:last-child{font-size:15px}
// // .fn-table .max{font-weight:normal;font-size:13px}
// // .fn-table .max input{width:26px;text-align:center;font-size:13px;color:#12306b}
// // .fn-table td{border:1px solid #2b5aa3;height:24px;padding:0;text-align:center}
// // .fn-table td.num{font-weight:bold;font-size:13px;text-align:center;width:46px;border-left:0}
// // .fn-table td.nom{text-align:left}
// // .fn-table td.nom input,.fn-table td input.note{width:100%;height:100%;padding:2px 6px;box-sizing:border-box;font-size:14px}
// // .fn-table td input.note{text-align:center}
// // .fn-table td input.note.over{color:#c00;font-weight:bold;background:#ffe5e5}
// // .fn-table td.tot{font-weight:bold;font-size:14px;background:#f2f7fd}
// // .fn-table tbody tr:nth-child(even) td:not(.num){background-color:#fbfdff}
// // @media print{
// //   .no-print{display:none!important}
// //   .fn-page{background:#fff;padding:0}
// //   .fn-sheet{box-shadow:none;max-width:none;overflow:visible}
// //   @page{size:A4 landscape;margin:8mm}
// // }
// // `;


// import { useState, useEffect, useMemo } from "react";
// import { loadCourses, loadStudents, type Course, type Student } from "../bulletinStore";
// import { useAuth } from "@/context/AuthContext";

// const COURSE_NAMES = [
//   "Communication orale",
//   "Orth. & Grammaire",
//   "Production écrite",
//   "Lecture expliquée",
//   "Communication créole",
// ];
// const MAXES = [10, 10, 10, 10, 10];
// const KEY_PREFIX = "notes-iem-virunga";

// const n = (v: any) => (v === "" || isNaN(+v) ? 0 : +v);
// const blankNotes = () => COURSE_NAMES.map(() => "");

// type Row = { studentId: string; nom: string; notes: string[] };

// export default function TeacherScores() {
//   const { user } = useAuth() as any;
//   const [classes, setClasses] = useState<string[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [classe, setClasse] = useState("");
//   const [courseId, setCourseId] = useState("");
//   const [teacher, setTeacher] = useState(user?.name ?? "");
//   const [trimestre, setTrimestre] = useState("");
//   const [date, setDate] = useState("");
//   const [rows, setRows] = useState<Row[]>([]);
//   const [saved, setSaved] = useState(false);

//   // storage key depends on class + course
//   const storageKey = useMemo(
//     () => `${KEY_PREFIX}:${classe || "all"}:${courseId || "none"}`,
//     [classe, courseId]
//   );

//   /* ---- Load classes & courses once ---- */
//   useEffect(() => {
//     loadStudents().then((students) => {
//       
//       
//       setClasse(CLASSES[0]);
//     });
//     loadCourses().then((c) => {
//       setCourses(c);
//       if (c[0]) setCourseId(c[0].id);
//     });
//   }, []);

//   /* ---- When class or course changes, reload rows + saved data ---- */
//   useEffect(() => {
//     if (!classe) return;
//     loadStudents().then((students) => {
//       const inClass = students.filter((s: any) => {
        const sClasse  = s.classe ?? "";
        const sSection = s.section ?? null;
        if (sClasse !== classe) return false;
        if (sSection && sSection !== section) return false;
        return true;
      });
//       let savedData: any = null;
//       try {
//         const raw = localStorage.getItem(storageKey);
//         savedData = raw ? JSON.parse(raw) : null;
//       } catch {}

//       const savedTeacher   = savedData?.teacher   ?? user?.name ?? "";
//       const savedTrimestre = savedData?.trimestre ?? "";
//       const savedDate      = savedData?.date      ?? "";
//       setTeacher(savedTeacher);
//       setTrimestre(savedTrimestre);
//       setDate(savedDate);

//       const rowsFromStudents: Row[] = inClass.map((s) => {
//         const existing = savedData?.rows?.find((r: Row) => r.studentId === s.id);
//         return {
//           studentId: s.id,
//           nom: s.name,
//           notes: existing?.notes ?? blankNotes(),
//         };
//       });

//       // If saved data has rows not present in the student list (orphans), keep them
//       if (savedData?.rows) {
//         for (const r of savedData.rows) {
//           if (!rowsFromStudents.find((x) => x.studentId === r.studentId)) {
//             rowsFromStudents.push(r);
//           }
//         }
//       }

//       setRows(rowsFromStudents);
//       setSaved(false);
//     });
//   }, [classe, storageKey, user]);

//   /* ---- Mutations ---- */
//   const setNote = (ri: number, ci: number, v: string) => {
//     setRows((p) =>
//       p.map((r, i) => (i === ri ? { ...r, notes: r.notes.map((x, j) => (j === ci ? v : x)) } : r))
//     );
//     setSaved(false);
//   };
//   const setNom = (ri: number, v: string) => {
//     setRows((p) => p.map((r, i) => (i === ri ? { ...r, nom: v } : r)));
//     setSaved(false);
//   };
//   const addRow = () => {
//     setRows((p) => [...p, { studentId: `manual-${Date.now()}`, nom: "", notes: blankNotes() }]);
//     setSaved(false);
//   };
//   const delRow = () => {
//     setRows((p) => p.slice(0, -1));
//     setSaved(false);
//   };

//   /* ---- Save to localStorage ---- */
//   function save() {
//     const payload = {
//       classe,
//       courseId,
//       courseName: courses.find((c) => c.id === courseId)?.name ?? "",
//       teacher,
//       trimestre,
//       date,
//       rows,
//       maxes: MAXES,
//       courseNames: COURSE_NAMES,
//       savedAt: Date.now(),
//     };
//     try {
//       localStorage.setItem(storageKey, JSON.stringify(payload));
//       setSaved(true);
//     } catch (e) {
//       console.error(e);
//       alert("Échec de l'enregistrement (stockage plein ?)");
//     }
//   }

//   function reset() {
//     if (!window.confirm("Effacer toutes les données de cette feuille ?")) return;
//     localStorage.removeItem(storageKey);
//     setRows((p) => p.map((r) => ({ ...r, notes: blankNotes() })));
//     setTeacher(user?.name ?? "");
//     setTrimestre("");
//     setDate("");
//     setSaved(false);
//   }

//   const totalMax = MAXES.reduce((a, b) => a + n(b), 0);

//   return (
//     <div className="fn-page">
//       <style>{css}</style>

//       <div className="fn-tools no-print">
//         <button onClick={() => window.print()}>Imprimer / PDF</button>
//         <button onClick={save} style={{ background: saved ? "#15803d" : "#0b4086" }}>
//           {saved ? "Enregistré ✓" : "Enregistrer"}
//         </button>
//         <button onClick={addRow}>+ Ajouter une ligne</button>
//         <button onClick={delRow}>− Retirer la dernière ligne</button>
//         <button className="danger" onClick={reset}>Réinitialiser</button>
//       </div>

//       <div className="fn-sheet">
//         {/* ---------- en-tête ---------- */}
//         <div className="fn-head">
//           <div className="fn-box fn-school">
//             <div className="school">IEM/VIRUNGA</div>
//             <div className="addr">Institut d'Enseignement Médical du Virunga</div>
//             <div className="addr">Tél. : +243 · Nord-Kivu, RDC</div>
//           </div>

//           <div className="fn-title">
//             <div className="t1">FEUILLE DE NOTES</div>
//             <div className="t2">EXAMEN</div>
//           </div>

//           <div className="fn-box fn-info">
//             <label>
//               <span>Classe :</span>
//               <select value={classe} onChange={(e) => setClasse(e.target.value)}>
//                 {classes.length === 0 && <option value="">— Aucune classe —</option>}
//                 {classes.map((c) => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </label>

//             <label>
//               <span>Cours :</span>
//               <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//                 {courses.length === 0 && <option value="">— Aucun cours —</option>}
//                 {courses.map((c) => (
//                   <option key={c.id} value={c.id}>{c.name}</option>
//                 ))}
//               </select>
//             </label>

//             <label>
//               <span>Prof :</span>
//               <input value={teacher} onChange={(e) => { setTeacher(e.target.value); setSaved(false); }} />
//             </label>

//             <label>
//               <span>Trimestre :</span>
//               <input value={trimestre} onChange={(e) => { setTrimestre(e.target.value); setSaved(false); }} />
//             </label>

//             <label>
//               <span>Date :</span>
//               <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setSaved(false); }} />
//             </label>
//           </div>
//         </div>

//         {/* ---------- tableau ---------- */}
//         <table className="fn-table">
//           <thead>
//             <tr>
//               <th className="dark num">N°</th>
//               <th className="dark nom">Nom et Prénom</th>
//               {COURSE_NAMES.map((c, i) => (
//                 <th key={c} className="light">
//                   <div>{c}</div>
//                   <div className="max">( / {MAXES[i]} )</div>
//                 </th>
//               ))}
//               <th className="dark total">
//                 <div>Total</div>
//                 <div>( / {totalMax} )</div>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r, ri) => {
//               const total = r.notes.reduce((a, b) => a + n(b), 0);
//               const filled = r.notes.some((x) => x !== "");
//               return (
//                 <tr key={r.studentId || ri}>
//                   <td className="num">{ri + 1}</td>
//                   <td className="nom">
//                     <input value={r.nom} onChange={(e) => setNom(ri, e.target.value)} />
//                   </td>
//                   {r.notes.map((v, ci) => (
//                     <td key={ci}>
//                       <input
//                         className={`note ${n(v) > MAXES[ci] ? "over" : ""}`}
//                         inputMode="decimal"
//                         value={v}
//                         onChange={(e) => setNote(ri, ci, e.target.value)}
//                       />
//                     </td>
//                   ))}
//                   <td className="tot">{filled ? total : ""}</td>
//                 </tr>
//               );
//             })}
//             {rows.length === 0 && (
//               <tr>
//                 <td colSpan={COURSE_NAMES.length + 3} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>
//                   Aucun élève dans cette classe. Choisissez une autre classe ou ajoutez une ligne.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// const css = `
// .fn-page{background:#e8ecf2;padding:16px;min-height:100vh;font-family:Arial,Helvetica,sans-serif}
// .fn-tools{max-width:1100px;margin:0 auto 12px;display:flex;gap:8px;flex-wrap:wrap}
// .fn-tools button{font:inherit;font-size:13px;padding:6px 12px;border:1px solid #0b4086;background:#0b4086;color:#fff;border-radius:4px;cursor:pointer}
// .fn-tools button.danger{background:#fff;color:#a32020;border-color:#a32020}
// .fn-sheet{max-width:1100px;margin:0 auto;background:#fff;border-radius:18px;padding:14px 14px 18px;box-shadow:0 2px 10px rgba(0,0,0,.18);overflow-x:auto}
// .fn-sheet input{font:inherit;border:0;background:transparent;outline:none;min-width:0;color:inherit}
// .fn-sheet input:focus{background:#fff9d6}
// .fn-sheet select{font:inherit;border:1px solid #cbd5e1;border-radius:4px;padding:2px 6px;background:#fff}
// .fn-head{display:grid;grid-template-columns:1.15fr 1fr 1.2fr;gap:20px;align-items:stretch;margin-bottom:14px;min-width:880px}
// .fn-box{border:1.5px solid #2b5aa3;border-radius:10px;padding:8px 12px}
// .fn-school{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#0b2f66;text-align:center}
// .fn-school .school{font-family:"Times New Roman",Georgia,serif;font-size:25px;font-weight:bold;color:#12285a}
// .fn-school .addr{font-size:13px;font-weight:600}
// .fn-title{background:#0b4086;color:#fff;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 10px;border:2px solid #07295a;text-align:center}
// .fn-title .t1{font-family:"Times New Roman",Georgia,serif;font-size:28px;font-weight:bold}
// .fn-title .t2{font-size:26px;font-weight:bold;letter-spacing:.5px}
// .fn-info{display:flex;flex-direction:column;justify-content:space-between;gap:4px;color:#12285a}
// .fn-info label{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:bold}
// .fn-info label span{white-space:nowrap;min-width:70px}
// .fn-info label input,.fn-info label select{flex:1;border-bottom:1px dotted #555;font-weight:normal;font-size:14px}
// .fn-table{width:100%;border-collapse:collapse;border:2px solid #0b4086;min-width:820px;table-layout:fixed}
// .fn-table th{border:1px solid #fff;font-size:13px;padding:6px 4px;line-height:1.4}
// .fn-table th.dark{background:#0b4086;color:#fff;font-size:16px}
// .fn-table th.light{background:#c3defa;color:#12306b}
// .fn-table th.num{width:46px}
// .fn-table th.total{width:120px}
// .fn-table th.total div:last-child{font-size:15px}
// .fn-table .max{font-weight:normal;font-size:13px}
// .fn-table td{border:1px solid #2b5aa3;height:26px;padding:0;text-align:center}
// .fn-table td.num{font-weight:bold;font-size:13px;width:46px;border-left:0}
// .fn-table td.nom{text-align:left}
// .fn-table td.nom input,.fn-table td input.note{width:100%;height:100%;padding:2px 6px;box-sizing:border-box;font-size:14px;text-align:left}
// .fn-table td input.note{text-align:center}
// .fn-table td input.note.over{color:#c00;font-weight:bold;background:#ffe5e5}
// .fn-table td.tot{font-weight:bold;font-size:14px;background:#f2f7fd}
// .fn-table tbody tr:nth-child(even) td:not(.num){background-color:#fbfdff}
// @media print{
//   .no-print{display:none!important}
//   .fn-page{background:#fff;padding:0}
//   .fn-sheet{box-shadow:none;max-width:none;overflow:visible}
//   @page{size:A4 landscape;margin:8mm}
// }
// `;


import { useState, useEffect, useMemo } from "react";
import { loadCourses, loadStudents, type Course } from "../bulletinStore";
import { useAuth } from "@/context/AuthContext";

/* ---------- Sections (RÉFORME) ---------- */
type SectionOption = { value: string; displayName: string };
const FALLBACK_SECTIONS: SectionOption[] = [
  { value: "INFIRMIERE",             displayName: "Section Infirmière de la RÉFORME" },
  { value: "ACCOUCHEUSE",            displayName: "Section Accoucheuse de la RÉFORME" },
  { value: "ASSISTANT_PHARMACIE",    displayName: "Section Assistant en pharmacie de la RÉFORME" },
  { value: "SANTE_MENTALE",          displayName: "Section Santé Mentale de la RÉFORME" },
  { value: "TECHNIQUE_LABORATOIRE",  displayName: "Section Technique de Laboratoire de la RÉFORME" },
];

/* Fixed class levels for IEM/Virunga */
const CLASSES: string[] = ["1ère", "2ème", "3ème", "4ème"];

/* Fallback course list — used when the API returns 0 courses */
const FALLBACK_COURSES: Course[] = [
  { id: "c-comm-orale",  name: "Communication orale",  teacherId: "", periodMax: 10, examMax: 20 },
  { id: "c-orth-gram",   name: "Orth. & Grammaire",    teacherId: "", periodMax: 10, examMax: 20 },
  { id: "c-prod-ecrite", name: "Production écrite",    teacherId: "", periodMax: 10, examMax: 20 },
  { id: "c-lect-expl",   name: "Lecture expliquée",    teacherId: "", periodMax: 10, examMax: 20 },
  { id: "c-comm-creole", name: "Communication créole", teacherId: "", periodMax: 10, examMax: 20 },
];

/* ---------- Courses columns ---------- */
const COURSE_NAMES = [
  "Communication orale",
  "Orth. & Grammaire",
  "Production écrite",
  "Lecture expliquée",
  "Communication créole",
];
const MAXES = [10, 10, 10, 10, 10];
const KEY_PREFIX = "notes-iem-virunga";

const n = (v: any) => (v === "" || isNaN(+v) ? 0 : +v);
const blankNotes = () => COURSE_NAMES.map(() => "");

type Row = { studentId: string; nom: string; notes: string[] };

export default function TeacherScores() {
  const { user } = useAuth() as any;

  const displayName =
    (user?.firstName || user?.lastName)
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.name || user?.username || "";

  const [sections, setSections]   = useState<SectionOption[]>(FALLBACK_SECTIONS);
  const [classes]                 = useState<string[]>(CLASSES);
  const [courses, setCourses]     = useState<Course[]>([]);
  const [section, setSection]     = useState(FALLBACK_SECTIONS[0].value);
  const [classe, setClasse]       = useState("");
  const [courseId, setCourseId]   = useState("");
  const [teacher, setTeacher]     = useState(displayName);
  const [trimestre, setTrimestre] = useState("");
  const [date, setDate]           = useState("");
  const [rows, setRows]           = useState<Row[]>([]);
  const [saved, setSaved]         = useState(false);
  const [debug, setDebug]         = useState("");

  const storageKey = useMemo(
    () => `${KEY_PREFIX}:${section || "all"}:${classe || "all"}:${courseId || "none"}`,
    [section, classe, courseId]
  );

  /* ---- Load classes & courses once ---- */
  useEffect(() => {
    loadStudents()
      .then((students) => {
        
        
        setClasse(CLASSES[0]);
      })
      .catch((e) => setDebug(`students error: ${e}`));

    loadCourses()
      .then((list) => {
        setDebug(`courses API returned ${list.length} course(s)`);
        setCourses(list);
        if (list[0]) setCourseId(list[0].id);
      })
      .catch((e) => setDebug(`courses error: ${e}`));
  }, []);

  /* ---- Filter courses to the logged-in teacher (when teacherId exists) ---- */
  const myCourses = useMemo(() => {
    if (!courses.length) return [];
    const hasTeacherIds = courses.some((c) => c.teacherId && c.teacherId.length > 0);
    if (!hasTeacherIds) return courses;                        // fallback: show all
    const mine = courses.filter((c) => c.teacherId === user?.id);
    return mine.length ? mine : courses;                       // if none matched, still show all
  }, [courses, user]);

  /* When the filtered course list changes, keep the selection valid */
  useEffect(() => {
    if (!myCourses.find((c) => c.id === courseId) && myCourses[0]) {
      setCourseId(myCourses[0].id);
    }
  }, [myCourses, courseId]);

  /* ---- Reload rows when section / class / course changes ---- */
  useEffect(() => {
    if (!classe) return;
    loadStudents().then((students) => {
      const inClass = students.filter((s: any) => {
        const sClasse  = s.classe ?? "";
        const sSection = s.section ?? null;
        if (sClasse !== classe) return false;
        if (sSection && sSection !== section) return false;
        return true;
      });

      let savedData: any = null;
      try {
        const raw = localStorage.getItem(storageKey);
        savedData = raw ? JSON.parse(raw) : null;
      } catch {}

      setTeacher(savedData?.teacher ?? displayName);
      setTrimestre(savedData?.trimestre ?? "");
      setDate(savedData?.date ?? "");

      const mappedRows: Row[] = inClass.map((s) => {
        const existing = savedData?.rows?.find((r: Row) => r.studentId === s.id);
        return {
          studentId: s.id,
          nom: s.name,
          notes: existing?.notes ?? blankNotes(),
        };
      });

      if (savedData?.rows) {
        for (const r of savedData.rows) {
          if (!mappedRows.find((x) => x.studentId === r.studentId)) {
            mappedRows.push(r);
          }
        }
      }

      setRows(mappedRows);
      setSaved(false);
    });
  }, [classe, storageKey, displayName]);

  /* ---- Mutations ---- */
  const setNote = (ri: number, ci: number, v: string) => {
    setRows((p) =>
      p.map((r, i) => (i === ri ? { ...r, notes: r.notes.map((x, j) => (j === ci ? v : x)) } : r))
    );
    setSaved(false);
  };
  const setNom = (ri: number, v: string) => {
    setRows((p) => p.map((r, i) => (i === ri ? { ...r, nom: v } : r)));
    setSaved(false);
  };
  const addRow = () => {
    setRows((p) => [...p, { studentId: `manual-${Date.now()}`, nom: "", notes: blankNotes() }]);
    setSaved(false);
  };
  const delRow = () => {
    setRows((p) => p.slice(0, -1));
    setSaved(false);
  };

  /* ---- Save ---- */
  function save() {
    const payload = {
      section,
      classe,
      courseId,
      courseName: myCourses.find((c) => c.id === courseId)?.name ?? "",
      teacher,
      trimestre,
      date,
      rows,
      maxes: MAXES,
      courseNames: COURSE_NAMES,
      savedAt: Date.now(),
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      setSaved(true);
    } catch (e) {
      console.error(e);
      alert("Échec de l'enregistrement (stockage plein ?)");
    }
  }

  function reset() {
    if (!window.confirm("Effacer toutes les données de cette feuille ?")) return;
    localStorage.removeItem(storageKey);
    setRows((p) => p.map((r) => ({ ...r, notes: blankNotes() })));
    setTeacher(displayName);
    setTrimestre("");
    setDate("");
    setSaved(false);
  }

  const totalMax = MAXES.reduce((a, b) => a + n(b), 0);

  return (
    <div className="fn-page">
      <style>{css}</style>

      <div className="fn-tools no-print">
        <button onClick={() => window.print()}>Imprimer / PDF</button>
        <button onClick={save} style={{ background: saved ? "#15803d" : "#0b4086" }}>
          {saved ? "Enregistré ✓" : "Enregistrer"}
        </button>
        <button onClick={addRow}>+ Ajouter une ligne</button>
        <button onClick={delRow}>− Retirer la dernière ligne</button>
        <button className="danger" onClick={reset}>Réinitialiser</button>
        {debug && <span style={{ color: "#64748b", fontSize: 12, marginLeft: 8 }}>{debug}</span>}
      </div>

      <div className="fn-sheet">
        {/* ---------- en-tête ---------- */}
        <div className="fn-head">
          <div className="fn-box fn-school">
            <div className="school">IEM/VIRUNGA</div>
            <div className="addr">Institut d'Enseignement Médical du Virunga</div>
            <div className="addr">Tél. : +243 · Nord-Kivu, RDC</div>
          </div>

          <div className="fn-title">
            <div className="t1">FEUILLE DE NOTES</div>
            <div className="t2">EXAMEN</div>
          </div>

          <div className="fn-box fn-info">
            <label>
              <span>Section :</span>
              <select value={section} onChange={(e) => { setSection(e.target.value); setSaved(false); }}>
                {sections.map((s) => (
                  <option key={s.value} value={s.value}>{s.displayName}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Classe :</span>
              <select value={classe} onChange={(e) => setClasse(e.target.value)}>
                {classes.length === 0 && <option value="">— Aucune classe —</option>}
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Cours :</span>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                {myCourses.length === 0 && <option value="">— Aucun cours —</option>}
                {myCourses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Prof :</span>
              <input value={teacher} onChange={(e) => { setTeacher(e.target.value); setSaved(false); }} />
            </label>

            <label>
              <span>Trimestre :</span>
              <input value={trimestre} onChange={(e) => { setTrimestre(e.target.value); setSaved(false); }} />
            </label>

            <label>
              <span>Date :</span>
              <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setSaved(false); }} />
            </label>
          </div>
        </div>

        {/* ---------- tableau ---------- */}
        <table className="fn-table">
          <thead>
            <tr>
              <th className="dark num">N°</th>
              <th className="dark nom">Nom et Prénom</th>
              {COURSE_NAMES.map((c, i) => (
                <th key={c} className="light">
                  <div>{c}</div>
                  <div className="max">( / {MAXES[i]} )</div>
                </th>
              ))}
              <th className="dark total">
                <div>Total</div>
                <div>( / {totalMax} )</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const total = r.notes.reduce((a, b) => a + n(b), 0);
              const filled = r.notes.some((x) => x !== "");
              return (
                <tr key={r.studentId || ri}>
                  <td className="num">{ri + 1}</td>
                  <td className="nom">
                    <input value={r.nom} onChange={(e) => setNom(ri, e.target.value)} />
                  </td>
                  {r.notes.map((v, ci) => (
                    <td key={ci}>
                      <input
                        className={`note ${n(v) > MAXES[ci] ? "over" : ""}`}
                        inputMode="decimal"
                        value={v}
                        onChange={(e) => setNote(ri, ci, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="tot">{filled ? total : ""}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={COURSE_NAMES.length + 3} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>
                  Aucun élève dans cette classe. Choisissez une autre classe ou ajoutez une ligne.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const css = `
.fn-page{background:#e8ecf2;padding:16px;min-height:100vh;font-family:Arial,Helvetica,sans-serif}
.fn-tools{max-width:1100px;margin:0 auto 12px;display:flex;gap:8px;flex-wrap:wrap}
.fn-tools button{font:inherit;font-size:13px;padding:6px 12px;border:1px solid #0b4086;background:#0b4086;color:#fff;border-radius:4px;cursor:pointer}
.fn-tools button.danger{background:#fff;color:#a32020;border-color:#a32020}
.fn-sheet{max-width:1100px;margin:0 auto;background:#fff;border-radius:18px;padding:14px 14px 18px;box-shadow:0 2px 10px rgba(0,0,0,.18);overflow-x:auto}
.fn-sheet input{font:inherit;border:0;background:transparent;outline:none;min-width:0;color:inherit}
.fn-sheet input:focus{background:#fff9d6}
.fn-sheet select{font:inherit;border:1px solid #cbd5e1;border-radius:4px;padding:2px 6px;background:#fff;max-width:100%}
.fn-head{display:grid;grid-template-columns:1.05fr 1fr 1.4fr;gap:20px;align-items:stretch;margin-bottom:14px;min-width:900px}
.fn-box{border:1.5px solid #2b5aa3;border-radius:10px;padding:8px 12px}
.fn-school{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#0b2f66;text-align:center}
.fn-school .school{font-family:"Times New Roman",Georgia,serif;font-size:25px;font-weight:bold;color:#12285a}
.fn-school .addr{font-size:13px;font-weight:600}
.fn-title{background:#0b4086;color:#fff;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 10px;border:2px solid #07295a;text-align:center}
.fn-title .t1{font-family:"Times New Roman",Georgia,serif;font-size:26px;font-weight:bold}
.fn-title .t2{font-size:24px;font-weight:bold;letter-spacing:.5px}
.fn-info{display:flex;flex-direction:column;justify-content:space-between;gap:4px;color:#12285a}
.fn-info label{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:bold}
.fn-info label span{white-space:nowrap;min-width:72px}
.fn-info label input,.fn-info label select{flex:1;border-bottom:1px dotted #555;font-weight:normal;font-size:13px}
.fn-table{width:100%;border-collapse:collapse;border:2px solid #0b4086;min-width:820px;table-layout:fixed}
.fn-table th{border:1px solid #fff;font-size:13px;padding:6px 4px;line-height:1.4}
.fn-table th.dark{background:#0b4086;color:#fff;font-size:16px}
.fn-table th.light{background:#c3defa;color:#12306b}
.fn-table th.num{width:46px}
.fn-table th.total{width:120px}
.fn-table th.total div:last-child{font-size:15px}
.fn-table .max{font-weight:normal;font-size:13px}
.fn-table td{border:1px solid #2b5aa3;height:26px;padding:0;text-align:center}
.fn-table td.num{font-weight:bold;font-size:13px;width:46px;border-left:0}
.fn-table td.nom{text-align:left}
.fn-table td.nom input,.fn-table td input.note{width:100%;height:100%;padding:2px 6px;box-sizing:border-box;font-size:14px;text-align:left}
.fn-table td input.note{text-align:center}
.fn-table td input.note.over{color:#c00;font-weight:bold;background:#ffe5e5}
.fn-table td.tot{font-weight:bold;font-size:14px;background:#f2f7fd}
.fn-table tbody tr:nth-child(even) td:not(.num){background-color:#fbfdff}
@media print{
  .no-print{display:none!important}
  .fn-page{background:#fff;padding:0}
  .fn-sheet{box-shadow:none;max-width:none;overflow:visible}
  @page{size:A4 landscape;margin:8mm}
}
`;