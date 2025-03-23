// client/src/ChatSessions.js
import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const ChatSessions = () => {
  const { theme } = useContext(ThemeContext);
  const [sessions, setSessions] = useState([]);
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/chat/sessions?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      } else {
        console.error("Failed to fetch sessions");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Chat Sessions</h2>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        sessions.map((session) => (
          <div key={session.id} className="card mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title">
                  Session {session.id} {session.title && `- ${session.title}`}
                </h5>
                <p className="card-text">
                  Created: {new Date(session.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => (window.location.href = `/chat?sessionId=${session.id}`)}
                className="btn btn-primary"
              >
                Continue Chat
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatSessions;
