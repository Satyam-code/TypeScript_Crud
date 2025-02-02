import * as amqp from 'amqplib';
import {RABBITMQ_HOST} from "../config/env"

export const sendEvent = async function sendEvent(queue: string, message: string) {
  const connection = await amqp.connect(RABBITMQ_HOST);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(message));
  console.log(`Event sent to queue ${queue}: ${message}`);
  setTimeout(() => {
    connection.close();
  }, 500);
}