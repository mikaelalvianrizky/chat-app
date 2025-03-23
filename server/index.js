const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const chatSessionsRoutes = require("./routes/chatSessions");
const chatFeedbackRoutes = require("./routes/chatFeedback");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes); // Untuk mengirim pesan dalam sesi
app.use("/api/chat/sessions", chatSessionsRoutes); // Untuk pembuatan & pengambilan session
app.use("/api/chat/feedback", chatFeedbackRoutes);

app.get("/", (req, res) => {
  res.send("Chat App Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
