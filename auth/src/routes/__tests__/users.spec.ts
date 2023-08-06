import request from 'supertest';

import app from '../../app';

describe('users', () => {
  describe('current', () => {
    it('returns details about the current user', async () => {
      const sessionCookie = await signUp();

      const res = await request(app)
        .get('/api/users/current')
        .set('Cookie', sessionCookie)
        .send();
      expect(res.body).toMatchObject({ email: signInEmail });
      expect(res.statusCode).toBe(200);
    });
  });
});
