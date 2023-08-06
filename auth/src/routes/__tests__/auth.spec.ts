import request from 'supertest';

import app from '../../app';

describe('auth', () => {
  describe('signup', () => {
    it('returns 201 on successful signup', async () => {
      await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'test' })
        .expect(201);
    });

    it('returns 201 and set-cookie header on successful signup', async () => {
      const res = await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'test' });

      expect(res.statusCode).toBe(201);
      expect(res.get('Set-Cookie')).toBeDefined();
    });

    it('returns 409 if email is already in use', async () => {
      await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'test' });

      const res = await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'test' });

      expect(res.body).toStrictEqual({ errors: [{ message: 'User already exists' }] });
      expect(res.statusCode).toBe(409);
    });

    it.each([
      ['invalid email', { email: 'test', password: 'abcd' }],
      ['missing email', { password: 'abcd' }],
      ['short password', { email: 'test@test.com', password: 'aaa' }],
      ['long password', { email: 'test@test.com', password: 'a'.repeat(21) }],
      ['missing password', { email: 'test@test.com' }],
    ])('returns 400 for %s', async (_, body) => {
      await request(app).post('/api/users/signup').send(body).expect(400);
    });
  });
});
