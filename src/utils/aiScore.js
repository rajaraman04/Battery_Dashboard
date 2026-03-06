// src/utils/aiScore.js
export function computeAIConfidence(battery) {
  const sohWeight = 0.35;
  const thermalWeight = 0.25;
  const cyclesWeight = 0.2;
  const degradationWeight = 0.2;

  const soh = Number(battery?.soh);
  const thermal = Number(battery?.thermal_stability_score);
  const cycles = Number(battery?.cycle_count);
  const degradation = Number(battery?.degradation_rate);

  const sohScore = Number.isFinite(soh) ? soh : 0;
  const thermalScore = Number.isFinite(thermal) ? thermal : 0;

  // If missing, use reasonable defaults so we never get NaN
  const cyclesScore = Number.isFinite(cycles) ? Math.max(0, 100 - cycles / 20) : 50;
  const degradationScore = Number.isFinite(degradation) ? Math.max(0, 100 - degradation * 100) : 50;

  const score =
    sohScore * sohWeight +
    thermalScore * thermalWeight +
    cyclesScore * cyclesWeight +
    degradationScore * degradationWeight;

  return Number.isFinite(score) ? Math.round(score) : 0;
}