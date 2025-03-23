// server/routes/chat.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { message, userId, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: "Pesan diperlukan" });
  if (!sessionId)
    return res.status(400).json({ error: "Session ID diperlukan" });

  try {
    // Buat konteks percakapan untuk API Chat OpenAI
    const conversation = [
      { role: "system", content: "You are a helpful assistant." },
    ];
    conversation.push({ role: "user", content: message });

    // Panggil API Chat Completion OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: conversation,
        max_tokens: 1500,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content.trim();

    // Simpan pesan ke dalam database
    const newRecord = await prisma.chatHistory.create({
      data: {
        chatSessionId: sessionId,
        userMessage: message,
        aiMessage: aiMessage,
      },
    });

    res.json({ aiMessage, chatHistoryId: newRecord.id });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses pesan" });
  }
});

module.exports = router;
