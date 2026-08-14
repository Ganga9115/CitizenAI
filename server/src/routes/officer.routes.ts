import { Router } from 'express';
import { OfficerController } from '../controllers/officer.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT, requireRole('OFFICER', 'ADMIN'));

router.get('/queue', OfficerController.getQueue);
router.patch('/assign/:id', OfficerController.assignComplaint);

export default router;
