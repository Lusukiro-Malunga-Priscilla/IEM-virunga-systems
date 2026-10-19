import { useAuth } from "@/context/AuthContext";
import {
  CalendarDays, NotebookPen, ClipboardList, GraduationCap,
  Megaphone, BookOpen, FileText,
} from "lucide-react";

export default function StudentDashboardHome() {
  const { user } = useAuth();
  const fullName = user?.name || "Utilisateur";

  return (
    <>
      <div className="sd-hello">
        <h2>Bonjour {fullName.split(" ")[0]}.</h2>
        <p>Voici un apercu de votre parcours a l'IEM Virunga.</p>
      </div>

      <div className="sd-stat-grid">
        <div className="sd-stat">
          <div className="sd-stat-label"><CalendarDays size={14} /> Cours aujourd'hui</div>
          <div className="sd-stat-value">0</div>
        </div>
        <div className="sd-stat">
          <div className="sd-stat-label"><NotebookPen size={14} /> Moyenne generale</div>
          <div className="sd-stat-value">--</div>
        </div>
        <div className="sd-stat">
          <div className="sd-stat-label"><ClipboardList size={14} /> Devoirs en attente</div>
          <div className="sd-stat-value">0</div>
        </div>
        <div className="sd-stat">
          <div className="sd-stat-label"><GraduationCap size={14} /> Ma classe</div>
          <div className="sd-stat-value">--</div>
        </div>
      </div>

      <div className="sd-panels">
        <section className="sd-card">
          <h3><Megaphone size={17} /> Annonces recentes</h3>
          <div className="sd-empty">Aucune annonce recente.</div>
        </section>

        <section className="sd-card">
          <h3><ClipboardList size={17} /> A faire</h3>
          <div className="sd-task-item">
            <FileText size={14} />
            <span>Rendre le devoir de mathematiques pour vendredi.</span>
          </div>
          <div className="sd-task-item">
            <BookOpen size={14} />
            <span>Reviser le chapitre 3 pour le controle.</span>
          </div>
          <div className="sd-task-item">
            <NotebookPen size={14} />
            <span>Consulter les notes du dernier examen.</span>
          </div>
        </section>
      </div>
    </>
  );
}
