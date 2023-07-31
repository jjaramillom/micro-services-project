import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { createUser } from '../controllers/userController';

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
  createUser
);

export { router as signupRouter };
