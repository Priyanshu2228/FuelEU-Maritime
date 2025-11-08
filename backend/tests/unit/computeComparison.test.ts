import computeComparison from '../../src/application/usecases/ComputeComparison';
import { PrismaClient } from '@prisma/client';

// Use an isolated Prisma client but we will mock prisma calls by creating temporary data
const prisma = new PrismaClient();

describe('computeComparison', () => {
  beforeAll(async () => {
    // ensure a baseline exists in DB for tests; upsert sample baseline and one other route
    await prisma.route.upsert({ where: { routeId: 'TEST_BASE' }, update: {}, create: { routeId: 'TEST_BASE', vesselType: 'Test', fuelType: 'HFO', year: 2024, ghgIntensity: 90, fuelConsumption: 1000, distance: 100, totalEmissions: 0, isBaseline: true } as any });
    await prisma.route.upsert({ where: { routeId: 'TEST_OTHER' }, update: {}, create: { routeId: 'TEST_OTHER', vesselType: 'Test', fuelType: 'MDO', year: 2024, ghgIntensity: 92, fuelConsumption: 1000, distance: 200, totalEmissions: 0 } as any });
  });

  afterAll(async () => {
    await prisma.route.deleteMany({ where: { routeId: { in: ['TEST_BASE', 'TEST_OTHER'] } } });
    await prisma.$disconnect();
  });

  test('computeComparison returns baseline and results', async () => {
    const data = await computeComparison();
    expect(data).toHaveProperty('baseline');
    expect(Array.isArray(data.results)).toBe(true);
    // ensure at least one result exists
    expect(data.results.length).toBeGreaterThanOrEqual(1);
    // find our TEST_OTHER route
    const found = data.results.find((r: any) => r.routeId === 'TEST_OTHER');
    expect(found).toBeDefined();
    expect(found).toHaveProperty('percentDiff');
  });
});
