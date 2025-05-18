const express = require("express");
const { connectToDatabase } = require("./database");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const app = express();

// Middleware для обробки JSON
app.use(express.json());

// Підключення до MongoDB
connectToDatabase();

// Імпорт MQTT слухача
require("./services/mqttListener");

// Налаштування Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/**/*.js"], // Шлях до ваших файлів з маршрутами
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Використовуємо Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Підключення маршрутів
const authRoutes = require("./routes/auth/authRoutes");
const userRoutes = require("./routes/user/userRoutes");
const roomsRoutes = require("./routes/rooms/roomsRoutes");
const logsRoutes = require("./routes/log/logsRoutes");
const lightRoutes = require("./routes/light/lightRoutes");

// Використання маршрутів із префіксами
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/rooms", roomsRoutes);
app.use("/logs", logsRoutes);
app.use("/lights", lightRoutes);

// Запуск серверу
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
