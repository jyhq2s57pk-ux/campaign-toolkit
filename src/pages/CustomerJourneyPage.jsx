import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../components/Badge.css';
import './CustomerJourneyPage.css';

// Chevron Down Icon
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10.9998L3 5.9998L3.7 5.2998L8 9.5998L12.3 5.2998L13 5.9998L8 10.9998Z" fill="var(--theme-icon-1, #F1F1F1)" />
  </svg>
);

// Chevron Up Icon
const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5L13 10L12.3 10.7L8 6.4L3.7 10.7L3 10L8 5Z" fill="var(--theme-icon-1, #F1F1F1)" />
  </svg>
);

// Marker Line SVG
const MarkerLine = () => (
  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.375 9L0.375001 9" stroke="#D6D6D6" strokeWidth="0.75" strokeLinecap="round" />
  </svg>
);

export default function CustomerJourneyPage() {
  const [pages, setPages] = useState([]);
  const [components, setComponents] = useState({});
  const [expandedPage, setExpandedPage] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  const detailRefs = useRef({});
  const screenshotRef = useRef(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data: pagesData, error: pagesError } = await supabase
      .from('journey_pages')
      .select('*')
      .order('sort_order', { ascending: true });

    if (pagesError) {
      console.error('Error fetching pages:', pagesError);
      setLoading(false);
      return;
    }

    setPages(pagesData || []);

    // Fetch all components for all pages
    const { data: componentsData, error: componentsError } = await supabase
      .from('journey_components')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!componentsError && componentsData) {
      // Group components by page_id
      const grouped = {};
      componentsData.forEach(comp => {
        if (!grouped[comp.page_id]) grouped[comp.page_id] = [];
        grouped[comp.page_id].push(comp);
      });
      setComponents(grouped);
    }

    setLoading(false);
  };

  const handlePageClick = (page) => {
    if (expandedPage?.id === page.id) {
      setExpandedPage(null);
      setActiveComponent(null);
    } else {
      setExpandedPage(page);
      const pageComponents = components[page.id] || [];
      if (pageComponents.length > 0) {
        setActiveComponent(pageComponents[0]);
      }
    }
  };

  const handleComponentClick = (component) => {
    setActiveComponent(component);
    // Scroll to component detail
    if (detailRefs.current[component.id]) {
      detailRefs.current[component.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Scroll sync: as user scrolls through details, highlight active component
  const handleDetailScroll = useCallback(() => {
    if (!expandedPage) return;
    const pageComponents = components[expandedPage.id] || [];

    for (const comp of pageComponents) {
      const el = detailRefs.current[comp.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Check if element is roughly in the center of viewport
        if (rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.3) {
          if (activeComponent?.id !== comp.id) {
            setActiveComponent(comp);
          }
          break;
        }
      }
    }
  }, [expandedPage, components, activeComponent]);

  useEffect(() => {
    const container = document.querySelector('.detail-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleDetailScroll);
      return () => container.removeEventListener('scroll', handleDetailScroll);
    }
  }, [handleDetailScroll]);

  const pageComponents = expandedPage ? (components[expandedPage.id] || []) : [];

  return (
    <div className="page-wrapper">
      <Header />
      <main className="journey-page">
        <div className="inner-content-wrapper">
          <div className="journey-header">
            <h1>Customer Journey</h1>
            <p>Explore touchpoints across the customer experience</p>
          </div>

          <div className="journey-content">
            {loading ? (
              <div className="loading-state">Loading journey data...</div>
            ) : (
              <div className="accordion-container">
                {pages.map((page) => {
                  const isExpanded = expandedPage?.id === page.id;
                  const componentCount = (components[page.id] || []).length;

                  return (
                    <div key={page.id} className={`accordion-item ${isExpanded ? 'expanded' : ''}`}>
                      {/* Accordion Header */}
                      <div
                        className="accordion-header"
                        onClick={() => handlePageClick(page)}
                      >
                        <div className="accordion-title-area">
                          <div className="accordion-title">{page.title}</div>
                          <div className="platform-badge">
                            <span className="platform-badge-text">{page.platform_type}</span>
                          </div>
                        </div>
                        <div className="accordion-meta">
                          <span className="component-count">{componentCount} Components</span>
                          <div className="accordion-chevron">
                            {isExpanded ? <ChevronUp /> : <ChevronDown />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="accordion-body">
                          <div className="content-layout">
                            {/* Left: Image Frame with Screenshot */}
                            <div className="image-frame" ref={screenshotRef}>
                              {page.screenshot_url ? (
                                <div className="screenshot-wrapper">
                                  <img src={page.screenshot_url} alt={page.title} className="screenshot-image" />
                                  {/* Number markers with connecting lines */}
                                  <div className="markers-container">
                                    {pageComponents.map((comp, index) => {
                                      const markers = comp.marker_positions || [];
                                      // Calculate position - distribute evenly or use saved positions
                                      const topPercent = markers.length > 0 && markers[0]?.top
                                        ? markers[0].top
                                        : `${(index * 140) + 58}px`;

                                      return (
                                        <div
                                          key={comp.id}
                                          className={`marker-row ${activeComponent?.id === comp.id ? 'active' : ''}`}
                                          style={{ top: topPercent }}
                                        >
                                          <MarkerLine />
                                          <div className="number-label">
                                            <span className="number-label-text">{comp.marker_number}</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="no-screenshot">
                                  <span>No screenshot available</span>
                                  <p>Add a screenshot URL in the Admin panel</p>
                                </div>
                              )}
                            </div>

                            {/* Right: Feature Descriptions */}
                            <div className="descriptions-container">
                              {pageComponents.map((comp) => {
                                // Build badges array using unified badge variant names
                                const badges = [];
                                if (comp.is_new) badges.push({ label: 'New', variant: 'new' });
                                if (comp.tier_executive) badges.push({ label: 'Executive', variant: 'executive' });
                                if (comp.tier_premium) badges.push({ label: 'Premium', variant: 'premium' });
                                // Always show Standard badge
                                badges.push({ label: 'Standard', variant: 'standard' });

                                return (
                                  <div
                                    key={comp.id}
                                    ref={(el) => detailRefs.current[comp.id] = el}
                                    className={`feature-item ${activeComponent?.id === comp.id ? 'active' : ''}`}
                                    onClick={() => handleComponentClick(comp)}
                                  >
                                    <div className="feature-content">
                                      {/* Header with number and title */}
                                      <div className="feature-header">
                                        <div className="feature-number">
                                          <span className="feature-number-text">{comp.marker_number}</span>
                                        </div>
                                        <div className="feature-title">{comp.title}</div>
                                      </div>

                                      {/* Description */}
                                      <div className="feature-description">
                                        {comp.description}
                                      </div>

                                      {/* Badges */}
                                      <div className="feature-badges">
                                        {badges.map((badge, index) => (
                                          <span key={index} className={`badge badge--${badge.variant}`}>
                                            {badge.label}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
