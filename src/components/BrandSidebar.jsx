import { Activity } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navigationItems } from "../lib/navigation";

export default function BrandSidebar() {
  return (
    <aside className="glass-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-72 flex-col justify-between p-6 lg:flex">
      <div>
        <div className="flex items-center gap-3">
          <div className="icon-chip bg-teal/15 text-teal ring-teal/20">
            <Activity size={22} />
          </div>
          <div>
            <p className="font-['Poppins'] text-xl font-semibold tracking-wide text-white">
              RecoverAI
            </p>
            <p className="text-sm text-slate-300">Post-operative monitoring</p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/30 p-4">
          <p className="eyebrow">Mission</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Help clinicians catch post-op deterioration early using live telemetry and visible,
            threshold-based escalation logic.
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal text-navy"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="rounded-3xl border border-teal/15 bg-teal/10 p-4">
        <p className="text-sm font-semibold text-white">Demo cue</p>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          An anomaly is intentionally triggered within the first 20-30 seconds so alerts and chart
          changes are visible during demos.
        </p>
      </div>
    </aside>
  );
}
