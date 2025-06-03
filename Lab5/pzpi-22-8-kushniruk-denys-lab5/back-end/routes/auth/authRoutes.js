const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const router = express.Router();
require("dotenv").config();

// Секретний ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Авторизація та реєстрація
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регістрація користувача
 *     description: Створення нового користувача в системі.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Адреса електронної пошти користувача.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Пароль користувача.
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 description: Ім'я користувача.
 *                 example: "Іван"
 *               lastName:
 *                 type: string
 *                 description: Прізвище користувача.
 *                 example: "Іванов"
 *               profileImage:
 *                 type: string
 *                 description: URL зображення профілю користувача.
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: Користувача успішно зареєстровано.
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, profileImage } = req.body;

    // Перевірка обов'язкових полів
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Всі поля є обов'язковими." });
    }

    // Перевірка наявності користувача
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Користувач з такою адресою електронної пошти вже існує.",
      });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      profileImage,
    });

    // Збереження користувача в базі даних
    await newUser.save();

    // Створення JWT токену
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Відправлення відповіді
    res.status(200).json({
      message: "Користувача успішно зареєстровано.",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    console.error("Помилка реєстрації:", error);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизація користувача
 *     description: Авторизація користувача в системі.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Адреса електронної пошти користувача.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Пароль користувача.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Користувач успішно авторизований.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Перевірка обов'язкових полів
    if (!email || !password) {
      return res.status(400).json({ message: "Введіть email та пароль." });
    }

    // Пошук користувача
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Невірний email або пароль." });
    }

    // Перевірка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Невірний email або пароль." });
    }

    // Створення JWT токену
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Користувач успішно авторизований.",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Помилка авторизації:", error);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Вихід з аккаунту
 *     description: Завершення сесії користувача.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Користувач успішно вийшов.
 */
router.post("/logout", (req, res) => {
  // Тут ми можемо додати логіку для видалення токену з клієнтської сторони, якщо це необхідно
  res.status(200).json({ message: "Користувач успішно вийшов." });
});

module.exports = router;
