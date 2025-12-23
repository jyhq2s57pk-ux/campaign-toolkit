import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import PlatformChip from '../components/PlatformChip';
import TouchpointSection from '../components/TouchpointSection';
import './TouchpointsPage.css';

export default function TouchpointsPage() {
  const [activePlatform, setActivePlatform] = useState('Homepage');
  const [touchpoints, setTouchpoints] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch touchpoints from Supabase
  useEffect(() => {
    fetchTouchpoints();
  }, []);

  // Detect scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchTouchpoints = async () => {
    const { data, error } = await supabase
      .from('touchpoints')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching touchpoints:', error);
    } else {
      setTouchpoints(data || []);

      // Extract unique platforms from touchpoints
      const uniquePlatforms = [...new Set(data.map(t => t.platform))];
      const platformsData = uniquePlatforms.map(platform => {
        // Determine if it's App or Web based on platform name
        let type = null;
        if (platform.toLowerCase().includes('app')) {
          type = 'App';
        } else if (platform.toLowerCase().includes('web') || platform.toLowerCase().includes('homepage')) {
          type = 'Web';
        }

        return {
          name: platform,
          type: type,
          isNew: false // You can update this logic based on your needs
        };
      });
      setPlatforms(platformsData);

      if (platformsData.length > 0) {
        setActivePlatform(platformsData[0].name);
      }
    }
    setLoading(false);
  };

  // Group touchpoints by platform
  const touchpointsByPlatform = touchpoints.reduce((acc, touchpoint) => {
    if (!acc[touchpoint.platform]) {
      acc[touchpoint.platform] = [];
    }
    acc[touchpoint.platform].push(touchpoint);
    return acc;
  }, {});

  // Scroll to platform section
  const scrollToPlatform = (platformName) => {
    setActivePlatform(platformName);
    const element = document.getElementById(platformName.toLowerCase().replace(/\s+/g, '-'));
    if (element) {
      const offset = 180; // Account for sticky header + nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main style={{ paddingTop: '56px' }}>
          <div className="page-header">
            <h1 className="page-title">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <main style={{ paddingTop: '56px' }}>
        {/* Page Header */}
        <div className="page-header">
          <p className="page-subtitle">Ecom Trading Toolkit Template</p>
          <h1 className="page-title">Customer touch points</h1>
        </div>

        {/* Platform Navigation */}
        <div className={`platform-nav-section ${isScrolled ? 'scrolled' : ''}`}>
          <div className="container">
            <div className="platform-nav-container">
              <span className="on-this-page-label">On this page</span>

              <div className="platform-chips-row">
                {platforms.map((platform) => (
                  <PlatformChip
                    key={platform.name}
                    name={platform.name}
                    isNew={platform.isNew}
                    type={platform.type}
                    isActive={activePlatform === platform.name}
                    onClick={() => scrollToPlatform(platform.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Touchpoint Sections - All platforms */}
        {Object.entries(touchpointsByPlatform).map(([platformName, touchpoints]) => {
          const platformData = platforms.find(p => p.name === platformName);
          return (
            <div
              key={platformName}
              id={platformName.toLowerCase().replace(/\s+/g, '-')}
            >
              <TouchpointSection
                platform={platformName}
                platformType={platformData?.type || null}
                title={platformName}
                touchpoints={touchpoints}
              />
            </div>
          );
        })}
      </main>
    </div>
  );
}
