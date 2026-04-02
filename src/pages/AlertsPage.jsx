import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import AlertsPanel from "../components/AlertsPanel";
import PageHeader from "../components/PageHeader";
import { useMonitoringData } from "../context/MonitoringContext";

const filters = [
  { key: "all", label: "All Alerts" },
  { key: "Critical", label: "Critical" },
  { key: "Watch", label: "Watch" }
];

export default function AlertsPage() {
  const { alerts, patients, generatedAt, loading } = useMonitoringData();
  const [filter, setFilter] = useState("all");

  const filteredAlerts = useMemo(() => {
    return filter === "all" ? alerts : alerts.filter((alert) => alert.severity === filter);
  }, [alerts, filter]);

  const highlightedAlert = filteredAlerts[0] ?? null;
  const highlightedPatient =
    patients.find((patient) => patient.id === highlightedAlert?.patientId) ?? null;
  const criticalCount = alerts.filter((alert) => alert.severity === "Critical").length;
  const watchCount = alerts.filter((alert) => alert.severity === "Watch").length;
  const affectedPatients = new Set(alerts.map((alert) => alert.patientId)).size;

  if (loading) {
    return (
      <AppShell>
        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="glass-panel max-w-xl p-8 text-center text-slate-300">
            Loading alert feed...
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Alerts"
        subtitle="Review watch and high-risk events in one place, then jump directly to the affected patient record for follow-up."
        generatedAt={generatedAt}
        alertCount={alerts.length}
        actions={
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  filter === item.key
                    ? "border border-teal/25 bg-teal/12 text-white"
                    : "border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="metric-panel border-critical/15 bg-critical/[0.06]">
          <p className="text-sm text-slate-300">Critical alerts</p>
          <p className="mt-2 text-3xl font-semibold text-white">{criticalCount}</p>
        </div>
        <div className="metric-panel border-warning/15 bg-warning/[0.06]">
          <p className="text-sm text-slate-300">Watch alerts</p>
          <p className="mt-2 text-3xl font-semibold text-white">{watchCount}</p>
        </div>
        <div className="metric-panel border-safe/15 bg-safe/[0.06]">
          <p className="text-sm text-slate-300">Patients affected</p>
          <p className="mt-2 text-3xl font-semibold text-white">{affectedPatients}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AlertsPanel
          alerts={filteredAlerts}
          title={filter === "all" ? "All Alerts" : `${filter} Alerts`}
          subtitle="Click patient links inside each alert card to open the affected record"
        />

        <div className="space-y-6">
          <div className="glass-panel p-5 md:p-6">
            <p className="eyebrow">Highlighted Alert</p>
            {highlightedAlert ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-lg font-semibold text-white">{highlightedAlert.patientName}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{highlightedAlert.issue}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {highlightedAlert.severity} | {highlightedAlert.time}
                  </p>
                </div>

                {highlightedPatient ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm text-slate-400">Current patient status</p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {highlightedPatient.status.level}
                    </p>
                    <p className="mt-3 text-sm text-slate-300">
                      HR {highlightedPatient.current.heartRate} bpm | SpO2{" "}
                      {highlightedPatient.current.spo2}% | Temp{" "}
                      {highlightedPatient.current.temperature}&deg;C
                    </p>
                    <Link
                      to={`/patients/${highlightedPatient.id}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal transition hover:text-white"
                    >
                      Open patient detail
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-300">No alerts match the active filter.</p>
            )}
          </div>

          <div className="glass-panel p-5 md:p-6">
            <p className="eyebrow">Response Logic</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <p>
                Critical alerts are triggered when SpO2 drops below 92%, heart rate rises above
                110 bpm, or temperature exceeds 38&deg;C.
              </p>
              <p>
                Watch alerts surface earlier drift so care teams can inspect a patient before the
                threshold becomes high risk.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
