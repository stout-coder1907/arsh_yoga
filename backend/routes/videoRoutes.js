import { Router } from 'express';
import {
  listVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { roles } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/', listVideos);
router.get('/:id', getVideo);
router.post('/', protect, roles('instructor', 'admin'), createVideo);
router.put('/:id', protect, roles('instructor', 'admin'), updateVideo);
router.delete('/:id', protect, roles('instructor', 'admin'), deleteVideo);

export default router;
