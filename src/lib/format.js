export const statusToneMap = {
  safe: "bg-safe/15 text-safe ring-safe/30",
  warning: "bg-warning/15 text-warning ring-warning/30",
  critical: "bg-critical/15 text-critical ring-critical/30"
};

export const forecastToneMap = {
  Stable: "bg-safe/15 text-safe ring-safe/20",
  Watch: "bg-warning/15 text-warning ring-warning/20",
  "High Risk": "bg-critical/15 text-critical ring-critical/20"
};

export function metricTone(metric, value) {
  if (metric === "heartRate") {
    return value > 110 ? "text-critical" : value > 100 || value < 60 ? "text-warning" : "text-slate-100";
  }

  if (metric === "spo2") {
    return value < 92 ? "text-critical" : value < 95 ? "text-warning" : "text-slate-100";
  }

  if (metric === "temperature") {
    return value > 38 ? "text-critical" : value > 37.6 ? "text-warning" : "text-slate-100";
  }

  return "text-slate-100";
}

export function formatStatusCount(patients, tone) {
  return patients.filter((patient) => patient.status.tone === tone).length;
}

export function getStatusMeta(tone) {
  if (tone === "critical") {
    return {
      softClass: "bg-critical/12 text-critical ring-critical/20",
      surfaceClass: "border-critical/15 bg-critical/[0.06]"
    };
  }

  if (tone === "warning") {
    return {
      softClass: "bg-warning/12 text-warning ring-warning/20",
      surfaceClass: "border-warning/15 bg-warning/[0.06]"
    };
  }

  return {
    softClass: "bg-safe/12 text-safe ring-safe/20",
    surfaceClass: "border-safe/15 bg-safe/[0.06]"
  };
}
