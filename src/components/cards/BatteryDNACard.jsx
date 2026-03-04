// src/components/cards/BatteryDNACard.jsx
import Panel from "../common/Panel";
import RiskBadge from "./RiskBadge";
import { usd, num } from "../../utils/format";
import { motion } from "framer-motion";
import { computeAIConfidence } from "../../utils/aiScore";
import { decisionEngine, actionTone } from "../../utils/decision";

function riskFromFlags(flags = []) {
  if (flags.includes("THERMAL_RISK") || flags.includes("FAST_DEGRADE")) return "HIGH";
  if (flags.includes("HIGH_CYCLES")) return "MED";
  return "LOW";
}

function ringStyle(pct) {
  const p = Math.max(0, Math.min(100, Number(pct || 0)));
  return {
    background: `conic-gradient(rgba(52,211,153,0.95) ${p}%, rgba(255,255,255,0.10) 0)`,
  };
}

function Tile({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3 min-w-0">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="mt-1 text-white font-semibold tabular-nums whitespace-nowrap">{value}</div>
    </div>
  );
}

export default function BatteryDNACard({ battery, variant = "wide" }) {
  if (!battery) return null;

  const risk = riskFromFlags(battery?.anomaly_flags || []);
  const profit = (battery.estimated_resale_usd || 0) - (battery.refurb_cost_usd || 0);
  const margin = battery.estimated_resale_usd ? (profit / battery.estimated_resale_usd) * 100 : 0;

  const aiScore = computeAIConfidence(battery);
  const decision = decisionEngine(battery);

  // WIDE: left -> right, made for full-width row
  if (variant === "wide") {
    return (
      <Panel className="p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-white/60">Battery DNA</div>
            <div className="mt-1 text-2xl font-semibold text-white">{battery.battery_id}</div>
            <div className="mt-1 text-sm text-white/60">
              {battery.chemistry} • {battery.form_factor} • {battery.location}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold",
                  actionTone(decision.action),
                ].join(" ")}
              >
                Strategic Action: {decision.action}
              </span>
              <span className="text-sm text-white/60">{decision.reason}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RiskBadge level={risk} />
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
              AI: <span className="font-semibold text-white tabular-nums">{aiScore}/100</span>
            </div>
          </div>
        </div>

        {/* Main content: 3 horizontal blocks */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_1fr] gap-4 items-stretch">
          {/* Block 1: SoH ring */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col items-center justify-center">
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="h-44 w-44 rounded-full p-2"
              style={ringStyle(battery.soh)}
            >
              <div className="h-full w-full rounded-full bg-black/50 grid place-items-center">
                <div className="text-white text-4xl font-semibold tabular-nums">{Math.round(battery.soh)}%</div>
                <div className="text-sm text-white/60 -mt-1">SoH</div>
              </div>
            </motion.div>

            <div className="mt-4 text-center">
              <div className="text-xs text-white/60">Projected Life</div>
              <div className="mt-1 text-xl font-semibold text-white tabular-nums">{num(battery.rul_months / 12, 1)} yrs</div>
              <div className="mt-1 text-xs text-white/50 tabular-nums">{battery.rul_months} months RUL</div>
            </div>
          </div>

          {/* Block 2: Business metrics */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/60">Business Metrics</div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/60">Profit Potential</div>
              <div className="mt-1 text-3xl font-semibold text-white tabular-nums">{usd(profit)}</div>
              <div className="mt-1 text-sm text-white/60">
                Resale <span className="text-white/90 tabular-nums">{usd(battery.estimated_resale_usd)}</span>{" "}
                <span className="text-white/30">•</span>{" "}
                Refurb <span className="text-white/90 tabular-nums">{usd(battery.refurb_cost_usd)}</span>
              </div>
              <div className="mt-2 text-sm text-white/60">
                Margin: <span className="text-white/90 font-semibold tabular-nums">{num(margin, 0)}%</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Tile label="Cycles" value={num(battery.cycle_count, 0)} />
              <Tile label="Thermal" value={`${num(battery.thermal_stability_score, 0)}/100`} />
              <Tile label="Max Temp" value={`${num(battery.max_temp_c, 1)}°C`} />
              <Tile label="IR" value={`${num(battery.internal_resistance_mohm, 1)} mΩ`} />
            </div>
          </div>

          {/* Block 3: Specs + Impact */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/60">Technical Specs & Impact</div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Tile label="Energy" value={`${num(battery.energy_kwh, 1)} kWh`} />
              <Tile label="Capacity" value={`${num(battery.capacity_ah, 0)} Ah`} />
              <Tile label="Voltage" value={`${num(battery.voltage_nominal, 0)} V`} />
              <Tile label="Chemistry" value={`${battery.chemistry || "-"}`} />
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/60">Sustainability Impact</div>
              <div className="mt-2 text-sm text-white/70">
                CO₂ saved{" "}
                <span className="text-white/90 font-semibold tabular-nums">{num(battery.co2_saved_kg, 0)} kg</span>{" "}
                <span className="text-white/30">•</span>{" "}
                Trees <span className="text-white/90 font-semibold tabular-nums">{num(battery.trees_equivalent, 0)}</span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-white/60">AI Confidence</div>
                  <div className="text-xs text-white/50">SoH + thermal + cycles + degradation</div>
                </div>
                <div className="text-2xl font-bold text-white tabular-nums">{aiScore}/100</div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    );
  }

  // fallback
  return (
    <Panel className="p-5">
      <div className="text-white/80">BatteryDNA</div>
    </Panel>
  );
}