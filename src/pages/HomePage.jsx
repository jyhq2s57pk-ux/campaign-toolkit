import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <Header />

      <main className="home-main">
        <div className="outer-container">
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Ecommerce Trading Toolkits</h1>
              <p className="hero-subtitle">
                Global frameworks to plan, launch and scale seasonal ecommerce activations across Reserve & Collect, App and Emporium.
              </p>
              <div className="hero-ctas">
                <Link to="/customer-journey" className="cta-primary">Explore the toolkit</Link>
                <Link to="/calendar" className="cta-secondary">View campaign calendar</Link>
              </div>
            </div>
          </section>

          <section className="intro-section">
            <div className="inner-content-wrapper">
              <p className="intro-text">
                The Ecommerce Trading Toolkits bring together customer journeys, campaign calendars, content modules and ways of working into a single, reusable system. Each toolkit is designed to help global and regional teams activate campaigns faster, more consistently and with measurable commercial impact.
              </p>
            </div>
          </section>

          <section className="what-it-gives-section">
            <div className="inner-content-wrapper">
              <h2 className="section-title-small">What this site gives you</h2>
              <div className="benefits-grid">
                <div className="benefit-card glass">
                  <div className="benefit-icon">🗺️</div>
                  <p>A clear view of the full ecommerce customer journey</p>
                </div>
                <div className="benefit-card glass">
                  <div className="benefit-icon">🎯</div>
                  <p>Pre-defined content placements by activation level</p>
                </div>
                <div className="benefit-card glass">
                  <div className="benefit-icon">📦</div>
                  <p>Central access to assets, copy and templates</p>
                </div>
                <div className="benefit-card glass">
                  <div className="benefit-icon">🔄</div>
                  <p>A repeatable process for global and local teams</p>
                </div>
              </div>
            </div>
          </section>

          <section className="nav-cards-section">
            <div className="inner-content-wrapper">
              <div className="nav-grid">
                <Link to="/customer-journey" className="nav-card glass animate-fade-in">
                  <div className="card-label">01</div>
                  <h3 className="card-heading">Customer Journey</h3>
                  <div className="card-arrow">→</div>
                </Link>
                <Link to="/calendar" className="nav-card glass animate-fade-in">
                  <div className="card-label">02</div>
                  <h3 className="card-heading">Campaign Calendar</h3>
                  <div className="card-arrow">→</div>
                </Link>
                <Link to="/resources" className="nav-card glass animate-fade-in">
                  <div className="card-label">03</div>
                  <h3 className="card-heading">Assets & Resources</h3>
                  <div className="card-arrow">→</div>
                </Link>
                <Link to="/ways-of-working" className="nav-card glass animate-fade-in">
                  <div className="card-label">04</div>
                  <h3 className="card-heading">Ways of Working</h3>
                  <div className="card-arrow">→</div>
                </Link>
                <Link to="/omnichannel" className="nav-card glass animate-fade-in">
                  <div className="card-label">05</div>
                  <h3 className="card-heading">Omnichannel Activation</h3>
                  <div className="card-arrow">→</div>
                </Link>
                <Link to="/insights" className="nav-card glass animate-fade-in">
                  <div className="card-label">06</div>
                  <h3 className="card-heading">Insights & Performance</h3>
                  <div className="card-arrow">→</div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
