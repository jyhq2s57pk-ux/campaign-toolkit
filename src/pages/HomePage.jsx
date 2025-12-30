import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";

export default function HomePage() {
  // Force HMR Update v3
  const Card = ({ n, title, desc, href = "#", className = "" }) => (
    <Link
      to={href}
      className={`card ${className}`}
    >
      <div className="frame">
        <div className="div">
          <div className="frame-2">
            <div className="period">{n}</div>
          </div>
          <div className="pillar">
            <div className="text-wrapper">{title}</div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="home-page">
      <Header />

      <main className="home-main">
        <div className="outer-container">
          {/* 1. Page Header Section */}
          <section className="page-header">
            <h1 className="page-title">Digital Commerce<br />Trading Toolkit</h1>
            <p className="page-subtitle-grey">
              Global frameworks to plan, launch and scale seasonal ecommerce<br />
              activations across Reserve & Collect, App and Emporium.
            </p>
          </section>

          {/* 2. Main Content Container */}
          <div className="inner-content-wrapper">

            {/* Section A: Campaign Hero */}
            <section className="section-hero">
              <span className="section-badge">Campaign toolkit</span>

              <div className="campaign-hero-card">
                <div className="hero-content-center">
                  <h2 className="hero-campaign-title">Summer Joy campaign</h2>
                  <div className="joy-unlimited-logo">
                    <span className="joy-bold">JOY</span>
                    <span className="joy-outline">UNLIMITED</span>
                  </div>
                </div>
              </div>
            </section>

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
                  title="Campaign Calendar"
                  href="/calendar"
                />

                {/* 3. Omnichannel Activation */}
                <Card
                  n="01"
                  title="Omnichannel Activation"
                  href="/omnichannel"
                />

                {/* 4. Assets & Resources */}
                <Card
                  n="01"
                  title="Assets & Resources"
                  href="/resources"
                />

                {/* 5. Insights & Performance */}
                <Card
                  n="01"
                  title="Insights & Performance"
                  href="/insights"
                />

                {/* 6. Ways of Working */}
                <Card
                  n="01"
                  title="Ways of Working"
                  href="/ways-of-working"
                />
              </div>
            </section>

            {/* Section C: Details */}
            <section className="section-details">
              <span className="section-badge">Details</span>

              <div className="details-row">
                <div className="detail-group">
                  <div className="detail-label text-orange">Scope</div>
                  <div className="detail-value">Global</div>
                </div>

                <div className="detail-group">
                  <div className="detail-label text-orange">Channels</div>
                  <div className="detail-value">Reserve & Collect (Web /APP) Emporium</div>
                </div>

                <div className="detail-group">
                  <div className="detail-label text-orange">Activation dates</div>
                  <div className="detail-value">October-December 2025<br />(Activation date may vary by location)</div>
                </div>

                <div className="detail-group badges-group">
                  <div className="status-badge badge-premium">
                    <span className="badge-pill">Premium</span>
                    <span className="badge-desc">Full visibility</span>
                  </div>
                  <div className="status-badge badge-executive">
                    <span className="badge-pill">Executive</span>
                    <span className="badge-desc">Medium visibility</span>
                  </div>
                  <div className="status-badge badge-standard">
                    <span className="badge-pill">Standard</span>
                    <span className="badge-desc">Regular visibility</span>
                  </div>
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
