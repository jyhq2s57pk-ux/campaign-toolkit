import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroCampaignCard from "../components/HeroCampaignCard";
import ActivationIdeas from "../components/ActivationIdeas";
import { api } from "../lib/api";
import "../components/Badge.css";
import "./HomePage.css";

import homePageTitle from "../assets/homepagetitle.svg";

export default function HomePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const data = await api.getCampaigns();
      setCampaigns(data);
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="home-page">
      <Header />

      <main className="home-main">
        {/* Homepage Title Image */}
        <div className="homepage-title-container">
          <img src={homePageTitle} alt="Campaign Toolkit" className="homepage-title-img" />
        </div>

        {/* Campaign Pill/Header Area - Showing latest campaign year or generic */}
        {!loading && campaigns.length > 0 && (
          <div className="campaign-header-pill-area">
            <span className="campaign-pill">Campaigns</span>
          </div>
        )}

        {/* Main Content Container */}
        <div className="inner-content-wrapper">

          {/* 1. Hero Campaign Cards Stacked */}
          <section className="section-hero-stack">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                Loading campaigns...
              </div>
            ) : campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="campaign-card-wrapper" style={{ marginBottom: '4rem' }}>
                  <HeroCampaignCard
                    title={campaign.name}
                    year={`${campaign.year} Global campaign`}
                    image={campaign.hero_image_url || 'https://placehold.co/600x400'}
                    scope={campaign.scope}
                    channels={campaign.channels}
                    activationDates={campaign.activation_dates}
                    links={[
                      { title: 'Customer Touchpoints', description: 'Explore touchpoints.', link: `/customer-journey?campaignId=${campaign.id}` },
                      { title: 'Insights', description: 'View insights.', link: `/insights?campaignId=${campaign.id}` },
                      { title: 'Activate', description: 'Activation guides.', link: `/ways-of-working?campaignId=${campaign.id}` },
                      { title: 'Omnichannel', description: 'Omnichannel strategy.', link: `/omnichannel?campaignId=${campaign.id}` },
                      { title: 'Calendar', description: 'Campaign calendar.', link: `/calendar?campaignId=${campaign.id}` },
                      { title: 'Resources', description: 'Download resources.', link: `/resources?campaignId=${campaign.id}` },
                    ]}
                    primaryColor={campaign.primary_color}
                    features={campaign.features}
                  />
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>No campaigns found.</div>
            )}
          </section>


        </div>
      </main>

      <Footer />
    </div>
  );
}

