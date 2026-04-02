import { Activity, BellRing, Search } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  generatedAt,
  alertCount,
  search,
  onSearch,
  searchPlaceholder = "Search patient",
  actions
}) {
  return (
    <header className="glass-panel flex flex-col gap-4 p-5 md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="eyebrow">RecoverAI</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{subtitle}</p>
        </div>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {typeof search === "string" && typeof onSearch === "function" ? (
          <label className="flex min-w-[260px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent outline-none placeholder:text-slate-500"
            />
          </label>
        ) : (
          <div className="text-sm text-slate-400">Focused post-operative monitoring workspace</div>
        )}

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex items-center gap-3 rounded-2xl border border-safe/20 bg-safe/[0.08] px-4 py-3">
            <Activity size={16} className="text-safe" />
            <div>
              <p className="text-sm font-medium text-safe">Live monitoring active</p>
              <p className="text-xs text-slate-300">
                {generatedAt ? `Updated ${new Date(generatedAt).toLocaleTimeString()}` : "Syncing..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <BellRing size={16} className="text-warning" />
            <div>
              <p className="text-sm font-medium text-white">Recent alerts</p>
              <p className="text-xs text-slate-400">{alertCount} retained in feed</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
