import { Request, Response } from 'express';
import { createPool } from '../../application/usecases/Pooling';

export async function postPool(req: Request, res: Response) {
  const { name, year, members } = req.body;
  if (!year || !members) return res.status(400).json({ error: 'year and members required' });
  try {
    const result = await createPool(name, Number(year), members);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err?.message ?? String(err) });
  }
}

export default { postPool };
