import { Router } from 'express';
import {
  createPayment,
  createOrder,
  verifyPayment,
  listPayments,
  getPayment,
  refundPayment,
  checkout,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = Router();

router.post('/', protect, createPayment);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/checkout', protect, checkout);
router.get('/', protect, admin, listPayments);
router.get('/:id', protect, getPayment);
router.patch('/:id/refund', protect, admin, refundPayment);

export default router;
