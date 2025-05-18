const mongoose = require("mongoose");

// Створення схеми для освітлення
const lightSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room", // Посилання на модель кімнати, якщо ви хочете зберігати дані про кімнату
      required: true,
    },
    status: {
      type: Boolean,
      default: false, // Статус: false - вимкнено, true - увімкнено
    },
    brightness: {
      type: Number,
      default: 100, // Рівень яскравості від 0 до 100
    },
    lastActivated: {
      type: Date,
      default: Date.now,
    },
    schedule: {
      start: {
        type: Date,
        required: false, // Час початку автоматичного включення (якщо застосовується)
      },
      end: {
        type: Date,
        required: false, // Час вимикання
      },
    },
    motionDetected: {
      type: Boolean,
      default: false, // Чи виявлений рух для автоматичного включення
    },
  },
  { versionKey: false }
);

// Створення моделі на основі схеми
const Light = mongoose.model("Light", lightSchema);

module.exports = Light;
