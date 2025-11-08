import { bankSurplus, applyBanked, getBankedAmount } from '../../src/application/usecases/Banking';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Banking use-cases', () => {
  const shipId = 'TEST_BANK';
  const year = 2024;

  beforeAll(async () => {
    // ensure clean
    await prisma.bankEntry.deleteMany({ where: { shipId } }).catch(() => {});
  });

  afterAll(async () => {
    await prisma.bankEntry.deleteMany({ where: { shipId } }).catch(() => {});
    await prisma.$disconnect();
  });

  test('bankSurplus and getBankedAmount', async () => {
    await bankSurplus(shipId, year, 1000);
    const total = await getBankedAmount(shipId, year);
    expect(total).toBeGreaterThanOrEqual(1000);
  });

  test('applyBanked reduces available amount and prevents overapply', async () => {
    const initial = await getBankedAmount(shipId, year);
    await applyBanked(shipId, year, 500);
    const after = await getBankedAmount(shipId, year);
    expect(after).toBeCloseTo(initial - 500);
    await expect(applyBanked(shipId, year, 9999999)).rejects.toThrow();
  });
});
