export function computeAIConfidence(battery) {
  const sohWeight = 0.35;
  const thermalWeight = 0.25;
  const cyclesWeight = 0.2;
  const degradationWeight = 0.2;

  const sohScore = battery.soh;
  const thermalScore = battery.thermal_stability_score;
  const cyclesScore = Math.max(0, 100 - battery.cycle_count / 20);
  const degradationScore = Math.max(0, 100 - battery.degradation_rate * 100);

  const score =
    sohScore * sohWeight +
    thermalScore * thermalWeight +
    cyclesScore * cyclesWeight +
    degradationScore * degradationWeight;

  return Math.round(score);
}