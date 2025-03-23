// client/src/Register.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

const Register = () => {
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // use environment variable

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful. Please log in.");
        navigate('/'); // Navigate to login page
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during registration.");
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
          <h2 className="card-title text-center mb-4">Register</h2>
          <form onSubmit={handleRegister}>
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
            <div className="form-group mt-3">
              <label className={labelClass}>Confirm Password:</label>
              <input
                type="password"
                className={inputClass}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
            <button type="submit" className={`${buttonClass} d-block mx-auto`}>
              Register
            </button>
          </form>
          <div className="mt-3 text-center">
            <p>
              Already have an account? <Link to="/">Click here to login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
