import { Router } from 'express';
import { getRoutes, setBaseline, getComparison, getRouteCB } from './routesController';

const router = Router();

router.get('/', getRoutes);
router.post('/:id/baseline', setBaseline);
router.get('/comparison', getComparison);
router.get('/cb', getRouteCB);

export default router;
