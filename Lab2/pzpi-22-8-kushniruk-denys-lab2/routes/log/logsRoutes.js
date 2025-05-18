const express = require("express");
const router = express.Router();
const Log = require("../../models/Log");

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Управління логами
 */

/**
 * @swagger
 * /logs/info:
 *   get:
 *     summary: Отримати всі логи
 *     description: Отримання списку всіх логів.
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Логи успішно отримано.
 */
router.get("/info", async (req, res) => {
  try {
    const logs = await Log.find().populate("user_id room_id", "email name");
    res.json(logs);
  } catch (error) {
    res.status(500).send("Помилка при отриманні логів");
  }
});

/**
 * @swagger
 * /logs/create:
 *   post:
 *     summary: Створити новий лог
 *     description: Додавання нового лога до системи.
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID користувача, який здійснив дію.
 *                 example: "605c72ef1532071f5f6a2b10"
 *               room_id:
 *                 type: string
 *                 description: ID кімнати, в якій відбулася дія.
 *                 example: "605c72ef1532071f5f6a2b11"
 *               action:
 *                 type: string
 *                 description: Опис дії.
 *                 example: "Ввімкнув світло"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Час виконання дії.
 *               timeOn:
 *                 type: number
 *                 description: Час, коли світло було увімкнено (в секундах).
 *                 example: 3600
 *               timeOff:
 *                 type: number
 *                 description: Час, коли світло було вимкнено (в секундах).
 *                 example: 1800
 *               averageLightTime:
 *                 type: number
 *                 description: Середній час освітлення кімнати (в секундах).
 *                 example: 2700
 *     responses:
 *       200:
 *         description: Лог успішно створено.
 */
router.post("/create", async (req, res) => {
  const {
    user_id,
    room_id,
    action,
    timestamp,
    timeOn,
    timeOff,
    averageLightTime,
  } = req.body;

  if (!user_id || !action || !timestamp) {
    return res.status(400).send("Всі поля повинні бути заповнені");
  }

  try {
    const newLog = new Log({
      user_id,
      room_id,
      action,
      timestamp,
      timeOn,
      timeOff,
      averageLightTime,
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).send("Помилка при створенні логу");
  }
});

/**
 * @swagger
 * /logs/info/{logId}:
 *   get:
 *     summary: Отримати конкретний лог за ID
 *     description: Отримання логу за його ID.
 *     tags: [Logs]
 *     parameters:
 *       - name: logId
 *         in: path
 *         required: true
 *         description: ID логу.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Лог успішно отримано.
 *       404:
 *         description: Лог не знайдений.
 */
router.get("/info/:logId", async (req, res) => {
  const { logId } = req.params;

  try {
    const log = await Log.findById(logId).populate(
      "user_id room_id",
      "email name"
    );

    if (!log) {
      return res.status(404).send("Лог не знайдений");
    }

    res.json(log);
  } catch (error) {
    res.status(500).send("Помилка при отриманні логу");
  }
});

/**
 * @swagger
 * /logs/delete/{logId}:
 *   delete:
 *     summary: Видалити лог за ID
 *     description: Видалення конкретного логу за його ID.
 *     tags: [Logs]
 *     parameters:
 *       - name: logId
 *         in: path
 *         required: true
 *         description: ID логу.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Лог успішно видалено.
 *       404:
 *         description: Лог не знайдений.
 */
router.delete("/delete/:logId", async (req, res) => {
  const { logId } = req.params;

  try {
    const deletedLog = await Log.findByIdAndDelete(logId);

    if (!deletedLog) {
      return res.status(404).send("Лог не знайдений");
    }

    res.status(200).send("Лог успішно видалено");
  } catch (error) {
    res.status(500).send("Помилка при видаленні логу");
  }
});

module.exports = router;
