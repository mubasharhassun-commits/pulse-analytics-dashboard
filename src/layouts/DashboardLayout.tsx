import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/campaigns": "Campaigns",
  "/subscribers": "Subscribers",
  "/automations": "Automations",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 space-y-5 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
