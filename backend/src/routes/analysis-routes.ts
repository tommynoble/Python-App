import { Router } from 'express';
import { upload } from '../middleware/upload';
import { AnalysisController } from '../controllers/analysis-controller';
import { validateImage } from '../middleware/validation';

const router = Router();
const analysisController = new AnalysisController();

router.post(
  '/',
  upload.single('image'),
  validateImage,
  analysisController.analyze
);

export default router;