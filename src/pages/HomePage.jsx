import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CompactCampaignCard from "../components/CompactCampaignCard";
import { api } from "../lib/api";
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

        {/* Main Content Container */}
        <div className="inner-content-wrapper">

          {/* Campaign Pill Label */}
          {!loading && campaigns.length > 0 && (
            <div className="campaign-header-pill-area">
              <span className="campaign-pill">Campaigns</span>
            </div>
          )}

          {/* Campaign Dashboard Grid */}
          <section className="campaign-dashboard-grid">
            {loading ? (
              <div className="campaign-loading">Loading campaigns...</div>
            ) : campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <CompactCampaignCard
                  key={campaign.id}
                  id={campaign.id}
                  name={campaign.name}
                  subtitle={campaign.subtitle}
                  year={campaign.year}
                  heroImage={campaign.hero_image_url}
                  activationDates={campaign.activation_dates}
                  scope={campaign.scope}
                  channels={campaign.channels}
                  primaryColor={campaign.primary_color}
                  features={campaign.features}
                />
              ))
            ) : (
              <div className="campaign-loading">No campaigns found.</div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
