// services/mqttListener.js
const mqtt = require("mqtt");
const Room = require("../models/Room"); // Підключення до моделі Room

// Налаштування MQTT
const mqttUrl = "mqtt://broker.emqx.io";
const topic = "light/status";

const client = mqtt.connect(mqttUrl);

// Підключення до MQTT брокера
client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Error subscribing to topic:", err);
    } else {
      console.log(`Subscribed to ${topic}`);
    }
  });
});

// Обробка повідомлень
client.on("message", async (topic, message) => {
  console.log(`Received message on ${topic}: ${message.toString()}`);

  // Парсимо повідомлення
  const data = JSON.parse(message.toString());

  if (data.status !== undefined && data.iotDeviceId) {
    try {
      // Знаходимо кімнату за iotDeviceId
      const room = await Room.findOne({ iotDeviceId: data.iotDeviceId });
      if (!room) {
        console.error("Room not found");
        return;
      }

      // Оновлюємо статус та дистанцію
      room.status = data.status;
      room.distance = data.distance;
      await room.save();

      console.log("Room updated successfully");
    } catch (error) {
      console.error("Error updating room:", error);
    }
  } else {
    console.log("Invalid data received");
  }
});
