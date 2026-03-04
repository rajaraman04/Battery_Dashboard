// src/components/cards/RiskBadge.jsx
import clsx from "clsx";

export default function RiskBadge({ level = "LOW" }) {
  const map = {
    LOW: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    MED: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    HIGH: "bg-red-500/15 text-red-300 border-red-500/20",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        map[level] || map.LOW
      )}
    >
      Risk: {level}
    </span>
  );
}