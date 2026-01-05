import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

import logo from '../assets/logo1.svg';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Journey', path: '/customer-journey' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Omnichannel', path: '/omnichannel' },
    { name: 'Resources', path: '/resources' },
    { name: 'Activate', path: '/ways-of-working' },
  ];

  return (
    <header className="header">
      <Link to="/" className="header-logo" onClick={closeMenu}>
        <img src={logo} alt="Digital Commerce" className="logo-image" />
      </Link>

      <button
        className="mobile-menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
      </button>

      <nav className={`header-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-btn ${location.pathname === link.path ? 'nav-btn-active' : ''}`}
            onClick={closeMenu}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
