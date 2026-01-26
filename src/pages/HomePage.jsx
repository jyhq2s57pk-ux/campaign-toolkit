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
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      const data = await api.getCampaign();
      setCampaign(data);
      setLoading(false);
    };
    fetchCampaign();
  }, []);

  return (
    <div className="home-page">
      <Header />

      <main className="home-main">
        {/* Homepage Title Image */}
        <div className="homepage-title-container">
          <img src={homePageTitle} alt="Campaign Toolkit" className="homepage-title-img" />
        </div>

        {/* Campaign Pill/Header Area */}
        {!loading && campaign && (
          <div className="campaign-header-pill-area">
            <span className="campaign-pill">{campaign.year} campaign</span>
          </div>
        )}

        {/* Main Content Container */}
        <div className="inner-content-wrapper">

          {/* 1. Hero Campaign Card */}
          <section className="section-hero">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                Loading campaign...
              </div>
            ) : campaign ? (
              <HeroCampaignCard
                title={campaign.name}
                year={`${campaign.year} Global campaign`}
                image={campaign.hero_image_url || 'https://placehold.co/600x400'}
                scope={campaign.scope}
                channels={campaign.channels}
                activationDates={campaign.activation_dates}
                links={[
                  { title: 'Customer Touchpoints', description: 'Explore touchpoints.', link: '/customer-journey' },
                  { title: 'Insights', description: 'View insights.', link: '/insights' },
                  { title: 'Activate', description: 'Activation guides.', link: '/ways-of-working' },
                  { title: 'Omnichannel', description: 'Omnichannel strategy.', link: '/omnichannel' },
                  { title: 'Calendar', description: 'Campaign calendar.', link: '/calendar' },
                  { title: 'Resources', description: 'Download resources.', link: '/resources' },
                ]}
              />
            ) : null}
          </section>

          {/* 3. Activation Ideas */}
          <section className="section-activation">
            <ActivationIdeas />
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

