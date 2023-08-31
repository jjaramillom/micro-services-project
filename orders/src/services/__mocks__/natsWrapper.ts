import { Stan } from 'node-nats-streaming';

const client: Pick<Stan, 'publish'> = {
  publish: jest.fn().mockImplementation((subject, data, cb) => {
    cb?.(undefined, '1223');
    return '';
  }),
};

const natsWrapper = {
  getClient(): Pick<Stan, 'publish'> {
    return client;
  },
  async connect(): Promise<void> {
    return;
  },
};

export default natsWrapper;
