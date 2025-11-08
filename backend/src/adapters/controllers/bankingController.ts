import { Request, Response } from 'express';
import { getBankedAmount, bankSurplus, applyBanked } from '../../application/usecases/Banking';

export async function getBankRecords(req: Request, res: Response) {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: 'shipId and year required' });
  try {
    const entries = await (async () => {
      // For simplicity return entries via prisma indirectly (controller-level)
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const e = await prisma.bankEntry.findMany({ where: { shipId: String(shipId), year: Number(year) } });
      await prisma.$disconnect();
      return e;
    })();
    const total = await getBankedAmount(String(shipId), Number(year));
    res.json({ entries, total });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}

export async function postBank(req: Request, res: Response) {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || amount == null) return res.status(400).json({ error: 'shipId, year and amount required' });
  try {
    const entry = await bankSurplus(String(shipId), Number(year), Number(amount));
    res.json(entry);
  } catch (err: any) {
    res.status(400).json({ error: err?.message ?? String(err) });
  }
}

export async function postApply(req: Request, res: Response) {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || amount == null) return res.status(400).json({ error: 'shipId, year and amount required' });
  try {
    const entry = await applyBanked(String(shipId), Number(year), Number(amount));
    res.json(entry);
  } catch (err: any) {
    res.status(400).json({ error: err?.message ?? String(err) });
  }
}

export default { getBankRecords, postBank, postApply };
