// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './ThemeContext';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import Chat from './Chat';
import ChatSessions from './ChatSessions';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/sessions" element={<ChatSessions />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
