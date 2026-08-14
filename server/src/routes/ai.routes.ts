import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { uploadAudio } from '../middleware/upload.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/process-audio', authenticateJWT, uploadAudio.single('audio'), AIController.processAudio);

export default router;
