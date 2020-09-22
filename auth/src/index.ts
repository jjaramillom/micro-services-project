import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/currentUser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

const app = express();

app.use(json());
app.use(loggingMiddleware);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get('/', (req, res) => {
  res.send('Auth service running');
});

// If not route was found, a not found error is thrown
// For async functions, next has to be used
/* app.all('*', async (_, __, next) => {
  next(new NotFoundError());
}); */

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
