import { forecastToneMap } from "../lib/format";

export default function ForecastPanel({ forecast }) {
  return (
    <div className="glass-panel p-5 md:p-6">
      <p className="eyebrow">Simple Prediction</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Near-term risk outlook</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        This uses the recent telemetry average, not a machine learning model, so the logic stays
        easy to explain in demos.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {forecast.map((entry) => (
          <div
            key={entry.hour}
            className="rounded-2xl border border-white/10 bg-slate-950/30 p-4"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{entry.hour}</p>
            <span
              className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ${forecastToneMap[entry.risk]}`}
            >
              {entry.risk}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
