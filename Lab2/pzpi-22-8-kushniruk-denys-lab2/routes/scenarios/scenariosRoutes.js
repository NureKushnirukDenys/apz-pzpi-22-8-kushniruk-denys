// const express = require("express");
// const router = express.Router();
// const Scenario = require("../../models/Scenario");

// /**
//  * @swagger
//  * tags:
//  *   name: Scenarios
//  *   description: Управління сценаріями для кімнат
//  */

// /**
//  * @swagger
//  * /scenarios/info:
//  *   get:
//  *     summary: Отримати всі сценарії для кімнат
//  *     description: Отримання всіх сценаріїв для кімнат.
//  *     tags: [Scenarios]
//  *     responses:
//  *       200:
//  *         description: Сценарії успішно отримано.
//  */
// router.get("/info", async (req, res) => {
//   try {
//     const scenarios = await Scenario.find().populate("user_id", "name"); // Популюємо user_id для отримання додаткової інформації про користувача
//     res.json(scenarios);
//   } catch (error) {
//     res.status(500).send("Помилка при отриманні сценаріїв");
//   }
// });

// /**
//  * @swagger
//  * /scenarios/create:
//  *   post:
//  *     summary: Створити новий сценарій для кімнати
//  *     description: Додавання нового сценарію для кімнати.
//  *     tags: [Scenarios]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               user_id:
//  *                 type: string
//  *                 description: ID користувача, для якого створюється сценарій.
//  *                 example: "605c72ef1532071f5f6a2b11"
//  *               name:
//  *                 type: string
//  *                 description: Назва сценарію.
//  *                 example: "Сценарій 1"
//  *               brightness:
//  *                 type: number
//  *                 description: Яскравість сценарію.
//  *                 example: 75
//  *     responses:
//  *       200:
//  *         description: Сценарій успішно створено.
//  */
// router.post("/create", async (req, res) => {
//   const { user_id, name, brightness } = req.body;

//   if (!user_id || !name || brightness === undefined) {
//     return res.status(400).send("Всі поля повинні бути заповнені");
//   }

//   try {
//     const newScenario = new Scenario({
//       user_id,
//       name,
//       brightness,
//     });

//     await newScenario.save();
//     res.status(201).json(newScenario);
//   } catch (error) {
//     res.status(500).send("Помилка при створенні сценарію");
//   }
// });

// /**
//  * @swagger
//  * /scenarios/info/{ScenarioId}:
//  *   get:
//  *     summary: Отримати конкретний сценарій для кімнати за ID
//  *     description: Отримання сценарію за його ID.
//  *     tags: [Scenarios]
//  *     parameters:
//  *       - name: ScenarioId
//  *         in: path
//  *         required: true
//  *         description: ID сценарію для кімнати.
//  *     responses:
//  *       200:
//  *         description: Сценарій успішно отримано.
//  *       404:
//  *         description: Сценарій не знайдений.
//  */
// router.get("/info/:ScenarioId", async (req, res) => {
//   const { ScenarioId } = req.params;

//   try {
//     const scenario = await Scenario.findById(ScenarioId).populate(
//       "user_id",
//       "name"
//     ); // Популюємо user_id для отримання додаткової інформації про користувача

//     if (!scenario) {
//       return res.status(404).send("Сценарій не знайдений");
//     }

//     res.json(scenario);
//   } catch (error) {
//     res.status(500).send("Помилка при отриманні сценарію");
//   }
// });

// /**
//  * @swagger
//  * /scenarios/update/{ScenarioId}:
//  *   put:
//  *     summary: Оновити сценарій для кімнати за ID
//  *     description: Оновлення сценарію для кімнати.
//  *     tags: [Scenarios]
//  *     parameters:
//  *       - name: ScenarioId
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
//  *               user_id:
//  *                 type: string
//  *                 description: Новий ID користувача.
//  *                 example: "605c72ef1532071f5f6a2b13"
//  *               name:
//  *                 type: string
//  *                 description: Нова назва сценарію.
//  *                 example: "Сценарій 2"
//  *               brightness:
//  *                 type: number
//  *                 description: Нова яскравість сценарію.
//  *                 example: 80
//  *     responses:
//  *       200:
//  *         description: Сценарій успішно оновлено.
//  *       404:
//  *         description: Сценарій не знайдений.
//  */
// router.put("/update/:ScenarioId", async (req, res) => {
//   const { ScenarioId } = req.params;
//   const { user_id, name, brightness } = req.body;

//   try {
//     const updatedScenario = await Scenario.findByIdAndUpdate(
//       ScenarioId,
//       { user_id, name, brightness },
//       { new: true }
//     );

//     if (!updatedScenario) {
//       return res.status(404).send("Сценарій не знайдений");
//     }

//     res.json(updatedScenario);
//   } catch (error) {
//     res.status(500).send("Помилка при оновленні сценарію");
//   }
// });

// /**
//  * @swagger
//  * /scenarios/delete/{ScenarioId}:
//  *   delete:
//  *     summary: Видалити сценарій для кімнати за ID
//  *     description: Видалення сценарію для кімнати за його ID.
//  *     tags: [Scenarios]
//  *     parameters:
//  *       - name: ScenarioId
//  *         in: path
//  *         required: true
//  *         description: ID сценарію для кімнати.
//  *     responses:
//  *       200:
//  *         description: Сценарій успішно видалено.
//  *       404:
//  *         description: Сценарій не знайдений.
//  */
// router.delete("/delete/:ScenarioId", async (req, res) => {
//   const { ScenarioId } = req.params;

//   try {
//     const deletedScenario = await Scenario.findByIdAndDelete(ScenarioId);

//     if (!deletedScenario) {
//       return res.status(404).send("Сценарій не знайдений");
//     }

//     res.status(200).send("Сценарій успішно видалено");
//   } catch (error) {
//     res.status(500).send("Помилка при видаленні сценарію");
//   }
// });

// module.exports = router;
