import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PoolMemberInput {
  shipId: string;
  cb_before: number; // gCO2e
}

export async function createPool(name: string | undefined, year: number, members: PoolMemberInput[]) {
  // Validation: sum(cb_before) >= 0
  const total = members.reduce((s, m) => s + m.cb_before, 0);
  if (total < 0) throw new Error('Sum of members CB must be >= 0 to create a pool');

  // Deep copy arrays for allocations
  const providers = members
    .map((m) => ({ ...m }))
    .filter((m) => m.cb_before > 0)
    .sort((a, b) => b.cb_before - a.cb_before); // largest surplus first
  const deficits = members
    .map((m) => ({ ...m }))
    .filter((m) => m.cb_before < 0)
    .sort((a, b) => a.cb_before - b.cb_before); // most negative first

  // initialize cb_after with cb_before
  const cbAfterMap: Record<string, number> = {};
  members.forEach((m) => (cbAfterMap[m.shipId] = m.cb_before));

  // Greedy allocation: move surplus to deficits
  for (const deficit of deficits) {
    let need = -deficit.cb_before; // positive amount required
    for (const provider of providers) {
      if (need <= 0) break;
      const available = Math.max(0, provider.cb_before);
      if (available <= 0) continue;
      const transfer = Math.min(available, need);
      provider.cb_before -= transfer;
      cbAfterMap[provider.shipId] = (cbAfterMap[provider.shipId] ?? 0) - transfer;
      cbAfterMap[deficit.shipId] = (cbAfterMap[deficit.shipId] ?? 0) + transfer;
      need -= transfer;
    }
    if (need > 1e-6) {
      // couldn't fully cover deficit (shouldn't happen if total >=0), enforce rule
      throw new Error('Allocation failed to cover deficits');
    }
  }

  // Enforce rules: deficit ship cannot exit worse (cb_after >= cb_before)
  for (const m of members) {
    if (m.cb_before < 0) {
      if ((cbAfterMap[m.shipId] ?? 0) < m.cb_before - 1e-6) {
        throw new Error(`Deficit ship ${m.shipId} would exit worse`);
      }
    }
    // surplus ship cannot exit negative
    if (m.cb_before > 0) {
      if ((cbAfterMap[m.shipId] ?? 0) < -1e-6) {
        throw new Error(`Surplus ship ${m.shipId} would become negative`);
      }
    }
  }

  // Persist pool
  const pool = await prisma.pool.create({ data: { name, year } as any });
  const createdMembers = [] as any[];
  for (const m of members) {
    const cb_before = m.cb_before;
    const cb_after = cbAfterMap[m.shipId] ?? cb_before;
    const pm = await prisma.poolMember.create({ data: { poolId: pool.id, shipId: m.shipId, cb_before, cb_after } as any });
    createdMembers.push(pm);
  }

  return { pool, members: createdMembers };
}

export default { createPool };
