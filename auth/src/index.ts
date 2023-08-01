import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import usersRouter from './routes/users';
import authRouter from './routes/auth';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

const app = express();
// Just to make express aware that there is a proxy behind. So that traffic coming from nginx is also considered as safe
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({ signed: false, secure: true }));
app.use(loggingMiddleware);

app.use(usersRouter);
app.use(authRouter);

app.get('/', (req, res) => {
  res.send('Auth service running');
});

// If no route was found, a not found error is thrown
// For async functions, next has to be used
/* app.all('*', async (_, __, next) => {
  next(new NotFoundError());
}); */

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  // if (!process.env.JWT_KEY) {
  //   throw new Error('JWT_KEY must be defined');
  // }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to mongo', error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
