import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createProduct, getProducts } from '../controllers/productController';

const router = Router();

router.get('/', authenticateToken, getProducts);
router.post('/', authenticateToken, createProduct);
export default router;
