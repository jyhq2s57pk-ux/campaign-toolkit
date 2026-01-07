import { Link } from 'react-router-dom';
import './Footer.css';
import avoltaLogo from '../assets/avoltaLogo.svg';

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
        {/* Top Row: Links and Copyright */}
        <div className="footer-top-row">
          <nav className="footer-nav">
            {footerLinks.map((link) => (
              <Link key={link.path} className="footer-nav-link" to={link.path}>
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="footer-copyright">
            © {new Date().getFullYear()} · All rights reserved
          </div>
        </div>

        {/* Bottom Row: Big Logo */}
        <div className="footer-logo-row">
          <img src={avoltaLogo} alt="Avolta" className="footer-logo-avolta" />
        </div>
      </div>
    </footer>
  );
}
