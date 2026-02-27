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
      // Preserve campaignId when entering admin
      const adminPath = campaignId ? `/admin?campaignId=${campaignId}` : '/admin';
      navigate(adminPath);
    }
    closeMenu();
  };

  // Helper to preserve campaignId in nav links
  const getNavLinkWithContext = (path) => {
    if (campaignId) {
      return `${path}?campaignId=${campaignId}`;
    }
    return path;
  };

  const allNavLinks = [
    { name: 'Customer Touchpoints', path: '/customer-journey' },
    { name: 'Resources', path: '/resources', moduleKey: 'page_resources' },
    { name: 'Activate', path: '/activate' },
    { name: 'Omnichannel', path: '/omnichannel' },
    { name: 'Calendar', path: '/calendar', moduleKey: 'page_calendar' },
    { name: 'Insights', path: '/insights' },
  ];

  // Filter out pages disabled by campaign modules
  const modules = campaign?.modules || {};
  const navLinks = allNavLinks.filter(link => {
    if (!link.moduleKey) return true;
    return modules[link.moduleKey] !== false;
  });

  const campaignColor = campaign?.primary_color;

  return (
    <header
      className={`header ${isAdmin ? 'admin-mode' : ''} ${campaign ? 'has-campaign' : ''}`}
      style={campaign && !isAdmin ? { '--campaign-color': campaignColor || '#8F53F0' } : undefined}
    >
      <div className="header-container">

        <div className="header-left">
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <img src={logo} alt="Trading Toolkit" className="logo-image" />
          </Link>
          {campaign && (
            <div className="header-campaign-context">
              <span
                className="campaign-context-dot"
                style={{ backgroundColor: campaignColor || '#8F53F0' }}
              />
              <span className="campaign-context-name">{campaign.name}</span>
              {campaign.year && (
                <span className="campaign-context-year">{campaign.year}</span>
              )}
            </div>
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
                className={`nav-btn ${(location.pathname === link.path || (link.path === '/activate' && location.pathname === '/ways-of-working')) ? 'nav-btn-active' : ''}`}
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

      {/* Campaign color accent strip */}
      {campaign && !isAdmin && (
        <div
          className="header-campaign-strip"
          style={{ backgroundColor: campaignColor || '#8F53F0' }}
        />
      )}
    </header>
  );
}
