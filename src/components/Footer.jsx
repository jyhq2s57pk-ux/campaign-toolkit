import { useLocation, useNavigate } from 'react-router-dom';
import FooterLogo from './FooterLogo';
import './Footer.css';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');

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
