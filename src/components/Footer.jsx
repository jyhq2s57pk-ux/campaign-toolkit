import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const footerLinks = [
    { name: 'Journey', path: '/customer-journey' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Resources', path: '/resources' },
    { name: 'Omnichannel', path: '/omnichannel' },
    { name: 'Insights', path: '/insights' },
    { name: 'Annex', path: '/annex' },
    { name: 'Admin', path: '/admin' },
    { name: 'Style Gallery', path: '/style-gallery' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <nav className="footer-nav">
          {footerLinks.map((link) => (
            <Link key={link.path} className="footer-nav-link" to={link.path}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="footer-copyright">
          © {new Date().getFullYear()} Digital Commerce Trading Toolkit · All rights reserved
        </div>
      </div>
    </footer>
  );
}
