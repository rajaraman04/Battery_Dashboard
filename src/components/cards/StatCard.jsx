// src/components/cards/StatCard.jsx
import Panel from "../common/Panel";

export default function StatCard({ label, value, sub }) {
  return (
    <Panel className="p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</div>
      {sub ? <div className="mt-1 text-xs text-white/50">{sub}</div> : null}
    </Panel>
  );
}