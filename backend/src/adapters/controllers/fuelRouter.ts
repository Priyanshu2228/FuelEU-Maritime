import { Router } from 'express';
import { PrismaFuelRepository } from '../persistence/prismaFuelRepository';
import { CreateFuelRecord } from '../../application/usecases/CreateFuelRecord';
import { GetFuelSummary } from '../../application/usecases/GetFuelSummary';
import { FuelController } from './fuelController';

const repo = new PrismaFuelRepository();
const createUsecase = new CreateFuelRecord(repo as any);
const summaryUsecase = new GetFuelSummary(repo as any);

const controller = new FuelController(createUsecase, summaryUsecase, repo);

const router = Router();

router.post('/', controller.create.bind(controller));
router.get('/summary', controller.getSummary.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
