import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app';

declare global {
  var signUp: () => Promise<string[]>;
  var signInEmail: string;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'abc';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const connections = await mongoose.connection.db.collections();
  await Promise.allSettled(connections.map((connection) => connection.deleteMany({})));
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signInEmail = 'test@test.com';
global.signUp = async (): Promise<string[]> => {
  const body = { password: 'test', email: global.signInEmail };
  const signupRes = await request(app).post('/api/users/signup').send(body);
  const sessionCookie = signupRes.get('Set-Cookie');
  expect(signupRes.statusCode).toBe(201);
  expect(sessionCookie).toBeDefined();

  return sessionCookie;
};
