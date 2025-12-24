import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";

export default function HomePage() {
  const Card = ({ n, title, desc, href = "#" }) => (
    <Link
      to={href}
      className="home-card"
    >
      <div className="card-number">{n}</div>
      <div className="card-title">{title}</div>
      <div className="card-description">{desc}</div>
    </Link>
  );

  return (
    <div className="home-page">
      <Header />

      <main className="home-main" style={{ paddingTop: '56px' }}>
        <div className="page-header">
          <p className="page-subtitle">Ecom Trading Toolkit Template</p>
          <h1 className="page-title">Ecommerce Trading Toolkit</h1>
        </div>

        <section className="hero-section">

          <p className="hero-description">
            This toolkit shows where to activate the Holiday Season campaign across web and app, plus the key touchpoints,
            timelines, and resources needed to launch confidently in market.
          </p>

          <div className="audio-card">
            <div>
              <div className="audio-title">Audio overview</div>
              <div className="audio-subtitle">A short overview of the campaign. Coming soon.</div>
            </div>
            <button className="audio-button">
              Listen to the overview
            </button>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Content</h2>

          <div className="cards-grid">
            <Card
              n="01"
              title="Customer Journey"
              desc="Touchpoints and components across the ecommerce journey, with tier guidance and implementation notes."
              href="/touchpoints"
            />
            <Card
              n="02"
              title="Ways of working"
              desc="How Global, Regions, and Content work together, including required inputs and handover steps."
              href="/ways-of-working"
            />
            <Card
              n="03"
              title="2026 Calendar"
              desc="A simple view of campaign timing across the year, with tier rows and CSV import and export."
              href="/calendar"
            />
            <Card
              n="04"
              title="Resources"
              desc="Quick access to the latest assets, templates, links, and supporting docs."
              href="/resources"
            />

            <div className="audio-card-inline">
              <div>
                <div className="card-number">05</div>
                <div className="card-title">Audio overview</div>
                <div className="card-description">A short overview of the campaign. Coming soon.</div>
              </div>
            </div>
          </div>

          <div className="grid-tip">
            Tip: In your host app, wire each card href to a real page route.
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
