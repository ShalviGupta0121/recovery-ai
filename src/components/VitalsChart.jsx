import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { metricTone } from "../lib/format";

const configs = {
  heartRate: {
    label: "Heart Rate",
    color: "#6f92c7",
    unit: "bpm",
    domain: [50, 130],
    threshold: 110
  },
  spo2: {
    label: "SpO2",
    color: "#58b3a1",
    unit: "%",
    domain: [85, 100],
    threshold: 92
  },
  temperature: {
    label: "Temperature",
    color: "#d4a45b",
    unit: "\u00B0C",
    domain: [36, 39.5],
    threshold: 38
  }
};

export default function VitalsChart({ data, metric, detailed = false }) {
  const config = configs[metric];
  const visibleData = data.slice(detailed ? -90 : -60).map((entry, index, source) => ({
    ...entry,
    axisLabel: index % 10 === 0 || index === source.length - 1 ? entry.label : ""
  }));
  const latest = visibleData.at(-1);

  return (
    <div className="glass-panel p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">{detailed ? "Patient Trend" : "Live Trend"}</p>
          <p className="mt-2 text-xl font-semibold text-white">{config.label}</p>
          <p className="text-sm text-slate-400">
            {detailed ? "Last 90 telemetry readings" : "Last 60 telemetry readings"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current</p>
          <p className={`mt-2 text-2xl font-semibold ${metricTone(metric, latest?.[metric])}`}>
            {latest?.[metric]} {config.unit}
          </p>
        </div>
      </div>

      <div className={detailed ? "h-80" : "h-72"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleData}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
            <XAxis
              dataKey="axisLabel"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={config.domain}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={38}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#171d27",
                borderColor: "rgba(148, 163, 184, 0.14)",
                borderRadius: "16px"
              }}
              formatter={(value) => [`${value} ${config.unit}`, config.label]}
            />
            <ReferenceLine
              y={config.threshold}
              stroke="rgba(205, 109, 103, 0.5)"
              strokeDasharray="4 4"
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              strokeWidth={3}
              dot={false}
              isAnimationActive
              animationDuration={450}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
