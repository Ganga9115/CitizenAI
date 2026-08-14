import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT, requireRole('ADMIN'));

router.get('/users', AdminController.getUsers);
router.patch('/users/:userId/role', AdminController.updateUserRole);
router.get('/departments', AdminController.getDepartments);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
