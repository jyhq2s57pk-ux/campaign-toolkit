import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import FooterLogo from './FooterLogo';
import './Footer.css';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = location.pathname.startsWith('/admin');
  const campaignId = searchParams.get('campaignId');

  const footerLinks = [
    { name: 'Customer Touchpoints', path: '/customer-journey' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Omnichannel', path: '/omnichannel' },
    { name: 'Insights', path: '/insights' },
    { name: 'Resources', path: '/resources' },
    { name: 'Activate', path: '/ways-of-working' },
    { name: 'Design System', path: '/design-system' },
  ];

  // Footer links use plain paths (no campaignId), matching live site
  const getLinkPath = (path) => path;

  const toggleAdmin = () => {
    if (isAdmin) {
      navigate('/');
    } else {
      navigate('/admin');
    }
  };

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

            {/* Desktop Admin Login Button */}
            <div className="footer-desktop-admin">
              <div className="admin-toggle-wrapper-footer" onClick={toggleAdmin}>
                <div className={`admin-toggle-switch-footer ${isAdmin ? 'active' : ''}`}>
                  <div className="toggle-knob-footer"></div>
                </div>
                <span className="admin-label-footer">Admin</span>
              </div>
            </div>

            {/* Mobile Admin Toggle (shown via CSS media query) */}
            <div className="footer-mobile-admin">
              <div className="admin-toggle-wrapper-footer" onClick={toggleAdmin}>
                <div className={`admin-toggle-switch-footer ${isAdmin ? 'active' : ''}`}>
                  <div className="toggle-knob-footer"></div>
                </div>
                <span className="admin-label-footer">Admin</span>
              </div>
            </div>

          </div>

          {/* Right Column: Navigation Links */}
          <div className="footer-nav-column" data-layer="Nav - Site nav">
            <div className="footer-nav-list" data-layer="List">
              {footerLinks.map((link) => (
                <div key={link.name} className="footer-nav-item" data-layer="Item">
                  <Link to={getLinkPath(link.path)} className="footer-nav-link" data-layer="Link">
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
