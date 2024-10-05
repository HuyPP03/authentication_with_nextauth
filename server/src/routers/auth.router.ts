import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import { validateBody } from '../middleware/validation.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);

router.post('/login', validateBody(loginSchema), authController.login);

router.post('/verify', authController.verify);

router.post('/check', authController.checkProvider);

router.post(
	'/create-user-with-provider',
	authController.createUserWithProvider,
);

export default router;
