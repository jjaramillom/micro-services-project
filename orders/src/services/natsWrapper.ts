import { Stan, connect } from 'node-nats-streaming';

class NatsWrapper {
  private client?: Stan;

  public connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this.client = connect(clusterId, clientId, { url });

    this.client?.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => this.client?.close());
    process.on('SIGTERM', () => this.client?.close());

    return new Promise((resolve, reject) => {
      this.client?.on('connect', () => {
        resolve();
      });
      this.client?.on('error', (err) => {
        reject(err);
      });
    });
  }

  public getClient(): Stan {
    if (!this.client) {
      throw new Error('cannot access NATS client before connecting');
    }
    return this.client;
  }
}

const natsWrapper = new NatsWrapper();

export default natsWrapper;
