import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  myEnrollments,
  myPayments,
  listUsers,
  setUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = Router();

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.get('/me/enrollments', protect, myEnrollments);
router.get('/me/payments', protect, myPayments);

// Admin
router.get('/', protect, admin, listUsers);
router.patch('/:id/role', protect, admin, setUserRole);
router.delete('/:id', protect, admin, deleteUser);

export default router;
