import React, { useEffect, useState } from 'react';
import { getBulletin } from '../lib/api';

interface Props {
  studentId: number;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  RELIGION_GROUP: 'Religion / Éducation à la vie / Ed. civ. & morale',
  SCIENCES_GROUP: 'Biologie / Dessin / Éduc. phys. / Géographie / Histoire / etc.',
  LANGUES_NATIONALES_GROUP: 'Anglais / Chimie / Didactique / Pédagogie / Physique / Psychologie',
  LANGUES_PRINCIPALES_GROUP: 'Français / Mathématiques',
  STAGE_GROUP: "Pratique d'enseignement",
};

function fmt(n: number) {
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : '';
}

export default function Bulletin({ studentId, onClose }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBulletin(studentId).then(setData).catch(e => setError(e.message));
  }, [studentId]);

  if (error) return <p style={{ color: '#dc2626' }}>{error}</p>;
  if (!data) return <p>Chargement du bulletin…</p>;

  const { student, categories, grandTotalMaxima, grandTotalActual, percentage, place, classSize } = data;

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 12 }} className="no-print">
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>
          ← Retour
        </button>
        <button
          onClick={() => window.print()}
          style={{ padding: '6px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Imprimer / PDF
        </button>
      </div>

      <div style={{ border: '2px solid #000', padding: 16, fontFamily: 'Georgia, serif', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 16, margin: 0 }}>
          RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
        </h2>
        <p style={{ textAlign: 'center', margin: 0, fontSize: 13 }}>MINISTÈRE DE L'ÉDUCATION NATIONALE</p>
        <p style={{ textAlign: 'center', margin: '0 0 10px', fontSize: 13 }}>ET NOUVELLE CITOYENNETÉ</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
          <div>
            <p>Élève : <strong>{student.fullName}</strong></p>
            <p>Né(e) le : {student.dateNaissance} à {student.lieuNaissance}</p>
            <p>Classe : {student.className} ({student.level})</p>
          </div>
          <div>
            <p>Sexe : {student.sexe}</p>
            <p>N° Perm. : {student.permNumber}</p>
            <p>Année scolaire : {student.academicYear}</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th rowSpan={2} style={cell}>BRANCHES</th>
              <th colSpan={4} style={cell}>PREMIER SEMESTRE</th>
              <th colSpan={4} style={cell}>SECOND SEMESTRE</th>
              <th rowSpan={2} style={cell}>T.G.</th>
            </tr>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={cell}>1ère P.</th>
              <th style={cell}>2e P.</th>
              <th style={cell}>EXAM.</th>
              <th style={cell}>TOT.</th>
              <th style={cell}>3e P.</th>
              <th style={cell}>4e P.</th>
              <th style={cell}>EXAM.</th>
              <th style={cell}>TOT.</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <React.Fragment key={cat.category}>
                <tr style={{ background: '#000', color: '#fff', fontWeight: 700 }}>
                  <td style={cell}>MAXIMA</td>
                  <td style={cell}>{fmt(cat.maxima1.period1)}</td>
                  <td style={cell}>{fmt(cat.maxima1.period2)}</td>
                  <td style={cell}>{fmt(cat.maxima1.exam)}</td>
                  <td style={cell}>{fmt(cat.maxima1.total)}</td>
                  <td style={cell}>{fmt(cat.maxima2.period1)}</td>
                  <td style={cell}>{fmt(cat.maxima2.period2)}</td>
                  <td style={cell}>{fmt(cat.maxima2.exam)}</td>
                  <td style={cell}>{fmt(cat.maxima2.total)}</td>
                  <td style={cell}>{fmt(cat.maximaGeneralTotal)}</td>
                </tr>
                {cat.rows.map((row: any) => (
                  <tr key={row.courseId}>
                    <td style={{ ...cell, textAlign: 'left' }}>{row.courseName}</td>
                    <td style={cell}>{fmt(row.semester1.period1)}</td>
                    <td style={cell}>{fmt(row.semester1.period2)}</td>
                    <td style={cell}>{fmt(row.semester1.exam)}</td>
                    <td style={cell}>{fmt(row.semester1.total)}</td>
                    <td style={cell}>{fmt(row.semester2.period1)}</td>
                    <td style={cell}>{fmt(row.semester2.period2)}</td>
                    <td style={cell}>{fmt(row.semester2.exam)}</td>
                    <td style={cell}>{fmt(row.semester2.total)}</td>
                    <td style={cell}>{fmt(row.generalTotal)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr style={{ fontWeight: 700, borderTop: '2px solid #000' }}>
              <td style={{ ...cell, textAlign: 'left' }}>TOTAUX</td>
              <td colSpan={4} style={cell}></td>
              <td colSpan={4} style={cell}></td>
              <td style={cell}>{fmt(grandTotalActual)} / {fmt(grandTotalMaxima)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13 }}>
          <p>Pourcentage : <strong>{fmt(percentage)}%</strong></p>
          <p>Place : <strong>{place}</strong> / {classSize}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, fontSize: 13 }}>
          <p>Signature de l'élève</p>
          <p>Sceau de l'École</p>
          <p>Chef d'Établissement</p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none; }
        }
      `}</style>
    </div>
  );
}

const cell: React.CSSProperties = {
  border: '1px solid #000',
  padding: '4px 6px',
  textAlign: 'center',
};