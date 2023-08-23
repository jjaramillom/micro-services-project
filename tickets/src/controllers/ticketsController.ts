import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import {
  NotFoundError,
  GeneralError,
  TicketCreatedPublisher,
  TicketUpdatedPublisher,
} from '@jjaramillom-tickets/common';

import Ticket, { ITicket } from '../models/Ticket';
import { mapToTicketResponse } from './mappers';
import natsWrapper from '../services/natsWrapper';

export async function createTicket(req: Request, res: Response, next: NextFunction) {
  const user = req.tokenPayload;
  const ticketData = req.body;

  try {
    const ticket = await Ticket.create({ ...ticketData, userId: user.id });
    const client = natsWrapper.getClient();
    const ticketCreatedPublisher = new TicketCreatedPublisher(client);
    ticketCreatedPublisher.publish(ticket);
    res.status(201).send(mapToTicketResponse(ticket)).end();
  } catch (error) {
    console.error(error);
    return next(new GeneralError(500, 'internal error'));
  }
}

export async function updateTicket(req: Request, res: Response, next: NextFunction) {
  const userId = req.tokenPayload.id;
  const ticketId = req.params.ticketId;
  const ticketData = req.body;

  if (!isValidObjectId(ticketId)) {
    return next(new NotFoundError());
  }

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return next(new NotFoundError());
    }

    if (ticket.userId !== userId) {
      return next(new GeneralError(401, 'User is not the owner of this ticket'));
    }

    ticket.set({ title: ticketData.title, price: ticketData.price });
    await ticket.save();

    const client = natsWrapper.getClient();
    const ticketUpdatedPublisher = new TicketUpdatedPublisher(client);
    ticketUpdatedPublisher.publish(ticket);
    res.status(200).send(mapToTicketResponse(ticket)).end();
  } catch (error) {
    console.error(error);
    return next(new GeneralError(500, 'internal error'));
  }
}

export async function getTicket(req: Request, res: Response, next: NextFunction) {
  const ticketId = req.params.ticketId;

  if (!isValidObjectId(ticketId)) {
    return next(new NotFoundError());
  }

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return next(new NotFoundError());
    }
    res.status(200).send(mapToTicketResponse(ticket)).end();
  } catch (error) {
    console.error(error);
    return next(new GeneralError(500, 'internal error'));
  }
}

export async function getTickets(req: Request, res: Response, next: NextFunction) {
  const userId = req.tokenPayload.id;

  try {
    const tickets = await Ticket.find({ userId: userId });
    res.status(200).send(tickets.map(mapToTicketResponse)).end();
  } catch (error) {
    console.error(error);
    return next(new NotFoundError());
  }
}

// TODO move this to .d.ts
declare global {
  namespace Express {
    interface Request {
      currentUser: { email: string; id: string };
      tokenPayload: ITicket;
    }
  }
}
