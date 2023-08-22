import { connect, Message } from 'node-nats-streaming';

const sc = connect('ticketing', 'listener', { url: 'http://localhost:4222' });

sc.on('connect', () => {
  console.log('connected');

  const opts = sc.subscriptionOptions().setStartWithLastReceived();
  const subscription = sc.subscribe('ticket:created', opts);
  subscription.on('message', (msg: Message) => {
    const data = JSON.parse((msg.getData() as Buffer).toString());
    data.price = data.price + 2000;
    console.log(data);
  });
});
