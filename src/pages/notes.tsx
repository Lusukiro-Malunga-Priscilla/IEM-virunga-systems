

// // import { useState, useEffect } from "react";

// // const uid = () => Math.random().toString(36).slice(2, 9);
// // const num = (v: any) => (v === "" || v == null || isNaN(+v) ? 0 : +v);
// // const STORAGE_KEY = "bulletin-rdc-2024-2025";

// // const mk = (name: string) => ({ id: uid(), name, s: ["", "", "", "", "", ""], rep: { pct: "", sign: "" } });

// // const initialData = () => ({
// //   header: {
// //     id: "", province: "", ville: "", commune: "", ecole: "", code: "",
// //     eleve: "", sexe: "", lieu: "", dateNaiss: "", classe: "", permanent: "",
// //     annee: "2024 - 2025", niveau: "1ère, 2ème, 3ème, 4ème Année Humanités / Normale",
// //   },
// //   groups: [
// //     { id: uid(), max: [10, 10, 20, 10, 10, 20], subjects: ["Religion", "Éducation à la Vie", "Sol. civ. & morale"].map(mk) },
// //     { id: uid(), max: [20, 20, 40, 20, 20, 40], subjects: ["Biologie", "Dessin", "Géographie", "Histoire", "Informatique", "Musique", "Langues nationales", "Sport / Écon. mode"].map(mk) },
// //     { id: uid(), max: [40, 40, 80, 40, 40, 80], subjects: ["Anglais", "Didactique des disciplines", "Didactique plurielle", "Pédagogie", "Physique", "Psychologie"].map(mk) },
// //     { id: uid(), max: [60, 60, 120, 60, 60, 120], subjects: ["Français", "Mathématiques", "Philosophie"].map(mk) },
// //   ],
// //   footer: { application: "", conduite: "", place: "", surEleves: "", decision: "", lieuFait: "", dateFait: "", chefEtab: "" },
// // });

// // function Cell({ value, onChange, bold, readOnly, wide }: any) {
// //   return (
// //     <input
// //       className={`cell ${bold ? "bold" : ""} ${wide ? "wide" : ""}`}
// //       value={value}
// //       readOnly={readOnly}
// //       inputMode={wide ? "text" : "decimal"}
// //       onChange={(e) => onChange && onChange(e.target.value)}
// //     />
// //   );
// // }

// // function Field({ label, value, onChange, type = "text", w }: any) {
// //   return (
// //     <label className="field" style={{ flex: w || 1 }}>
// //       <span>{label}</span>
// //       <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
// //     </label>
// //   );
// // }

// // export default function Notes() {
// //   const [data, setData] = useState<any>(() => {
// //     try {
// //       const saved = localStorage.getItem(STORAGE_KEY);
// //       return saved ? JSON.parse(saved) : initialData();
// //     } catch {
// //       return initialData();
// //     }
// //   });

// //   useEffect(() => {
// //     try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
// //   }, [data]);

// //   const { header, groups, footer } = data;

// //   const setHeader = (k: string, v: any) => setData((d: any) => ({ ...d, header: { ...d.header, [k]: v } }));
// //   const setFooter = (k: string, v: any) => setData((d: any) => ({ ...d, footer: { ...d.footer, [k]: v } }));
// //   const updGroup = (gid: string, fn: any) =>
// //     setData((d: any) => ({ ...d, groups: d.groups.map((g: any) => (g.id === gid ? fn(g) : g)) }));
// //   const setMax = (gid: string, i: number, v: any) => updGroup(gid, (g: any) => ({ ...g, max: g.max.map((m: any, j: number) => (j === i ? v : m)) }));
// //   const setScore = (gid: string, sid: string, i: number, v: any) =>
// //     updGroup(gid, (g: any) => ({
// //       ...g,
// //       subjects: g.subjects.map((s: any) => (s.id === sid ? { ...s, s: s.s.map((x: any, j: number) => (j === i ? v : x)) } : s)),
// //     }));
// //   const setSubj = (gid: string, sid: string, patch: any) =>
// //     updGroup(gid, (g: any) => ({ ...g, subjects: g.subjects.map((s: any) => (s.id === sid ? { ...s, ...patch } : s)) }));
// //   const addSubject = (gid: string) => updGroup(gid, (g: any) => ({ ...g, subjects: [...g.subjects, mk("Nouveau cours")] }));
// //   const delSubject = (gid: string, sid: string) =>
// //     updGroup(gid, (g: any) => ({ ...g, subjects: g.subjects.filter((s: any) => s.id !== sid) }));
// //   const addGroup = () =>
// //     setData((d: any) => ({ ...d, groups: [...d.groups, { id: uid(), max: [10, 10, 20, 10, 10, 20], subjects: [mk("Nouveau cours")] }] }));
// //   const delGroup = (gid: string) => setData((d: any) => ({ ...d, groups: d.groups.filter((g: any) => g.id !== gid) }));
// //   const reset = () => window.confirm("Effacer toutes les données ?") && setData(initialData());

// //   const sem1 = (a: any) => num(a[0]) + num(a[1]) + num(a[2]);
// //   const sem2 = (a: any) => num(a[3]) + num(a[4]) + num(a[5]);
// //   const tg = (a: any) => sem1(a) + sem2(a);

// //   const maxGen = groups.reduce(
// //     (acc: any, g: any) => acc.map((v: any, i: number) => v + num(g.max[i]) * g.subjects.length),
// //     [0, 0, 0, 0, 0, 0]
// //   );
// //   const totGen = groups.reduce(
// //     (acc: any, g: any) => g.subjects.reduce((a2: any, s: any) => a2.map((v: any, i: number) => v + num(s.s[i])), acc),
// //     [0, 0, 0, 0, 0, 0]
// //   );
// //   const maxTG = sem1(maxGen) + sem2(maxGen);
// //   const totTG = sem1(totGen) + sem2(totGen);
// //   const pct = (t: number, m: number) => (m ? ((t / m) * 100).toFixed(1) : "");
// //   const pctArr = totGen.map((t: number, i: number) => pct(t, maxGen[i]));

// //   const nineCols = (a: any, onChange: any, { bold, readOnly }: any = {}) => [
// //     <td key="0"><Cell value={a[0]} onChange={(v: any) => onChange(0, v)} bold={bold} readOnly={readOnly} /></td>,
// //     <td key="1"><Cell value={a[1]} onChange={(v: any) => onChange(1, v)} bold={bold} readOnly={readOnly} /></td>,
// //     <td key="2"><Cell value={a[2]} onChange={(v: any) => onChange(2, v)} bold={bold} readOnly={readOnly} /></td>,
// //     <td key="3" className="calc">{sem1(a) || ""}</td>,
// //     <td key="4"><Cell value={a[3]} onChange={(v: any) => onChange(3, v)} bold={bold} readOnly={readOnly} /></td>,
// //     <td key="5"><Cell value={a[4]} onChange={(v: any) => onChange(4, v)} bold={bold} readOnly={readOnly} /></td>,
// //     <td key="6"><Cell value={a[5]} onChange={(v: any) => onChange(5, v)} bold={bold} readOnly={readOnly} /></td>,
// //     <td key="7" className="calc">{sem2(a) || ""}</td>,
// //     <td key="8" className="calc">{tg(a) || ""}</td>,
// //   ];

// //   return (
// //     <div className="page">
// //       <style>{css}</style>

// //       <div className="toolbar no-print">
// //         <button onClick={() => window.print()}>Imprimer / PDF</button>
// //         <button onClick={() => addGroup()}>+ Ajouter un groupe (MAXIMA)</button>
// //         <button className="danger" onClick={reset}>Réinitialiser</button>
// //         <span className="hint">Toutes les cases sont modifiables. Les totaux se calculent automatiquement.</span>
// //       </div>

// //       <div className="sheet">
// //         <div className="top">
// //           <div className="flag" aria-hidden="true">★</div>
// //           <div className="title-block">
// //             <div>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</div>
// //             <div>MINISTÈRE DE L'ÉDUCATION NATIONALE</div>
// //             <div>ET NOUVELLE CITOYENNETÉ</div>
// //           </div>
// //           <div className="emblem" aria-hidden="true">RDC</div>
// //         </div>

// //         <div className="idline"><Field label="N° ID" value={header.id} onChange={(v: any) => setHeader("id", v)} /></div>

// //         <div className="box">
// //           <div className="box-title">PROVINCE ÉDUCATIONNELLE :
// //             <input value={header.province} onChange={(e) => setHeader("province", e.target.value)} />
// //           </div>
// //           <div className="cols">
// //             <div className="col">
// //               <Field label="VILLE" value={header.ville} onChange={(v: any) => setHeader("ville", v)} />
// //               <Field label="COMMUNE / TÉL." value={header.commune} onChange={(v: any) => setHeader("commune", v)} />
// //               <Field label="ÉCOLE" value={header.ecole} onChange={(v: any) => setHeader("ecole", v)} />
// //               <Field label="CODE" value={header.code} onChange={(v: any) => setHeader("code", v)} />
// //             </div>
// //             <div className="col">
// //               <div className="row2">
// //                 <Field label="ÉLÈVE" value={header.eleve} onChange={(v: any) => setHeader("eleve", v)} w={3} />
// //                 <Field label="SEXE" value={header.sexe} onChange={(v: any) => setHeader("sexe", v)} w={1} />
// //               </div>
// //               <div className="row2">
// //                 <Field label="NÉ(E) À" value={header.lieu} onChange={(v: any) => setHeader("lieu", v)} w={2} />
// //                 <Field label="LE" type="date" value={header.dateNaiss} onChange={(v: any) => setHeader("dateNaiss", v)} w={2} />
// //               </div>
// //               <Field label="CLASSE" value={header.classe} onChange={(v: any) => setHeader("classe", v)} />
// //               <Field label="N° PERM." value={header.permanent} onChange={(v: any) => setHeader("permanent", v)} />
// //             </div>
// //           </div>
// //         </div>

// //         <h2 className="bulletin-title">
// //           BULLETIN DE LA{" "}
// //           <input className="inline" style={{ width: "42%" }} value={header.niveau} onChange={(e) => setHeader("niveau", e.target.value)} />
// //           {" "}ANNÉE SCOLAIRE{" "}
// //           <input className="inline" style={{ width: 90 }} value={header.annee} onChange={(e) => setHeader("annee", e.target.value)} />
// //         </h2>

// //         <div className="scroll">
// //           <table className="grades">
// //             <thead>
// //               <tr>
// //                 <th rowSpan={3} className="branch">BRANCHES</th>
// //                 <th colSpan={4}>PREMIER SEMESTRE</th>
// //                 <th colSpan={4}>SECOND SEMESTRE</th>
// //                 <th rowSpan={3}>T.G.</th>
// //                 <th colSpan={2}>EXAMEN DE REPÊCHAGE</th>
// //                 <th rowSpan={3} className="no-print" />
// //               </tr>
// //               <tr>
// //                 <th colSpan={2}>TR. JOURNAL</th><th rowSpan={2}>EXAM.</th><th rowSpan={2}>TOT.</th>
// //                 <th colSpan={2}>TR. JOURNAL</th><th rowSpan={2}>EXAM.</th><th rowSpan={2}>TOT.</th>
// //                 <th rowSpan={2}>%</th><th rowSpan={2}>SIGN. PROF</th>
// //               </tr>
// //               <tr>
// //                 <th>1ère P.</th><th>2ème P.</th><th>3ème P.</th><th>4ème P.</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {groups.map((g: any) => (
// //                 <GroupRows
// //                   key={g.id}
// //                   g={g}
// //                   nineCols={nineCols}
// //                   setMax={setMax}
// //                   setScore={setScore}
// //                   setSubj={setSubj}
// //                   addSubject={addSubject}
// //                   delSubject={delSubject}
// //                   delGroup={delGroup}
// //                 />
// //               ))}

// //               <tr className="total-row">
// //                 <td className="label">MAXIMA GÉNÉRAUX</td>
// //                 {nineCols(maxGen, () => {}, { bold: true, readOnly: true })}
// //                 <td colSpan={2} className="shade" /><td className="no-print" />
// //               </tr>
// //               <tr className="total-row">
// //                 <td className="label">TOTAL</td>
// //                 {nineCols(totGen, () => {}, { bold: true, readOnly: true })}
// //                 <td colSpan={2} className="shade" /><td className="no-print" />
// //               </tr>
// //               <tr className="total-row">
// //                 <td className="label">POURCENTAGE</td>
// //                 <td className="calc">{pctArr[0]}</td><td className="calc">{pctArr[1]}</td><td className="calc">{pctArr[2]}</td>
// //                 <td className="calc">{pct(sem1(totGen), sem1(maxGen))}</td>
// //                 <td className="calc">{pctArr[3]}</td><td className="calc">{pctArr[4]}</td><td className="calc">{pctArr[5]}</td>
// //                 <td className="calc">{pct(sem2(totGen), sem2(maxGen))}</td>
// //                 <td className="calc">{pct(totTG, maxTG)}</td>
// //                 <td colSpan={2} className="shade" /><td className="no-print" />
// //               </tr>
// //               <tr>
// //                 <td className="label">APPLICATION</td>
// //                 <td colSpan={8}><Cell wide value={footer.application} onChange={(v: any) => setFooter("application", v)} /></td>
// //                 <td colSpan={3} className="shade" /><td className="no-print" />
// //               </tr>
// //               <tr>
// //                 <td className="label">CONDUITE</td>
// //                 <td colSpan={8}><Cell wide value={footer.conduite} onChange={(v: any) => setFooter("conduite", v)} /></td>
// //                 <td colSpan={3} className="shade" /><td className="no-print" />
// //               </tr>
// //               <tr>
// //                 <td className="label">PLACE / ÉLÈVES</td>
// //                 <td colSpan={4}><Cell wide value={footer.place} onChange={(v: any) => setFooter("place", v)} /></td>
// //                 <td colSpan={4} className="sur">sur&nbsp;<Cell value={footer.surEleves} onChange={(v: any) => setFooter("surEleves", v)} />&nbsp;élèves</td>
// //                 <td colSpan={3} className="shade" /><td className="no-print" />
// //               </tr>
// //               <tr>
// //                 <td className="label">SIGNATURE DU RESPONSABLE</td>
// //                 <td colSpan={11}><Cell wide value={footer.chefEtab} onChange={(v: any) => setFooter("chefEtab", v)} /></td>
// //                 <td className="no-print" />
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>

// //         <div className="decision">
// //           <p>
// //             - L'élève passe dans la classe supérieure ( ) / L'élève double la classe ( ) /
// //             L'élève est à refaire : <input className="inline" style={{ width: 180 }} value={footer.decision} onChange={(e) => setFooter("decision", e.target.value)} />
// //           </p>
// //           <p>
// //             Fait à <input className="inline" style={{ width: 130 }} value={footer.lieuFait} onChange={(e) => setFooter("lieuFait", e.target.value)} />
// //             , le <input className="inline" type="date" style={{ width: 140 }} value={footer.dateFait} onChange={(e) => setFooter("dateFait", e.target.value)} />
// //           </p>
// //           <div className="sign">
// //             <div>Signature de l'élève</div>
// //             <div>Sceau de l'École</div>
// //             <div>Nom et signature du Chef d'Établissement</div>
// //           </div>
// //           <small>Interdiction formelle de reproduire ce bulletin sous peine des sanctions prévues par la loi.</small>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function GroupRows({ g, nineCols, setMax, setScore, setSubj, addSubject, delSubject, delGroup }: any) {
// //   return (
// //     <>
// //       <tr className="maxima">
// //         <td className="label">MAXIMA</td>
// //         {nineCols(g.max, (i: number, v: any) => setMax(g.id, i, v), { bold: true })}
// //         <td colSpan={2} className="shade" />
// //         <td className="no-print">
// //           <button className="mini danger" title="Supprimer le groupe" onClick={() => delGroup(g.id)}>×</button>
// //         </td>
// //       </tr>
// //       {g.subjects.map((s: any) => (
// //         <tr key={s.id}>
// //           <td className="name"><Cell wide value={s.name} onChange={(v: any) => setSubj(g.id, s.id, { name: v })} /></td>
// //           {nineCols(s.s, (i: number, v: any) => setScore(g.id, s.id, i, v))}
// //           <td><Cell value={s.rep.pct} onChange={(v: any) => setSubj(g.id, s.id, { rep: { ...s.rep, pct: v } })} /></td>
// //           <td><Cell wide value={s.rep.sign} onChange={(v: any) => setSubj(g.id, s.id, { rep: { ...s.rep, sign: v } })} /></td>
// //           <td className="no-print">
// //             <button className="mini danger" title="Supprimer le cours" onClick={() => delSubject(g.id, s.id)}>×</button>
// //           </td>
// //         </tr>
// //       ))}
// //       <tr className="no-print">
// //         <td colSpan={13}>
// //           <button className="mini" onClick={() => addSubject(g.id)}>+ Ajouter un cours à ce groupe</button>
// //         </td>
// //       </tr>
// //     </>
// //   );
// // }

// // const css = `
// // .page{font-family:"Times New Roman",Georgia,serif;background:#e9e7e1;padding:16px;min-height:100vh;color:#111}
// // .toolbar{max-width:1000px;margin:0 auto 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
// // .toolbar button,.mini{font:inherit;font-size:13px;padding:6px 12px;border:1px solid #1d3b78;background:#1d3b78;color:#fff;border-radius:4px;cursor:pointer}
// // .toolbar button.danger,.mini.danger{background:#fff;color:#a32020;border-color:#a32020}
// // .mini{padding:2px 8px;background:#fff;color:#1d3b78;font-size:12px}
// // .hint{font-size:12px;color:#555}
// // .sheet{max-width:1000px;margin:0 auto;background:#fff;border:1px solid #888;padding:20px 24px;box-shadow:0 2px 10px rgba(0,0,0,.15)}
// // .top{display:flex;align-items:center;justify-content:space-between;gap:12px}
// // .title-block{text-align:center;font-weight:bold;font-size:14px;line-height:1.4;flex:1}
// // .flag{width:64px;height:44px;background:linear-gradient(135deg,#0a7cff 55%,#f7d618 55% 60%,#ce1021 60% 72%,#f7d618 72% 77%,#0a7cff 77%);color:#f7d618;display:flex;align-items:center;justify-content:center;font-size:20px}
// // .emblem{width:56px;height:56px;border:2px solid #1d3b78;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#1d3b78}
// // .idline{margin:8px 0}
// // .box{border:1.5px solid #111;padding:6px 10px}
// // .box-title{font-weight:bold;font-size:13px;display:flex;gap:6px;align-items:center;border-bottom:1px solid #111;padding-bottom:4px;margin-bottom:4px}
// // .box-title input{flex:1}
// // .cols{display:flex;gap:18px}.col{flex:1;display:flex;flex-direction:column;gap:2px}
// // .row2{display:flex;gap:10px}
// // .field{display:flex;gap:6px;align-items:baseline;font-size:12px;font-weight:bold}
// // .field span{white-space:nowrap}
// // input{font:inherit}
// // .field input,.box-title input,.inline{border:0;border-bottom:1px dotted #555;background:transparent;font-size:13px;padding:1px 3px;min-width:0;width:100%;outline:none}
// // .field input:focus,.box-title input:focus,.inline:focus,.cell:focus{background:#fff8d6}
// // .inline{width:auto;display:inline-block}
// // .bulletin-title{font-size:13px;text-align:center;margin:12px 0 6px;font-weight:bold}
// // .scroll{overflow-x:auto}
// // .grades{width:100%;border-collapse:collapse;font-size:11px;min-width:820px}
// // .grades th,.grades td{border:1px solid #111;padding:0;text-align:center}
// // .grades th{padding:3px 2px;font-size:10px;background:#f3f1ea}
// // .grades th.branch{width:150px}
// // .label{text-align:left!important;font-weight:bold;padding:2px 4px!important;font-size:11px;background:#f3f1ea}
// // .maxima td{background:#ecebe5}
// // .name{text-align:left!important}
// // .calc{background:#fafaf7;font-weight:bold;min-width:30px;padding:0 2px}
// // .shade{background:repeating-linear-gradient(45deg,#ddd,#ddd 3px,#fff 3px,#fff 6px)}
// // .total-row .calc{background:#ecebe5}
// // .sur{text-align:left!important;padding:0 6px!important;font-size:11px}
// // .sur .cell{width:40px;display:inline-block}
// // .cell{width:100%;border:0;background:transparent;text-align:center;font-size:12px;padding:3px 1px;outline:none;box-sizing:border-box;min-width:26px}
// // .cell.wide{text-align:left;min-width:60px;padding-left:4px}
// // .cell.bold{font-weight:bold}
// // .decision{margin-top:12px;font-size:12px}
// // .decision p{margin:6px 0}
// // .sign{display:flex;justify-content:space-between;margin:28px 0 8px;font-weight:bold;font-size:12px}
// // .decision small{font-size:10px;font-style:italic;display:block;text-align:center}
// // @media print{
// //   .no-print{display:none!important}
// //   .page{background:#fff;padding:0}
// //   .sheet{box-shadow:none;border:0;padding:0;max-width:none}
// //   .scroll{overflow:visible}
// // }
// // @media (max-width:640px){.cols{flex-direction:column}.sheet{padding:12px}}
// // `;

// import { useState, useEffect, useMemo } from "react";
// import {
//   loadCourses, loadStudents,
//   type Course, type Student,
// } from "./bulletinStore";
// import { useAuth } from "@/context/AuthContext";

// /* ---------- Sections ---------- */
// type SectionOption = { value: string; displayName: string };
// const FALLBACK_SECTIONS: SectionOption[] = [
//   { value: "INFIRMIERE",            displayName: "Section Infirmière de la RÉFORME" },
//   { value: "ACCOUCHEUSE",           displayName: "Section Accoucheuse de la RÉFORME" },
//   { value: "ASSISTANT_PHARMACIE",   displayName: "Section Assistant en pharmacie de la RÉFORME" },
//   { value: "SANTE_MENTALE",         displayName: "Section Santé Mentale de la RÉFORME" },
//   { value: "TECHNIQUE_LABORATOIRE", displayName: "Section Technique de Laboratoire de la RÉFORME" },
// ];

// const CLASSES: string[] = ["1ère", "2ème", "3ème", "4ème"];

// /* ---------- Bulletin helpers ---------- */
// const uid = () => Math.random().toString(36).slice(2, 9);
// const num = (v: any) => (v === "" || v == null || isNaN(+v) ? 0 : +v);
// const STORAGE_KEY = (section: string, classe: string, studentId: string) =>
//   `bulletin-iem-${section}-${classe}-${studentId}`;

// const mk = (name: string) => ({ id: uid(), name, s: ["", "", "", "", "", ""], rep: { pct: "", sign: "" } });

// const initialData = () => ({
//   header: {
//     id: "", province: "", ville: "", commune: "", ecole: "", code: "",
//     eleve: "", sexe: "", lieu: "", dateNaiss: "", classe: "", permanent: "",
//     annee: "2024 - 2025", niveau: "1ère, 2ème, 3ème, 4ème Année Humanités / Normale",
//   },
//   groups: [
//     { id: uid(), max: [10, 10, 20, 10, 10, 20], subjects: ["Religion", "Éducation à la Vie", "Sol. civ. & morale"].map(mk) },
//     { id: uid(), max: [20, 20, 40, 20, 20, 40], subjects: ["Biologie", "Dessin", "Géographie", "Histoire", "Informatique", "Musique", "Langues nationales", "Sport / Écon. mode"].map(mk) },
//     { id: uid(), max: [40, 40, 80, 40, 40, 80], subjects: ["Anglais", "Didactique des disciplines", "Didactique plurielle", "Pédagogie", "Physique", "Psychologie"].map(mk) },
//     { id: uid(), max: [60, 60, 120, 60, 60, 120], subjects: ["Français", "Mathématiques", "Philosophie"].map(mk) },
//   ],
//   footer: { application: "", conduite: "", place: "", surEleves: "", decision: "", lieuFait: "", dateFait: "", chefEtab: "" },
// });

// function Cell({ value, onChange, bold, readOnly, wide }: any) {
//   return (
//     <input
//       className={`cell ${bold ? "bold" : ""} ${wide ? "wide" : ""}`}
//       value={value}
//       readOnly={readOnly}
//       inputMode={wide ? "text" : "decimal"}
//       onChange={(e) => onChange && onChange(e.target.value)}
//     />
//   );
// }

// function Field({ label, value, onChange, type = "text", w }: any) {
//   return (
//     <label className="field" style={{ flex: w || 1 }}>
//       <span>{label}</span>
//       <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
//     </label>
//   );
// }

// /* ---------- Main ---------- */
// export default function Notes() {
//   const { user } = useAuth() as any;

//   const [sections]       = useState<SectionOption[]>(FALLBACK_SECTIONS);
//   const [section, setSection] = useState(FALLBACK_SECTIONS[0].value);
//   const [classe, setClasse]   = useState(CLASSES[0]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [courseId, setCourseId] = useState("");
//   const [students, setStudents] = useState<Student[]>([]);
//   const [selectedStudentId, setSelectedStudentId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [debug, setDebug] = useState("");

//   /* Load courses + students once */
//   useEffect(() => {
//     loadCourses().then((list) => {
//       setCourses(list);
//       if (list[0]) setCourseId(list[0].id);
//       setDebug((d) => `${d}courses: ${list.length}`.trim());
//     });

//     loadStudents().then((list) => {
//       setStudents(list);
//       setDebug((d) => `${d} · students: ${list.length}`.trim());
//     });
//   }, []);

//   /* Students filtered by section + classe */
//   const filteredStudents = useMemo(() => {
//     return students.filter((s: any) => {
//       const sClasse  = s.classe ?? "";
//       const sSection = s.section ?? null;
//       if (sClasse !== classe) return false;
//       if (sSection && sSection !== section) return false;
//       return true;
//     });
//   }, [students, classe, section]);

//   /* Storage key for the bulletin of this specific (section, classe, student) */
//   const storageKey = useMemo(
//     () => STORAGE_KEY(section, classe, selectedStudentId || "blank"),
//     [section, classe, selectedStudentId]
//   );

//   const [data, setData] = useState<any>(() => initialData());

//   /* Load the bulletin when section/classe/student changes */
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(storageKey);
//       const loaded = raw ? JSON.parse(raw) : initialData();
//       // Auto-fill the student header if a student is selected
//       const student = students.find((s) => s.id === selectedStudentId);
//       if (student) {
//         loaded.header = {
//           ...loaded.header,
//           eleve: student.name,
//           classe: student.classe || classe,
//         };
//       } else {
//         loaded.header = { ...loaded.header, classe };
//       }
//       setData(loaded);
//     } catch {
//       setData(initialData());
//     }
//   }, [storageKey, selectedStudentId, students, classe]);

//   /* Persist */
//   useEffect(() => {
//     try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch {}
//   }, [data, storageKey]);

//   const { header, groups, footer } = data;

//   const setHeader = (k: string, v: any) => setData((d: any) => ({ ...d, header: { ...d.header, [k]: v } }));
//   const setFooter = (k: string, v: any) => setData((d: any) => ({ ...d, footer: { ...d.footer, [k]: v } }));
//   const updGroup = (gid: string, fn: any) =>
//     setData((d: any) => ({ ...d, groups: d.groups.map((g: any) => (g.id === gid ? fn(g) : g)) }));
//   const setMax = (gid: string, i: number, v: any) => updGroup(gid, (g: any) => ({ ...g, max: g.max.map((m: any, j: number) => (j === i ? v : m)) }));
//   const setScore = (gid: string, sid: string, i: number, v: any) =>
//     updGroup(gid, (g: any) => ({
//       ...g,
//       subjects: g.subjects.map((s: any) => (s.id === sid ? { ...s, s: s.s.map((x: any, j: number) => (j === i ? v : x)) } : s)),
//     }));
//   const setSubj = (gid: string, sid: string, patch: any) =>
//     updGroup(gid, (g: any) => ({ ...g, subjects: g.subjects.map((s: any) => (s.id === sid ? { ...s, ...patch } : s)) }));
//   const addSubject = (gid: string) => updGroup(gid, (g: any) => ({ ...g, subjects: [...g.subjects, mk("Nouveau cours")] }));
//   const delSubject = (gid: string, sid: string) =>
//     updGroup(gid, (g: any) => ({ ...g, subjects: g.subjects.filter((s: any) => s.id !== sid) }));
//   const addGroup = () =>
//     setData((d: any) => ({ ...d, groups: [...d.groups, { id: uid(), max: [10, 10, 20, 10, 10, 20], subjects: [mk("Nouveau cours")] }] }));
//   const delGroup = (gid: string) => setData((d: any) => ({ ...d, groups: d.groups.filter((g: any) => g.id !== gid) }));
//   const reset = () => window.confirm("Effacer toutes les données de ce bulletin ?") && setData(initialData());

//   const sem1 = (a: any) => num(a[0]) + num(a[1]) + num(a[2]);
//   const sem2 = (a: any) => num(a[3]) + num(a[4]) + num(a[5]);
//   const tg = (a: any) => sem1(a) + sem2(a);

//   const maxGen = groups.reduce(
//     (acc: any, g: any) => acc.map((v: any, i: number) => v + num(g.max[i]) * g.subjects.length),
//     [0, 0, 0, 0, 0, 0]
//   );
//   const totGen = groups.reduce(
//     (acc: any, g: any) => g.subjects.reduce((a2: any, s: any) => a2.map((v: any, i: number) => v + num(s.s[i])), acc),
//     [0, 0, 0, 0, 0, 0]
//   );
//   const maxTG = sem1(maxGen) + sem2(maxGen);
//   const totTG = sem1(totGen) + sem2(totGen);
//   const pct = (t: number, m: number) => (m ? ((t / m) * 100).toFixed(1) : "");
//   const pctArr = totGen.map((t: number, i: number) => pct(t, maxGen[i]));

//   const nineCols = (a: any, onChange: any, { bold, readOnly }: any = {}) => [
//     <td key="0"><Cell value={a[0]} onChange={(v: any) => onChange(0, v)} bold={bold} readOnly={readOnly} /></td>,
//     <td key="1"><Cell value={a[1]} onChange={(v: any) => onChange(1, v)} bold={bold} readOnly={readOnly} /></td>,
//     <td key="2"><Cell value={a[2]} onChange={(v: any) => onChange(2, v)} bold={bold} readOnly={readOnly} /></td>,
//     <td key="3" className="calc">{sem1(a) || ""}</td>,
//     <td key="4"><Cell value={a[3]} onChange={(v: any) => onChange(3, v)} bold={bold} readOnly={readOnly} /></td>,
//     <td key="5"><Cell value={a[4]} onChange={(v: any) => onChange(4, v)} bold={bold} readOnly={readOnly} /></td>,
//     <td key="6"><Cell value={a[5]} onChange={(v: any) => onChange(5, v)} bold={bold} readOnly={readOnly} /></td>,
//     <td key="7" className="calc">{sem2(a) || ""}</td>,
//     <td key="8" className="calc">{tg(a) || ""}</td>,
//   ];

//   return (
//     <div className="page">
//       <style>{css}</style>

//       {/* ---------- Top toolbar: Section + Classe + Cours + Student ---------- */}
//       <div className="toolbar no-print">
//         <label className="tool-field">
//           <span>Section :</span>
//           <select value={section} onChange={(e) => { setSection(e.target.value); setSelectedStudentId(""); }}>
//             {sections.map((s) => <option key={s.value} value={s.value}>{s.displayName}</option>)}
//           </select>
//         </label>

//         <label className="tool-field">
//           <span>Classe :</span>
//           <select value={classe} onChange={(e) => { setClasse(e.target.value); setSelectedStudentId(""); }}>
//             {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
//           </select>
//         </label>

//         <label className="tool-field">
//           <span>Cours :</span>
//           <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//             {courses.length === 0 && <option value="">— Aucun cours —</option>}
//             {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//           </select>
//         </label>

//         <label className="tool-field">
//           <span>Élève :</span>
//           <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
//             <option value="">— Bulletin vierge —</option>
//             {filteredStudents.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
//           </select>
//         </label>

//         <button onClick={() => window.print()}>Imprimer / PDF</button>
//         <button onClick={addGroup}>+ Groupe</button>
//         <button className="danger" onClick={reset}>Réinitialiser</button>

//         {debug && <span className="hint">{debug}</span>}
//       </div>

//       <div className="sheet">
//         <div className="top">
//           <div className="flag" aria-hidden="true">★</div>
//           <div className="title-block">
//             <div>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</div>
//             <div>MINISTÈRE DE L'ÉDUCATION NATIONALE</div>
//             <div>ET NOUVELLE CITOYENNETÉ</div>
//           </div>
//           <div className="emblem" aria-hidden="true">RDC</div>
//         </div>

//         <div className="idline"><Field label="N° ID" value={header.id} onChange={(v: any) => setHeader("id", v)} /></div>

//         <div className="box">
//           <div className="box-title">PROVINCE ÉDUCATIONNELLE :
//             <input value={header.province} onChange={(e) => setHeader("province", e.target.value)} />
//           </div>
//           <div className="cols">
//             <div className="col">
//               <Field label="VILLE" value={header.ville} onChange={(v: any) => setHeader("ville", v)} />
//               <Field label="COMMUNE / TÉL." value={header.commune} onChange={(v: any) => setHeader("commune", v)} />
//               <Field label="ÉCOLE" value={header.ecole} onChange={(v: any) => setHeader("ecole", v)} />
//               <Field label="CODE" value={header.code} onChange={(v: any) => setHeader("code", v)} />
//             </div>
//             <div className="col">
//               <div className="row2">
//                 <Field label="ÉLÈVE" value={header.eleve} onChange={(v: any) => setHeader("eleve", v)} w={3} />
//                 <Field label="SEXE" value={header.sexe} onChange={(v: any) => setHeader("sexe", v)} w={1} />
//               </div>
//               <div className="row2">
//                 <Field label="NÉ(E) À" value={header.lieu} onChange={(v: any) => setHeader("lieu", v)} w={2} />
//                 <Field label="LE" type="date" value={header.dateNaiss} onChange={(v: any) => setHeader("dateNaiss", v)} w={2} />
//               </div>
//               <Field label="CLASSE" value={header.classe} onChange={(v: any) => setHeader("classe", v)} />
//               <Field label="N° PERM." value={header.permanent} onChange={(v: any) => setHeader("permanent", v)} />
//             </div>
//           </div>
//         </div>

//         <h2 className="bulletin-title">
//           BULLETIN DE LA{" "}
//           <input className="inline" style={{ width: "42%" }} value={header.niveau} onChange={(e) => setHeader("niveau", e.target.value)} />
//           {" "}ANNÉE SCOLAIRE{" "}
//           <input className="inline" style={{ width: 90 }} value={header.annee} onChange={(e) => setHeader("annee", e.target.value)} />
//         </h2>

//         <div className="scroll">
//           <table className="grades">
//             <thead>
//               <tr>
//                 <th rowSpan={3} className="branch">BRANCHES</th>
//                 <th colSpan={4}>PREMIER SEMESTRE</th>
//                 <th colSpan={4}>SECOND SEMESTRE</th>
//                 <th rowSpan={3}>T.G.</th>
//                 <th colSpan={2}>EXAMEN DE REPÊCHAGE</th>
//                 <th rowSpan={3} className="no-print" />
//               </tr>
//               <tr>
//                 <th colSpan={2}>TR. JOURNAL</th><th rowSpan={2}>EXAM.</th><th rowSpan={2}>TOT.</th>
//                 <th colSpan={2}>TR. JOURNAL</th><th rowSpan={2}>EXAM.</th><th rowSpan={2}>TOT.</th>
//                 <th rowSpan={2}>%</th><th rowSpan={2}>SIGN. PROF</th>
//               </tr>
//               <tr>
//                 <th>1ère P.</th><th>2ème P.</th><th>3ème P.</th><th>4ème P.</th>
//               </tr>
//             </thead>

//             <tbody>
//               {groups.map((g: any) => (
//                 <GroupRows
//                   key={g.id}
//                   g={g}
//                   nineCols={nineCols}
//                   setMax={setMax}
//                   setScore={setScore}
//                   setSubj={setSubj}
//                   addSubject={addSubject}
//                   delSubject={delSubject}
//                   delGroup={delGroup}
//                 />
//               ))}

//               <tr className="total-row">
//                 <td className="label">MAXIMA GÉNÉRAUX</td>
//                 {nineCols(maxGen, () => {}, { bold: true, readOnly: true })}
//                 <td colSpan={2} className="shade" /><td className="no-print" />
//               </tr>
//               <tr className="total-row">
//                 <td className="label">TOTAL</td>
//                 {nineCols(totGen, () => {}, { bold: true, readOnly: true })}
//                 <td colSpan={2} className="shade" /><td className="no-print" />
//               </tr>
//               <tr className="total-row">
//                 <td className="label">POURCENTAGE</td>
//                 <td className="calc">{pctArr[0]}</td><td className="calc">{pctArr[1]}</td><td className="calc">{pctArr[2]}</td>
//                 <td className="calc">{pct(sem1(totGen), sem1(maxGen))}</td>
//                 <td className="calc">{pctArr[3]}</td><td className="calc">{pctArr[4]}</td><td className="calc">{pctArr[5]}</td>
//                 <td className="calc">{pct(sem2(totGen), sem2(maxGen))}</td>
//                 <td className="calc">{pct(totTG, maxTG)}</td>
//                 <td colSpan={2} className="shade" /><td className="no-print" />
//               </tr>
//               <tr>
//                 <td className="label">APPLICATION</td>
//                 <td colSpan={8}><Cell wide value={footer.application} onChange={(v: any) => setFooter("application", v)} /></td>
//                 <td colSpan={3} className="shade" /><td className="no-print" />
//               </tr>
//               <tr>
//                 <td className="label">CONDUITE</td>
//                 <td colSpan={8}><Cell wide value={footer.conduite} onChange={(v: any) => setFooter("conduite", v)} /></td>
//                 <td colSpan={3} className="shade" /><td className="no-print" />
//               </tr>
//               <tr>
//                 <td className="label">PLACE / ÉLÈVES</td>
//                 <td colSpan={4}><Cell wide value={footer.place} onChange={(v: any) => setFooter("place", v)} /></td>
//                 <td colSpan={4} className="sur">sur&nbsp;<Cell value={footer.surEleves} onChange={(v: any) => setFooter("surEleves", v)} />&nbsp;élèves</td>
//                 <td colSpan={3} className="shade" /><td className="no-print" />
//               </tr>
//               <tr>
//                 <td className="label">SIGNATURE DU RESPONSABLE</td>
//                 <td colSpan={11}><Cell wide value={footer.chefEtab} onChange={(v: any) => setFooter("chefEtab", v)} /></td>
//                 <td className="no-print" />
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div className="decision">
//           <p>
//             - L'élève passe dans la classe supérieure ( ) / L'élève double la classe ( ) /
//             L'élève est à refaire : <input className="inline" style={{ width: 180 }} value={footer.decision} onChange={(e) => setFooter("decision", e.target.value)} />
//           </p>
//           <p>
//             Fait à <input className="inline" style={{ width: 130 }} value={footer.lieuFait} onChange={(e) => setFooter("lieuFait", e.target.value)} />
//             , le <input className="inline" type="date" style={{ width: 140 }} value={footer.dateFait} onChange={(e) => setFooter("dateFait", e.target.value)} />
//           </p>
//           <div className="sign">
//             <div>Signature de l'élève</div>
//             <div>Sceau de l'École</div>
//             <div>Nom et signature du Chef d'Établissement</div>
//           </div>
//           <small>Interdiction formelle de reproduire ce bulletin sous peine des sanctions prévues par la loi.</small>
//         </div>
//       </div>
//     </div>
//   );
// }

// function GroupRows({ g, nineCols, setMax, setScore, setSubj, addSubject, delSubject, delGroup }: any) {
//   return (
//     <>
//       <tr className="maxima">
//         <td className="label">MAXIMA</td>
//         {nineCols(g.max, (i: number, v: any) => setMax(g.id, i, v), { bold: true })}
//         <td colSpan={2} className="shade" />
//         <td className="no-print">
//           <button className="mini danger" title="Supprimer le groupe" onClick={() => delGroup(g.id)}>×</button>
//         </td>
//       </tr>
//       {g.subjects.map((s: any) => (
//         <tr key={s.id}>
//           <td className="name"><Cell wide value={s.name} onChange={(v: any) => setSubj(g.id, s.id, { name: v })} /></td>
//           {nineCols(s.s, (i: number, v: any) => setScore(g.id, s.id, i, v))}
//           <td><Cell value={s.rep.pct} onChange={(v: any) => setSubj(g.id, s.id, { rep: { ...s.rep, pct: v } })} /></td>
//           <td><Cell wide value={s.rep.sign} onChange={(v: any) => setSubj(g.id, s.id, { rep: { ...s.rep, sign: v } })} /></td>
//           <td className="no-print">
//             <button className="mini danger" title="Supprimer le cours" onClick={() => delSubject(g.id, s.id)}>×</button>
//           </td>
//         </tr>
//       ))}
//       <tr className="no-print">
//         <td colSpan={13}>
//           <button className="mini" onClick={() => addSubject(g.id)}>+ Ajouter un cours à ce groupe</button>
//         </td>
//       </tr>
//     </>
//   );
// }

// const css = `
// .page{font-family:"Times New Roman",Georgia,serif;background:#e9e7e1;padding:16px;min-height:100vh;color:#111}
// .toolbar{max-width:1000px;margin:0 auto 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
// .tool-field{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:bold;color:#1d3b78}
// .tool-field span{white-space:nowrap}
// .tool-field select{font:inherit;font-weight:normal;padding:4px 8px;border:1px solid #cbd5e1;border-radius:4px;background:#fff;max-width:260px}
// .toolbar button,.mini{font:inherit;font-size:13px;padding:6px 12px;border:1px solid #1d3b78;background:#1d3b78;color:#fff;border-radius:4px;cursor:pointer}
// .toolbar button.danger,.mini.danger{background:#fff;color:#a32020;border-color:#a32020}
// .mini{padding:2px 8px;background:#fff;color:#1d3b78;font-size:12px}
// .hint{font-size:12px;color:#555}
// .sheet{max-width:1000px;margin:0 auto;background:#fff;border:1px solid #888;padding:20px 24px;box-shadow:0 2px 10px rgba(0,0,0,.15)}
// .top{display:flex;align-items:center;justify-content:space-between;gap:12px}
// .title-block{text-align:center;font-weight:bold;font-size:14px;line-height:1.4;flex:1}
// .flag{width:64px;height:44px;background:linear-gradient(135deg,#0a7cff 55%,#f7d618 55% 60%,#ce1021 60% 72%,#f7d618 72% 77%,#0a7cff 77%);color:#f7d618;display:flex;align-items:center;justify-content:center;font-size:20px}
// .emblem{width:56px;height:56px;border:2px solid #1d3b78;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#1d3b78}
// .idline{margin:8px 0}
// .box{border:1.5px solid #111;padding:6px 10px}
// .box-title{font-weight:bold;font-size:13px;display:flex;gap:6px;align-items:center;border-bottom:1px solid #111;padding-bottom:4px;margin-bottom:4px}
// .box-title input{flex:1}
// .cols{display:flex;gap:18px}.col{flex:1;display:flex;flex-direction:column;gap:2px}
// .row2{display:flex;gap:10px}
// .field{display:flex;gap:6px;align-items:baseline;font-size:12px;font-weight:bold}
// .field span{white-space:nowrap}
// input{font:inherit}
// .field input,.box-title input,.inline{border:0;border-bottom:1px dotted #555;background:transparent;font-size:13px;padding:1px 3px;min-width:0;width:100%;outline:none}
// .field input:focus,.box-title input:focus,.inline:focus,.cell:focus{background:#fff8d6}
// .inline{width:auto;display:inline-block}
// .bulletin-title{font-size:13px;text-align:center;margin:12px 0 6px;font-weight:bold}
// .scroll{overflow-x:auto}
// .grades{width:100%;border-collapse:collapse;font-size:11px;min-width:820px}
// .grades th,.grades td{border:1px solid #111;padding:0;text-align:center}
// .grades th{padding:3px 2px;font-size:10px;background:#f3f1ea}
// .grades th.branch{width:150px}
// .label{text-align:left!important;font-weight:bold;padding:2px 4px!important;font-size:11px;background:#f3f1ea}
// .maxima td{background:#ecebe5}
// .name{text-align:left!important}
// .calc{background:#fafaf7;font-weight:bold;min-width:30px;padding:0 2px}
// .shade{background:repeating-linear-gradient(45deg,#ddd,#ddd 3px,#fff 3px,#fff 6px)}
// .total-row .calc{background:#ecebe5}
// .sur{text-align:left!important;padding:0 6px!important;font-size:11px}
// .sur .cell{width:40px;display:inline-block}
// .cell{width:100%;border:0;background:transparent;text-align:center;font-size:12px;padding:3px 1px;outline:none;box-sizing:border-box;min-width:26px}
// .cell.wide{text-align:left;min-width:60px;padding-left:4px}
// .cell.bold{font-weight:bold}
// .decision{margin-top:12px;font-size:12px}
// .decision p{margin:6px 0}
// .sign{display:flex;justify-content:space-between;margin:28px 0 8px;font-weight:bold;font-size:12px}
// .decision small{font-size:10px;font-style:italic;display:block;text-align:center}
// @media print{
//   .no-print{display:none!important}
//   .page{background:#fff;padding:0}
//   .sheet{box-shadow:none;border:0;padding:0;max-width:none}
//   .scroll{overflow:visible}
// }
// @media (max-width:640px){.cols{flex-direction:column}.sheet{padding:12px}}
// `;


import { useState, useEffect, useMemo } from "react";
import {
  loadCourses, loadStudents, getStudentMarks,
  type Course, type Student, type Marks,
} from "./bulletinStore";

/* ---------- Sections ---------- */
type SectionOption = { value: string; displayName: string };
const FALLBACK_SECTIONS: SectionOption[] = [
  { value: "INFIRMIERE",            displayName: "Section Infirmière de la RÉFORME" },
  { value: "ACCOUCHEUSE",           displayName: "Section Accoucheuse de la RÉFORME" },
  { value: "ASSISTANT_PHARMACIE",   displayName: "Section Assistant en pharmacie de la RÉFORME" },
  { value: "SANTE_MENTALE",         displayName: "Section Santé Mentale de la RÉFORME" },
  { value: "TECHNIQUE_LABORATOIRE", displayName: "Section Technique de Laboratoire de la RÉFORME" },
];

const CLASSES: string[] = ["1ère", "2ème", "3ème", "4ème"];

/* ---------- Bulletin helpers ---------- */
const uid = () => Math.random().toString(36).slice(2, 9);
const num = (v: any) => (v === "" || v == null || isNaN(+v) ? 0 : +v);
const STORAGE_KEY = (section: string, classe: string, studentId: string) =>
  `bulletin-iem-${section}-${classe}-${studentId}`;
const TEACHER_NOTES_KEY = (section: string, classe: string, courseId: string) =>
  `notes-iem-virunga:${section}:${classe}:${courseId}`;

const mk = (name: string) => ({ id: uid(), name, s: ["", "", "", "", "", ""], rep: { pct: "", sign: "" } });

const initialData = () => ({
  header: {
    id: "", province: "", ville: "", commune: "", ecole: "", code: "",
    eleve: "", sexe: "", lieu: "", dateNaiss: "", classe: "", permanent: "",
    annee: "2024 - 2025", niveau: "1ère, 2ème, 3ème, 4ème Année Humanités / Normale",
  },
  groups: [
    { id: uid(), max: [10, 10, 20, 10, 10, 20], subjects: ["Religion", "Éducation à la Vie", "Sol. civ. & morale"].map(mk) },
    { id: uid(), max: [20, 20, 40, 20, 20, 40], subjects: ["Biologie", "Dessin", "Géographie", "Histoire", "Informatique", "Musique", "Langues nationales", "Sport / Écon. mode"].map(mk) },
    { id: uid(), max: [40, 40, 80, 40, 40, 80], subjects: ["Anglais", "Didactique des disciplines", "Didactique plurielle", "Pédagogie", "Physique", "Psychologie"].map(mk) },
    { id: uid(), max: [60, 60, 120, 60, 60, 120], subjects: ["Français", "Mathématiques", "Philosophie"].map(mk) },
  ],
  footer: { application: "", conduite: "", place: "", surEleves: "", decision: "", lieuFait: "", dateFait: "", chefEtab: "" },
});

function Cell({ value, onChange, bold, readOnly, wide }: any) {
  return (
    <input
      className={`cell ${bold ? "bold" : ""} ${wide ? "wide" : ""}`}
      value={value}
      readOnly={readOnly}
      inputMode={wide ? "text" : "decimal"}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  );
}

function Field({ label, value, onChange, type = "text", w }: any) {
  return (
    <label className="field" style={{ flex: w || 1 }}>
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

/* ---------- Load marks for a student from API + teacher localStorage ---------- */
async function loadStudentFullMarks(
  studentId: string,
  section: string,
  classe: string,
  courses: Course[]
): Promise<{ byCourse: Record<string, Marks>; source: string }> {
  // 1) try API
  try {
    const apiMap = await getStudentMarks(studentId);
    if (apiMap && apiMap.size > 0) {
      const obj: Record<string, Marks> = {};
      apiMap.forEach((v, k) => { obj[k] = v; });
      return { byCourse: obj, source: "API" };
    }
  } catch (e) { /* fall through */ }

  // 2) fall back to teacher localStorage
  const obj: Record<string, Marks> = {};
  for (const c of courses) {
    try {
      const raw = localStorage.getItem(TEACHER_NOTES_KEY(section, classe, c.id));
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const row = parsed?.rows?.find((r: any) => r.studentId === studentId);
      if (!row || !row.notes) continue;
      // teacher's Feuille de Notes uses notes[0..4] for 5 sub-columns;
      // map to p1, p2, ex1, p3, p4, ex2 (only first 6 fit)
      const n = row.notes;
      obj[c.id] = {
        p1: n[0] !== "" ? Number(n[0]) : null,
        p2: n[1] !== "" ? Number(n[1]) : null,
        ex1: n[2] !== "" ? Number(n[2]) : null,
        p3: n[3] !== "" ? Number(n[3]) : null,
        p4: n[4] !== "" ? Number(n[4]) : null,
        ex2: null,
      };
    } catch {}
  }
  return { byCourse: obj, source: "enseignant (local)" };
}

/* ---------- Main ---------- */
export default function Notes() {
  const [sections]       = useState<SectionOption[]>(FALLBACK_SECTIONS);
  const [section, setSection] = useState(FALLBACK_SECTIONS[0].value);
  const [classe, setClasse]   = useState(CLASSES[0]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [debug, setDebug] = useState("");
  const [loadSource, setLoadSource] = useState("");

  useEffect(() => {
    loadCourses().then((list) => {
      setCourses(list);
      if (list[0]) setCourseId(list[0].id);
      setDebug((d) => `${d}courses:${list.length}`.trim());
    });
    loadStudents().then((list) => {
      setStudents(list);
      setDebug((d) => `${d} students:${list.length}`.trim());
    });
  }, []);

  /* Filter by section + classe + search */
  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s: any) => {
      const sClasse  = s.classe ?? "";
      const sSection = s.section ?? null;
      if (sClasse !== classe) return false;
      if (sSection && sSection !== section) return false;
      if (q && !String(s.name).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [students, classe, section, search]);

  const storageKey = useMemo(
    () => STORAGE_KEY(section, classe, selectedStudentId || "blank"),
    [section, classe, selectedStudentId]
  );

  const [data, setData] = useState<any>(() => initialData());

  /* Load bulletin on selection change */
  useEffect(() => {
    let loaded: any = null;
    try {
      const raw = localStorage.getItem(storageKey);
      loaded = raw ? JSON.parse(raw) : initialData();
    } catch {
      loaded = initialData();
    }

    const student = students.find((s) => s.id === selectedStudentId);
    if (student) {
      loaded.header = {
        ...loaded.header,
        eleve: student.name,
        classe: student.classe || classe,
      };
    } else {
      loaded.header = { ...loaded.header, classe };
    }

    setData(loaded);
  }, [storageKey, selectedStudentId, students, classe]);

  /* Persist bulletin */
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch {}
  }, [data, storageKey]);

  /* Auto-load student's marks from all courses when they're picked */
  useEffect(() => {
    if (!selectedStudentId) { setLoadSource(""); return; }
    (async () => {
      const { byCourse, source } = await loadStudentFullMarks(selectedStudentId, section, classe, courses);
      setLoadSource(source);

      setData((d: any) => {
        const next = { ...d, groups: d.groups.map((g: any) => ({ ...g, subjects: g.subjects.map((s: any) => ({ ...s })) })) };

        for (const group of next.groups) {
          for (const subject of group.subjects) {
            // find matching course by name (case-insensitive)
            const course = courses.find(
              (c) => c.name.toLowerCase() === subject.name.toLowerCase()
            );
            if (!course) continue;
            const m = byCourse[course.id];
            if (!m) continue;
            const arr = [
              m.p1 ?? "", m.p2 ?? "", m.ex1 ?? "",
              m.p3 ?? "", m.p4 ?? "", m.ex2 ?? "",
            ];
            subject.s = arr.map((v) => (v === null ? "" : String(v)));
          }
        }
        return next;
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudentId]);

  const { header, groups, footer } = data;

  const setHeader = (k: string, v: any) => setData((d: any) => ({ ...d, header: { ...d.header, [k]: v } }));
  const setFooter = (k: string, v: any) => setData((d: any) => ({ ...d, footer: { ...d.footer, [k]: v } }));
  const updGroup = (gid: string, fn: any) =>
    setData((d: any) => ({ ...d, groups: d.groups.map((g: any) => (g.id === gid ? fn(g) : g)) }));
  const setMax = (gid: string, i: number, v: any) => updGroup(gid, (g: any) => ({ ...g, max: g.max.map((m: any, j: number) => (j === i ? v : m)) }));
  const setScore = (gid: string, sid: string, i: number, v: any) =>
    updGroup(gid, (g: any) => ({
      ...g,
      subjects: g.subjects.map((s: any) => (s.id === sid ? { ...s, s: s.s.map((x: any, j: number) => (j === i ? v : x)) } : s)),
    }));
  const setSubj = (gid: string, sid: string, patch: any) =>
    updGroup(gid, (g: any) => ({ ...g, subjects: g.subjects.map((s: any) => (s.id === sid ? { ...s, ...patch } : s)) }));
  const addSubject = (gid: string) => updGroup(gid, (g: any) => ({ ...g, subjects: [...g.subjects, mk("Nouveau cours")] }));
  const delSubject = (gid: string, sid: string) =>
    updGroup(gid, (g: any) => ({ ...g, subjects: g.subjects.filter((s: any) => s.id !== sid) }));
  const addGroup = () =>
    setData((d: any) => ({ ...d, groups: [...d.groups, { id: uid(), max: [10, 10, 20, 10, 10, 20], subjects: [mk("Nouveau cours")] }] }));
  const delGroup = (gid: string) => setData((d: any) => ({ ...d, groups: d.groups.filter((g: any) => g.id !== gid) }));
  const reset = () => window.confirm("Effacer toutes les données de ce bulletin ?") && setData(initialData());

  const sem1 = (a: any) => num(a[0]) + num(a[1]) + num(a[2]);
  const sem2 = (a: any) => num(a[3]) + num(a[4]) + num(a[5]);
  const tg = (a: any) => sem1(a) + sem2(a);

  const maxGen = groups.reduce(
    (acc: any, g: any) => acc.map((v: any, i: number) => v + num(g.max[i]) * g.subjects.length),
    [0, 0, 0, 0, 0, 0]
  );
  const totGen = groups.reduce(
    (acc: any, g: any) => g.subjects.reduce((a2: any, s: any) => a2.map((v: any, i: number) => v + num(s.s[i])), acc),
    [0, 0, 0, 0, 0, 0]
  );
  const maxTG = sem1(maxGen) + sem2(maxGen);
  const totTG = sem1(totGen) + sem2(totGen);
  const pct = (t: number, m: number) => (m ? ((t / m) * 100).toFixed(1) : "");
  const pctArr = totGen.map((t: number, i: number) => pct(t, maxGen[i]));

  const nineCols = (a: any, onChange: any, { bold, readOnly }: any = {}) => [
    <td key="0"><Cell value={a[0]} onChange={(v: any) => onChange(0, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="1"><Cell value={a[1]} onChange={(v: any) => onChange(1, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="2"><Cell value={a[2]} onChange={(v: any) => onChange(2, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="3" className="calc">{sem1(a) || ""}</td>,
    <td key="4"><Cell value={a[3]} onChange={(v: any) => onChange(3, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="5"><Cell value={a[4]} onChange={(v: any) => onChange(4, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="6"><Cell value={a[5]} onChange={(v: any) => onChange(5, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="7" className="calc">{sem2(a) || ""}</td>,
    <td key="8" className="calc">{tg(a) || ""}</td>,
  ];

  return (
    <div className="page">
      <style>{css}</style>

      <div className="toolbar no-print">
        <label className="tool-field">
          <span>Section :</span>
          <select value={section} onChange={(e) => { setSection(e.target.value); setSelectedStudentId(""); }}>
            {sections.map((s) => <option key={s.value} value={s.value}>{s.displayName}</option>)}
          </select>
        </label>
        <label className="tool-field">
          <span>Classe :</span>
          <select value={classe} onChange={(e) => { setClasse(e.target.value); setSelectedStudentId(""); }}>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="tool-field">
          <span>Cours :</span>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            {courses.length === 0 && <option value="">— Aucun cours —</option>}
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="tool-field">
          <span>Rechercher élève :</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom ou prénom…"
            style={{ padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: 4, minWidth: 200 }}
          />
        </label>
        <button onClick={() => window.print()}>Imprimer / PDF</button>
        <button onClick={addGroup}>+ Groupe</button>
        <button className="danger" onClick={reset}>Réinitialiser</button>
        {debug && <span className="hint">{debug}</span>}
      </div>

      {/* ---------- Student list ---------- */}
      <div className="student-panel no-print">
        <div className="student-panel__title">
          {filteredStudents.length} élève(s) — {classe}
          {loadSource && selectedStudentId && (
            <span className="student-panel__source"> · notes chargées : {loadSource}</span>
          )}
        </div>
        <div className="student-panel__list">
          {filteredStudents.length === 0 && (
            <div className="student-panel__empty">Aucun élève dans cette section + classe.</div>
          )}
          {filteredStudents.map((s) => (
            <button
              key={s.id}
              className={`student-chip ${selectedStudentId === s.id ? "student-chip--active" : ""}`}
              onClick={() => setSelectedStudentId(s.id)}
            >
              <span className="student-chip__name">{s.name}</span>
              <span className="student-chip__classe">{s.classe}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Bulletin ---------- */}
      <div className="sheet">
        <div className="top">
          <div className="flag" aria-hidden="true">★</div>
          <div className="title-block">
            <div>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</div>
            <div>MINISTÈRE DE L'ÉDUCATION NATIONALE</div>
            <div>ET NOUVELLE CITOYENNETÉ</div>
          </div>
          <div className="emblem" aria-hidden="true">RDC</div>
        </div>

        <div className="idline"><Field label="N° ID" value={header.id} onChange={(v: any) => setHeader("id", v)} /></div>

        <div className="box">
          <div className="box-title">PROVINCE ÉDUCATIONNELLE :
            <input value={header.province} onChange={(e) => setHeader("province", e.target.value)} />
          </div>
          <div className="cols">
            <div className="col">
              <Field label="VILLE" value={header.ville} onChange={(v: any) => setHeader("ville", v)} />
              <Field label="COMMUNE / TÉL." value={header.commune} onChange={(v: any) => setHeader("commune", v)} />
              <Field label="ÉCOLE" value={header.ecole} onChange={(v: any) => setHeader("ecole", v)} />
              <Field label="CODE" value={header.code} onChange={(v: any) => setHeader("code", v)} />
            </div>
            <div className="col">
              <div className="row2">
                <Field label="ÉLÈVE" value={header.eleve} onChange={(v: any) => setHeader("eleve", v)} w={3} />
                <Field label="SEXE" value={header.sexe} onChange={(v: any) => setHeader("sexe", v)} w={1} />
              </div>
              <div className="row2">
                <Field label="NÉ(E) À" value={header.lieu} onChange={(v: any) => setHeader("lieu", v)} w={2} />
                <Field label="LE" type="date" value={header.dateNaiss} onChange={(v: any) => setHeader("dateNaiss", v)} w={2} />
              </div>
              <Field label="CLASSE" value={header.classe} onChange={(v: any) => setHeader("classe", v)} />
              <Field label="N° PERM." value={header.permanent} onChange={(v: any) => setHeader("permanent", v)} />
            </div>
          </div>
        </div>

        <h2 className="bulletin-title">
          BULLETIN DE LA{" "}
          <input className="inline" style={{ width: "42%" }} value={header.niveau} onChange={(e) => setHeader("niveau", e.target.value)} />
          {" "}ANNÉE SCOLAIRE{" "}
          <input className="inline" style={{ width: 90 }} value={header.annee} onChange={(e) => setHeader("annee", e.target.value)} />
        </h2>

        <div className="scroll">
          <table className="grades">
            <thead>
              <tr>
                <th rowSpan={3} className="branch">BRANCHES</th>
                <th colSpan={4}>PREMIER SEMESTRE</th>
                <th colSpan={4}>SECOND SEMESTRE</th>
                <th rowSpan={3}>T.G.</th>
                <th colSpan={2}>EXAMEN DE REPÊCHAGE</th>
                <th rowSpan={3} className="no-print" />
              </tr>
              <tr>
                <th colSpan={2}>TR. JOURNAL</th><th rowSpan={2}>EXAM.</th><th rowSpan={2}>TOT.</th>
                <th colSpan={2}>TR. JOURNAL</th><th rowSpan={2}>EXAM.</th><th rowSpan={2}>TOT.</th>
                <th rowSpan={2}>%</th><th rowSpan={2}>SIGN. PROF</th>
              </tr>
              <tr>
                <th>1ère P.</th><th>2ème P.</th><th>3ème P.</th><th>4ème P.</th>
              </tr>
            </thead>

            <tbody>
              {groups.map((g: any) => (
                <GroupRows
                  key={g.id}
                  g={g}
                  nineCols={nineCols}
                  setMax={setMax}
                  setScore={setScore}
                  setSubj={setSubj}
                  addSubject={addSubject}
                  delSubject={delSubject}
                  delGroup={delGroup}
                />
              ))}

              <tr className="total-row">
                <td className="label">MAXIMA GÉNÉRAUX</td>
                {nineCols(maxGen, () => {}, { bold: true, readOnly: true })}
                <td colSpan={2} className="shade" /><td className="no-print" />
              </tr>
              <tr className="total-row">
                <td className="label">TOTAL</td>
                {nineCols(totGen, () => {}, { bold: true, readOnly: true })}
                <td colSpan={2} className="shade" /><td className="no-print" />
              </tr>
              <tr className="total-row">
                <td className="label">POURCENTAGE</td>
                <td className="calc">{pctArr[0]}</td><td className="calc">{pctArr[1]}</td><td className="calc">{pctArr[2]}</td>
                <td className="calc">{pct(sem1(totGen), sem1(maxGen))}</td>
                <td className="calc">{pctArr[3]}</td><td className="calc">{pctArr[4]}</td><td className="calc">{pctArr[5]}</td>
                <td className="calc">{pct(sem2(totGen), sem2(maxGen))}</td>
                <td className="calc">{pct(totTG, maxTG)}</td>
                <td colSpan={2} className="shade" /><td className="no-print" />
              </tr>
              <tr>
                <td className="label">APPLICATION</td>
                <td colSpan={8}><Cell wide value={footer.application} onChange={(v: any) => setFooter("application", v)} /></td>
                <td colSpan={3} className="shade" /><td className="no-print" />
              </tr>
              <tr>
                <td className="label">CONDUITE</td>
                <td colSpan={8}><Cell wide value={footer.conduite} onChange={(v: any) => setFooter("conduite", v)} /></td>
                <td colSpan={3} className="shade" /><td className="no-print" />
              </tr>
              <tr>
                <td className="label">PLACE / ÉLÈVES</td>
                <td colSpan={4}><Cell wide value={footer.place} onChange={(v: any) => setFooter("place", v)} /></td>
                <td colSpan={4} className="sur">sur&nbsp;<Cell value={footer.surEleves} onChange={(v: any) => setFooter("surEleves", v)} />&nbsp;élèves</td>
                <td colSpan={3} className="shade" /><td className="no-print" />
              </tr>
              <tr>
                <td className="label">SIGNATURE DU RESPONSABLE</td>
                <td colSpan={11}><Cell wide value={footer.chefEtab} onChange={(v: any) => setFooter("chefEtab", v)} /></td>
                <td className="no-print" />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="decision">
          <p>
            - L'élève passe dans la classe supérieure ( ) / L'élève double la classe ( ) /
            L'élève est à refaire : <input className="inline" style={{ width: 180 }} value={footer.decision} onChange={(e) => setFooter("decision", e.target.value)} />
          </p>
          <p>
            Fait à <input className="inline" style={{ width: 130 }} value={footer.lieuFait} onChange={(e) => setFooter("lieuFait", e.target.value)} />
            , le <input className="inline" type="date" style={{ width: 140 }} value={footer.dateFait} onChange={(e) => setFooter("dateFait", e.target.value)} />
          </p>
          <div className="sign">
            <div>Signature de l'élève</div>
            <div>Sceau de l'École</div>
            <div>Nom et signature du Chef d'Établissement</div>
          </div>
          <small>Interdiction formelle de reproduire ce bulletin sous peine des sanctions prévues par la loi.</small>
        </div>
      </div>
    </div>
  );
}

function GroupRows({ g, nineCols, setMax, setScore, setSubj, addSubject, delSubject, delGroup }: any) {
  return (
    <>
      <tr className="maxima">
        <td className="label">MAXIMA</td>
        {nineCols(g.max, (i: number, v: any) => setMax(g.id, i, v), { bold: true })}
        <td colSpan={2} className="shade" />
        <td className="no-print">
          <button className="mini danger" title="Supprimer le groupe" onClick={() => delGroup(g.id)}>×</button>
        </td>
      </tr>
      {g.subjects.map((s: any) => (
        <tr key={s.id}>
          <td className="name"><Cell wide value={s.name} onChange={(v: any) => setSubj(g.id, s.id, { name: v })} /></td>
          {nineCols(s.s, (i: number, v: any) => setScore(g.id, s.id, i, v))}
          <td><Cell value={s.rep.pct} onChange={(v: any) => setSubj(g.id, s.id, { rep: { ...s.rep, pct: v } })} /></td>
          <td><Cell wide value={s.rep.sign} onChange={(v: any) => setSubj(g.id, s.id, { rep: { ...s.rep, sign: v } })} /></td>
          <td className="no-print">
            <button className="mini danger" title="Supprimer le cours" onClick={() => delSubject(g.id, s.id)}>×</button>
          </td>
        </tr>
      ))}
      <tr className="no-print">
        <td colSpan={13}>
          <button className="mini" onClick={() => addSubject(g.id)}>+ Ajouter un cours à ce groupe</button>
        </td>
      </tr>
    </>
  );
}

const css = `
.page{font-family:"Times New Roman",Georgia,serif;background:#e9e7e1;padding:16px;min-height:100vh;color:#111}
.toolbar{max-width:1000px;margin:0 auto 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.tool-field{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:bold;color:#1d3b78}
.tool-field span{white-space:nowrap}
.tool-field select,.tool-field input{font:inherit;font-weight:normal;padding:4px 8px;border:1px solid #cbd5e1;border-radius:4px;background:#fff}
.toolbar button,.mini{font:inherit;font-size:13px;padding:6px 12px;border:1px solid #1d3b78;background:#1d3b78;color:#fff;border-radius:4px;cursor:pointer}
.toolbar button.danger,.mini.danger{background:#fff;color:#a32020;border-color:#a32020}
.mini{padding:2px 8px;background:#fff;color:#1d3b78;font-size:12px}
.hint{font-size:12px;color:#555}

/* ---------- Student panel ---------- */
.student-panel{max-width:1000px;margin:0 auto 12px;background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:12px 14px}
.student-panel__title{font-size:13px;font-weight:bold;color:#1d3b78;margin-bottom:8px}
.student-panel__source{font-weight:normal;color:#64748b}
.student-panel__list{display:flex;flex-wrap:wrap;gap:6px;max-height:180px;overflow-y:auto}
.student-panel__empty{color:#64748b;font-size:13px;padding:8px 0}
.student-chip{display:flex;align-items:center;gap:8px;padding:6px 12px;border:1px solid #cbd5e1;background:#f7f9fc;border-radius:999px;cursor:pointer;font:inherit;font-size:13px;color:#12285a;transition:all .15s}
.student-chip:hover{background:#eaf1fb;border-color:#1d3b78}
.student-chip--active{background:#1d3b78;color:#fff;border-color:#1d3b78}
.student-chip--active .student-chip__classe{color:#c3defa}
.student-chip__classe{color:#64748b;font-size:11px}

.sheet{max-width:1000px;margin:0 auto;background:#fff;border:1px solid #888;padding:20px 24px;box-shadow:0 2px 10px rgba(0,0,0,.15)}
.top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.title-block{text-align:center;font-weight:bold;font-size:14px;line-height:1.4;flex:1}
.flag{width:64px;height:44px;background:linear-gradient(135deg,#0a7cff 55%,#f7d618 55% 60%,#ce1021 60% 72%,#f7d618 72% 77%,#0a7cff 77%);color:#f7d618;display:flex;align-items:center;justify-content:center;font-size:20px}
.emblem{width:56px;height:56px;border:2px solid #1d3b78;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#1d3b78}
.idline{margin:8px 0}
.box{border:1.5px solid #111;padding:6px 10px}
.box-title{font-weight:bold;font-size:13px;display:flex;gap:6px;align-items:center;border-bottom:1px solid #111;padding-bottom:4px;margin-bottom:4px}
.box-title input{flex:1}
.cols{display:flex;gap:18px}.col{flex:1;display:flex;flex-direction:column;gap:2px}
.row2{display:flex;gap:10px}
.field{display:flex;gap:6px;align-items:baseline;font-size:12px;font-weight:bold}
.field span{white-space:nowrap}
input{font:inherit}
.field input,.box-title input,.inline{border:0;border-bottom:1px dotted #555;background:transparent;font-size:13px;padding:1px 3px;min-width:0;width:100%;outline:none}
.field input:focus,.box-title input:focus,.inline:focus,.cell:focus{background:#fff8d6}
.inline{width:auto;display:inline-block}
.bulletin-title{font-size:13px;text-align:center;margin:12px 0 6px;font-weight:bold}
.scroll{overflow-x:auto}
.grades{width:100%;border-collapse:collapse;font-size:11px;min-width:820px}
.grades th,.grades td{border:1px solid #111;padding:0;text-align:center}
.grades th{padding:3px 2px;font-size:10px;background:#f3f1ea}
.grades th.branch{width:150px}
.label{text-align:left!important;font-weight:bold;padding:2px 4px!important;font-size:11px;background:#f3f1ea}
.maxima td{background:#ecebe5}
.name{text-align:left!important}
.calc{background:#fafaf7;font-weight:bold;min-width:30px;padding:0 2px}
.shade{background:repeating-linear-gradient(45deg,#ddd,#ddd 3px,#fff 3px,#fff 6px)}
.total-row .calc{background:#ecebe5}
.sur{text-align:left!important;padding:0 6px!important;font-size:11px}
.sur .cell{width:40px;display:inline-block}
.cell{width:100%;border:0;background:transparent;text-align:center;font-size:12px;padding:3px 1px;outline:none;box-sizing:border-box;min-width:26px}
.cell.wide{text-align:left;min-width:60px;padding-left:4px}
.cell.bold{font-weight:bold}
.decision{margin-top:12px;font-size:12px}
.decision p{margin:6px 0}
.sign{display:flex;justify-content:space-between;margin:28px 0 8px;font-weight:bold;font-size:12px}
.decision small{font-size:10px;font-style:italic;display:block;text-align:center}
@media print{
  .no-print{display:none!important}
  .page{background:#fff;padding:0}
  .sheet{box-shadow:none;border:0;padding:0;max-width:none}
  .scroll{overflow:visible}
}
@media (max-width:640px){.cols{flex-direction:column}.sheet{padding:12px}}
`;