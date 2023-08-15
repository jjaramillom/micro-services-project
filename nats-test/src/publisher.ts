import { connect } from 'node-nats-streaming';

const sc = connect('ticketing', 'publisher', { url: 'http://localhost:4222' });

sc.on('connect', () => {
  console.log('connected');
  const data = {
    id: Math.floor(Math.random() * 100),
    price: Math.floor(Math.random() * 100),
    title: 'test',
  };
  sc.publish('test-topic', Buffer.from(JSON.stringify(data)), (err, guid) => {
    if (err) {
      console.log('publish failed: ' + err);
    } else {
      console.log('published message with guid: ' + guid);
    }
    process.exit();
  });
});
