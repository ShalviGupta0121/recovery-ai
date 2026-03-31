import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchBootstrap } from "../data/api";

const MonitoringContext = createContext(null);

export function MonitoringProvider({ children }) {
  const [data, setData] = useState({
    patients: [],
    alerts: [],
    generatedAt: null
  });
  const [freshAlerts, setFreshAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const knownAlertIds = useRef(new Set());

  useEffect(() => {
    let isMounted = true;
    const dismissTimers = new Set();
    let source;

    async function loadInitial() {
      try {
        const bootstrap = await fetchBootstrap();
        if (!isMounted) {
          return;
        }
        setData(bootstrap);
        setLoading(false);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.message);
        setLoading(false);
      }
    }

    loadInitial();

    // Shared SSE connection keeps dashboard and patient detail synchronized.
    source = new EventSource("/api/stream");
    source.onmessage = (event) => {
      const snapshot = JSON.parse(event.data);
      setData(snapshot);
      setError("");

      const incomingAlerts = (snapshot.freshAlerts || []).filter((alert) => {
        if (knownAlertIds.current.has(alert.id)) {
          return false;
        }
        knownAlertIds.current.add(alert.id);
        return true;
      });

      if (!incomingAlerts.length) {
        return;
      }

      setFreshAlerts((current) => [...incomingAlerts, ...current].slice(0, 4));

      incomingAlerts.forEach((alert) => {
        const timer = window.setTimeout(() => {
          dismissTimers.delete(timer);
          setFreshAlerts((current) => current.filter((entry) => entry.id !== alert.id));
        }, 4200);
        dismissTimers.add(timer);
      });
    };

    source.onerror = () => {
      setError("Live stream interrupted. Attempting to reconnect...");
    };

    return () => {
      isMounted = false;
      source?.close();
      dismissTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const value = useMemo(
    () => ({
      ...data,
      freshAlerts,
      loading,
      error,
      getPatientById(id) {
        return data.patients.find((patient) => patient.id === id) ?? null;
      }
    }),
    [data, error, freshAlerts, loading]
  );

  return <MonitoringContext.Provider value={value}>{children}</MonitoringContext.Provider>;
}

export function useMonitoringData() {
  const context = useContext(MonitoringContext);

  if (!context) {
    throw new Error("useMonitoringData must be used within MonitoringProvider");
  }

  return context;
}
