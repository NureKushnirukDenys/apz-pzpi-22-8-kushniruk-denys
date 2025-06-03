const { connectToDatabase } = require("./database");
const User = require("./models/User");
const Room = require("./models/Room");
const Log = require("./models/Log");
const Light = require("./models/Light");

async function seedData() {
  try {
    await connectToDatabase();

    // Колекція Users
    const user1 = await User.create({
      email: "user1@example.com",
      password: "hashedpassword1",
      role: "user",
      firstName: "John",
      lastName: "Doe",
      profileImage: "url_to_image_1",
    });

    // Створення адміністратора
    const admin = await User.create({
      email: "admin@example.com",
      password: "hashedpassword2",
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      profileImage: "url_to_image_2",
    });

    // Колекція Rooms
    const room1 = await Room.create({
      user_id: user1._id,
      name: "Кухня",
      status: true,
      iotDeviceId: "iot12345",
      distance: 10,
    });

    const room2 = await Room.create({
      user_id: user1._id,
      name: "Спальня",
      status: false,
      iotDeviceId: "iot67890",
      distance: 15,
    });

    // Колекція Logs
    await Log.insertMany([
      {
        user_id: user1._id,
        room_id: room1._id,
        action: "Увімкнено освітлення",
        timestamp: new Date(),
        timeOn: 3600,
        timeOff: 1800,
        averageLightTime: 2700,
      },
      {
        user_id: user1._id,
        room_id: room2._id,
        action: "Вимкнено освітлення",
        timestamp: new Date(),
        timeOn: 1800,
        timeOff: 3600,
        averageLightTime: 2700,
      },
    ]);

    // Колекція Lights (Освітлення)
    await Light.insertMany([
      {
        roomId: room1._id,
        status: true,
        brightness: 80,
        lastActivated: new Date(),
        schedule: {
          start: new Date("2024-12-14T07:00:00Z"),
          end: new Date("2024-12-14T09:00:00Z"),
        },
        motionDetected: false,
      },
      {
        roomId: room2._id,
        status: false,
        brightness: 50,
        lastActivated: new Date(),
        schedule: {
          start: new Date("2024-12-14T18:00:00Z"),
          end: new Date("2024-12-14T22:00:00Z"),
        },
        motionDetected: true,
      },
    ]);

    console.log("Дані успішно додано!");
    process.exit(0);
  } catch (err) {
    console.error("Помилка під час заповнення даних:", err);
    process.exit(1);
  }
}

seedData();
