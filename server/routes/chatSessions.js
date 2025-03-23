// server/routes/chatSessions.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Membuat session baru
router.post("/", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID diperlukan" });

  try {
    const session = await prisma.chatSession.create({
      data: {
        userId: userId,
        title: "Session: "+(new Date().toLocaleString())
      },
    });
    res.json({ session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal membuat session" });
  }
});

// Mengambil semua session untuk pengguna tertentu
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'User ID diperlukan' });
  
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: true, // pastikan messages disertakan
      },
    });
    res.json({ sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil sesi chat' });
  }
});


module.exports = router;
