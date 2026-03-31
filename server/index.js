import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 4000;
const STREAM_INTERVAL_MS = 1500;
const INITIAL_HISTORY_POINTS = 80;
const MAX_HISTORY_POINTS = 120;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");
const distIndexPath = path.join(distPath, "index.html");
const hasBuiltClient = existsSync(distIndexPath);

app.use(cors());
app.use(express.json());

const surgeries = [
  "Laparoscopic Appendectomy",
  "Knee Arthroscopy",
  "Hip Replacement",
  "Coronary Bypass",
  "Gallbladder Removal",
  "Hernia Repair"
];

const names = [
  "Patient 01",
  "Patient 02",
  "Patient 03",
  "Patient 04",
  "Patient 05",
  "Patient 06"
];

const streams = new Set();
let tickCount = 0;
let alertId = 1;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const nowLabel = () =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date());

function getStatus({ heartRate, spo2, temperature }) {
  const reasons = [];

  if (spo2 < 92 || heartRate > 110 || temperature > 38) {
    if (spo2 < 92) {
      reasons.push(`SpO2 ${spo2}% is below the 92% high-risk threshold`);
    }
    if (heartRate > 110) {
      reasons.push(`Heart rate ${heartRate} bpm is above the 110 bpm threshold`);
    }
    if (temperature > 38) {
      reasons.push(`Temperature ${temperature}°C is above the 38°C threshold`);
    }

    return {
      level: "High Risk",
      tone: "critical",
      message: "Immediate bedside review recommended.",
      reasons
    };
  }

  if (spo2 < 95 || heartRate > 100 || heartRate < 60 || temperature > 37.6) {
    if (spo2 < 95) {
      reasons.push(`SpO2 ${spo2}% is trending below the target range`);
    }
    if (heartRate > 100 || heartRate < 60) {
      reasons.push(`Heart rate ${heartRate} bpm is drifting from baseline`);
    }
    if (temperature > 37.6) {
      reasons.push(`Temperature ${temperature}°C suggests an early deviation`);
    }

    return {
      level: "Watch",
      tone: "warning",
      message: "Monitor closely for continued drift.",
      reasons
    };
  }

  return {
    level: "Stable",
    tone: "safe",
    message: "Vitals are within the expected recovery range.",
    reasons: ["Heart rate, SpO2, and temperature are currently within target ranges"]
  };
}

function createReading(patient, index, forced = {}) {
  const phase = (index + patient.seed) / 7;
  const heartRate = clamp(
    forced.heartRate ??
      patient.baseline.heartRate + Math.sin(phase) * 4.5 + (Math.random() * 4 - 2),
    54,
    132
  );
  const spo2 = clamp(
    forced.spo2 ??
      patient.baseline.spo2 + Math.cos(phase / 1.7) * 1.1 + (Math.random() - 0.5),
    86,
    100
  );
  const temperature = clamp(
    forced.temperature ??
      patient.baseline.temperature + Math.sin(phase / 2.9) * 0.2 + (Math.random() * 0.12 - 0.06),
    36.1,
    39.3
  );

  const rounded = {
    timestamp: Date.now() - (INITIAL_HISTORY_POINTS - index) * STREAM_INTERVAL_MS,
    label: index === INITIAL_HISTORY_POINTS - 1 ? nowLabel() : "",
    heartRate: Number(heartRate.toFixed(0)),
    spo2: Number(spo2.toFixed(0)),
    temperature: Number(temperature.toFixed(1))
  };

  return {
    ...rounded,
    status: getStatus(rounded)
  };
}

function buildForecast(history) {
  const latest = history.slice(-24);
  const avgSpo2 = latest.reduce((sum, item) => sum + item.spo2, 0) / latest.length;
  const avgHeartRate = latest.reduce((sum, item) => sum + item.heartRate, 0) / latest.length;
  const avgTemp = latest.reduce((sum, item) => sum + item.temperature, 0) / latest.length;

  const baseRisk =
    avgSpo2 < 93 || avgHeartRate > 107 || avgTemp > 37.9
      ? "High Risk"
      : avgSpo2 < 95 || avgHeartRate > 98 || avgTemp > 37.5
        ? "Watch"
        : "Stable";

  return [
    { hour: "Now", risk: baseRisk },
    { hour: "6h", risk: baseRisk === "High Risk" ? "Watch" : baseRisk },
    { hour: "12h", risk: baseRisk === "Stable" ? "Stable" : "Watch" },
    { hour: "24h", risk: baseRisk === "High Risk" ? "Watch" : "Stable" }
  ];
}

const patients = names.map((name, index) => {
  const patient = {
    id: String(index + 1),
    name,
    age: 34 + index * 7,
    room: `Ward ${index + 2}0${index + 1}`,
    surgeryType: surgeries[index % surgeries.length],
    daysPostOp: 1 + (index % 4),
    seed: index * 13,
    baseline: {
      heartRate: 68 + index * 3,
      spo2: 98 - (index % 2),
      temperature: 36.7 + index * 0.1
    },
    anomalyTicks: 0,
    anomalyCooldown: 12 + index * 2,
    anomalyProfile: null,
    alerts: []
  };

  patient.history = Array.from({ length: INITIAL_HISTORY_POINTS }, (_, readingIndex) =>
    createReading(patient, readingIndex)
  );
  patient.current = patient.history.at(-1);
  patient.forecast = buildForecast(patient.history);
  patient.status = patient.current.status;

  return patient;
});

function createAlert(patient, issue, severity) {
  const alert = {
    id: alertId++,
    patientId: patient.id,
    patientName: patient.name,
    time: nowLabel(),
    issue,
    severity,
    room: patient.room
  };

  patient.alerts.unshift(alert);
  patient.alerts = patient.alerts.slice(0, 12);
  return alert;
}

function pickAnomaly(patient) {
  const profiles = [
    {
      heartRate: 114 + Math.random() * 6,
      spo2: 90 + Math.random() * 1.5,
      temperature: 37.7 + Math.random() * 0.2,
      rule: "Tachycardia"
    },
    {
      heartRate: 96 + Math.random() * 4,
      spo2: 89 + Math.random() * 2,
      temperature: 37.4 + Math.random() * 0.2,
      rule: "Desaturation"
    },
    {
      heartRate: 101 + Math.random() * 4,
      spo2: 94 + Math.random(),
      temperature: 38.1 + Math.random() * 0.3,
      rule: "Fever"
    }
  ];

  patient.anomalyProfile = profiles[tickCount % profiles.length];
  patient.anomalyTicks = 7;
  patient.anomalyCooldown = 18 + Math.floor(Math.random() * 4);
}

function serializePatient(patient) {
  return {
    id: patient.id,
    name: patient.name,
    age: patient.age,
    room: patient.room,
    surgeryType: patient.surgeryType,
    daysPostOp: patient.daysPostOp,
    current: patient.current,
    status: patient.status,
    forecast: patient.forecast,
    alerts: patient.alerts,
    history: patient.history,
    highlighted: patient.status.tone !== "safe"
  };
}

function getSnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    patients: patients.map(serializePatient),
    alerts: patients
      .flatMap((patient) => patient.alerts)
      .sort((a, b) => b.id - a.id)
      .slice(0, 12)
  };
}

function broadcast(payload) {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  streams.forEach((stream) => stream.write(data));
}

setInterval(() => {
  tickCount += 1;
  const freshAlerts = [];

  patients.forEach((patient, index) => {
    patient.anomalyCooldown -= 1;

    if (tickCount === 14 && index === 1) {
      pickAnomaly(patient);
    } else if (patient.anomalyCooldown <= 0 && index === tickCount % patients.length) {
      pickAnomaly(patient);
    }

    const forcedReading =
      patient.anomalyTicks > 0
        ? {
            heartRate: patient.anomalyProfile.heartRate + (Math.random() * 5 - 2.5),
            spo2: patient.anomalyProfile.spo2 + (Math.random() * 1.3 - 0.6),
            temperature: patient.anomalyProfile.temperature + (Math.random() * 0.16 - 0.08)
          }
        : undefined;

    if (patient.anomalyTicks > 0) {
      patient.anomalyTicks -= 1;
    }

    const reading = createReading(patient, tickCount + INITIAL_HISTORY_POINTS, forcedReading);
    reading.timestamp = Date.now();
    reading.label = nowLabel();

    const previous = patient.current;
    patient.current = reading;
    patient.history.push(reading);
    patient.history = patient.history.slice(-MAX_HISTORY_POINTS);
    patient.status = reading.status;
    patient.forecast = buildForecast(patient.history);

    if (reading.status.tone === "critical" && previous.status.tone !== "critical") {
      freshAlerts.push(
        createAlert(
          patient,
          patient.status.reasons[0] ?? `${patient.anomalyProfile?.rule ?? "Rule"} triggered`,
          "Critical"
        )
      );
    } else if (
      reading.status.tone === "warning" &&
      previous.status.tone === "safe" &&
      tickCount % 4 === 0
    ) {
      freshAlerts.push(
        createAlert(
          patient,
          patient.status.reasons[0] ?? `Vitals are trending outside baseline in ${patient.room}`,
          "Watch"
        )
      );
    }
  });

  broadcast({
    type: "snapshot",
    ...getSnapshot(),
    freshAlerts
  });
}, STREAM_INTERVAL_MS);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", generatedAt: new Date().toISOString() });
});

app.get("/api/bootstrap", (_req, res) => {
  res.json(getSnapshot());
});

app.get("/api/patients/:id", (req, res) => {
  const patient = patients.find((entry) => entry.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  return res.json(serializePatient(patient));
});

app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write(
    `data: ${JSON.stringify({ type: "snapshot", ...getSnapshot(), freshAlerts: [] })}\n\n`
  );
  streams.add(res);

  req.on("close", () => {
    streams.delete(res);
  });
});

if (hasBuiltClient) {
  app.use(express.static(distPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(distIndexPath);
  });
}

app.listen(PORT, () => {
  console.log(`RecoverAI API running on http://localhost:${PORT}`);
  if (hasBuiltClient) {
    console.log(`Serving built client from ${distPath}`);
  }
});
