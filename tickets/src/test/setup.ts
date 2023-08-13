import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createJwtToken, setJwtTokenKey } from '@jjaramillom-tickets/common';

interface User {
  id: string;
  email: string;
}

declare global {
  var signIn: (user?: User) => string[];
  var defaultSignInUser: User;
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

const defaultSignInUser = { email: 'test@test.com', id: '123' };
global.defaultSignInUser = defaultSignInUser;
global.signIn = (user: User = defaultSignInUser): string[] => {
  setJwtTokenKey(process.env.JWT_KEY!);
  const jwt = createJwtToken(user);
  const sessionJSON = JSON.stringify({ jwt });
  const encodedSession = Buffer.from(sessionJSON).toString('base64');
  return [`session=${encodedSession}`];
};
