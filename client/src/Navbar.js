// src/Navbar.js
import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">My Chat App</a>
        <div className="d-flex ms-auto">
          <button onClick={toggleTheme} className="btn btn-outline-light me-2">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          {(location.pathname !== "/" && location.pathname !== "/register")&& (
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
