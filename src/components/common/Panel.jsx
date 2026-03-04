// src/components/common/Panel.jsx
import clsx from "clsx";

export default function Panel({ className, children }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}