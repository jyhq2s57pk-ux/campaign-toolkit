import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../components/Badge.css";
import "./HomePage.css";

import HomePageTile from "../components/HomePageTile";

export default function HomePage() {
  // Force HMR Update v5
  const Card = ({ n, title, href = "#", className = "" }) => (
    <Link
      to={href}
      className={`card ${className}`}
    >
      <div className="card-top">
        <div className="card-number">{n}</div>
      </div>
      <div className="card-bottom">
        <div className="card-title">{title}</div>
      </div>
    </Link>
  );

  return (
    <div className="home-page">
      <Header />

      <main className="home-main">
        {/* 1. Intro Section */}
        <div className="intro-section">
          <div className="intro-container">
            <div className="intro-title">Digital Commerce<br />Trading Toolkit</div>
            <div className="intro-subtitle">
              Global frameworks to plan, launch and scale seasonal ecommerce activations across Reserve & Collect, App and Emporium.
            </div>
          </div>
        </div>

        {/* 2. Main Content Container */}
        <div className="inner-content-wrapper">

          {/* Section A: Campaign Hero */}
          {/* Note: HomePageTile includes the wrapper and badge now */}
          <HomePageTile />

          {/* Section B: Grid */}
          <section className="section-grid">
            <span className="section-badge">Whats inside</span>

            <div className="content-grid two-rows">
              {/* 1. Customer Journey */}
              <Card
                n="01"
                title="Customer Journey"
                href="/customer-journey"
              />

              {/* 2. Campaign Calendar */}
              <Card
                n="01"
                title="Trading calendar"
                href="/calendar"
              />

              {/* 3. Omnichannel Activation */}
              <Card
                n="01"
                title="Omnichannel consistency"
                href="/omnichannel"
              />

              {/* 4. Assets & Resources */}
              <Card
                n="01"
                title="Asset collection"
                href="/resources"
              />

              {/* 5. Insights & Performance */}
              <Card
                n="01"
                title="Resources"
                href="/insights"
              />

              {/* 6. Ways of Working */}
              <Card
                n="01"
                title="How to activate"
                href="/ways-of-working"
              />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

