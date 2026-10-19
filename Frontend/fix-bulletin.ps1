$f = ".\src\pages\Adminbulletinrdc.tsx"
$content = @"
import { useState, useEffect } from "react";

/* ---------- helpers ---------- */
const uid = () => Math.random().toString(36).slice(2, 9);
const num = (v) => (v === "" || v == null || isNaN(+v) ? 0 : +v);
const STORAGE_KEY = "bulletin-rdc-2024-2025";

// score/maxima order: [P1, P2, EXAM1, P3, P4, EXAM2]
const mk = (name) => ({ id: uid(), name, s: ["", "", "", "", "", ""], rep: { pct: "", sign: "" } });

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

/* ---------- small inputs ---------- */
function Cell({ value, onChange, bold, readOnly, wide }) {
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

function Field({ label, value, onChange, type = "text", w }) {
  return (
    <label className="field" style={{ flex: w || 1 }}>
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

/* ---------- main component ---------- */
export default function Bulletin() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialData();
    } catch {
      return initialData();
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  const { header, groups, footer } = data;

  /* updaters */
  const setHeader = (k, v) => setData((d) => ({ ...d, header: { ...d.header, [k]: v } }));
  const setFooter = (k, v) => setData((d) => ({ ...d, footer: { ...d.footer, [k]: v } }));
  const updGroup = (gid, fn) =>
    setData((d) => ({ ...d, groups: d.groups.map((g) => (g.id === gid ? fn(g) : g)) }));
  const setMax = (gid, i, v) => updGroup(gid, (g) => ({ ...g, max: g.max.map((m, j) => (j === i ? v : m)) }));
  const setScore = (gid, sid, i, v) =>
    updGroup(gid, (g) => ({
      ...g,
      subjects: g.subjects.map((s) => (s.id === sid ? { ...s, s: s.s.map((x, j) => (j === i ? v : x)) } : s)),
    }));
  const setSubj = (gid, sid, patch) =>
    updGroup(gid, (g) => ({ ...g, subjects: g.subjects.map((s) => (s.id === sid ? { ...s, ...patch } : s)) }));
  const addSubject = (gid) => updGroup(gid, (g) => ({ ...g, subjects: [...g.subjects, mk("Nouveau cours")] }));
  const delSubject = (gid, sid) =>
    updGroup(gid, (g) => ({ ...g, subjects: g.subjects.filter((s) => s.id !== sid) }));
  const addGroup = () =>
    setData((d) => ({ ...d, groups: [...d.groups, { id: uid(), max: [10, 10, 20, 10, 10, 20], subjects: [mk("Nouveau cours")] }] }));
  const delGroup = (gid) => setData((d) => ({ ...d, groups: d.groups.filter((g) => g.id !== gid) }));
  const reset = () => window.confirm("Effacer toutes les données ?") && setData(initialData());

  /* calculations */
  const sem1 = (a) => num(a[0]) + num(a[1]) + num(a[2]);
  const sem2 = (a) => num(a[3]) + num(a[4]) + num(a[5]);
  const tg = (a) => sem1(a) + sem2(a);

  const maxGen = groups.reduce(
    (acc, g) => acc.map((v, i) => v + num(g.max[i]) * g.subjects.length),
    [0, 0, 0, 0, 0, 0]
  );
  const totGen = groups.reduce(
    (acc, g) => g.subjects.reduce((a2, s) => a2.map((v, i) => v + num(s.s[i])), acc),
    [0, 0, 0, 0, 0, 0]
  );
  const maxTG = sem1(maxGen) + sem2(maxGen);
  const totTG = sem1(totGen) + sem2(totGen);
  const pct = (t, m) => (m ? ((t / m) * 100).toFixed(1) : "");
  const pctArr = totGen.map((t, i) => pct(t, maxGen[i]));

  const nineCols = (a, onChange, { bold, readOnly } = {}) => [
    <td key="0"><Cell value={a[0]} onChange={(v) => onChange(0, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="1"><Cell value={a[1]} onChange={(v) => onChange(1, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="2"><Cell value={a[2]} onChange={(v) => onChange(2, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="3" className="calc">{sem1(a) || ""}</td>,
    <td key="4"><Cell value={a[3]} onChange={(v) => onChange(3, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="5"><Cell value={a[4]} onChange={(v) => onChange(4, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="6"><Cell value={a[5]} onChange={(v) => onChange(5, v)} bold={bold} readOnly={readOnly} /></td>,
    <td key="7" className="calc">{sem2(a) || ""}</td>,
    <td key="8" className="calc">{tg(a) || ""}</td>,
  ];

  return (
    <div className="page">
      <style>{css}</style>

      <div className="toolbar no-print">
        <button onClick={() => window.print()}>Imprimer / PDF</button>
        <button onClick={() => addGroup()}>+ Ajouter un groupe (MAXIMA)</button>
        <button className="danger" onClick={reset}>Réinitialiser</button>
        <span className="hint">Toutes les cases sont modifiables. Les totaux se calculent automatiquement.</span>
      </div>

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

        <div className="idline"><Field label="N° ID" value={header.id} onChange={(v) => setHeader("id", v)} /></div>

        <div className="box">
          <div className="box-title">PROVINCE ÉDUCATIONNELLE :
            <input value={header.province} onChange={(e) => setHeader("province", e.target.value)} />
          </div>
          <div className="cols">
            <div className="col">
              <Field label="VILLE" value={header.ville} onChange={(v) => setHeader("ville", v)} />
              <Field label="COMMUNE / TÉL." value={header.commune} onChange={(v) => setHeader("commune", v)} />
              <Field label="ÉCOLE" value={header.ecole} onChange={(v) => setHeader("ecole", v)} />
              <Field label="CODE" value={header.code} onChange={(v) => setHeader("code", v)} />
            </div>
            <div className="col">
              <div className="row2">
                <Field label="ÉLÈVE" value={header.eleve} onChange={(v) => setHeader("eleve", v)} w={3} />
                <Field label="SEXE" value={header.sexe} onChange={(v) => setHeader("sexe", v)} w={1} />
              </div>
              <div className="row2">
                <Field label="NÉ(E) À" value={header.lieu} onChange={(v) => setHeader("lieu", v)} w={2} />
                <Field label="LE" type="date" value={header.dateNaiss} onChange={(v) => setHeader("dateNaiss", v)} w={2} />
              </div>
              <Field label="CLASSE" value={header.classe} onChange={(v) => setHeader("classe", v)} />
              <Field label="N° PERM." value={header.permanent} onChange={(v) => setHeader("permanent", v)} />
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
              {groups.map((g) => (
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
                  maxTG={tg(g.max)}
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
                <td colSpan={8}><Cell wide value={footer.application} onChange={(v) => setFooter("application", v)} /></td>
                <td colSpan={3} className="shade" /><td className="no-print" />
              </tr>
              <tr>
                <td className="label">CONDUITE</td>
                <td colSpan={8}><Cell wide value={footer.conduite} onChange={(v) => setFooter("conduite", v)} /></td>
                <td colSpan={3} className="shade" /><td className="no-print" />
              </tr>
              <tr>
                <td className="label">PLACE / ÉLÈVES</td>
                <td colSpan={4}><Cell wide value={footer.place} onChange={(v) => setFooter("place", v)} /></td>
                <td colSpan={4} className="sur">sur&nbsp;<Cell value={footer.surEleves} onChange={(v) => setFooter("surEleves", v)} />&nbsp;élèves</td>
                <td colSpan={3} className="shade" /><td className="no-print" />
              </tr>
              <tr>
                <td className="label">SIGNATURE DU RESPONSABLE</td>
                <td colSpan={11}><Cell wide value={footer.chefEtab} onChange={(v) => setFooter("chefEtab", v)} /></td>
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

function GroupRows({ g, nineCols, setMax, setScore, setSubj, addSubject, delSubject, delGroup, maxTG }) {
  return (
    <>
      <tr className="maxima">
        <td className="label">MAXIMA</td>
        {nineCols(g.max, (i, v) => setMax(g.id, i, v), { bold: true })}
        <td colSpan={2} className="shade" />
        <td className="no-print">
          <button className="mini danger" title="Supprimer le groupe" onClick={() => delGroup(g.id)}>×</button>
        </td>
      </tr>
      {g.subjects.map((s) => (
        <tr key={s.id}>
          <td className="name"><Cell wide value={s.name} onChange={(v) => setSubj(g.id, s.id, { name: v })} /></td>
          {nineCols(s.s, (i, v) => setScore(g.id, s.id, i, v))}
          <td><Cell value={s.rep.pct} onChange={(v) => setSubj(g.id, s.id, { rep: { ...s.rep, pct: v } })} /></td>
          <td><Cell wide value={s.rep.sign} onChange={(v) => setSubj(g.id, s.id, { rep: { ...s.rep, sign: v } })} /></td>
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

const css = `` + String.raw`
.page{font-family:"Times New Roman",Georgia,serif;background:#e9e7e1;padding:16px;min-height:100vh;color:#111}
.toolbar{max-width:1000px;margin:0 auto 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.toolbar button,.mini{font:inherit;font-size:13px;padding:6px 12px;border:1px solid #1d3b78;background:#1d3b78;color:#fff;border-radius:4px;cursor:pointer}
.toolbar button.danger,.mini.danger{background:#fff;color:#a32020;border-color:#a32020}
.mini{padding:2px 8px;background:#fff;color:#1d3b78;font-size:12px}
.hint{font-size:12px;color:#555}
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
"@
$content | Set-Content -Path $f -Encoding UTF8
Write-Host "Adminbulletinrdc.tsx written OK" -ForegroundColor Green

# Point /notes route to the new page
$f2 = ".\src\App.tsx"
$c = Get-Content $f2 -Raw -Encoding UTF8
if ($c -match 'const Notes\s*=\s*React\.lazy\(\(\) => import\("@/pages/notes"\)\);') {
  $c = $c -replace 'const Notes\s*=\s*React\.lazy\(\(\) => import\("@/pages/notes"\)\);', 'const Notes       = React.lazy(() => import("@/pages/Adminbulletinrdc"));'
  Set-Content -Path $f2 -Value $c -Encoding UTF8 -NoNewline
  Write-Host "App.tsx route /notes -> Adminbulletinrdc OK" -ForegroundColor Green
} else {
  Write-Host "Could not find Notes import line - check App.tsx manually" -ForegroundColor Yellow
}
