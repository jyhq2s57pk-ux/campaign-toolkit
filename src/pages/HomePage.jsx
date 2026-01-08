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
                title="Customer Touchpoints"
                href="/customer-journey"
              />

              {/* 2. Trading Calendar */}
              <Card
                n="02"
                title="Trading calendar"
                href="/calendar"
              />

              {/* 3. Omnichannel Consistency */}
              <Card
                n="03"
                title="Omnichannel consistency"
                href="/omnichannel"
              />

              {/* 4. Resources */}
              <Card
                n="04"
                title="Resources"
                href="/resources"
              />

              {/* 5. How to Activate */}
              <Card
                n="05"
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

