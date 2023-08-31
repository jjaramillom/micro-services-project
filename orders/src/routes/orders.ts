import { Router } from 'express';
import { body } from 'express-validator';
import { jwtAuthentication, validateRequest } from '@jjaramillom-tickets/common';

import {
  createOrder,
  cancelOrder,
  getOrder,
  getOrders,
} from '../controllers/ordersController';

const router = Router();

router
  .route('/api/orders/:orderId')
  .get(jwtAuthentication, getOrder)
  .delete(jwtAuthentication, cancelOrder);

router
  .route('/api/orders')
  .post(
    jwtAuthentication,
    [body('ticketId').trim().notEmpty().withMessage('ticketId is required')],
    validateRequest,
    createOrder
  )
  .get(jwtAuthentication, getOrders);

export default router;
