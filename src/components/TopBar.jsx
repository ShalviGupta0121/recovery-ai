import { Activity, BellRing, Search } from "lucide-react";

export default function TopBar({ search, onSearch, generatedAt, alertCount }) {
  return (
    <header className="glass-panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
      <div>
        <p className="eyebrow">RecoverAI</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Post-operative Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">
          Live heart rate, oxygen saturation, and temperature surveillance.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex min-w-[260px] items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search patient"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
          />
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-safe/20 bg-safe/10 px-4 py-3">
          <Activity size={16} className="text-safe" />
          <div>
            <p className="text-sm font-medium text-safe">Live monitoring active</p>
            <p className="text-xs text-slate-300">
              {generatedAt ? `Updated ${new Date(generatedAt).toLocaleTimeString()}` : "Syncing..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">
          <BellRing size={16} className="text-warning" />
          <div>
            <p className="text-sm font-medium text-white">Recent alerts</p>
            <p className="text-xs text-slate-400">{alertCount} retained in feed</p>
          </div>
        </div>
      </div>
    </header>
  );
}
