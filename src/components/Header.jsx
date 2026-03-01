import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import './Header.css';

import logo from '../assets/logo1.svg';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [campaign, setCampaign] = useState(null);

  const campaignId = searchParams.get('campaignId');

  useEffect(() => {
    const fetchCampaignContext = async () => {
      if (campaignId) {
        const data = await api.getCampaignById(campaignId);
        setCampaign(data || null);
      } else {
        setCampaign(null);
      }
    };
    fetchCampaignContext();
  }, [campaignId]);

  const isAdmin = location.pathname.startsWith('/admin');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleAdmin = () => {
    if (isAdmin) {
      navigate('/');
    } else {
      navigate('/admin');
    }
    closeMenu();
  };

  // Preserve campaignId in nav links
  const getNavLinkWithContext = (path) => {
    return campaignId ? `${path}?campaignId=${campaignId}` : path;
  };

  // Campaign-scoped nav links (only shown when campaignId is present)
  const campaignNavLinks = [
    { name: 'Insights', path: '/insights' },
    { name: 'Touchpoints', path: '/customer-journey' },
    { name: 'Activate', path: '/ways-of-working' },
    { name: 'Omnichannel', path: '/omnichannel' },
    { name: 'Resources', path: '/resources', moduleKey: 'page_resources' },
  ];

  // Global nav links (always shown)
  const globalNavLinks = [
    { name: 'Calendar', path: '/calendar' },
  ];

  // Build visible nav links based on context
  const modules = campaign?.modules || {};
  const navLinks = campaignId
    ? campaignNavLinks.filter(link => {
        if (!link.moduleKey) return true;
        return modules[link.moduleKey] !== false;
      })
    : globalNavLinks;

  // Determine header inline style for campaign color
  const headerStyle = campaign?.primary_color
    ? { '--header-bg': campaign.primary_color }
    : {};

  return (
    <header
      className={`header ${isAdmin ? 'admin-mode' : ''}`}
      style={headerStyle}
    >
      {/* Row 1: Topbar — logo + admin toggle */}
      <div className="header-topbar">
        <div className="header-topbar__inner">
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <img src={logo} alt="Trading Toolkit" className="logo-image" />
          </Link>
          <div className="header-right">
            <div className="admin-toggle-wrapper" onClick={toggleAdmin}>
              <div className={`admin-toggle-switch ${isAdmin ? 'active' : ''}`}>
                <div className="toggle-knob"></div>
              </div>
              <span className="admin-label">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Subnav — breadcrumbs + nav links */}
      <div className="header-subnav">
        <div className="header-subnav__inner">
          <div className="header-breadcrumbs">
            <Link
              className="breadcrumb-link breadcrumb-link--home"
              to="/"
              onClick={closeMenu}
            >
              Home
            </Link>
            {campaign && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-link breadcrumb-link--campaign">
                  {campaign.name}
                </span>
              </>
            )}
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
                  to={getNavLinkWithContext(link.path)}
                  className={`nav-btn ${(location.pathname === link.path || (link.path === '/ways-of-working' && location.pathname === '/activate')) ? 'nav-btn-active' : ''}`}
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
        </div>
      </div>
    </header>
  );
}
