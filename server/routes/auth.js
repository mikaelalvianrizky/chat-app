// server/routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const users = [
  { id: 1, username: "user1", password: "password123" },
  { id: 2, username: "user2", password: "password456" },
];

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: "Username atau password salah" });
  }
  // Buat token JWT (gunakan secret yang aman di .env)
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );
  res.json({ token, userId: user.id });
});

module.exports = router;
