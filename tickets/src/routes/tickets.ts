import { Router } from 'express';
import { body } from 'express-validator';
import { jwtAuthentication, validateRequest } from '@jjaramillom-tickets/common';

import {
  createTicket,
  updateTicket,
  getTicket,
  getTickets,
} from '../controllers/ticketsController';

const router = Router();

router
  .route('/api/tickets/:ticketId')
  .get(jwtAuthentication, getTicket)
  .put(
    jwtAuthentication,
    [
      body('title').trim().notEmpty().withMessage('title is required'),
      body('price').isFloat({ gt: 0 }).withMessage('price must be greater than 0'),
    ],
    validateRequest,
    updateTicket
  );

router
  .route('/api/tickets')
  .post(
    jwtAuthentication,
    [
      body('title').trim().notEmpty().withMessage('title is required'),
      body('price').isFloat({ gt: 0 }).withMessage('price must be greater than 0'),
    ],
    validateRequest,
    createTicket
  )

  .get(jwtAuthentication, getTickets);

export default router;
