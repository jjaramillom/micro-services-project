import amqplib from 'amqplib';

const queue = 'test_topic';

(async () => {
  const conn = await amqplib.connect('amqp://localhost');
  console.info('connected');
  const channel = await conn.createChannel();
  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('Received:', msg.content.toString());
      channel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();
