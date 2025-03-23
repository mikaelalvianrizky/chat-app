// client/src/Login.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

const Login = () => {
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // use environment variable

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        navigate('/chat'); // Redirect to chat page
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during login.');
    }
  };

  const cardClass = theme === "dark"
    ? "card mx-auto bg-dark text-white"
    : "card mx-auto pastel-card";
  const inputClass = theme === "dark"
    ? "form-control bg-secondary text-white border-0"
    : "form-control pastel-input";
  const labelClass = theme === "dark" ? "text-white" : "text-dark";
  const buttonClass = "btn btn-primary btn-block mt-4"

  return (
    <div className="container mt-5">
      <div className={cardClass} style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className={labelClass}>Username:</label>
              <input
                type="text"
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="form-group mt-3">
              <label className={labelClass}>Password:</label>
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className={`${buttonClass} d-block mx-auto`}>
              Login
            </button>
          </form>
          <div className="mt-3 text-center">
            <p>
              Don't have an account? <Link to="/register">Click here to register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
