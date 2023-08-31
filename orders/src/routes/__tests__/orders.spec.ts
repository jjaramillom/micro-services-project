import request from 'supertest';

import app from '../../app';
import Ticket from '../../models/Ticket';
import natsWrapper from '../../services/natsWrapper';
import Order from '../../models/Order';
import { OrderStatus } from '@jjaramillom-tickets/common';

jest.mock('../../services/natsWrapper.ts');

const natsClient = natsWrapper.getClient();

describe('orders', () => {
  let sessionCookie: string[];
  beforeEach(() => {
    sessionCookie = signIn();
    (natsClient.publish as jest.Mock).mockClear();
  });
  describe('create', () => {
    it('can only be accessed if the user is signed in', async () => {
      const ticket = await Ticket.create({ price: 1, title: 'test' });
      let res = await request(app).post('/api/orders').send({ ticketId: ticket.id });
      expect(res.statusCode).toBe(401);
      res = await request(app)
        .post('/api/orders')
        .set('Cookie', sessionCookie)
        .send({ ticketId: ticket.id });
      expect(res.statusCode).toBe(201);
    });

    it('creates an order', async () => {
      const ticket = await Ticket.create({ price: 1, title: 'test' });
      let res = await request(app).post('/api/orders').send({ ticketId: ticket.id });
      expect(res.statusCode).toBe(401);
      res = await request(app)
        .post('/api/orders')
        .set('Cookie', sessionCookie)
        .send({ ticketId: ticket.id });
      expect(res.statusCode).toBe(201);
      const order = await Order.findById(res.body.id);
      expect(order).toBeDefined();
    });

    it('returns 404 if ticket does not exist', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Cookie', sessionCookie)
        .send({ ticketId: 'abc' });
      expect(res.statusCode).toBe(404);
    });

    it('returns 409 if ticket is already reserved', async () => {
      const ticket = await Ticket.create({ price: 1, title: 'test' });
      let res = await request(app)
        .post('/api/orders')
        .set('Cookie', sessionCookie)
        .send({ ticketId: ticket.id });
      expect(res.statusCode).toBe(201);
      res = await request(app)
        .post('/api/orders')
        .set('Cookie', sessionCookie)
        .send({ ticketId: ticket.id });
      expect(res.statusCode).toBe(409);
    });

    it.todo('emits an order created event');
  });

  describe('get order', () => {
    it('can only be accessed if the user is signed in', async () => {
      const ticket = await Ticket.create({ price: 1, title: 'test' });
      const expiresAt = new Date();
      const order = await Order.create({
        ticket: ticket,
        status: OrderStatus.Created,
        userId: '123',
        expiresAt: expiresAt,
      });

      const res = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', sessionCookie)
        .send();
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        status: OrderStatus.Created,
        userId: '123',
        expiresAt: expiresAt.toISOString(),
        id: order.id,
        ticket: {
          id: ticket.id,
          price: 1,
          title: 'test',
        },
      });
    });
  });

  describe('get orders', () => {
    it('can only be accessed if the user is signed in', async () => {
      const ticket = await Ticket.create({ price: 1, title: 'test' });
      const expiresAt = new Date();
      const order = await Order.create({
        ticket: ticket,
        status: OrderStatus.Created,
        userId: '123',
        expiresAt: expiresAt,
      });

      const res = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', sessionCookie)
        .send();
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        status: OrderStatus.Created,
        userId: '123',
        expiresAt: expiresAt.toISOString(),
        id: order.id,
        ticket: {
          id: ticket.id,
          price: 1,
          title: 'test',
        },
      });
    });

    it('only returns the user orders', async () => {
      const expiresAt = new Date();
      const tickets = await Promise.all(
        [10, 20, 30].map((price) => Ticket.create({ price, title: `Ticket for ${price}` }))
      );
      const ordersUsers = ['other-user', defaultSignInUser.id, defaultSignInUser.id];
      const orders = await Promise.all(
        tickets.map((ticket, i) =>
          Order.create({
            ticket,
            status: OrderStatus.Created,
            userId: ordersUsers[i],
            expiresAt,
          })
        )
      );

      const res = await request(app).get('/api/orders').set('Cookie', sessionCookie).send();
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toStrictEqual([
        {
          status: orders[1].status,
          userId: orders[1].userId,
          expiresAt: orders[1].expiresAt.toISOString(),
          id: orders[1].id,
          ticket: {
            id: tickets[1].id,
            price: tickets[1].price,
            title: tickets[1].title,
          },
        },
        {
          status: orders[2].status,
          userId: orders[2].userId,
          expiresAt: orders[2].expiresAt.toISOString(),
          id: orders[2].id,
          ticket: {
            id: tickets[2].id,
            price: tickets[2].price,
            title: tickets[2].title,          },
        },
      ]);
    });
  });
});
