import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // ✅ Default import (fixed)

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background text-white">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
