// src/utils/format.js
export function usd(n) {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function pct(n) {
  const v = Number(n || 0);
  return `${Math.round(v)}%`;
}

export function num(n, digits = 1) {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}