// src/components/controls/BatterySelect.jsx
import Panel from "../common/Panel";

export default function BatterySelect({ batteries, selectedId, setSelectedId }) {
  return (
    <Panel className="p-4">
      <div className="text-xs text-white/60 mb-2">Select Battery</div>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
      >
        {batteries.map((b) => (
          <option key={b.battery_id} value={b.battery_id}>
            {b.battery_id} • {b.chemistry} • SoH {b.soh}%
          </option>
        ))}
      </select>
    </Panel>
  );
}