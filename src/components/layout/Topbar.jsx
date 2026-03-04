// src/components/layout/Topbar.jsx
import { Search } from "lucide-react";

export default function Topbar({ query, setQuery }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="space-y-0.5">
        <div className="text-sm text-white/60">Bridge Green Upcycle</div>
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Battery Confidence Dashboard
        </h1>
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <Search className="h-4 w-4 text-white/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search battery ID, chemistry, location…"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
          />
        </div>
      </div>
    </div>
  );
}