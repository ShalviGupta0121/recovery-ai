import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { metricTone, statusToneMap } from "../lib/format";

export default function PatientCard({ patient, selected, onSelect }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(patient.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(patient.id);
        }
      }}
      className={`glass-panel w-full p-5 text-left transition duration-200 hover:-translate-y-0.5 ${
        selected ? "ring-1 ring-teal/45" : "ring-1 ring-transparent"
      } ${patient.highlighted ? "border-white/15" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{patient.name}</p>
          <p className="mt-1 text-sm text-slate-400">
            {patient.surgeryType} | Day {patient.daysPostOp}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusToneMap[patient.status.tone]}`}
        >
          {patient.status.level}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">HR</p>
          <p
            className={`mt-2 text-2xl font-semibold ${metricTone(
              "heartRate",
              patient.current.heartRate
            )}`}
          >
            {patient.current.heartRate}
          </p>
          <p className="text-xs text-slate-500">bpm</p>
        </div>

        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">SpO2</p>
          <p
            className={`mt-2 text-2xl font-semibold ${metricTone("spo2", patient.current.spo2)}`}
          >
            {patient.current.spo2}
          </p>
          <p className="text-xs text-slate-500">%</p>
        </div>

        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Temp</p>
          <p
            className={`mt-2 text-2xl font-semibold ${metricTone(
              "temperature",
              patient.current.temperature
            )}`}
          >
            {patient.current.temperature}
          </p>
          <p className="text-xs text-slate-500">&deg;C</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>{patient.room}</span>
        <Link
          to={`/patients/${patient.id}`}
          className="inline-flex items-center gap-1 text-teal transition hover:text-white"
          onClick={(event) => event.stopPropagation()}
        >
          Details <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
