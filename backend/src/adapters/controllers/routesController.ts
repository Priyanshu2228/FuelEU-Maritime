import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import computeComparison from '../../application/usecases/ComputeComparison';
import computeCB from '../../application/usecases/ComputeCB';

const prisma = new PrismaClient();

export async function getRoutes(req: Request, res: Response) {
  const routes = await prisma.route.findMany();
  res.json(routes);
}

export async function setBaseline(req: Request, res: Response) {
  const routeId = req.params.id;
  try {
    // First check if the route exists
    const route = await prisma.route.findFirst({ where: { routeId } });
    if (!route) {
      return res.status(404).json({ error: `Route ${routeId} not found` });
    }

    // set isBaseline=false for all
    await prisma.route.updateMany({ data: { isBaseline: false } });
    
    // set selected to true
    const updated = await prisma.route.update({ 
      where: { id: route.id }, 
      data: { isBaseline: true } 
    });
    
    res.json(updated);
  } catch (err: any) {
    console.error('Error setting baseline:', err);
    res.status(500).json({ 
      error: 'Failed to set baseline',
      message: err?.message ?? String(err),
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }
}

export async function getComparison(req: Request, res: Response) {
  try {
    const data = await computeComparison();
    if (!data.baseline || !data.results) {
      return res.status(404).json({ 
        error: 'No comparison data available',
        message: 'Please ensure routes are properly configured in the database'
      });
    }
    res.json(data);
  } catch (err: any) {
    console.error('Error in getComparison:', err);
    res.status(500).json({ 
      error: 'Failed to compute comparison',
      message: err?.message ?? String(err),
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }
}

export async function getRouteCB(req: Request, res: Response) {
  const { routeId, year } = req.query;
  try {
    if (!routeId) return res.status(400).json({ error: 'routeId required' });
    const r = await prisma.route.findFirst({ where: { routeId: String(routeId) } });
    if (!r) return res.status(404).json({ error: 'route not found' });
    const cb = computeCB({ ghgIntensity: r.ghgIntensity, fuelConsumptionTons: r.fuelConsumption });
    res.json({ routeId: r.routeId, year: r.year, cb_gCO2e: cb.cb_gCO2e });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}
