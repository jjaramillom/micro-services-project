import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import {
  NotFoundError,
  GeneralError,
  OrderStatus,
  OrderCreatedEvent,
} from '@jjaramillom-tickets/common';

import Order, { IOrder } from '../models/Order';
import Ticket from '../models/Ticket';
import {
  OrderCancelledEventPublisher,
  OrderCreatedEventPublisher,
} from '../events/publishers/orderPublishers';
import natsWrapper from '../services/natsWrapper';

const EXPIRATION_TIME = 1000 * 60 * 15; // 15 minutes

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  const user = req.tokenPayload;
  const { ticketId } = req.body;

  try {
    if (!isValidObjectId(ticketId)) {
      return next(new GeneralError(404, 'Ticket does not exist'));
    }
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return next(new GeneralError(404, 'Ticket does not exist'));
    }

    const isTicketReserved = await ticket.isReserved();

    if (isTicketReserved) {
      return next(new GeneralError(409, 'Ticket is already reserved'));
    }
    const order = await Order.create({
      userId: user.id,
      expiresAt: new Date(Date.now() + EXPIRATION_TIME),
      status: OrderStatus.Created,
      ticket,
    });
    const client = natsWrapper.getClient();
    const publisher = new OrderCreatedEventPublisher(client);
    publisher.publish({
      expiresAt: order.expiresAt.toISOString(),
      id: order.id,
      status: order.status,
      ticket: order.ticket,
      userId: order.userId,
    });
    res.status(201).send(order).end();
  } catch (error) {
    console.error(error);
    return next(new GeneralError(500, 'internal error'));
  }
}

export async function cancelOrder(req: Request, res: Response, next: NextFunction) {
  const user = req.tokenPayload;
  const { orderId } = req.params;
  if (!isValidObjectId(orderId)) {
    return next(new NotFoundError());
  }
  try {
    const order = await Order.findById(orderId);
    if (!order || order.userId !== user.id) {
      return next(new NotFoundError());
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    const client = natsWrapper.getClient();
    const publisher = new OrderCancelledEventPublisher(client);
    publisher.publish({ id: order.id, ticket: order.ticket });
    res.status(204).send().end();
  } catch (error) {
    console.error(error);
    return next(new GeneralError(500, 'internal error'));
  }
}

export async function getOrder(req: Request, res: Response, next: NextFunction) {
  const user = req.tokenPayload;
  const { orderId } = req.params;

  if (!isValidObjectId(orderId)) {
    return next(new NotFoundError());
  }

  try {
    const order = await Order.find({ id: orderId, userId: user.id }).populate('ticket');
    if (!order) {
      return next(new NotFoundError());
    }
    res.status(200).send(order).end();
  } catch (error) {
    console.error(error);
    return next(new GeneralError(500, 'internal error'));
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  const userId = req.tokenPayload.id;

  try {
    const orders = await Order.find({ userId: userId }).populate('ticket');
    res.status(200).send(orders).end();
  } catch (error) {
    console.error(error);
    return next(new NotFoundError());
  }
}

// TODO move this to .d.ts
declare global {
  namespace Express {
    interface Request {
      tokenPayload: { email: string; id: string };
    }
  }
}
