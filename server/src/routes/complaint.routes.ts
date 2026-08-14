import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/check-similar', ComplaintController.checkSimilar);
router.post('/:id/endorse', ComplaintController.endorseComplaint);
router.post('/:id/feedback', ComplaintController.submitFeedback);

router.post('/', ComplaintController.createComplaint);
router.get('/', ComplaintController.getComplaints);
router.get('/:id', ComplaintController.getComplaintById);
router.patch('/:id/status', requireRole('OFFICER', 'ADMIN'), ComplaintController.updateStatus);
router.post('/:id/notes', requireRole('OFFICER', 'ADMIN'), ComplaintController.addNote);

export default router;
