// src/components/Sidebar.tsx -- clean single-sidebar version
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Users, CalendarDays, FileText, LogOut,
  GraduationCap, BookOpen, NotebookPen, PenSquare, Megaphone,
  CreditCard, FileBarChart, Settings, Pin, ChevronLeft, Library,
  Home, CalendarCheck, Building2, Briefcase, Layers,
} from "lucide-react";

type NavItem = { path: string; icon: any; label: string };
type NavSection = { title?: string; items: NavItem[] };

const adminNav: NavSection[] = [
  { title: "Pilotage", items: [{ path: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" }] },
  { title: "Scolarite", items: [
    { path: "/eleves",      icon: GraduationCap, label: "Eleves" },
    { path: "/enseignants", icon: Users,         label: "Enseignants" },
    { path: "/cours",       icon: BookOpen,      label: "Cours" },
    { path: "/presences",   icon: CalendarCheck, label: "Presences" },
    { path: "/notes",       icon: NotebookPen,   label: "Notes" },
    { path: "/examens",     icon: PenSquare,     label: "Examens" },
  ]},
  { title: "Administration", items: [
    { path: "/certificates",  icon: FileText,     label: "Certificats" },
    { path: "/paiements",     icon: CreditCard,   label: "Paiements" },
    { path: "/announcements", icon: Megaphone,    label: "Annonces" },
    { path: "/library",       icon: Library,      label: "Bibliotheque" },
    { path: "/reports",       icon: FileBarChart, label: "Rapports" },
    { path: "/sections",      icon: Building2,    label: "Sections" },
  ]},
  { title: "Compte", items: [{ path: "/settings", icon: Settings, label: "Parametres" }] },
];

const teacherNav: NavSection[] = [
  { title: "Pilotage", items: [{ path: "/teacher", icon: Home, label: "Tableau de bord" }] },
  { title: "Enseignement", items: [
    { path: "/teacher/classes",    icon: Layers,        label: "Mes classes" },
    { path: "/teacher/students",   icon: Users,         label: "Eleves" },
    { path: "/teacher/attendance", icon: CalendarCheck, label: "Presences" },
    { path: "/teacher/courses",    icon: BookOpen,      label: "Cours" },
    { path: "/teacher/grades",     icon: NotebookPen,   label: "Notes" },
    { path: "/teacher/exams",      icon: PenSquare,     label: "Examens" },
        { path: "/teacher/announcements", icon: Megaphone, label: "Annonces" },
  ]},
  { title: "Compte", items: [{ path: "/teacher/profile", icon: Settings, label: "Mon profil" }] },
];

const studentNav: NavSection[] = [
  { title: "Pilotage", items: [{ path: "/eleve", icon: Home, label: "Tableau de bord" }] },
  { title: "Scolarite", items: [
    { path: "/eleve/courses",    icon: BookOpen,      label: "Mes cours" },
    { path: "/eleve/grades",     icon: NotebookPen,   label: "Mes notes" },
    { path: "/eleve/attendance", icon: CalendarCheck, label: "Mes presences" },
    { path: "/eleve/exams",      icon: PenSquare,     label: "Examens" },
  ]},
  { title: "Ressources", items: [
    { path: "/eleve/announcements", icon: Megaphone,    label: "Annonces" },
    { path: "/eleve/library",       icon: Library,      label: "Bibliotheque" },
    { path: "/eleve/reports",       icon: FileBarChart, label: "Mes bulletins" },
  ]},
  { title: "Compte", items: [{ path: "/eleve/profile", icon: Settings, label: "Mon profil" }] },
];

const BRAND = "#0B1B3A";
const COLLAPSED_KEY = "iem_sidebar_collapsed";

function pickNav(role: string | undefined) {
  if (role === "admin") return { sections: adminNav, subtitle: "Espace administration", root: "/dashboard" };
  if (role === "enseignant") return { sections: teacherNav, subtitle: "Espace enseignant", root: "/teacher" };
  return { sections: studentNav, subtitle: "Espace eleve", root: "/eleve" };
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(COLLAPSED_KEY) === "true"; } catch { return false; }
  });

  const toggle = () => {
    setCollapsed(p => {
      const n = !p;
      try { localStorage.setItem(COLLAPSED_KEY, String(n)); } catch {}
      return n;
    });
  };

  const { sections, subtitle, root } = pickNav(user?.role);
  const fullName = user?.name || "Utilisateur";
  const initials = fullName.split(" ").map(s => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside style={{
      width: collapsed ? 60 : 260, minWidth: collapsed ? 60 : 260,
      height: "100vh", position: "sticky", top: 0, flexShrink: 0,
      background: BRAND, color: "#fff", display: "flex", flexDirection: "column",
      transition: "width 200ms ease", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 10, padding: collapsed ? "16px 8px" : "16px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{ width: 34, height: 34, background: "#fff", color: BRAND,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: 12, borderRadius: 8 }}>IEMV</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap",
                            overflow: "hidden", textOverflow: "ellipsis" }}>IEM Virunga</div>
              <div style={{ fontSize: 11.5, color: "#8993A8" }}>{subtitle}</div>
            </div>
          </div>
        )}
        <button onClick={toggle} title={collapsed ? "Ouvrir" : "Replier le menu"}
                style={{ background: "rgba(255,255,255,0.06)", border: 0, color: "#AEB6C6",
                         cursor: "pointer", padding: 6, borderRadius: 7, display: "flex" }}>
          {collapsed ? ">" : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {sections.map((section, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            {section.title && !collapsed && (
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#69728A",
                            padding: "14px 10px 6px", letterSpacing: 0.5,
                            textTransform: "uppercase" }}>{section.title}</div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} end={item.path === root}
                         title={collapsed ? item.label : undefined}
                         style={({ isActive }) => ({
                           display: "flex", alignItems: "center",
                           gap: collapsed ? 0 : 11,
                           justifyContent: collapsed ? "center" : "flex-start",
                           padding: collapsed ? "10px 0" : "9px 12px",
                           margin: "2px 0", borderRadius: 8,
                           color: isActive ? BRAND : "#B7BFD1",
                           background: isActive ? "#fff" : "transparent",
                           fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                           textDecoration: "none", whiteSpace: "nowrap",
                         })}>
                  <Icon size={16} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: 12,
                    display: "flex", alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#141F35",
                      color: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", fontWeight: 700, fontSize: 12,
                      border: "1px solid rgba(255,255,255,0.08)" }}>{initials || "?"}</div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
            <div style={{ fontSize: 12.5, color: "#fff", fontWeight: 600,
                          whiteSpace: "nowrap", overflow: "hidden",
                          textOverflow: "ellipsis" }}>{fullName}</div>
            <div style={{ fontSize: 11, color: "#8993A8", whiteSpace: "nowrap",
                          overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
          </div>
        )}
        <button onClick={handleLogout} title="Deconnexion"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                         color: "#B7BFD1", padding: 7, borderRadius: 7, cursor: "pointer" }}>
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
