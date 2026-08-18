import { Router } from 'express';

import { chatController } from '../controllers/chat.controller';

import {
  optionalAuth
} from '../middleware/optionalAuth.middleware';

const router =
  Router();

router.post(
  '/',
  optionalAuth,
  chatController
);

export default router;