const express = require("express");
const Light = require("../../models/Light");
const Log = require("../../models/Log");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lights
 *   description: Управління освітленням
 */

/**
 * @swagger
 * /lights/{id}:
 *   get:
 *     summary: Отримати дані про освітлення
 *     description: Отримати інформацію про освітлення за його ID.
 *     tags: [Lights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID освітлення
 *     responses:
 *       200:
 *         description: Дані про освітлення успішно отримано.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 brightness:
 *                   type: number
 *                 lastActivated:
 *                   type: string
 *       404:
 *         description: Освітлення не знайдено.
 */
router.get("/:id", async (req, res) => {
  try {
    const light = await Light.findById(req.params.id);
    if (!light) {
      return res.status(404).send("Освітлення не знайдено");
    }
    res.status(200).json(light);
  } catch (error) {
    res.status(500).send("Помилка при отриманні даних про освітлення");
  }
});

/**
 * @swagger
 * /lights/{id}/toggle:
 *   put:
 *     summary: Перемикати стан освітлення
 *     description: Змінює стан освітлення на протилежний.
 *     tags: [Lights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID освітлення
 *     responses:
 *       200:
 *         description: Стан освітлення успішно змінено.
 *       404:
 *         description: Освітлення не знайдено.
 */
router.put("/:id/toggle", async (req, res) => {
  try {
    const light = await Light.findById(req.params.id);
    if (!light) {
      return res.status(404).send("Освітлення не знайдено");
    }

    const currentTime = new Date();
    const log = await Log.findOne({ room_id: light.roomId }).sort({
      timestamp: -1,
    });

    if (log) {
      if (light.status) {
        log.timeOff += (currentTime - log.timestamp) / 1000;
      } else {
        log.timeOn += (currentTime - log.timestamp) / 1000;
      }
      log.averageLightTime = (log.timeOn + log.timeOff) / 2;
      log.timestamp = currentTime;
      await log.save();
    }

    light.status = !light.status;
    light.lastActivated = currentTime;
    await light.save();

    res.status(200).json(light);
  } catch (error) {
    res.status(500).send("Помилка при зміні стану освітлення");
  }
});

/**
 * @swagger
 * /lights/{id}/schedule:
 *   put:
 *     summary: Встановити розклад для освітлення
 *     description: Встановлює час початку та закінчення для автоматичного включення/вимкнення освітлення.
 *     tags: [Lights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID освітлення
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *               end:
 *                 type: string
 *                 format: date-time
 *             example:
 *               start: "2024-12-14T07:00:00Z"
 *               end: "2024-12-14T09:00:00Z"
 *     responses:
 *       200:
 *         description: Розклад для освітлення успішно оновлено.
 *       404:
 *         description: Освітлення не знайдено.
 */
router.put("/:id/schedule", async (req, res) => {
  try {
    const { start, end } = req.body;
    const light = await Light.findById(req.params.id);
    if (!light) {
      return res.status(404).json({ message: "Освітлення не знайдено." });
    }

    light.schedule = { start, end };
    await light.save();
    res.status(200).json(light);
  } catch (error) {
    console.error("Помилка встановлення розкладу для освітлення:", error);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

/**
 * @swagger
 * /lights/{id}/motion:
 *   put:
 *     summary: Виявлення руху для автоматичного включення
 *     description: Вмикає освітлення автоматично, якщо виявлений рух.
 *     tags: [Lights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID освітлення
 *     responses:
 *       200:
 *         description: Освітлення автоматично увімкнено.
 *       404:
 *         description: Освітлення не знайдено.
 */
router.put("/:id/motion", async (req, res) => {
  try {
    const light = await Light.findById(req.params.id);
    if (!light) {
      return res.status(404).json({ message: "Освітлення не знайдено." });
    }

    light.motionDetected = true;
    light.status = true;
    light.lastActivated = Date.now();

    await light.save();
    res.status(200).json(light);
  } catch (error) {
    console.error("Помилка виявлення руху:", error);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

module.exports = router;
