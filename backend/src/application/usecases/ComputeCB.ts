interface ComputeCBParams {
  ghgIntensity: number; // gCO2e/MJ
  fuelConsumptionTons: number; // t
  targetIntensity?: number; // gCO2e/MJ
}

export function computeCB({ ghgIntensity, fuelConsumptionTons, targetIntensity = 89.3368 }: ComputeCBParams) {
  // Energy in scope (MJ) ≈ fuelConsumption × 41 000 MJ/t
  const energyMJ = fuelConsumptionTons * 41000;
  // Compliance Balance (gCO2e) = (Target − Actual) × Energy
  const cb_gCO2e = (targetIntensity - ghgIntensity) * energyMJ;
  return { cb_gCO2e, energyMJ };
}

export default computeCB;
