import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

import logo from '../assets/logo1.svg';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if we are on admin page
  const isAdmin = location.pathname.startsWith('/admin');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      navigate('/');
    } else {
      navigate('/admin');
    }
    closeMenu();
  };

  const navLinks = [
    { name: 'Customer Touchpoints', path: '/customer-journey' },
    { name: 'Insights', path: '/insights' },
    { name: 'Activate', path: '/ways-of-working' },
    { name: 'Omnichannel', path: '/omnichannel' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Resources', path: '/resources' },
  ];

  return (
    <header className={`header ${isAdmin ? 'admin-mode' : ''}`}>
      <div className="header-container">

        <div className="header-left">
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <img src={logo} alt="Trading Toolkit" className="logo-image" />
          </Link>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </button>

        <div className={`header-center ${isMenuOpen ? 'open' : ''}`}>
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

            {/* Mobile-only Admin Toggle */}
            <div className="mobile-admin-wrapper" onClick={toggleAdmin}>
              <div className={`admin-toggle-switch ${isAdmin ? 'active' : ''}`}>
                <div className="toggle-knob"></div>
              </div>
              <span className="admin-label">Admin</span>
            </div>
          </nav>
        </div>

        <div className="header-right">
          <div className="admin-toggle-wrapper" onClick={toggleAdmin}>
            <div className={`admin-toggle-switch ${isAdmin ? 'active' : ''}`}>
              <div className="toggle-knob"></div>
            </div>
            <span className="admin-label">Admin</span>
          </div>
        </div>

      </div>
    </header>
  );
}
