import { ITicket } from '../models/Ticket';

type UserResponse = Pick<ITicket, 'id' | 'title' | 'price'>;

export function mapToTicketResponse(ticket: ITicket): UserResponse {
  return {
    title: ticket.title,
    price: ticket.price,
    id: ticket.id,
  };
}
