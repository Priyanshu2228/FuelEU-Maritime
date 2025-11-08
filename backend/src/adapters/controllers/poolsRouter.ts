import { Router } from 'express';
import { postPool } from './poolsController';

const router = Router();

router.post('/', postPool);

export default router;
