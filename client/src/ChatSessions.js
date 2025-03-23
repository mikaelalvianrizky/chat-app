// client/src/ChatSessions.js
import React, { useEffect, useState } from "react";

const ChatSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchSessions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/sessions?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSessions(data.sessions);
    } catch (error) {
      console.error("Gagal mengambil sesi", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const createSession = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/chat/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setTitle(data.session.title);
      fetchSessions();
    } catch (error) {
      console.error("Gagal membuat session", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Sesi Obrolan Saya</h2>
      <form onSubmit={createSession} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul session (opsional)"
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Buat Session Baru
        </button>
      </form>
      {sessions.length === 0 ? (
        <p>Tidak ada sesi yang ditemukan.</p>
      ) : (
        sessions.map((session) => (
          <div
            key={session.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <h3>
              Session ID: {session.id} {session.title && `- ${session.title}`}
            </h3>
            <button
              onClick={() =>
                (window.location.href = `/chat?sessionId=${session.id}`)
              }
            >
              Lanjutkan Chat
            </button>
            {/* Tampilkan preview pesan atau info lain jika diperlukan */}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatSessions;
