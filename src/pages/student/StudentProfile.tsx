import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { studentApi, StudentDashboard } from "@/lib/studentApi";

/** Accepts "data:...", a raw base64 string, a full URL, or a relative path. */
function toImageSrc(raw?: string | null): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;
  if (s.startsWith("data:")) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s; // relative to backend origin
  // Heuristic: raw base64 string
  if (/^[A-Za-z0-9+/=]+$/.test(s) && s.length > 40) {
    return `data:image/jpeg;base64,${s}`;
  }
  return s;
}

export default function StudentProfile() {
  const { user } = useAuth();
  const [me, setMe] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    studentApi.me()
      .then(d => { if (!cancelled) setMe(d); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const student = me?.student ?? {};
  const firstName = (user?.firstName ?? student.firstName ?? "").trim();
  const lastName  = (user?.lastName  ?? student.lastName  ?? "").trim();
  const fullName  = student.fullName ?? `${firstName} ${lastName}`.trim() ?? user?.name ?? "Utilisateur";
  const email     = user?.email ?? student.email ?? "";

  const initials = (
    (firstName.charAt(0) || fullName.charAt(0) || "") +
    (lastName.charAt(0)  || fullName.split(" ").slice(-1)[0]?.charAt(0) || "")
  ).toUpperCase() || "?";

  const photoRaw =
    (student as any).photo ??
    (student as any).profilePicture ??
    (student as any).picture ??
    null;

  const photoSrc = toImageSrc(photoRaw);

  const Row = ({ label, value }: { label: string; value?: string }) => (
    <div style={{
      display: "flex", justifyContent: "space-between",
      padding: "14px 20px", borderBottom: "1px solid #E7EAF0",
    }}>
      <span style={{ color: "#6B7280", fontSize: 13.5 }}>{label}</span>
      <span style={{ color: "#12141B", fontSize: 13.5, fontWeight: 600 }}>
        {value && value.length > 0 ? value : "--"}
      </span>
    </div>
  );

  return (
    <div style={pageWrap}>
      <h1 style={h1Style}>Mon profil</h1>
      <p style={subStyle}>Informations de votre compte.</p>

      {loading && <p style={{ color: "#6E7580" }}>Chargement...</p>}

      <div style={card}>
        <div style={{ padding: "24px 20px", display: "flex",
                      alignItems: "center", gap: 18, borderBottom: "1px solid #E7EAF0" }}>
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={fullName}
              style={{
                width: 72, height: 72, borderRadius: "50%", objectFit: "cover",
                border: "3px solid #E7EAF0", background: "#F4F6FA",
              }}
              onError={(e) => {
                // If the URL fails, hide the img and let initials fallback take over
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const sib = (e.currentTarget.nextElementSibling as HTMLElement | null);
                if (sib) sib.style.display = "flex";
              }}
            />
          ) : null}
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#0B1B3A", color: "#fff",
            display: photoSrc ? "none" : "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 700, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0B1B3A" }}>
              {fullName}
            </div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>{email}</div>
          </div>
        </div>

        <Row label="Identifiant"        value={String((user as any)?.studentId ?? user?.id ?? student.id ?? "")} />
        <Row label="Matricule"          value={student.registrationNumber} />
        <Row label="Role"               value={user?.role ?? "eleve"} />
        <Row label="Email"              value={email} />
        <Row label="Prenom"             value={firstName} />
        <Row label="Nom"                value={lastName} />
        <Row label="Classe"             value={student.studentClass} />
        <Row label="Section"            value={student.section} />
        <Row label="Nationalite"        value={student.nationality} />
        <Row label="Statut inscription" value={student.enrollmentStatus} />
      </div>
    </div>
  );
}

const pageWrap: React.CSSProperties = { padding: "32px 36px 64px", maxWidth: 900 };
const h1Style: React.CSSProperties = { fontSize: 24, fontWeight: 800, color: "#0A1B33", margin: 0 };
const subStyle: React.CSSProperties = { color: "#6E7580", marginTop: 6, marginBottom: 24, fontSize: 14 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid #E7EAF0",
  borderRadius: 8, overflow: "hidden" };
