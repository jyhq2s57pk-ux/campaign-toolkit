import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ResourcesPage.css";

export default function ResourcesPage() {
  const categories = ["Visual Assets", "Copy & Messaging", "Templates"];

  const resources = [
    {
      id: "v1",
      category: "Visual Assets",
      title: "Hero banners",
      description: "Web and App campaign hero imagery in all required formats.",
      formats: ["SVG", "JPG", "PNG"],
    },
    {
      id: "v2",
      category: "Visual Assets",
      title: "Category imagery",
      description: "CLP, PLP and megamenu imagery for campaign activation.",
      formats: ["JPG", "PNG"],
    },
    {
      id: "v3",
      category: "Visual Assets",
      title: "Social formats",
      description: "Paid media and organic social assets for global sharing.",
      formats: ["MP4", "GIF"],
    },
    {
      id: "c1",
      category: "Copy & Messaging",
      title: "Campaign headlines",
      description: "Approved global headlines and subheadings.",
      formats: ["DOCX", "PDF"],
    },
    {
      id: "c2",
      category: "Copy & Messaging",
      title: "Member variants",
      description: "Specific messaging for loyalty club members.",
      formats: ["DOCX"],
    },
    {
      id: "t1",
      category: "Templates",
      title: "Figma master file",
      description: "Complete design system for seasonal activations.",
      formats: ["FIGMA"],
    },
    {
      id: "t2",
      category: "Templates",
      title: "Component specs",
      description: "Standardised dimensions and safe zones for all modules.",
      formats: ["PDF"],
    },
  ];

  const [activeCategory, setActiveCategory] = useState("Visual Assets");
  const filteredResources = useMemo(() =>
    resources.filter((r) => r.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="resources-page">
      <Header />

      <main className="resources-main-content">
        <div className="outer-container">
          <section className="page-header">
            <h1 className="page-title">Assets & Resources</h1>
            <p className="page-subtitle-grey">
              All assets, copy and templates needed to activate campaigns are housed here.
            </p>
          </section>

          <div className="inner-content-wrapper">
            <div className="resources-container">
              <nav className="category-nav">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </nav>

              <div className="resources-grid animate-fade-in">
                {filteredResources.map((res) => (
                  <div key={res.id} className="resource-asset-card glass">
                    <div className="asset-preview">
                      <div className="preview-placeholder">
                        {res.formats[0]}
                      </div>
                    </div>
                    <div className="asset-info">
                      <h3 className="asset-title">{res.title}</h3>
                      <p className="asset-desc">{res.description}</p>
                      <div className="asset-meta">
                        {res.formats.map(f => <span key={f} className="format-tag">{f}</span>)}
                      </div>
                    </div>
                    <button className="download-btn">Download</button>
                  </div>
                ))}
              </div>

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
