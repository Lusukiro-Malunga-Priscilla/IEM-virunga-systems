import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";
import type { AppRole } from "@/context/AuthContext";

/**
 * Layout-route guard.
 * Usage:
 *   <Route element={<RequireRole role="eleve" />}>
 *     <Route path="/eleve" element={<StudentDashboard />} />
 *   </Route>
 *
 * It renders <Outlet /> when the role matches, otherwise redirects.
 * If you still want to pass children instead of Outlet, that also works.
 */
export default function RequireRole({
  role,
  children,
}: {
  role: AppRole;
  children?: React.ReactNode;
}) {
  const { user } = useAuth();

  // 1. Not authenticated -> login
  if (!user) return <Navigate to="/login" replace />;

  // 2. Role mismatch -> send to that role's home
  if (user.role !== role) {
    const fallback =
      user.role === "admin" ? "/dashboard" :
      user.role === "enseignant" ? "/teacher" :
      "/eleve";
    return <Navigate to={fallback} replace />;
  }

  // 3. OK -> render outlet or children
  return children ? <>{children}</> : <Outlet />;
}
