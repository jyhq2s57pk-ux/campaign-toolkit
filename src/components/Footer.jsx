import { Link } from 'react-router-dom';
import FooterLogo from './FooterLogo';
import './Footer.css';

export default function Footer() {
  const footerLinks = [
    { name: 'Customer Touchpoints', path: '/customer-journey' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Omnichannel', path: '/omnichannel' },
    { name: 'Insights', path: '/insights' },
    { name: 'Resources', path: '/resources' },
    { name: 'Activate', path: '/activate' },
  ];

  return (
    <footer className="footer" data-layer="Footer">
      <div className="footer-container" data-layer="Container">

        {/* Top Section: Title/Login & Navigation */}
        <div className="footer-top-section" data-layer="Container">

          {/* Left Column: Title & Admin Login */}
          <div className="footer-left-column" data-layer="Container">
            <div className="footer-title" data-layer="Digital Commerce Trading Toolkit">
              Digital Commerce <br />
              Trading Toolkit
            </div>
            <Link to="/admin" className="footer-admin-login-btn" data-layer="Component 3">
              <div className="footer-admin-text" data-layer="Text">Admin login</div>
            </Link>
          </div>

          {/* Right Column: Navigation Links */}
          <div className="footer-nav-column" data-layer="Nav - Site nav">
            <div className="footer-nav-list" data-layer="List">
              {footerLinks.map((link) => (
                <div key={link.name} className="footer-nav-item" data-layer="Item">
                  <Link to={link.path} className="footer-nav-link" data-layer="Link">
                    <div className="footer-link-text" data-layer={link.name}>
                      {link.name}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Logo */}
        <div className="footer-bottom-section" data-layer="Container">
          <div className="footer-logo-container" data-layer="Logo container">
            <div className="footer-logo" data-layer="Logo">
              <FooterLogo />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
