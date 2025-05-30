import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function Template({ isLoggedIn }) {
  const [navHidden, setNavHidden] = useState(true);

  const toggleMenu = () => {
    setNavHidden(!navHidden);
  };

  return (
    <div className="wrapper">
      <header>
        <div className="logo">
          <a href="/">InkSpace</a>
        </div>
        <nav>
          <ul id="nav-list" className={navHidden ? 'hidden' : ''}>
            <li><Link to="/canvas">Canvas</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>
        <button
          id="menu-toggle"
          onClick={toggleMenu}
          disabled={!isLoggedIn}
        >
          ☰
        </button>
      </header>

      <main>
        <Outlet /> {}
      </main>

      <footer>
        <div className="footer-content">
          <h2>InkSpace</h2>
          <nav>
            <ul>
              <li><Link to="/canvas">Canvas</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default Template;
