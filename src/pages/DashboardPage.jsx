import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert, ShieldCheck, Waves } from "lucide-react";
import AppShell from "../components/AppShell";
import ForecastPanel from "../components/ForecastPanel";
import PageHeader from "../components/PageHeader";
import PatientCard from "../components/PatientCard";
import StatusPanel from "../components/StatusPanel";
import VitalsChart from "../components/VitalsChart";
import { useMonitoringData } from "../context/MonitoringContext";
import { formatStatusCount, getStatusMeta } from "../lib/format";

const summaryCards = [
  {
    key: "safe",
    label: "Stable",
    description: "Patients inside expected post-op ranges",
    icon: ShieldCheck
  },
  {
    key: "warning",
    label: "Watch",
    description: "Early change that needs closer observation",
    icon: Waves
  },
  {
    key: "critical",
    label: "High Risk",
    description: "Threshold breach requiring attention",
    icon: ShieldAlert
  }
];

export default function DashboardPage() {
  const { patients, alerts, generatedAt, loading, error } = useMonitoringData();
  const [selectedId, setSelectedId] = useState("1");

  const prioritizedPatients = useMemo(() => {
    const order = { critical: 0, warning: 1, safe: 2 };
    return [...patients]
      .sort((a, b) => order[a.status.tone] - order[b.status.tone] || a.name.localeCompare(b.name))
      .slice(0, 4);
  }, [patients]);

  const selectedPatient =
    prioritizedPatients.find((patient) => patient.id === selectedId) ??
    prioritizedPatients[0] ??
    patients.find((patient) => patient.id === selectedId) ??
    patients[0] ??
    null;

  if (loading) {
    return (
      <AppShell>
        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="glass-panel max-w-xl p-8 text-center">
            <p className="text-lg font-semibold text-white">Starting RecoverAI monitoring...</p>
            <p className="mt-3 text-slate-300">
              Loading the simulated telemetry feed and preparing the dashboard.
            </p>
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Operations Dashboard"
        subtitle="A focused overview of post-operative recovery: live patient risk distribution, the current watchlist, the active alert feed, and real-time vitals for one selected patient."
        generatedAt={generatedAt}
        alertCount={alerts.length}
        actions={
          <>
            <Link
              to="/patients"
              className="primary-action"
            >
              Open Patients <ArrowRight size={16} />
            </Link>
            <Link
              to="/alerts"
              className="secondary-action"
            >
              Open Alerts <ArrowRight size={16} />
            </Link>
          </>
        }
      />

      {error ? (
        <div className="rounded-3xl border border-warning/25 bg-warning/10 px-5 py-4 text-sm text-warning">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => {
          const meta = getStatusMeta(card.key);
          const count = formatStatusCount(patients, card.key);

          return (
            <article key={card.key} className={`metric-panel ${meta.surfaceClass}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{count}</p>
                </div>
                <div className={`icon-chip ${meta.softClass}`}>
                  <card.icon size={18} />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{card.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="glass-panel p-5 md:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Watchlist</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Patients needing attention</h2>
              </div>
              <Link to="/patients" className="text-sm font-medium text-teal transition hover:text-white">
                View all patients
              </Link>
            </div>

            <div className="mt-5 grid gap-4">
              {prioritizedPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  selected={selectedPatient?.id === patient.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 md:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Alert Feed</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Recent escalations</h2>
              </div>
              <Link to="/alerts" className="text-sm font-medium text-teal transition hover:text-white">
                View all alerts
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <Link
                  key={alert.id}
                  to={`/patients/${alert.patientId}`}
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-teal/25 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{alert.patientName}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{alert.issue}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {alert.severity}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {selectedPatient ? (
          <div className="space-y-6">
            <StatusPanel patient={selectedPatient} />
            <ForecastPanel forecast={selectedPatient.forecast} />
          </div>
        ) : null}
      </section>

      {selectedPatient ? (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Live Vitals</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {selectedPatient.name} telemetry
              </h2>
            </div>
            <Link
              to={`/patients/${selectedPatient.id}`}
              className="text-sm font-medium text-teal transition hover:text-white"
            >
              Open patient detail
            </Link>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <VitalsChart data={selectedPatient.history} metric="heartRate" />
            <VitalsChart data={selectedPatient.history} metric="spo2" />
            <VitalsChart data={selectedPatient.history} metric="temperature" />
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
