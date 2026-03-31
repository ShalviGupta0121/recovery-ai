import { NavLink } from "react-router-dom";
import BrandSidebar from "./BrandSidebar";
import ToastStack from "./ToastStack";
import { useMonitoringData } from "../context/MonitoringContext";
import { navigationItems } from "../lib/navigation";

export default function AppShell({ children }) {
  const { freshAlerts } = useMonitoringData();

  return (
    <main className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <ToastStack alerts={freshAlerts} />

      <div className="mx-auto flex max-w-[1600px] gap-6">
        <BrandSidebar />

        <div className="flex-1 space-y-6">
          <nav className="glass-panel flex gap-2 overflow-x-auto p-2 lg:hidden">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-teal text-navy" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {children}
        </div>
      </div>
    </main>
  );
}
