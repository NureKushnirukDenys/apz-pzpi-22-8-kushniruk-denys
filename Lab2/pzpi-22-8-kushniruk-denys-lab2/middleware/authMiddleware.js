const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).send({ msg: "Access denied." });

  // Перевірка формату токену
  if (!token.startsWith("Bearer ")) {
    return res.status(400).send({ msg: "Invalid token format." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "secretkey"); // Беремо токен після "Bearer"
    req.user = decoded; // Додаємо decoded дані до req.user
    next();
  } catch (error) {
    res.status(400).send({ msg: "Invalid token." });
  }
};

module.exports = authMiddleware;
