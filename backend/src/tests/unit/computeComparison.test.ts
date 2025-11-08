import { expect, describe, it } from 'vitest';
import computeComparison from '../../application/usecases/ComputeComparison';

describe('ComputeComparison', () => {
  it('should correctly calculate percentage difference', async () => {
    const result = await computeComparison([
      { 
        routeId: 'R001',
        ghgIntensity: 91.0,
        year: 2024,
        isBaseline: true
      },
      {
        routeId: 'R002',
        ghgIntensity: 88.0,
        year: 2024,
        isBaseline: false
      }
    ]);

    expect(result.baseline?.ghgIntensity).toBe(91.0);
    expect(result.results[0].percentDiff).toBeCloseTo(-3.30, 2);
    expect(result.results[0].compliant).toBe(true);
  });

  it('should mark routes as non-compliant when above target', async () => {
    const result = await computeComparison([
      {
        routeId: 'R001',
        ghgIntensity: 89.3368,
        year: 2024,
        isBaseline: true
      },
      {
        routeId: 'R003',
        ghgIntensity: 93.5,
        year: 2024,
        isBaseline: false
      }
    ]);

    expect(result.results[0].percentDiff).toBeGreaterThan(0);
    expect(result.results[0].compliant).toBe(false);
  });

  it('should handle empty route list', async () => {
    const result = await computeComparison([]);
    expect(result.baseline).toBeUndefined();
    expect(result.results).toHaveLength(0);
  });

  it('should handle missing baseline', async () => {
    const result = await computeComparison([
      {
        routeId: 'R002',
        ghgIntensity: 88.0,
        year: 2024,
        isBaseline: false
      }
    ]);

    expect(result.baseline).toBeUndefined();
    expect(result.results).toHaveLength(0);
  });
});