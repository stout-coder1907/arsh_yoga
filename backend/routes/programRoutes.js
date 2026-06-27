import { Router } from 'express';
import {
  listPrograms,
  getProgram,
  getProgramLectures,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/', listPrograms);
router.get('/:id/lectures', getProgramLectures);
router.get('/:slug', getProgram);
router.post('/', protect, admin, createProgram);
router.put('/:id', protect, admin, updateProgram);
router.delete('/:id', protect, admin, deleteProgram);

export default router;
