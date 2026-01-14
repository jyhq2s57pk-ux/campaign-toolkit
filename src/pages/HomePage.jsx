import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroCampaignCard from "../components/HeroCampaignCard";
import ActivationIdeas from "../components/ActivationIdeas";
import "../components/Badge.css";
import "./HomePage.css";

import homePageTitle from "../assets/homepagetitle.svg";

export default function HomePage() {
  return (
    <div className="home-page">
      <Header />

      <main className="home-main">
        {/* Homepage Title Image */}
        <div className="homepage-title-container">
          <img src={homePageTitle} alt="Campaign Toolkit" className="homepage-title-img" />
        </div>

        {/* Campaign Pill/Header Area */}
        <div className="campaign-header-pill-area">
          <span className="campaign-pill">2026 campaign</span>
        </div>

        {/* Main Content Container */}
        <div className="inner-content-wrapper">

          {/* 1. Hero Campaign Card */}
          <section className="section-hero">
            <HeroCampaignCard
              links={[
                { title: 'Customer Touchpoints', description: 'Explore touchpoints.', link: '/customer-journey' },
                { title: 'Insights', description: 'View insights.', link: '/insights' },
                { title: 'Activate', description: 'Activation guides.', link: '/ways-of-working' },
                { title: 'Omnichannel', description: 'Omnichannel strategy.', link: '/omnichannel' },
                { title: 'Calendar', description: 'Campaign calendar.', link: '/calendar' },
                { title: 'Resources', description: 'Download resources.', link: '/resources' },
              ]}
            />
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

