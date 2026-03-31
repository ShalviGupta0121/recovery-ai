import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import ForecastPanel from "../components/ForecastPanel";
import PageHeader from "../components/PageHeader";
import PatientCard from "../components/PatientCard";
import StatusPanel from "../components/StatusPanel";
import VitalsChart from "../components/VitalsChart";
import { useMonitoringData } from "../context/MonitoringContext";

export default function PatientsPage() {
  const { patients, alerts, generatedAt, loading } = useMonitoringData();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("1");

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    return patients.filter((patient) => {
      const haystack = `${patient.name} ${patient.room} ${patient.surgeryType}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [patients, search]);

  const selectedPatient =
    filteredPatients.find((patient) => patient.id === selectedId) ??
    filteredPatients[0] ??
    patients.find((patient) => patient.id === selectedId) ??
    patients[0] ??
    null;

  if (loading) {
    return (
      <AppShell>
        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="glass-panel max-w-xl p-8 text-center text-slate-300">
            Loading patient roster...
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Patients"
        subtitle="Browse the full monitored roster, search by patient or procedure, and inspect a selected patient’s current risk state and vital trends."
        generatedAt={generatedAt}
        alertCount={alerts.length}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by patient, room, or procedure"
      />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel p-5 md:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Roster</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Monitored patients</h2>
            </div>
            <p className="text-sm text-slate-400">{filteredPatients.length} results</p>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                selected={selectedPatient?.id === patient.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </div>

        {selectedPatient ? (
          <div className="space-y-6">
            <StatusPanel patient={selectedPatient} />
            <ForecastPanel forecast={selectedPatient.forecast} />
            <Link
              to={`/patients/${selectedPatient.id}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-teal px-5 py-3 text-sm font-medium text-navy transition hover:brightness-110"
            >
              Open Full Patient Detail
            </Link>
          </div>
        ) : null}
      </section>

      {selectedPatient ? (
        <section className="space-y-4">
          <div>
            <p className="eyebrow">Trends</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {selectedPatient.name} live telemetry
            </h2>
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
