// src/pages/Dashboard.jsx
import { useMemo, useState } from "react";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/cards/StatCard";
import BatteryDNACard from "../components/cards/BatteryDNACard";
import DegradationForecast from "../components/charts/DegradationForecast";
import BatteryLeaderboard from "../components/tables/BatteryLeaderboard";
import BatterySelect from "../components/controls/BatterySelect";
import { mockBatteries } from "../data/mockBatteries";
import { usd, num } from "../utils/format";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(mockBatteries[0]?.battery_id);

  const batteries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockBatteries;
    return mockBatteries.filter((b) => {
      const hay = `${b.battery_id} ${b.chemistry} ${b.location} ${b.form_factor} ${b.origin_pack}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const selected = useMemo(() => {
    return batteries.find((b) => b.battery_id === selectedId) || batteries[0] || mockBatteries[0];
  }, [batteries, selectedId]);

  const totals = useMemo(() => {
    const n = batteries.length;
    const avgSoh = n ? batteries.reduce((s, b) => s + b.soh, 0) / n : 0;
    const totalProfit = batteries.reduce(
      (s, b) => s + ((b.estimated_resale_usd || 0) - (b.refurb_cost_usd || 0)),
      0
    );
    const totalCo2 = batteries.reduce((s, b) => s + (b.co2_saved_kg || 0), 0);
    return { n, avgSoh, totalProfit, totalCo2 };
  }, [batteries]);

  return (
    <div className="min-h-screen bg-[radial-gradient(80%_80%_at_20%_10%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(70%_70%_at_80%_0%,rgba(251,146,60,0.14),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]">
      <div className="grid grid-cols-[260px_1fr] min-h-screen">
        <Sidebar />

        <div className="flex flex-col">
          <Topbar query={query} setQuery={setQuery} />

          <div className="px-6 pb-10">
            {/* Row: Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="Inventory" value={num(totals.n, 0)} sub="Batteries in stock" />
              <StatCard label="Avg State of Health" value={`${num(totals.avgSoh, 0)}%`} sub="Higher = more resale value" />
              <StatCard label="Total Profit Potential" value={usd(totals.totalProfit)} sub="Resale - refurb estimate" />
              <StatCard label="CO₂ Saved" value={`${num(totals.totalCo2, 0)} kg`} sub="Second-life impact" />
            </div>

            {/* Row 1: Select + Leaderboard */}
            <div className="mt-5 grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-4 items-start">
              <BatterySelect
                batteries={batteries}
                selectedId={selected.battery_id}
                setSelectedId={setSelectedId}
              />

              <BatteryLeaderboard
                batteries={batteries}
                onSelect={(id) => setSelectedId(id)}
                selectedId={selected.battery_id}
              />
            </div>

            {/* Row 2: Battery DNA full width (wide layout) */}
            <div className="mt-5">
              <BatteryDNACard battery={selected} variant="wide" />
            </div>

            {/* Row 3: Forecast + AI Recommendation (unchanged) */}
            <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
              <DegradationForecast battery={selected} />

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="text-xs text-white/60">AI Recommendation</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  Best Use Case:{" "}
                  {selected.soh >= 90
                    ? "Premium Second-Life Storage"
                    : selected.soh >= 80
                    ? "Commercial Backup"
                    : "Refurb / Recycle"}
                </div>
                <div className="mt-2 text-sm text-white/70">

                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="text-xs text-white/60">Thermal Max</div>
                    <div className="mt-1 text-white font-semibold">{num(selected.max_temp_c, 1)}°C</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="text-xs text-white/60">Cycles</div>
                    <div className="mt-1 text-white font-semibold">{num(selected.cycle_count, 0)}</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-white/50">
                  Next upgrade: exportable one-page PDF for sales + confidence breakdown.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}