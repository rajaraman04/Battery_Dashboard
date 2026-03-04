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

export default function DegradationForecast({ battery }) {
  const history = battery?.timeseries?.history || [];
  const forecast = battery?.timeseries?.forecast || [];

  // Merge with a label to differentiate
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
          </div>
        </div>
        <div className="text-xs text-white/50">
          Thermal Stability: <span className="text-white/80 font-medium">{battery.thermal_stability_score}/100</span>
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
            <Line
              type="monotone"
              dataKey="soh"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={true}
            />
            {/* overlay forecast dotted line */}
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