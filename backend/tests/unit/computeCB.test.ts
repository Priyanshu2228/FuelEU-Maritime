import computeCB from '../../src/application/usecases/ComputeCB';

test('computeCB returns expected cb_gCO2e and energyMJ', () => {
  const ghg = 90; // gCO2e/MJ
  const fuelT = 1000; // t
  const { cb_gCO2e, energyMJ } = computeCB({ ghgIntensity: ghg, fuelConsumptionTons: fuelT, targetIntensity: 89.3368 });
  // energy = 1000 * 41000
  expect(energyMJ).toBeCloseTo(41000000);
  // cb = (target - actual) * energy
  const expected = (89.3368 - ghg) * energyMJ;
  expect(cb_gCO2e).toBeCloseTo(expected);
});
