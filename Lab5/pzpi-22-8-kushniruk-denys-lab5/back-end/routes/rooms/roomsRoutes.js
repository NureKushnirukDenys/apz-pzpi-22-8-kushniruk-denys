const express = require("express");
const router = express.Router();
const Room = require("../../models/Room");
const Log = require("../../models/Log");
const { calculateEnergySaving } = require("../../businessLogic/BusinessLogic");
const { getPowerByBrightness } = require("../../businessLogic/BusinessLogic");

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Управління кімнатами
 */

/**
 * @swagger
 * /rooms/create:
 *   post:
 *     summary: Створити нову кімнату
 *     description: Створення нової кімнати в системі.
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: Ідентифікатор користувача.
 *                 example: "60d0fe4f5311236168a109ca"
 *               name:
 *                 type: string
 *                 description: Назва кімнати.
 *                 example: "Кімната 1"
 *               iotDeviceId:
 *                 type: string
 *                 description: ID IoT пристрою.
 *                 example: "iot12345"
 *               distance:
 *                 type: number
 *                 description: Дистанція.
 *                 example: 10
 *     responses:
 *       200:
 *         description: Кімната успішно створена.
 */
router.post("/create", async (req, res) => {
  try {
    const { user_id, name, iotDeviceId, distance, brightness } = req.body;

    if (!user_id || !name || !iotDeviceId) {
      return res
        .status(400)
        .json({ message: "user_id, name та iotDeviceId є обов'язковими" });
    }

    const newRoom = new Room({
      user_id,
      name,
      iotDeviceId,
      distance,
      brightness:
        typeof brightness === "number"
          ? Math.max(0, Math.min(100, brightness))
          : 100,
    });

    await newRoom.save();

    await Log.create({
      action: `Додано нову кімнату "${name}"`,
      room_id: newRoom._id,
      user_id,
      timestamp: new Date(),
    });

    res
      .status(200)
      .json({ message: "Кімната успішно створена", room: newRoom });
  } catch (error) {
    res.status(500).send("Серверна помилка");
  }
});

/**
 * @swagger
 * /rooms/info/{roomId}:
 *   get:
 *     summary: Отримати інформацію про кімнату
 *     description: Отримання інформації про кімнату за її ID.
 *     tags: [Rooms]
 *     parameters:
 *       - name: roomId
 *         in: path
 *         required: true
 *         description: ID кімнати.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Інформація про кімнату успішно отримана.
 *       404:
 *         description: Кімната не знайдена.
 */
router.get("/info/:roomId", async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).send("Кімната не знайдена.");
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).send("Серверна помилка");
  }
});

/**
 * @swagger
 * /rooms/update/{roomId}:
 *   put:
 *     summary: Оновити інформацію про кімнату
 *     description: Оновлення даних кімнати.
 *     tags: [Rooms]
 *     parameters:
 *       - name: roomId
 *         in: path
 *         required: true
 *         description: ID кімнати.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: Ідентифікатор користувача.
 *                 example: "60d0fe4f5311236168a109ca"
 *               name:
 *                 type: string
 *                 description: Назва кімнати.
 *                 example: "Кімната 2"
 *               iotDeviceId:
 *                 type: string
 *                 description: ID IoT пристрою.
 *                 example: "iot12345"
 *               distance:
 *                 type: number
 *                 description: Дистанція.
 *                 example: 10
 *     responses:
 *       200:
 *         description: Кімната успішно оновлена.
 *       404:
 *         description: Кімната не знайдена.
 */
// router.put("/update/:roomId", async (req, res) => {
//   try {
//     const { user_id, name, iotDeviceId, distance } = req.body;

//     const updatedRoom = await Room.findByIdAndUpdate(
//       req.params.roomId,
//       { user_id, name, iotDeviceId, distance },
//       { new: true }
//     );

//     if (!updatedRoom) {
//       return res.status(404).send("Кімната не знайдена.");
//     }

//     res
//       .status(200)
//       .json({ message: "Кімната успішно оновлена", room: updatedRoom });
//   } catch (error) {
//     res.status(500).send("Серверна помилка");
//   }
// });

router.put("/update/:roomId", async (req, res) => {
  try {
    const { user_id, name, iotDeviceId, distance, brightness } = req.body;

    // Валідація brightness
    if (
      brightness !== undefined &&
      (typeof brightness !== "number" || brightness < 0 || brightness > 100)
    ) {
      return res
        .status(400)
        .json({ message: "Яскравість має бути числом від 0 до 100" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.roomId,
      { user_id, name, iotDeviceId, distance, brightness },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).send("Кімната не знайдена.");
    }

    res
      .status(200)
      .json({ message: "Кімната успішно оновлена", room: updatedRoom });
  } catch (error) {
    res.status(500).send("Серверна помилка");
  }
});

/**
 * @swagger
 * /rooms/updateStatus/{roomId}:
 *   patch:
 *     summary: Оновити статус кімнати
 *     description: Оновлення статусу кімнати (увімкнено/вимкнено світло).
 *     tags: [Rooms]
 *     parameters:
 *       - name: roomId
 *         in: path
 *         required: true
 *         description: ID кімнати.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: Статус кімнати (увімкнено/вимкнено світло).
 *                 example: true
 *     responses:
 *       200:
 *         description: Статус кімнати успішно оновлено.
 *       404:
 *         description: Кімната не знайдена.
 */
router.patch("/updateStatus/:roomId", async (req, res) => {
  try {
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ message: "Поле status має бути булевим" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.roomId,
      { status },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).send("Кімната не знайдена.");
    }

    res
      .status(200)
      .json({ message: "Статус кімнати успішно оновлено", room: updatedRoom });
  } catch (error) {
    res.status(500).send("Серверна помилка");
  }
});

/**
 * @swagger
 * /rooms/delete/{roomId}:
 *   delete:
 *     summary: Видалити кімнату
 *     description: Видалення кімнати з системи.
 *     tags: [Rooms]
 *     parameters:
 *       - name: roomId
 *         in: path
 *         required: true
 *         description: ID кімнати.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Кімната успішно видалена.
 *       404:
 *         description: Кімната не знайдена.
 */
router.delete("/delete/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Кімната не знайдена" });

    // Додаємо лог
    await Log.create({
      action: `Видалено кімнату "${room.name}"`,
      room_id: room._id,
      user_id: room.user_id,
      timestamp: new Date(),
    });

    res.json({ message: "Кімната видалена" });
  } catch (error) {
    res.status(500).json({ message: "Помилка видалення кімнати" });
  }
});

/**
 * @swagger
 * /rooms/update-distance:
 *   post:
 *     summary: Оновити дистанцію
 *     description: Оновлення дистанції для кімнати за ID IoT пристрою.
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               iotDeviceId:
 *                 type: string
 *                 description: ID IoT пристрою.
 *                 example: "iot12345"
 *               distance:
 *                 type: number
 *                 description: Нова дистанція.
 *                 example: 20
 *     responses:
 *       200:
 *         description: Дистанція успішно оновлена.
 *       404:
 *         description: Кімната не знайдена.
 */
router.post("/update-distance", async (req, res) => {
  const { iotDeviceId, distance } = req.body;

  try {
    // Знаходимо кімнату за iotDeviceId
    const room = await Room.findOne({ iotDeviceId });
    if (!room) {
      return res.status(404).json({ message: "Кімната не знайдена" });
    }

    // Оновлюємо дистанцію
    room.distance = distance;
    await room.save();

    res.status(200).json({ message: "Дистанція успішно оновлена", room });
  } catch (error) {
    res.status(500).json({ message: "Серверна помилка", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Серверна помилка" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, iotDeviceId, distance, status, brightness } = req.body;

    // 1. Отримати стару кімнату
    const oldRoom = await Room.findById(req.params.id);
    if (!oldRoom)
      return res.status(404).json({ message: "Кімната не знайдена" });

    // 2. Оновити кімнату
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { name, iotDeviceId, distance, status, brightness },
      { new: true }
    );

    // 3. Порівняти зміни
    let changes = [];
    if (name !== undefined && name !== oldRoom.name) {
      changes.push(`Назва: "${oldRoom.name}" → "${name}"`);
    }
    if (iotDeviceId !== undefined && iotDeviceId !== oldRoom.iotDeviceId) {
      changes.push(`IoT ID: "${oldRoom.iotDeviceId}" → "${iotDeviceId}"`);
    }
    if (distance !== undefined && distance !== oldRoom.distance) {
      changes.push(`Дистанція: ${oldRoom.distance} → ${distance}`);
    }
    if (typeof status === "boolean" && status !== oldRoom.status) {
      changes.push(
        `Статус: ${oldRoom.status ? "увімкнено" : "вимкнено"} → ${
          status ? "увімкнено" : "вимкнено"
        }`
      );
    }
    if (brightness !== undefined && brightness !== oldRoom.brightness) {
      changes.push(`Яскравість: ${oldRoom.brightness}% → ${brightness}%`);
    }

    // 4. Якщо були зміни — створити лог
    if (changes.length > 0) {
      await Log.create({
        action: `Змінено кімнату "${room.name}": ${changes.join(", ")}`,
        room_id: room._id,
        user_id: room.user_id,
        timestamp: new Date(),
      });
    }

    res.json({ room });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

/**
 * @swagger
 * /rooms/saving/{roomId}:
 *   get:
 *     summary: Розрахунок економії електроенергії для кімнати
 *     description: Повертає відсоток економії електроенергії для всіх ламп у кімнаті.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID кімнати
 *     responses:
 *       200:
 *         description: Відсоток економії електроенергії успішно розраховано.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 savingPercent:
 *                   type: number
 *                   description: Відсоток економії
 *       500:
 *         description: Помилка розрахунку економії.
 */
router.get("/saving/:roomId", async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: "Кімната не знайдена" });
    }
    const brightness =
      typeof room.brightness === "number" ? room.brightness : 100;
    const Pmax = 29; // максимальна потужність для однієї кімнати
    const Pcurr = getPowerByBrightness(brightness);
    const saving = ((Pmax - Pcurr) / Pmax) * 100;
    res.json({ savingPercent: Math.round(saving * 100) / 100 });
  } catch (error) {
    res.status(500).json({ message: "Помилка розрахунку економії" });
  }
});

module.exports = router;
