// src/components/cards/ProfitGauge.jsx
import Panel from "../common/Panel";
import { clamp } from "../../utils/format";

export default function ProfitGauge({ profitMarginPct }) {
  const v = clamp(Number(profitMarginPct || 0), 0, 60);
  const pct = Math.round((v / 60) * 100);

  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/60">Profitability</div>
        <div className="text-xs text-white/60">{Math.round(v)}% margin</div>
      </div>

      <div className="mt-3 h-3 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 text-xs text-white/50">
        Higher margin = better resale candidate.
      </div>
    </Panel>
  );
}