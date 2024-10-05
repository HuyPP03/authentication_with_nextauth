import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import { validateBody } from '../middleware/validation.middleware';
import { registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);

export default router;
