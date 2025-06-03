const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");
const Log = require("../../models/Log");

router.post("/", async (req, res) => {
  const user_id = req.body.user_id; // отримати user_id з тіла запиту
  exec(
    "node backup.js",
    { cwd: path.resolve(__dirname, "../../") },
    async (error, stdout, stderr) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Помилка при створенні бекапу", error: stderr });
      }

      await Log.create({
        action: "Створено резервну копію бази даних",
        user_id, // додати user_id
        timestamp: new Date(),
      });

      res.json({ message: "Бекап виконано успішно", output: stdout });
    }
  );
});

module.exports = router;
