// src/pages/Compare.jsx
import { useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Panel from "../components/common/Panel";
import BatterySelect from "../components/controls/BatterySelect";
import { mockBatteries } from "../data/mockBatteries";
import { usd, num } from "../utils/format";
import { computeAIConfidence } from "../utils/aiScore";
import { decisionEngine } from "../utils/decision";

function MetricRow({ label, left, right, higherIsBetter = true, suffix = "" }) {
  const l = Number(left ?? 0);
  const r = Number(right ?? 0);

  const leftBetter = higherIsBetter ? l > r : l < r;
  const rightBetter = higherIsBetter ? r > l : l > r;

  return (
    <div className="grid grid-cols-[160px_1fr_1fr] items-center gap-3 py-2 border-b border-white/10">
      <div className="text-xs text-white/60">{label}</div>

      <div
        className={`rounded-xl border px-3 py-2 text-sm ${
          leftBetter ? "border-emerald-500/25 bg-emerald-500/10" : "border-white/10 bg-white/5"
        }`}
      >
        <span className="text-white font-semibold">
          {left}
          {suffix}
        </span>
      </div>

      <div
        className={`rounded-xl border px-3 py-2 text-sm ${
          rightBetter ? "border-emerald-500/25 bg-emerald-500/10" : "border-white/10 bg-white/5"
        }`}
      >
        <span className="text-white font-semibold">
          {right}
          {suffix}
        </span>
      </div>
    </div>
  );
}

export default function Compare() {
  const [query, setQuery] = useState("");
  const [aId, setAId] = useState(mockBatteries[0]?.battery_id);
  const [bId, setBId] = useState(mockBatteries[1]?.battery_id);

  const batteries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockBatteries;
    return mockBatteries.filter((x) =>
      `${x.battery_id} ${x.chemistry} ${x.location}`.toLowerCase().includes(q)
    );
  }, [query]);

  const A = batteries.find((x) => x.battery_id === aId) || batteries[0];
  const B = batteries.find((x) => x.battery_id === bId) || batteries[1] || batteries[0];

  const aProfit = (A?.estimated_resale_usd || 0) - (A?.refurb_cost_usd || 0);
  const bProfit = (B?.estimated_resale_usd || 0) - (B?.refurb_cost_usd || 0);

  const aAi = computeAIConfidence(A);
  const bAi = computeAIConfidence(B);

  const aDecision = decisionEngine(A);
  const bDecision = decisionEngine(B);

  // Demo "winner" score: AI + profit influence
  const aScore = aAi + aProfit / 1000;
  const bScore = bAi + bProfit / 1000;
  const winner = aScore >= bScore ? "A" : "B";

  const swap = () => {
    setAId(bId);
    setBId(aId);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(80%_80%_at_20%_10%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(70%_70%_at_80%_0%,rgba(251,146,60,0.14),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]">
      <div className="grid grid-cols-[260px_1fr] min-h-screen">
        <Sidebar />
        <div className="flex flex-col">
          <Topbar query={query} setQuery={setQuery} />

          <div className="px-6 pb-10">
            {/* Selectors */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <BatterySelect batteries={batteries} selectedId={aId} setSelectedId={setAId} />
              <BatterySelect batteries={batteries} selectedId={bId} setSelectedId={setBId} />
            </div>

            {/* Winner banner + Swap */}
            <Panel className="p-4 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-white/60">Comparison Summary</div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    Better Choice: Battery {winner}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    Based on AI confidence + profit potential (demo scoring)
                  </div>
                </div>

                <button
                  onClick={swap}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                >
                  Swap A ↔ B
                </button>
              </div>
            </Panel>

            {/* Cards A/B */}
            <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Panel className="p-5">
                <div className="text-xs text-white/60">Battery A</div>
                <div className="mt-1 text-lg font-semibold text-white">{A.battery_id}</div>
                <div className="mt-1 text-xs text-white/50">
                  {A.chemistry} • {A.form_factor} • {A.location}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">Strategic Action</div>
                    <div className="mt-1 text-white font-semibold">{aDecision.action}</div>
                    <div className="mt-1 text-xs text-white/50">{aDecision.reason}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">AI Confidence</div>
                    <div className="mt-1 text-white font-semibold">{aAi}/100</div>
                    <div className="mt-1 text-xs text-white/50">Profit: {usd(aProfit)}</div>
                  </div>
                </div>
              </Panel>

              <Panel className="p-5">
                <div className="text-xs text-white/60">Battery B</div>
                <div className="mt-1 text-lg font-semibold text-white">{B.battery_id}</div>
                <div className="mt-1 text-xs text-white/50">
                  {B.chemistry} • {B.form_factor} • {B.location}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">Strategic Action</div>
                    <div className="mt-1 text-white font-semibold">{bDecision.action}</div>
                    <div className="mt-1 text-xs text-white/50">{bDecision.reason}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">AI Confidence</div>
                    <div className="mt-1 text-white font-semibold">{bAi}/100</div>
                    <div className="mt-1 text-xs text-white/50">Profit: {usd(bProfit)}</div>
                  </div>
                </div>
              </Panel>
            </div>

            {/* Side-by-side table */}
            <div className="mt-4">
              <Panel className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/60">Side-by-side Comparison</div>
                    <div className="mt-1 text-sm text-white/70">Green highlight = better</div>
                  </div>
                </div>

                <div className="mt-4">
                  <MetricRow label="State of Health" left={num(A.soh, 0)} right={num(B.soh, 0)} suffix="%" />
                  <MetricRow label="RUL" left={num(A.rul_months, 0)} right={num(B.rul_months, 0)} suffix=" mo" />
                  <MetricRow label="Profit" left={usd(aProfit)} right={usd(bProfit)} />
                  <MetricRow
                    label="Thermal Score"
                    left={num(A.thermal_stability_score, 0)}
                    right={num(B.thermal_stability_score, 0)}
                    suffix="/100"
                  />
                  <MetricRow
                    label="Max Temp"
                    left={num(A.max_temp_c, 1)}
                    right={num(B.max_temp_c, 1)}
                    suffix="°C"
                    higherIsBetter={false}
                  />
                  <MetricRow
                    label="Cycles"
                    left={num(A.cycle_count, 0)}
                    right={num(B.cycle_count, 0)}
                    higherIsBetter={false}
                  />
                  <MetricRow
                    label="Internal Resistance"
                    left={num(A.internal_resistance_mohm, 1)}
                    right={num(B.internal_resistance_mohm, 1)}
                    suffix=" mΩ"
                    higherIsBetter={false}
                  />
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}