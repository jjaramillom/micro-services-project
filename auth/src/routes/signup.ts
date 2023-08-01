import express from 'express';
import { body } from 'express-validator';

import { signUp } from '../controllers/authController';
import { validateRequest } from '../middleware';

const router = express.Router();

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

export { router as signupRouter };
