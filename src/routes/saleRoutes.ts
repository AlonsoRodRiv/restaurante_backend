import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createSale, getSales } from '../controllers/saleController';

const router = Router();

router.get('/', authenticateToken, getSales);
router.post('/', authenticateToken, createSale);
export default router;
