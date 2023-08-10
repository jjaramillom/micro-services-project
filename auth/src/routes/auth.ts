import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@jjaramillom-tickets/common';

import { login, signUp, logout } from '../controllers/authController';
import { basicAuthentication } from '../middleware';

const router = express.Router();

router.post('/api/users/login', basicAuthentication, login);
router.post('/api/users/logout', logout);
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('email should be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password should be between 4 and 20 characters'),
  ],
  validateRequest,
  signUp
);
export default router;
