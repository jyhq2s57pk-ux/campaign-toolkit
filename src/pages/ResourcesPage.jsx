import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ResourcesPage.css";

export default function ResourcesPage() {
  const tabs = ["Creative", "Content", "Product", "Brand", "Technical"];

  const data = [
    {
      id: "r1",
      category: "Creative",
      title: "Digital asset portal",
      description: "Campaign visuals and formats for local adaptation.",
      href: "#",
    },
    {
      id: "r2",
      category: "Creative",
      title: "Figma templates",
      description: "Templates for campaign layouts and paid media sizes.",
      href: "#",
    },
    {
      id: "r3",
      category: "Product",
      title: "Jira board",
      description: "Track implementation tickets and regional status.",
      href: "#",
    },
  ];

  const [active, setActive] = useState("Creative");
  const items = useMemo(() => data.filter((r) => r.category === active), [active]);

  return (
    <div className="resources-page">
      <Header />

      <main style={{ paddingTop: '56px' }}>
        <div className="page-header">
          <p className="page-subtitle">Ecom Trading Toolkit Template</p>
          <h1 className="page-title">Resources</h1>
        </div>

        <div className="resources-main">
          <div className="resource-tabs">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`resource-tab ${active === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="resources-empty">
            No resources in this category yet.
          </div>
        ) : (
          <div className="resources-grid">
            {items.map((r) => (
              <div key={r.id} className="resource-card">
                <div className="resource-title">{r.title}</div>
                <div className="resource-description">{r.description}</div>
                <div className="resource-action">
                  <a href={r.href} className="resource-button">
                    Open resource
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
