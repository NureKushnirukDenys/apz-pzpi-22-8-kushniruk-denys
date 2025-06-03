const express = require("express");
const User = require("../../models/User");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управління користувачами
 */

/**
 * @swagger
 * /users/info/{id}:
 *   get:
 *     summary: Отримати інформацію про користувача
 *     description: Отримати інформацію про користувача за його ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Інформація про користувача успішно отримана.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 profileImage:
 *                   type: string
 *       404:
 *         description: Користувача не знайдено.
 */
router.get("/info/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Помилка отримання користувача:", error);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Редагувати дані користувача
 *     description: Редагувати дані користувача за його ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               profileImage:
 *                 type: string
 *             example:
 *               email: "user@example.com"
 *               firstName: "Іван"
 *               lastName: "Іванов"
 *               profileImage: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: Дані користувача успішно оновлені.
 *       404:
 *         description: Користувача не знайдено.
 */
router.put("/update/:id", async (req, res) => {
  try {
    const { email, firstName, lastName, profileImage } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено." });
    }

    // Оновлення тільки тих полів, які були передані
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Помилка оновлення користувача:", error);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Отримати список всіх користувачів
 *     description: Повертає масив усіх користувачів (без паролів).
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список користувачів успішно отримано.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Серверна помилка
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // без пароля
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Серверна помилка" });
  }
});

/**
 * @swagger
 * /users/role/{id}:
 *   put:
 *     summary: Змінити роль користувача
 *     description: Оновлює роль користувача (user або admin) за його ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: Нова роль користувача
 *             example:
 *               role: "admin"
 *     responses:
 *       200:
 *         description: Роль користувача успішно оновлено.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Некоректна роль
 *       404:
 *         description: Користувача не знайдено.
 *       500:
 *         description: Серверна помилка
 */
router.put("/role/:id", async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Некоректна роль" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Серверна помилка" });
  }
});

module.exports = router;
