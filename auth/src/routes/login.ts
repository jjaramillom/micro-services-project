import express from 'express';

import { login } from '../controllers/authController';
import { basicAuthentication } from '../middleware';

const router = express.Router();

router.post('/api/users/login', basicAuthentication, login);

export { router as signinRouter };
