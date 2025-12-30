import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import TouchpointItem from '../components/TouchpointItem';
import ScreenshotPlaceholder from '../components/ScreenshotPlaceholder';
import './CustomerJourneyPage.css';

export default function CustomerJourneyPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [touchpoints, setTouchpoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const journeyStages = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      platforms: ['Home - Web', 'Home - App', 'Shopping Home - App', 'Web', 'web']
    },
    {
      id: 'category',
      label: 'Category & PLP',
      icon: '📂',
      platforms: ['Category Landing Pages', 'Product Listing Pages', 'Gifting Content Landing Page']
    },
    {
      id: 'search',
      label: 'Navigation & Search',
      icon: '🔍',
      platforms: ['Search', 'Top & Megamenu']
    },
    {
      id: 'pdp',
      label: 'PDP & Checkout',
      icon: '🛒',
      platforms: ['Product Detail Page', 'Checkout & Shopping Bag', 'Thank You Page']
    },
  ];

  useEffect(() => {
    fetchTouchpoints();
  }, []);

  const fetchTouchpoints = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('touchpoints')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTouchpoints(data || []);
    } catch (err) {
      console.error('Error fetching touchpoints:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTouchpointsForStage = (platforms) => {
    return touchpoints.filter(tp =>
      platforms.some(p => p.toLowerCase() === tp.platform?.toLowerCase())
    );
  };

  const content = {
    home: {
      title: 'Home',
      items: [
        'Web and App hero banners introduce the campaign',
        'Promobar highlights key member benefits',
        'Most Popular and What’s Trending carousels feature campaign SKUs',
        'Editorial banners reinforce the campaign narrative'
      ]
    },
    category: {
      title: 'Category & PLP',
      items: [
        'Campaign-led CLPs act as the main discovery hub',
        'CLP hero banners adapt copy for members and non-members',
        'Dual and triple content blocks highlight key categories',
        'Tailored PLPs surface curated assortments'
      ]
    },
    search: {
      title: 'Navigation & Search',
      items: [
        'Campaign surfaced in top menu and megamenu',
        'Brand banners used where space allows',
        'Search terms redirect to campaign PLPs',
        'Priority SKUs boosted in search results'
      ]
    },
    pdp: {
      title: 'PDP & Checkout',
      items: [
        'PDP marketing banners cross-sell campaign assortments',
        'Optional product bundles add value',
        'Checkout carousels adapt messaging by travel date',
        'Thank you pages reinforce in-store activations'
      ]
    }
  };

  return (
    <div className="journey-page">
      <Header />
      <main className="journey-main">
        <div className="outer-container">
          <section className="page-header">
            <h1 className="page-title">Customer Journey</h1>
            <p className="page-subtitle-grey">
              This page shows how a seasonal campaign comes to life across the ecommerce journey, from first exposure to checkout and post-purchase.
            </p>
          </section>

          <div className="inner-content-wrapper">
            {/* Journey Map / In-page Nav */}
            <section className="journey-overview">
              <h2 className="section-label">Journey Overview</h2>
              <div className="journey-map-nav">
                {journeyStages.map((stage, index) => (
                  <React.Fragment key={stage.id}>
                    <button
                      className={`journey-step-btn ${activeSection === stage.id ? 'active' : ''}`}
                      onClick={() => setActiveSection(stage.id)}
                    >
                      <span className="step-icon">{stage.icon}</span>
                      <span className="step-label">{stage.label}</span>
                    </button>
                    {index < journeyStages.length - 1 && <div className="step-connector">→</div>}
                  </React.Fragment>
                ))}
              </div>
            </section>

            {/* Content Display (Tabs/Accordion style) */}
            <section className="journey-details">
              <div className="content-accordion glass">
                {journeyStages.map((stage) => {
                  const stageTouchpoints = getTouchpointsForStage(stage.platforms);
                  return (
                    <div
                      key={stage.id}
                      className={`accordion-item ${activeSection === stage.id ? 'expanded' : ''}`}
                    >
                      <button
                        className="accordion-header"
                        onClick={() => setActiveSection(activeSection === stage.id ? null : stage.id)}
                      >
                        <span className="header-icon">{stage.icon}</span>
                        <h3>{stage.label}</h3>
                        <span className="header-arrow">{activeSection === stage.id ? '−' : '+'}</span>
                      </button>
                      {activeSection === stage.id && (
                        <div className="accordion-content animate-fade-only">
                          {(() => {
                            // Find all unique platforms that belong to this stage
                            // Belonging means: matches one of the hardcoded platforms OR starts with the stage label (e.g. "Home - ")
                            const stageTouchpoints = touchpoints.filter(tp => {
                              const p = tp.platform?.toLowerCase() || '';
                              const labelMatch = stage.label.toLowerCase();
                              return stage.platforms.some(sp => sp.toLowerCase() === p) ||
                                p.startsWith(labelMatch + ' -') ||
                                p === labelMatch;
                            });

                            // Get unique platform names (case-insensitive grouping but keep first casing)
                            const uniquePlatforms = [];
                            const seenPlatforms = new Set();

                            stageTouchpoints.forEach(tp => {
                              const platformName = tp.platform || 'Unknown';
                              const lowerName = platformName.toLowerCase();
                              if (!seenPlatforms.has(lowerName)) {
                                seenPlatforms.add(lowerName);
                                uniquePlatforms.push(platformName);
                              }
                            });

                            // Sort platforms by their minimum sort_order
                            uniquePlatforms.sort((a, b) => {
                              const minA = Math.min(...stageTouchpoints.filter(tp => tp.platform?.toLowerCase() === a.toLowerCase()).map(tp => tp.sort_order || 999));
                              const minB = Math.min(...stageTouchpoints.filter(tp => tp.platform?.toLowerCase() === b.toLowerCase()).map(tp => tp.sort_order || 999));
                              return minA - minB;
                            });

                            if (uniquePlatforms.length === 0) {
                              return !loading ? (
                                <div className="no-data-note">
                                  No component data found for this stage in the CMS.
                                </div>
                              ) : null;
                            }

                            return uniquePlatforms.map((platformName) => {
                              const platformTouchpoints = stageTouchpoints.filter(tp =>
                                tp.platform?.toLowerCase() === platformName.toLowerCase()
                              );

                              // Find the first touchpoint with an image to use for the module screenshot
                              const moduleWithImage = platformTouchpoints.find(tp => tp.image_url) || platformTouchpoints[0];

                              return (
                                <div key={platformName} className="module-container">
                                  <div className="module-header">
                                    <div className="module-title-row">
                                      <div className="module-icon-circle">
                                        <span className="arrow-icon">→</span>
                                      </div>
                                      <h4 className="module-name">{platformName}</h4>
                                    </div>
                                  </div>

                                  <div className="touchpoint-card-compact glass">
                                    <div className="touchpoint-layout">
                                      <div className="touchpoint-screenshot">
                                        <ScreenshotPlaceholder
                                          imageUrl={moduleWithImage.image_url}
                                          markers={moduleWithImage.marker_positions || []}
                                        />
                                      </div>
                                      <div className="touchpoint-list">
                                        {platformTouchpoints.map((tp, i) => (
                                          <TouchpointItem
                                            key={tp.id}
                                            number={i + 1}
                                            title={tp.title}
                                            description={tp.description}
                                            isOptional={tp.is_optional}
                                            isNew={tp.is_new}
                                            isPremium={tp.tier_premium}
                                            isExecutive={tp.tier_executive}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          })()}

                          <div
                            className="add-module-card glass"
                            onClick={() => window.location.href = `/admin?platform=${stage.label} - New Page&showForm=true`}
                          >
                            <div className="add-module-icon">+</div>
                            <div className="add-module-content">
                              <h5 className="add-module-title">Add New {stage.label} Module</h5>
                              <p className="add-module-subtitle">Create a new page layout for this stage (e.g. "{stage.label} - Tablet")</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Activation Levels */}
            <section className="activation-levels">
              <h2 className="section-label centered">Activation Levels</h2>
              <div className="levels-grid">
                <div className="level-card glass tier-premium">
                  <div className="level-badge">Premium</div>
                  <p>Delivers full visibility across all stages.</p>
                </div>
                <div className="level-card glass tier-executive">
                  <div className="level-badge">Executive</div>
                  <p>Focuses on mid-funnel and search.</p>
                </div>
                <div className="level-card glass tier-standard">
                  <div className="level-badge">Standard</div>
                  <p>Uses selected placements only.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
