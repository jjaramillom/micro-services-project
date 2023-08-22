import request from 'supertest';

import app from '../../app';
import Ticket from '../../models/Ticket';
import natsWrapper from '../../services/natsWrapper';

jest.mock('../../services/natsWrapper.ts');

const natsClient = natsWrapper.getClient();

describe('tickets', () => {
  let sessionCookie: string[];
  beforeEach(() => {
    sessionCookie = signIn();
    (natsClient.publish as jest.Mock).mockClear();
  });
  describe('create', () => {
    it('can only be accessed if the user is signed in', async () => {
      let res = await request(app).post('/api/tickets').send();
      expect(res.statusCode).toBe(401);
      res = await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({ title: 'test', price: 100 });
      expect(res.statusCode).toBe(201);
      expect(natsClient.publish).toHaveBeenCalledTimes(1);
      const { body } = res;
      expect(natsClient.publish).toHaveBeenCalledWith(
        'ticket:created',
        JSON.stringify({ title: body.title, userId: '123', price: body.price, id: body.id }),
        expect.any(Function)
      );
    });

    it('returns 400 if invalid title is provided', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({ title: '', price: 100 });
      expect(res.body).toStrictEqual({
        errors: [{ field: 'title', message: 'title is required' }],
      });
      expect(res.statusCode).toBe(400);
    });
    it('returns 400 if invalid price is provided', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({ title: 'test', price: 0 });
      expect(res.body).toStrictEqual({
        errors: [{ field: 'price', message: 'price must be greater than 0' }],
      });
      expect(res.statusCode).toBe(400);
    });
    it('creates a ticket', async () => {
      let tickets = await Ticket.find({});
      expect(tickets).toHaveLength(0);
      const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({ title: 'test', price: 10 });
      expect(res.body).toMatchObject({
        title: 'test',
        price: 10,
      });
      expect(res.statusCode).toBe(201);
      tickets = await Ticket.find({});
      expect(tickets).toHaveLength(1);
      expect(tickets[0]).toMatchObject({ title: 'test', price: 10, userId: '123' });
    });
  });

  describe('get ticket', () => {
    it('can only be accessed if the user is signed in', async () => {
      let res = await request(app).get('/api/tickets/123').send();
      expect(res.statusCode).toBe(401);
      res = await request(app).get('/api/tickets/123').set('Cookie', sessionCookie).send();
      expect(res.statusCode).toBe(404);
    });

    it('returns 404 if ticket does not exist', async () => {
      const res = await request(app)
        .get('/api/tickets/123')
        .set('Cookie', sessionCookie)
        .send();
      expect(res.statusCode).toBe(404);
    });

    it('returns 404 if ticket does not exist', async () => {
      const res = await request(app)
        .get('/api/tickets/123')
        .set('Cookie', sessionCookie)
        .send();
      expect(res.statusCode).toBe(404);
    });

    it('returns ticket', async () => {
      const { body } = await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({ title: 'test', price: 10 });

      const res = await request(app)
        .get(`/api/tickets/${body.id}`)
        .set('Cookie', sessionCookie)
        .send();
      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual(body);
    });
  });

  describe('get tickets', () => {
    it('can only be accessed if the user is signed in', async () => {
      let res = await request(app).get('/api/tickets').send();
      expect(res.statusCode).toBe(401);
      res = await request(app).get('/api/tickets').set('Cookie', sessionCookie).send();
      expect(res.statusCode).toBe(200);
    });

    it('returns tickets', async () => {
      await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({ title: 'test', price: 10 });

      const res = await request(app).get(`/api/tickets`).set('Cookie', sessionCookie).send();
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('update ticket', () => {
    it('can only be accessed if the user is signed in', async () => {
      let res = await request(app).put('/api/tickets/123').send({ title: 'test', price: 100 });
      expect(res.statusCode).toBe(401);
      res = await request(app)
        .put('/api/tickets/123')
        .set('Cookie', sessionCookie)
        .send({ title: 'test', price: 100 });
      expect(res.statusCode).toBe(404);
    });

    it('returns 400 if invalid title is provided', async () => {
      const res = await request(app)
        .put('/api/tickets/123')
        .set('Cookie', sessionCookie)
        .send({ title: '', price: 100 });
      expect(res.body).toStrictEqual({
        errors: [{ field: 'title', message: 'title is required' }],
      });
      expect(res.statusCode).toBe(400);
    });
    it('returns 400 if invalid price is provided', async () => {
      const res = await request(app)
        .put('/api/tickets/123')
        .set('Cookie', sessionCookie)
        .send({ title: 'test', price: 0 });
      expect(res.body).toStrictEqual({
        errors: [{ field: 'price', message: 'price must be greater than 0' }],
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 401 if user is not the owner of the ticket', async () => {
      const ownerSessionCookie = signIn({ id: 'abcdef', email: 'anotherUser@test.com' });
      const { body: createdTicket } = await request(app)
        .post('/api/tickets')
        .set('Cookie', ownerSessionCookie)
        .send({ title: 'test', price: 10 });

      const res = await request(app)
        .put(`/api/tickets/${createdTicket.id}`)
        .set('Cookie', sessionCookie)
        .send({ title: 'test-123', price: 1000 });
      expect(res.statusCode).toBe(401);
      expect(res.body).toStrictEqual({
        errors: [{ message: 'User is not the owner of this ticket' }],
      });
    });
    it('updates a ticket', async () => {
      let tickets = await Ticket.find({});
      expect(tickets).toHaveLength(0);

      const { body: createdTicket } = await request(app)
        .post('/api/tickets')
        .set('Cookie', sessionCookie)
        .send({ title: 'test', price: 10 });

      tickets = await Ticket.find({});
      expect(tickets).toHaveLength(1);
      expect(tickets[0]).toMatchObject({ title: 'test', price: 10, userId: '123' });

      const res = await request(app)
        .put(`/api/tickets/${createdTicket.id}`)
        .set('Cookie', sessionCookie)
        .send({ title: 'updated test', price: 1000 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual({
        id: createdTicket.id,
        title: 'updated test',
        price: 1000,
      });

      tickets = await Ticket.find({});
      expect(tickets).toHaveLength(1);
      expect(tickets[0]).toMatchObject({ title: 'updated test', price: 1000, userId: '123' });
    });
  });
});
