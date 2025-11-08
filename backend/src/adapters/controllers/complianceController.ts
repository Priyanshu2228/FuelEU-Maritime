import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import computeCB from '../../application/usecases/ComputeCB';
import { getBankedAmount } from '../../application/usecases/Banking';

const prisma = new PrismaClient();

export async function getCB(req: Request, res: Response) {
  const { shipId, year } = req.query;
  try {
    if (!shipId) return res.status(400).json({ error: 'shipId required' });
    const route = await prisma.route.findFirst({ where: { routeId: String(shipId) } });
    if (!route) return res.status(404).json({ error: 'route not found' });
    const cb = computeCB({ ghgIntensity: route.ghgIntensity, fuelConsumptionTons: route.fuelConsumption });
    // persist snapshot
    await prisma.shipCompliance.create({ data: { shipId: route.routeId, routeId: route.id, year: route.year, cb_gco2eq: cb.cb_gCO2e } as any });
    res.json({ shipId: route.routeId, year: route.year, cb_gco2eq: cb.cb_gCO2e });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}

export async function getAdjustedCB(req: Request, res: Response) {
  const { shipId, year } = req.query;
  try {
    if (!shipId) return res.status(400).json({ error: 'shipId required' });
    const route = await prisma.route.findFirst({ where: { routeId: String(shipId) } });
    if (!route) return res.status(404).json({ error: 'route not found' });
    const cb = computeCB({ ghgIntensity: route.ghgIntensity, fuelConsumptionTons: route.fuelConsumption });
    const banked = await getBankedAmount(route.routeId, route.year);
    const adjusted = cb.cb_gCO2e + banked; // banked surplus increases CB
    res.json({ shipId: route.routeId, year: route.year, cb_before: cb.cb_gCO2e, banked, cb_after: adjusted });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}

export default { getCB, getAdjustedCB };
