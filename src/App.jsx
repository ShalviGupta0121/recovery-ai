import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { MonitoringProvider } from "./context/MonitoringContext";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PatientsPage = lazy(() => import("./pages/PatientsPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));
const PatientDetailPage = lazy(() => import("./pages/PatientDetailPage"));

export default function App() {
  return (
    <MonitoringProvider>
      <AppErrorBoundary>
        <BrowserRouter>
          <Suspense
            fallback={
              <main className="flex min-h-screen items-center justify-center px-6">
                <div className="glass-panel max-w-lg p-8 text-center">
                  <p className="text-lg font-semibold text-white">
                    Loading RecoverAI...
                  </p>
                  <p className="mt-3 text-slate-300">
                    Preparing the monitoring workspace.
                  </p>
                </div>
              </main>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/patients/:id" element={<PatientDetailPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppErrorBoundary>
    </MonitoringProvider>
  );
}
