import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Template from './Template';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Canvas from './Canvas';
import Profile from './Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  const handleRegister = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Template isLoggedIn={isLoggedIn} />}>
          <Route 
            index 
            element={isLoggedIn ? <Navigate to="/canvas" /> : <LoginForm onLogin={handleLogin} />} 
          />
          <Route path="login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="register" element={<RegisterForm onRegister={handleRegister} />} />
          <Route 
            path="canvas" 
            element={isLoggedIn ? <Canvas userName={userName} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="profile" 
            element={isLoggedIn ? <Profile userName={userName} /> : <Navigate to="/login" />} 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
