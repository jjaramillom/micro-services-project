import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler ,NotFoundError,setJwtTokenKey} from '@jjaramillom-tickets/common';

import usersRouter from './routes/users';
import authRouter from './routes/auth';

setJwtTokenKey(process.env.JWT_KEY!)

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
};

const app = express();
// Just to make express aware that there is a proxy behind. So that traffic coming from nginx is also considered as safe
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }));
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

export default app;
