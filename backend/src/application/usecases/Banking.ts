import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getBankedAmount(shipId: string, year: number) {
  const entries = await prisma.bankEntry.findMany({ where: { shipId, year } });
  const total = entries.reduce<number>((s, e) => s + (e.amount_gco2eq ?? 0), 0);
  return total;
}

export async function bankSurplus(shipId: string, year: number, amount: number) {
  if (amount <= 0) throw new Error('Amount must be positive to bank');
  const entry = await prisma.bankEntry.create({ data: { shipId, year, amount_gco2eq: amount } as any });
  return entry;
}

export async function applyBanked(shipId: string, year: number, amount: number) {
  if (amount <= 0) throw new Error('Amount must be positive to apply');
  const available = await getBankedAmount(shipId, year);
  if (amount > available) throw new Error('Insufficient banked amount');
  // record negative entry to represent application
  const entry = await prisma.bankEntry.create({ data: { shipId, year, amount_gco2eq: -Math.abs(amount) } as any });
  return entry;
}

export default { getBankedAmount, bankSurplus, applyBanked };
