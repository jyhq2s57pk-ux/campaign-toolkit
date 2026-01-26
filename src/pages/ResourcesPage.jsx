import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ResourcesPage.css";
import { api } from "../lib/api";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getResources().then(data => {
      setResources(data || []);
      setLoading(false);
    });
  }, []);

  const handleResourceClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="resources-page">
        <Header />
        <main className="resources-main-content">
          <div className="outer-container">
            <p>Loading resources...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="resources-page">
      <Header />

      <main className="resources-main-content">
        <div className="outer-container">
          <section className="page-header">
            <h1>Assets & Resources</h1>
            <p>
              All assets, copy and templates needed to activate campaigns are housed here.
            </p>
          </section>

          <div className="inner-content-wrapper">
            <div className="resources-container">
              {resources.length === 0 ? (
                <div className="empty-state">
                  <p>No resources available.</p>
                </div>
              ) : (
                <div className="resources-grid animate-fade-in">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="resource-asset-card glass"
                      onClick={() => handleResourceClick(resource.cta_url)}
                      style={{ cursor: resource.cta_url ? 'pointer' : 'default' }}
                    >
                      {/* Thumbnail or placeholder */}
                      <div className="asset-preview">
                        {resource.thumbnail_url ? (
                          <img src={resource.thumbnail_url} alt={resource.title} />
                        ) : (
                          <div className="preview-placeholder">Graphic</div>
                        )}
                      </div>

                      {/* Category badge */}
                      {resource.category && (
                        <div className="asset-category-badge">
                          {resource.category}
                        </div>
                      )}

                      {/* Content */}
                      <div className="asset-info">
                        <h3 className="asset-title">{resource.title}</h3>
                        {resource.description && (
                          <p className="asset-desc">{resource.description}</p>
                        )}
                      </div>

                      {/* CTA Button */}
                      {resource.cta_url && (
                        <button
                          className="download-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResourceClick(resource.cta_url);
                          }}
                        >
                          {resource.cta_label || 'View Resource'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="access-note glass">
                <h3>Access Note</h3>
                <p>Assets are available via Canopy and Figma. Local adaptations or new requests should be raised via DCCR.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
