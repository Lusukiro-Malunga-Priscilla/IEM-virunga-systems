// src/components/SidebarLayout.tsx
import { Outlet } from "react-router";
import Sidebar from "@/components/Sidebar";

/**
 * Layout used by the admin and teacher route trees.
 * Renders the Sidebar on the left and the active page (<Outlet />) on the right.
 */
export default function SidebarLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F6F7FB" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}