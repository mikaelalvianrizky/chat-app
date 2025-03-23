// server/routes/chatFeedback.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * POST /api/chat/feedback
 * Body: { chatHistoryId, rating }
 * rating: 'up' atau 'down'
 */
router.post("/", async (req, res) => {
  const { chatHistoryId, rating } = req.body;

  if (!chatHistoryId || !rating) {
    return res
      .status(400)
      .json({ error: "chatHistoryId dan rating diperlukan" });
  }

  try {
    // Simpan feedback ke database
    const feedback = await prisma.chatFeedback.create({
      data: {
        chatHistoryId: chatHistoryId,
        rating: rating,
      },
    });
    res.json({ success: true, feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menyimpan feedback" });
  }
});

module.exports = router;
