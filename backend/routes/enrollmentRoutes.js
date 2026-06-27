import { Router } from 'express';
import {
  enroll,
  updateProgress,
  listEnrollments,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = Router();

router.post('/', protect, enroll);
router.patch('/:id/progress', protect, updateProgress);
router.get('/', protect, admin, listEnrollments);

export default router;
