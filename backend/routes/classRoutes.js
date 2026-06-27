import { Router } from 'express';
import {
  listClasses,
  adminListClasses,
  getClass,
  studentViewClasses,
  createClass,
  updateClass,
  deleteClass,
  joinClass,
} from '../controllers/classController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin, roles } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/', listClasses);
router.get('/student-view', protect, studentViewClasses);
router.get('/admin/classes', protect, admin, adminListClasses);
router.get('/:id', getClass);
router.post('/', protect, roles('instructor', 'admin'), createClass);
router.put('/:id', protect, roles('instructor', 'admin'), updateClass);
router.delete('/:id', protect, roles('instructor', 'admin'), deleteClass);
router.post('/:id/join', protect, joinClass);

export default router;
