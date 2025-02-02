import * as amqp from "amqplib";
import { AppDataSource } from "../config/ormconfig";
import { UserLog } from "../entities/UserLog";
import { RABBITMQ_HOST } from "../config/env";

async function startConsumer() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_HOST);
    const channel = await connection.createChannel();
    const queue = "audit_logs";

    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: true });
    console.log("Waiting for events...");

    // Consume messages from the queue
    channel.consume(queue, async (message: any) => {
      if (message) {
        const event = JSON.parse(message.content.toString());

        if (event.type === "USER_CREATED" || "USER_UPDATED" || "USER_DELETED") {
          // Create a new log entry
          const log = new UserLog(
            event.data.user_id,
            event.data.email,
            event.data.logData,
            event.data.created_at
          );
          // Save the log to MySQL using TypeORM
          await AppDataSource.manager.save(log);
          console.log("Log inserted for user:", event.data.user_id);
        }

        // Acknowledge the message
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

startConsumer().catch((error) => {
  console.error("Error in consumer:", error);
  process.exit(1); // Exit on error
});
