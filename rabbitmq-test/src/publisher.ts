import amqp from 'amqplib';

const queue = 'test_topic';
const data = {
  id: Math.floor(Math.random() * 100),
  price: Math.floor(Math.random() * 100),
  title: 'test',
};

(async () => {
  let connection;
  try {
    connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    console.log(`[x] Sent`);
    console.log(data);
    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) {
      await connection.close();
    }
    process.exit();
  }
})();
