import { Request, Response } from 'express';
import { IFuelRepository } from '../../ports/repositories/IFuelRepository';

export class FuelController {
  constructor(
    private createUseCase: any,
    private summaryUseCase: any,
    private fuelRepo?: IFuelRepository
  ) {}

  async create(req: Request, res: Response) {
    try {
      const data = await this.createUseCase.execute(req.body);
      res.status(201).json(data);
    } catch (err) {
      const msg = (err as any)?.message ?? String(err);
      res.status(500).json({ error: msg });
    }
  }

  async getSummary(req: Request, res: Response) {
    try {
      const summary = await this.summaryUseCase.execute();
      res.json(summary);
    } catch (err) {
      const msg = (err as any)?.message ?? String(err);
      res.status(500).json({ error: msg });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const records = await this.fuelRepo?.getAllFuelRecords();
      res.json(records);
    } catch (err) {
      const msg = (err as any)?.message ?? String(err);
      res.status(500).json({ error: msg });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!this.fuelRepo || typeof this.fuelRepo.updateFuelRecord !== 'function') {
        return res.status(500).json({ error: 'Repository update method not available' });
      }
      await this.fuelRepo.updateFuelRecord(id, req.body);
      res.json({ message: 'Updated successfully' });
    } catch (err) {
      const msg = (err as any)?.message ?? String(err);
      res.status(500).json({ error: msg });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!this.fuelRepo || typeof this.fuelRepo.deleteFuelRecord !== 'function') {
        return res.status(500).json({ error: 'Repository delete method not available' });
      }
      await this.fuelRepo.deleteFuelRecord(id);
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      const msg = (err as any)?.message ?? String(err);
      res.status(500).json({ error: msg });
    }
  }
}
