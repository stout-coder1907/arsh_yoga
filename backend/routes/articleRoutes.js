import { Router } from 'express';
import {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { roles } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/', listArticles);
router.get('/:slug', getArticle);
router.post('/', protect, roles('instructor', 'admin'), createArticle);
router.put('/:id', protect, roles('instructor', 'admin'), updateArticle);
router.delete('/:id', protect, roles('instructor', 'admin'), deleteArticle);

export default router;
