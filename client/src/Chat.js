// client/src/Chat.js
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  // Ambil daftar session dari backend
  const fetchSessions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/sessions?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      } else {
        console.error("Gagal mengambil sesi chat");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Muat riwayat chat untuk session yang dipilih
  const loadChatHistory = (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session && session.messages) {
      // Flatten userMessage & aiMessage ke dalam chatLog
      const flattened = [];
      session.messages.forEach((m) => {
        // Pesan dari user
        flattened.push({
          id: null,
          sender: "User",
          text: m.userMessage,
        });
        // Pesan dari AI
        flattened.push({
          id: m.id, // gunakan ID ChatHistory untuk feedback
          sender: "AI",
          text: m.aiMessage,
        });
      });
      setChatLog(flattened);
    } else {
      setChatLog([]);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Jika session dipilih atau daftar session berubah, muat ulang riwayat
  useEffect(() => {
    if (selectedSession) {
      loadChatHistory(selectedSession);
    } else {
      setChatLog([]);
    }
  }, [selectedSession, sessions]);

  // Fungsi kirim pesan
  const sendMessage = async () => {
    if (!message.trim() || !selectedSession) return;
    const userMessage = message;
    setMessage("");

    // Tambahkan pesan user ke UI sementara
    setChatLog((prev) => [
      ...prev,
      { id: null, sender: "User", text: userMessage },
    ]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          userId,
          sessionId: selectedSession,
        }),
      });
      const data = await response.json();

      if (data.aiMessage) {
        // Masukkan ID ChatHistory yang dikembalikan server
        const newMessage = {
          id: data.chatHistoryId,
          sender: "AI",
          text: data.aiMessage,
        };
        setChatLog((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Kirim feedback untuk jawaban AI
  const sendFeedback = async (chatHistoryId, rating) => {
    try {
      await fetch("http://localhost:5000/api/chat/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatHistoryId, rating }),
      });
      alert(`Terima kasih atas feedback ${rating}!`);
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  // Kirim pesan saat menekan Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Buat session baru
  const createNewSession = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, title: "New Session" }),
      });
      const data = await response.json();
      if (data.session) {
        // Tambah session baru ke daftar dan pilih langsung
        setSessions((prev) => [data.session, ...prev]);
        setSelectedSession(data.session.id);
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">Chat Room</h2>

      {/* Tombol buat session baru */}
      <div className="mb-3">
        <button onClick={createNewSession} className="btn btn-success">
          Buat Session Baru
        </button>
      </div>

      {/* Dropdown pemilihan session */}
      <div className="mb-3">
        <select
          value={selectedSession || ""}
          onChange={(e) => {
            const sessionId = parseInt(e.target.value, 10);
            setSelectedSession(sessionId);
          }}
          className="form-control d-inline-block"
        >
          <option disabled value="">Pilih Session</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.title ? session.title : `Session ${session.id}`}
            </option>
          ))}
        </select>
      </div>

      {/* Kotak obrolan */}
      <div
        className="border rounded p-3 bg-light"
        style={{ height: "400px", overflowY: "scroll" }}
      >
        {chatLog.length === 0 ? (
          <p className="text-muted">Belum ada chat dalam session ini.</p>
        ) : (
          chatLog.map((msg, index) => (
            <div
              key={index}
              className={`my-2 d-flex ${
                msg.sender === "AI"
                  ? "justify-content-start"
                  : "justify-content-end"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.sender === "AI"
                    ? "bg-secondary text-white"
                    : "bg-primary text-white"
                }`}
              >
                {msg.sender === "AI" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
              {msg.sender === "AI" && msg.id && (
                <div className="d-inline-block ml-2">
                  <button
                    onClick={() => sendFeedback(msg.id, "up")}
                    className="btn btn-outline-success btn-sm mr-1"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => sendFeedback(msg.id, "down")}
                    className="btn btn-outline-danger btn-sm"
                  >
                    👎
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input pesan */}
      <div className="input-group mt-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-control"
          placeholder="Ketik pesan..."
        />
        <div className="input-group-append">
          <button onClick={sendMessage} className="btn btn-success">
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
