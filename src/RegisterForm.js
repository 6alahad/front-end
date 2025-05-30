import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterForm.css';

function RegisterForm({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const collectData = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    const user = { name, email, password };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        setMessageType("success");
        onRegister(name);
        setTimeout(() => navigate('/'), 1000);
      } else {
        if (data.error === "Username already exists") {
          setMessage("A user with this username already exists.");
        } else if (data.error === "Email is already registered") {
          setMessage("This email is already registered.");
        } else {
          setMessage("An error occurred during registration.");
        }
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server is unavailable. Please try again later.");
      setMessageType("error");
    }
  };

  return (
    <section className="register-section">
      <h2>Create a New Account</h2>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <form
        className="register-form"
        onSubmit={(e) => {
          e.preventDefault();
          collectData();
        }}
      >
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required 
          value={name} onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required
          value={password} onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </section>
  );
}

export default RegisterForm;
