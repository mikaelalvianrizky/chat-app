import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import Chat from "./Chat";
import ChatSessions from "./ChatSessions";

// Layout yang punya navbar
function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      {/* Outlet akan diganti dengan komponen child route */}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute yang dibungkus LayoutWithNavbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/sessions" element={<ChatSessions />} />
          {/* Tambahkan rute lain di sini, jika diperlukan */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
