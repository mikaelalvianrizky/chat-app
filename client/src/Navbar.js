// src/Navbar.js
import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa"; // import sun/moon icons

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
          <button
            onClick={toggleTheme}
            className="btn border-0 me-2"
            style={{ background: "none" }}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <FaMoon size={24} color="#fff" />
            ) : (
              <FaSun size={24} color="#fff" />
            )}
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
