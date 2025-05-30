import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm({ onLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Login successful!");
        setMessageType("success");
        onLogin(name);
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(data.error || "Login failed. Please check your credentials.");
        setMessageType("error");
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server is unavailable. Please try again later.");
      setMessageType("error");
    }
  };

  return (
    <section className="login-section">
      <h2>Login to Your Account</h2>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <form className="login-form" onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required
          value={name} onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required
          value={password} onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <p className="register-link">
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </section>
  );
}

export default LoginForm;
