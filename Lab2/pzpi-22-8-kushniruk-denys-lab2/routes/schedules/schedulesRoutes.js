// const express = require("express");
// const router = express.Router();
// const Schedule = require("../../models/Schedule");

// /**
//  * @swagger
//  * tags:
//  *   name: Schedules
//  *   description: Управління розкладами/графіками
//  */

// /**
//  * @swagger
//  * /schedules/info:
//  *   get:
//  *     summary: Отримати всі розклади/графіки
//  *     description: Отримання всіх графіків для кімнат.
//  *     tags: [Schedules]
//  *     responses:
//  *       200:
//  *         description: Графіки успішно отримано.
//  */
// router.get("/info", async (req, res) => {
//   try {
//     const schedules = await Schedule.find().populate("room_id", "name"); // Популюємо room_id для отримання додаткової інформації про кімнату
//     res.json(schedules);
//   } catch (error) {
//     res.status(500).send("Помилка при отриманні графіків");
//   }
// });

// /**
//  * @swagger
//  * /schedules/create:
//  *   post:
//  *     summary: Створити новий розклад/графік
//  *     description: Додавання нового графіка для кімнати.
//  *     tags: [Schedules]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               room_id:
//  *                 type: string
//  *                 description: ID кімнати, для якої створюється графік.
//  *                 example: "605c72ef1532071f5f6a2b11"
//  *               start_time:
//  *                 type: string
//  *                 description: Час початку.
//  *                 example: "08:00"
//  *               end_time:
//  *                 type: string
//  *                 description: Час завершення.
//  *                 example: "10:00"
//  *               days_of_week:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 description: Дні тижня для виконання графіка.
//  *                 example: ["Monday", "Wednesday", "Friday"]
//  *     responses:
//  *       200:
//  *         description: Графік успішно створено.
//  */
// router.post("/create", async (req, res) => {
//   const { room_id, start_time, end_time, days_of_week } = req.body;

//   if (!room_id || !start_time || !end_time || !days_of_week) {
//     return res.status(400).send("Всі поля повинні бути заповнені");
//   }

//   try {
//     const newSchedule = new Schedule({
//       room_id,
//       start_time,
//       end_time,
//       days_of_week,
//     });

//     await newSchedule.save();
//     res.status(201).json(newSchedule);
//   } catch (error) {
//     res.status(500).send("Помилка при створенні графіка");
//   }
// });

// /**
//  * @swagger
//  * /schedules/info/{scheduleId}:
//  *   get:
//  *     summary: Отримати конкретний розклад/графік за ID
//  *     description: Отримання графіка за його ID.
//  *     tags: [Schedules]
//  *     parameters:
//  *       - name: scheduleId
//  *         in: path
//  *         required: true
//  *         description: ID графіка.
//  *     responses:
//  *       200:
//  *         description: Графік успішно отримано.
//  *       404:
//  *         description: Графік не знайдений.
//  */
// router.get("/info/:scheduleId", async (req, res) => {
//   const { scheduleId } = req.params;

//   try {
//     const schedule = await Schedule.findById(scheduleId).populate(
//       "room_id",
//       "name"
//     ); // Популюємо room_id для отримання додаткової інформації про кімнату

//     if (!schedule) {
//       return res.status(404).send("Графік не знайдений");
//     }

//     res.json(schedule);
//   } catch (error) {
//     res.status(500).send("Помилка при отриманні графіка");
//   }
// });

// /**
//  * @swagger
//  * /schedules/update/{scheduleId}:
//  *   put:
//  *     summary: Оновити розклад/графік за ID
//  *     description: Оновлення графіка за його ID.
//  *     tags: [Schedules]
//  *     parameters:
//  *       - name: scheduleId
//  *         in: path
//  *         required: true
//  *         description: ID графіка.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               start_time:
//  *                 type: string
//  *                 description: Час початку.
//  *                 example: "09:00"
//  *               end_time:
//  *                 type: string
//  *                 description: Час завершення.
//  *                 example: "11:00"
//  *               days_of_week:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 description: Дні тижня для виконання графіка.
//  *                 example: ["Monday", "Thursday"]
//  *     responses:
//  *       200:
//  *         description: Графік успішно оновлено.
//  *       404:
//  *         description: Графік не знайдений.
//  */
// router.put("/update/:scheduleId", async (req, res) => {
//   const { scheduleId } = req.params;
//   const { start_time, end_time, days_of_week } = req.body;

//   try {
//     const updatedSchedule = await Schedule.findByIdAndUpdate(
//       scheduleId,
//       { start_time, end_time, days_of_week },
//       { new: true }
//     );

//     if (!updatedSchedule) {
//       return res.status(404).send("Графік не знайдений");
//     }

//     res.json(updatedSchedule);
//   } catch (error) {
//     res.status(500).send("Помилка при оновленні графіка");
//   }
// });

// /**
//  * @swagger
//  * /schedules/delete/{scheduleId}:
//  *   delete:
//  *     summary: Видалити розклад/графік за ID
//  *     description: Видалення графіка за його ID.
//  *     tags: [Schedules]
//  *     parameters:
//  *       - name: scheduleId
//  *         in: path
//  *         required: true
//  *         description: ID графіка.
//  *     responses:
//  *       200:
//  *         description: Графік успішно видалено.
//  *       404:
//  *         description: Графік не знайдений.
//  */
// router.delete("/delete/:scheduleId", async (req, res) => {
//   const { scheduleId } = req.params;

//   try {
//     const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);

//     if (!deletedSchedule) {
//       return res.status(404).send("Графік не знайдений");
//     }

//     res.status(200).send("Графік успішно видалено");
//   } catch (error) {
//     res.status(500).send("Помилка при видаленні графіка");
//   }
// });

// module.exports = router;
