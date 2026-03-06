// src/components/charts/DegradationForecast.jsx
import Panel from "../common/Panel";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

// Build a simple synthetic time-series when battery.timeseries is missing
function buildTimeseries(battery) {
  const sohNow = Number(battery?.soh);
  const degr = Number(battery?.degradation_rate); // % per month
  const safeSoh = Number.isFinite(sohNow) ? sohNow : 80;
  const safeDegr = Number.isFinite(degr) ? degr : 0.22;

  // History (6 months back)
  const history = [
    { t: "M-6", soh: clamp(safeSoh + safeDegr * 6, 50, 100) },
    { t: "M-5", soh: clamp(safeSoh + safeDegr * 5, 50, 100) },
    { t: "M-4", soh: clamp(safeSoh + safeDegr * 4, 50, 100) },
    { t: "M-3", soh: clamp(safeSoh + safeDegr * 3, 50, 100) },
    { t: "M-2", soh: clamp(safeSoh + safeDegr * 2, 50, 100) },
    { t: "M-1", soh: clamp(safeSoh + safeDegr * 1, 50, 100) },
    { t: "Now", soh: clamp(safeSoh, 50, 100) },
  ];

  // Forecast (3, 6, 12, 24 months ahead)
  const forecast = [
    { t: "M+3", soh: clamp(safeSoh - safeDegr * 3, 50, 100) },
    { t: "M+6", soh: clamp(safeSoh - safeDegr * 6, 50, 100) },
    { t: "M+12", soh: clamp(safeSoh - safeDegr * 12, 50, 100) },
    { t: "M+24", soh: clamp(safeSoh - safeDegr * 24, 50, 100) },
  ];

  return { history, forecast };
}

export default function DegradationForecast({ battery }) {
  const hasSeries =
    Array.isArray(battery?.timeseries?.history) && battery.timeseries.history.length > 0;

  const series = hasSeries ? battery.timeseries : buildTimeseries(battery);

  const history = series.history || [];
  const forecast = series.forecast || [];

  // Merge so the main line shows full timeline
  const data = [
    ...history.map((d) => ({ ...d, kind: "history" })),
    ...forecast.map((d) => ({ ...d, kind: "forecast" })),
  ];

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-white/60">Degradation Forecast</div>
          <div className="mt-1 text-sm text-white/80">
            Solid = observed • Dotted = predicted
            {!hasSeries ? (
              <span className="ml-2 text-white/50">(auto-generated)</span>
            ) : null}
          </div>
        </div>
        <div className="text-xs text-white/50">
          Thermal Stability:{" "}
          <span className="text-white/80 font-medium">
            {battery?.thermal_stability_score ?? "-"} /100
          </span>
        </div>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="t" stroke="rgba(255,255,255,0.45)" />
            <YAxis domain={[50, 100]} stroke="rgba(255,255,255,0.45)" />
            <Tooltip
              contentStyle={{
                background: "rgba(10,10,10,0.9)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                color: "white",
              }}
            />

            {/* Full timeline line */}
            <Line type="monotone" dataKey="soh" strokeWidth={2.5} dot={false} />

            {/* Dotted forecast overlay */}
            <Line
              type="monotone"
              dataKey="soh"
              strokeWidth={2.5}
              dot={false}
              strokeDasharray="6 6"
              isAnimationActive={false}
              data={forecast}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}