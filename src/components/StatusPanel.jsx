import { Activity, ShieldAlert, ShieldCheck } from "lucide-react";
import { statusToneMap } from "../lib/format";

export default function StatusPanel({ patient, compact = false }) {
  const reasons = patient.status.reasons?.length
    ? patient.status.reasons
    : ["Monitoring rules are evaluating the current telemetry feed."];

  const Icon =
    patient.status.tone === "critical"
      ? ShieldAlert
      : patient.status.tone === "warning"
        ? Activity
        : ShieldCheck;

  return (
    <div className="glass-panel p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Risk Status</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{patient.status.level}</h2>
          <p className="mt-2 text-sm text-slate-300">{patient.status.message}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusToneMap[patient.status.tone]}`}
        >
          {patient.status.level}
        </span>
      </div>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
        <div className="flex items-center gap-3">
          <div className="icon-chip bg-white/5 text-white ring-white/10">
            <Icon size={20} className="text-teal" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Current bedside assessment</p>
            <p className="text-xl font-semibold text-white">{patient.name}</p>
          </div>
        </div>

        <div className={`mt-5 grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-3"}`}>
          <div className="metric-card">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Heart Rate</p>
            <p className="mt-3 text-xl font-semibold text-white">{patient.current.heartRate} bpm</p>
          </div>
          <div className="metric-card">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">SpO2</p>
            <p className="mt-3 text-xl font-semibold text-white">{patient.current.spo2}%</p>
          </div>
          <div className="metric-card">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Temperature</p>
            <p className="mt-3 text-xl font-semibold text-white">{patient.current.temperature}°C</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {reasons.map((reason) => (
            <div
              key={reason}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-slate-200"
            >
              {reason}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
