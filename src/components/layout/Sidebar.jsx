// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { BatteryCharging, BarChart3, Trophy, GitCompare } from "lucide-react";

const items = [
  { icon: BarChart3, label: "Overview", to: "/" },
  { icon: BatteryCharging, label: "Battery Spotlight", to: "/" }, // keep same for now
  { icon: GitCompare, label: "Compare", to: "/compare" },
  { icon: Trophy, label: "Leaderboard", to: "/" }, // keep same for now
];

export default function Sidebar() {
  return (
    <div className="h-full border-r border-white/10 bg-black/20 px-4 py-6">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center text-white font-semibold">
          BG
        </div>
        <div>
          <div className="text-sm font-semibold text-white">BGU</div>
          <div className="text-xs text-white/60">Dashboard</div>
        </div>
      </div>

      <div className="space-y-1">
        {items.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              [
                "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
                isActive
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-white/75 hover:text-white hover:bg-white/5",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
        Tip: Sell confidence, not voltage. Show ROI + risk + forecast.
      </div>
    </div>
  );
}