// const express = require("express");
// const router = express.Router();
// const ScenarioRoom = require("../../models/ScenarioRoom");

// /**
//  * @swagger
//  * tags:
//  *   name: ScenarioRooms
//  *   description: Управління сценаріями для кімнат
//  */

// /**
//  * @swagger
//  * /scenarioRooms/info:
//  *   get:
//  *     summary: Отримати всі сценарії для кімнат
//  *     description: Отримання всіх сценаріїв для кімнат.
//  *     tags: [ScenarioRooms]
//  *     responses:
//  *       200:
//  *         description: Сценарії успішно отримано.
//  */
// router.get("/info", async (req, res) => {
//   try {
//     const scenarioRooms = await ScenarioRoom.find()
//       .populate("scenario_id", "name") // Популюємо scenario_id для отримання додаткової інформації про сценарії
//       .populate("room_id", "name"); // Популюємо room_id для отримання додаткової інформації про кімнати
//     res.json(scenarioRooms);
//   } catch (error) {
//     res.status(500).send("Помилка при отриманні сценаріїв");
//   }
// });

// /**
//  * @swagger
//  * /scenarioRooms/create:
//  *   post:
//  *     summary: Створити новий сценарій для кімнати
//  *     description: Додавання нового сценарію для кімнати.
//  *     tags: [ScenarioRooms]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               scenario_id:
//  *                 type: string
//  *                 description: ID сценарію, для якого створюється запис.
//  *                 example: "605c72ef1532071f5f6a2b11"
//  *               room_id:
//  *                 type: string
//  *                 description: ID кімнати, для якої створюється сценарій.
//  *                 example: "605c72ef1532071f5f6a2b12"
//  *     responses:
//  *       200:
//  *         description: Сценарій успішно створено.
//  */
// router.post("/create", async (req, res) => {
//   const { scenario_id, room_id } = req.body;

//   if (!scenario_id || !room_id) {
//     return res.status(400).send("Всі поля повинні бути заповнені");
//   }

//   try {
//     const newScenarioRoom = new ScenarioRoom({
//       scenario_id,
//       room_id,
//     });

//     await newScenarioRoom.save();
//     res.status(201).json(newScenarioRoom);
//   } catch (error) {
//     res.status(500).send("Помилка при створенні сценарію");
//   }
// });

// /**
//  * @swagger
//  * /scenarioRooms/info/{scenarioRoomId}:
//  *   get:
//  *     summary: Отримати конкретний сценарій для кімнати за ID
//  *     description: Отримання сценарію за його ID.
//  *     tags: [ScenarioRooms]
//  *     parameters:
//  *       - name: scenarioRoomId
//  *         in: path
//  *         required: true
//  *         description: ID сценарію для кімнати.
//  *     responses:
//  *       200:
//  *         description: Сценарій успішно отримано.
//  *       404:
//  *         description: Сценарій не знайдений.
//  */
// router.get("/info/:scenarioRoomId", async (req, res) => {
//   const { scenarioRoomId } = req.params;

//   try {
//     const scenarioRoom = await ScenarioRoom.findById(scenarioRoomId)
//       .populate("scenario_id", "name") // Популюємо scenario_id для отримання додаткової інформації про сценарій
//       .populate("room_id", "name"); // Популюємо room_id для отримання додаткової інформації про кімнату

//     if (!scenarioRoom) {
//       return res.status(404).send("Сценарій не знайдений");
//     }

//     res.json(scenarioRoom);
//   } catch (error) {
//     res.status(500).send("Помилка при отриманні сценарію");
//   }
// });

// /**
//  * @swagger
//  * /scenarioRooms/update/{scenarioRoomId}:
//  *   put:
//  *     summary: Оновити сценарій для кімнати за ID
//  *     description: Оновлення сценарію для кімнати.
//  *     tags: [ScenarioRooms]
//  *     parameters:
//  *       - name: scenarioRoomId
//  *         in: path
//  *         required: true
//  *         description: ID сценарію для кімнати.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               scenario_id:
//  *                 type: string
//  *                 description: Новий ID сценарію.
//  *                 example: "605c72ef1532071f5f6a2b13"
//  *               room_id:
//  *                 type: string
//  *                 description: Новий ID кімнати.
//  *                 example: "605c72ef1532071f5f6a2b14"
//  *     responses:
//  *       200:
//  *         description: Сценарій успішно оновлено.
//  *       404:
//  *         description: Сценарій не знайдений.
//  */
// router.put("/update/:scenarioRoomId", async (req, res) => {
//   const { scenarioRoomId } = req.params;
//   const { scenario_id, room_id } = req.body;

//   try {
//     const updatedScenarioRoom = await ScenarioRoom.findByIdAndUpdate(
//       scenarioRoomId,
//       { scenario_id, room_id },
//       { new: true }
//     );

//     if (!updatedScenarioRoom) {
//       return res.status(404).send("Сценарій не знайдений");
//     }

//     res.json(updatedScenarioRoom);
//   } catch (error) {
//     res.status(500).send("Помилка при оновленні сценарію");
//   }
// });

// /**
//  * @swagger
//  * /scenarioRooms/delete/{scenarioRoomId}:
//  *   delete:
//  *     summary: Видалити сценарій для кімнати за ID
//  *     description: Видалення сценарію для кімнати за його ID.
//  *     tags: [ScenarioRooms]
//  *     parameters:
//  *       - name: scenarioRoomId
//  *         in: path
//  *         required: true
//  *         description: ID сценарію для кімнати.
//  *     responses:
//  *       200:
//  *         description: Сценарій успішно видалено.
//  *       404:
//  *         description: Сценарій не знайдений.
//  */
// router.delete("/delete/:scenarioRoomId", async (req, res) => {
//   const { scenarioRoomId } = req.params;

//   try {
//     const deletedScenarioRoom = await ScenarioRoom.findByIdAndDelete(
//       scenarioRoomId
//     );

//     if (!deletedScenarioRoom) {
//       return res.status(404).send("Сценарій не знайдений");
//     }

//     res.status(200).send("Сценарій успішно видалено");
//   } catch (error) {
//     res.status(500).send("Помилка при видаленні сценарію");
//   }
// });

// module.exports = router;
