// src/utils/decision.js

export function decisionEngine(b) {
  // Simple, explainable business rules (can be replaced by ML later)
  const profit = (b.estimated_resale_usd || 0) - (b.refurb_cost_usd || 0);
  const margin = b.estimated_resale_usd ? (profit / b.estimated_resale_usd) * 100 : 0;

  // High risk triggers
  const flags = b.anomaly_flags || [];
  const highRisk = flags.includes("THERMAL_RISK") || flags.includes("FAST_DEGRADE");

  if (!highRisk && b.soh >= 90 && b.thermal_stability_score >= 85 && margin >= 55) {
    return { action: "SELL", reason: "High health + stable thermal + strong margin" };
  }

  if (!highRisk && b.soh >= 80 && b.rul_months >= 24) {
    return { action: "HOLD", reason: "Good candidate for second-life deployment" };
  }

  return { action: "RECYCLE", reason: highRisk ? "Risk flags detected" : "Low SoH / limited RUL" };
}

export function actionTone(action) {
  if (action === "SELL") return "bg-emerald-500/15 text-emerald-200 border-emerald-500/20";
  if (action === "HOLD") return "bg-amber-500/15 text-amber-200 border-amber-500/20";
  return "bg-red-500/15 text-red-200 border-red-500/20";
}