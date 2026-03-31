import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BellRing, ClipboardList, HeartPulse } from "lucide-react";
import AlertsPanel from "../components/AlertsPanel";
import AppShell from "../components/AppShell";
import ForecastPanel from "../components/ForecastPanel";
import PageHeader from "../components/PageHeader";
import StatusPanel from "../components/StatusPanel";
import VitalsChart from "../components/VitalsChart";
import { useMonitoringData } from "../context/MonitoringContext";

export default function PatientDetailPage() {
  const { id } = useParams();
  const { getPatientById, loading, error, alerts, generatedAt } = useMonitoringData();
  const patient = getPatientById(id);
  const patientAlerts = patient?.alerts ?? [];
  const baselineSpo2 = patient?.history?.[0]?.spo2 ?? "--";

  if (error && !patient) {
    return (
      <AppShell>
        <div className="glass-panel max-w-lg p-8 text-center">
          <p className="text-lg font-semibold text-white">{error}</p>
          <Link to="/patients" className="mt-4 inline-flex text-teal">
            Return to patients
          </Link>
        </div>
      </AppShell>
    );
  }

  if (loading || !patient) {
    return (
      <AppShell>
        <div className="glass-panel max-w-lg p-8 text-center text-slate-300">
          Loading patient detail...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title={patient.name}
        subtitle={`${patient.surgeryType} | ${patient.room} | Post-op day ${patient.daysPostOp}`}
        generatedAt={generatedAt}
        alertCount={alerts.length}
        actions={
          <Link
            to="/patients"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5"
          >
            <ArrowLeft size={16} />
            Back to Patients
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <div className="flex items-center gap-2 text-slate-300">
            <HeartPulse size={16} className="text-teal" />
            Latest HR
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">{patient.current.heartRate} bpm</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-slate-300">
            <BellRing size={16} className="text-warning" />
            Alerts
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">{patientAlerts.length}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 text-slate-300">
            <ClipboardList size={16} className="text-safe" />
            Risk
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">{patient.status.level}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-6">
          <VitalsChart data={patient.history} metric="heartRate" detailed />
          <VitalsChart data={patient.history} metric="spo2" detailed />
          <VitalsChart data={patient.history} metric="temperature" detailed />
        </div>

        <div className="space-y-6">
          <StatusPanel patient={patient} compact />
          <ForecastPanel forecast={patient.forecast} />

          <div className="glass-panel p-5 md:p-6">
            <p className="eyebrow">Patient Info</p>
            <div className="mt-5 grid gap-3">
              <div className="metric-card">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Age</p>
                <p className="mt-3 text-lg font-semibold text-white">{patient.age}</p>
              </div>
              <div className="metric-card">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Baseline SpO2</p>
                <p className="mt-3 text-lg font-semibold text-white">{baselineSpo2}%</p>
              </div>
              <div className="metric-card">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current Temperature</p>
                <p className="mt-3 text-lg font-semibold text-white">{patient.current.temperature}°C</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AlertsPanel
        alerts={patientAlerts}
        title="Alert History"
        subtitle="Rule-triggered events for this patient"
      />
    </AppShell>
  );
}
