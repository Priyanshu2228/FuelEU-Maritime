import { Router } from 'express';
import { getBankRecords, postBank, postApply } from './bankingController';

const router = Router();

router.get('/records', getBankRecords);
router.post('/bank', postBank);
router.post('/apply', postApply);

export default router;
