// client/src/Chat.js
import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ThemeContext } from "./ThemeContext";

const Chat = () => {
  const { theme } = useContext(ThemeContext);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch sessions from backend
  const fetchSessions = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/chat/sessions?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      } else {
        console.error("Failed to fetch chat sessions");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Load chat history for a selected session
  const loadChatHistory = (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session && session.messages) {
      const flattened = [];
      session.messages.forEach((m) => {
        flattened.push({
          id: null, // user messages don't need an ID for feedback
          sender: "User",
          text: m.userMessage,
        });
        flattened.push({
          id: m.id, // use the ChatHistory record ID for AI messages
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

  useEffect(() => {
    if (selectedSession) {
      loadChatHistory(selectedSession);
    } else {
      setChatLog([]);
    }
  }, [selectedSession, sessions]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedSession) return;
    const userMessage = message;
    setMessage("");
    setChatLog((prev) => [...prev, { id: null, sender: "User", text: userMessage }]);

    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage, userId, sessionId: selectedSession }),
      });
      const data = await response.json();
      if (data.aiMessage) {
        const newMessage = {
          id: data.chatHistoryId, // backend returns the new ChatHistory ID
          sender: "AI",
          text: data.aiMessage,
        };
        setChatLog((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendFeedback = async (chatHistoryId, rating) => {
    try {
      await fetch(`${backendUrl}/api/chat/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatHistoryId, rating }),
      });
      alert(`Thank you for your feedback: ${rating}!`);
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const createNewSession = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/chat/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, title: "New Session" }),
      });
      const data = await response.json();
      if (data.session) {
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
      <div className="mb-3">
        <button onClick={createNewSession} className="btn btn-success">
          Create New Session
        </button>
      </div>
      <div className="mb-3">
        <select
          value={selectedSession || ""}
          onChange={(e) => setSelectedSession(parseInt(e.target.value, 10))}
          className="form-control d-inline-block w-auto"
        >
          <option disabled value="">Select Session</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.title ? session.title : `Session ${session.id}`}
            </option>
          ))}
        </select>
      </div>
      <div
        className="border rounded p-3 bg-light"
        style={{ height: "400px", overflowY: "scroll" }}
      >
        {chatLog.length === 0 ? (
          <p className="text-muted">No chat available in this session.</p>
        ) : (
          chatLog.map((msg, index) => (
            <div
              key={index}
              className={`my-2 d-flex ${
                msg.sender === "AI" ? "justify-content-start" : "justify-content-end"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.sender === "AI" ? "bg-secondary text-white" : "bg-primary text-white"
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
      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="input-group-append">
          <button onClick={sendMessage} className="btn btn-success">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
