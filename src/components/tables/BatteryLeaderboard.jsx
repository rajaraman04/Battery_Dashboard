// src/components/tables/BatteryLeaderboard.jsx
import Panel from "../common/Panel";
import { usd, num } from "../../utils/format";

function profit(b) {
  return (b.estimated_resale_usd || 0) - (b.refurb_cost_usd || 0);
}

export default function BatteryLeaderboard({ batteries, onSelect, selectedId }) {
  const ranked = [...batteries].sort((a, b) => profit(b) - profit(a)).slice(0, 6);

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-white/60">Top Batteries</div>
          <div className="mt-1 text-sm text-white/80">Ranked by profit potential</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {ranked.map((b, idx) => (
          <button
            key={b.battery_id}
            onClick={() => onSelect(b.battery_id)}
            className={[
              "w-full rounded-xl border px-3 py-2 text-left transition",
              b.battery_id === selectedId
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/7",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-white/50">#{idx + 1}</div>
                <div className="truncate text-sm font-semibold text-white">{b.battery_id}</div>
                <div className="text-xs text-white/55">{b.chemistry} • SoH {num(b.soh, 0)}%</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/60">Profit</div>
                <div className="text-sm font-semibold text-white">{usd(profit(b))}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}