import mongoose from 'mongoose';

import './env';
import app from './app';
import natsWrapper from './services/natsWrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to mongo', error);
  }

  try {
    // TODO add a proper client id
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.getClient().on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    console.log('Connected to NATS');
  } catch (error) {
    console.error('Could not connect to NATS', error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
