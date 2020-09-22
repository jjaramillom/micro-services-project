import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { RequestValidationError, DatabaseConnectionError } from '../errors';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email should be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password should be between 4 and 20 characters'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    console.log('Creating user...');
    throw new DatabaseConnectionError();

    res.send({ msg: 'user created' });
  }
);

export { router as signupRouter };
