// import React, { useEffect, useMemo, useState } from "react";
// import { loadCourses, loadStudents, type Course, type Student } from "../bulletinStore";
// import { useAuth } from "@/context/AuthContext";

// const NAVY = "#0B1B3A";
// const MUTED = "#64748b";
// const BORDER = "#e4e0d6";

// const FALLBACK_SECTIONS = [
//   { value: "INFIRMIERE",            displayName: "Section Infirmiere de la REFORME" },
//   { value: "ACCOUCHEUSE",           displayName: "Section Accoucheuse de la REFORME" },
//   { value: "ASSISTANT_PHARMACIE",   displayName: "Section Assistant en pharmacie de la REFORME" },
//   { value: "SANTE_MENTALE",         displayName: "Section Sante Mentale de la REFORME" },
//   { value: "TECHNIQUE_LABORATOIRE", displayName: "Section Technique de Laboratoire de la REFORME" },
// ];

// const CLASSES = ["1ere", "2eme", "3eme", "4eme"];

// type Combo = { classe: string; section: string; courses: Course[]; students: Student[] };

// export default function TeacherClasses() {
//   const { user } = useAuth() as any;
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([loadCourses(), loadStudents()]).then(([c, s]) => {
//       setCourses(c);
//       setStudents(s);
//       setLoading(false);
//     });
//   }, []);

//   const myCourses = useMemo(() => {
//     if (!courses.length) return [];
//     const hasTeacherIds = courses.some((c) => c.teacherId && c.teacherId.length > 0);
//     if (!hasTeacherIds) return courses;
//     const mine = courses.filter((c) => c.teacherId === user?.id);
//     return mine.length ? mine : courses;
//   }, [courses, user]);

//   // Build a class+section combo per (classe, section) that contains at least 1 student
//   const combos = useMemo<Combo[]>(() => {
//     const map = new Map<string, Combo>();
//     for (const s of students) {
//       const section = (s as any).section || "INFIRMIERE";
//       const key = s.classe + "::" + section;
//       if (!map.has(key)) {
//         map.set(key, { classe: s.classe, section, courses: [], students: [] });
//       }
//       map.get(key)!.students.push(s);
//     }
//     return Array.from(map.values()).map((c) => ({
//       ...c,
//       courses: myCourses,
//     }));
//   }, [students, myCourses]);

//   const sectionLabel = (v: string) =>
//     FALLBACK_SECTIONS.find((s) => s.value === v)?.displayName || v;

//   if (loading) return <div style={{ padding: 24, color: MUTED }}>Chargement...</div>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Mes classes</h1>
//       <p style={{ color: MUTED, marginBottom: 20 }}>
//         {combos.length} classe(s) — vous pouvez y saisir les notes et prendre les presences.
//       </p>

//       <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
//         {combos.map((c) => (
//         <div key={c.classe + "-" + c.section} style={{
//             border: 1px solid , borderRadius: 12, padding: 16, background: "#fff",
//             boxShadow: "0 1px 3px rgba(0,0,0,.04)",
//           }}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//               <strong style={{ color: NAVY, fontSize: 16 }}>{c.classe}</strong>
//               <span style={{ color: MUTED, fontSize: 13 }}>{c.students.length} eleve(s)</span>
//             </div>
//             <div style={{ color: "#334155", fontSize: 13, marginBottom: 8 }}>
//               {sectionLabel(c.section)}
//             </div>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//               {c.courses.length === 0 && <span style={{ color: MUTED, fontSize: 12 }}>Aucun cours assigne</span>}
//               {c.courses.slice(0, 5).map((co) => (
//                 <span key={co.id} style={{
//                   background: "#eef2ff", color: "#3730a3", padding: "2px 8px",
//                   borderRadius: 999, fontSize: 12,
//                 }}>{co.name}</span>
//               ))}
//             </div>
//           </div>
//         ))}
//         {combos.length === 0 && (
//           <p style={{ color: MUTED }}>Aucune classe avec eleves enregistres.</p>
//         )}
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useMemo, useState } from "react";
// import { loadCourses, loadStudents, type Course, type Student } from "../bulletinStore";
// import { useAuth } from "@/context/AuthContext";

// const NAVY = "#0B1B3A";
// const MUTED = "#64748b";
// const BORDER = "#e4e0d6";

// const FALLBACK_SECTIONS = [
//   { value: "INFIRMIERE",            displayName: "Section Infirmière de la RÉFORME" },
//   { value: "ACCOUCHEUSE",           displayName: "Section Accoucheuse de la RÉFORME" },
//   { value: "ASSISTANT_PHARMACIE",   displayName: "Section Assistant en pharmacie de la RÉFORME" },
//   { value: "SANTE_MENTALE",         displayName: "Section Santé Mentale de la RÉFORME" },
//   { value: "TECHNIQUE_LABORATOIRE", displayName: "Section Technique de Laboratoire de la RÉFORME" },
// ];

// type Combo = { classe: string; section: string; courses: Course[]; students: Student[] };

// export default function TeacherClasses() {
//   const { user } = useAuth() as any;
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([loadCourses(), loadStudents()]).then(([c, s]) => {
//       setCourses(c);
//       setStudents(s);
//       setLoading(false);
//     });
//   }, []);

//   const myCourses = useMemo(() => {
//     if (!courses.length) return [];
//     const hasTeacherIds = courses.some((c) => c.teacherId && c.teacherId.length > 0);
//     if (!hasTeacherIds) return courses;
//     const mine = courses.filter((c) => c.teacherId === user?.id);
//     return mine.length ? mine : courses;
//   }, [courses, user]);

//   const combos = useMemo<Combo[]>(() => {
//     const map = new Map<string, Combo>();
//     for (const s of students) {
//       const section = (s as any).section || "INFIRMIERE";
//       const key = s.classe + "::" + section;
//       if (!map.has(key)) {
//         map.set(key, { classe: s.classe, section, courses: [], students: [] });
//       }
//       map.get(key)!.students.push(s);
//     }
//     return Array.from(map.values()).map((c) => ({ ...c, courses: myCourses }));
//   }, [students, myCourses]);

//   const sectionLabel = (v: string) =>
//     FALLBACK_SECTIONS.find((s) => s.value === v)?.displayName || v;

//   if (loading) return <div style={{ padding: 24, color: MUTED }}>Chargement...</div>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Mes classes</h1>
//       <p style={{ color: MUTED, marginBottom: 20 }}>
//         {combos.length} classe(s) — vous pouvez y saisir les notes et prendre les présences.
//       </p>

//       <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
//         {combos.map((c) => (
//           <div
//             key={c.classe + "-" + c.section}
//             style={{
//               border: "1px solid " + BORDER,
//               borderRadius: 12,
//               padding: 16,
//               background: "#fff",
//               boxShadow: "0 1px 3px rgba(0,0,0,.04)",
//             }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//               <strong style={{ color: NAVY, fontSize: 16 }}>{c.classe}</strong>
//               <span style={{ color: MUTED, fontSize: 13 }}>{c.students.length} élève(s)</span>
//             </div>
//             <div style={{ color: "#334155", fontSize: 13, marginBottom: 8 }}>
//               {sectionLabel(c.section)}
//             </div>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//               {c.courses.length === 0 && (
//                 <span style={{ color: MUTED, fontSize: 12 }}>Aucun cours assigné</span>
//               )}
//               {c.courses.slice(0, 5).map((co) => (
//                 <span
//                   key={co.id}
//                   style={{
//                     background: "#eef2ff",
//                     color: "#3730a3",
//                     padding: "2px 8px",
//                     borderRadius: 999,
//                     fontSize: 12,
//                   }}
//                 >
//                   {co.name}
//                 </span>
//               ))}
//             </div>
//           </div>
//         ))}
//         {combos.length === 0 && (
//           <p style={{ color: MUTED }}>Aucune classe avec élèves enregistrés.</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { loadCourses, loadStudents, type Course, type Student } from "../bulletinStore";
import { useAuth } from "@/context/AuthContext";

const NAVY = "#0B1B3A";
const MUTED = "#64748b";
const BORDER = "#e4e0d6";

const FALLBACK_SECTIONS = [
  { value: "INFIRMIERE",            displayName: "Section Infirmière de la RÉFORME" },
  { value: "ACCOUCHEUSE",           displayName: "Section Accoucheuse de la RÉFORME" },
  { value: "ASSISTANT_PHARMACIE",   displayName: "Section Assistant en pharmacie de la RÉFORME" },
  { value: "SANTE_MENTALE",         displayName: "Section Santé Mentale de la RÉFORME" },
  { value: "TECHNIQUE_LABORATOIRE", displayName: "Section Technique de Laboratoire de la RÉFORME" },
];

type Combo = { classe: string; section: string; courses: Course[]; students: Student[] };

export default function TeacherClasses() {
  const { user } = useAuth() as any;
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadCourses(), loadStudents()]).then(([c, s]) => {
      setCourses(c);
      setStudents(s);
      setLoading(false);
    });
  }, []);

  const myCourses = useMemo(() => {
    if (!courses.length) return [];
    const hasTeacherIds = courses.some((c) => c.teacherId && c.teacherId.length > 0);
    if (!hasTeacherIds) return courses;
    const mine = courses.filter((c) => c.teacherId === user?.id);
    return mine.length ? mine : courses;
  }, [courses, user]);

  const combos = useMemo<Combo[]>(() => {
    const map = new Map<string, Combo>();
    for (const s of students) {
      const section = (s as any).section || "INFIRMIERE";
      const key = s.classe + "::" + section;
      if (!map.has(key)) {
        map.set(key, { classe: s.classe, section, courses: [], students: [] });
      }
      map.get(key)!.students.push(s);
    }
    return Array.from(map.values()).map((c) => ({ ...c, courses: myCourses }));
  }, [students, myCourses]);

  const sectionLabel = (v: string) =>
    FALLBACK_SECTIONS.find((s) => s.value === v)?.displayName || v;

  if (loading) return <div style={{ padding: 24, color: MUTED }}>Chargement...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Mes classes</h1>
      <p style={{ color: MUTED, marginBottom: 20 }}>
        {combos.length} classe(s) — vous pouvez y saisir les notes et prendre les présences.
      </p>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {combos.map((c) => (
          <div
            key={c.classe + "-" + c.section}
            style={{
              border: "1px solid " + BORDER,
              borderRadius: 12,
              padding: 16,
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <strong style={{ color: NAVY, fontSize: 16 }}>{c.classe}</strong>
              <span style={{ color: MUTED, fontSize: 13 }}>{c.students.length} élève(s)</span>
            </div>
            <div style={{ color: "#334155", fontSize: 13, marginBottom: 8 }}>
              {sectionLabel(c.section)}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c.courses.length === 0 && (
                <span style={{ color: MUTED, fontSize: 12 }}>Aucun cours assigné</span>
              )}
              {c.courses.slice(0, 5).map((co) => (
                <span
                  key={co.id}
                  style={{
                    background: "#eef2ff",
                    color: "#3730a3",
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                  }}
                >
                  {co.name}
                </span>
              ))}
            </div>
          </div>
        ))}
        {combos.length === 0 && (
          <p style={{ color: MUTED }}>Aucune classe avec élèves enregistrés.</p>
        )}
      </div>
    </div>
  );
}