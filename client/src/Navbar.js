// client/src/Navbar.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); // default dari localStorage
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (theme === "light") {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    } else {
      document.body.style.backgroundColor = "#343a40";
      document.body.style.color = "#ffffff";
    }
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      document.body.style.backgroundColor = "#343a40";
      document.body.style.color = "#ffffff";
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          My Chat App
        </a>
        <div className="d-flex ms-auto">
          <button onClick={toggleTheme} className="btn btn-outline-light me-2">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          {location.pathname !== "/" && (
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
