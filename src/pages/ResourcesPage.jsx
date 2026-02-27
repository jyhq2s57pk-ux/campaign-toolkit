import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ResourcesPage.css";
import { api } from "../lib/api";
import "../components/UniversalCard.css"; // Ensure styles are loaded if not globally
import UniversalCard from "../components/UniversalCard";
export default function ResourcesPage() {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaignId');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getResources(campaignId).then(data => {
      setResources(data || []);
      setLoading(false);
    });
  }, [campaignId]);

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
                    <UniversalCard
                      key={resource.id}
                      title={resource.title}
                      description={resource.description}
                      image={resource.thumbnail_url} // If null, UniversalCard shows placeholder
                      category={resource.category}
                      categoryStyle="badge"
                      buttonText={resource.cta_url ? (resource.cta_label || 'View Resource') : null}
                      onClick={() => handleResourceClick(resource.cta_url)}
                      onButtonClick={(e) => {
                        // e.stopPropagation handled in UniversalCard, but good to be safe if passed
                        handleResourceClick(resource.cta_url);
                      }}
                      className="animate-fade-in" // Or just keep passing styles via class if needed
                    />
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
