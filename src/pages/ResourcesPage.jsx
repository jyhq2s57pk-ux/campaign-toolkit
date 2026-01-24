import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ResourcesPage.css";
import { api } from "../lib/api";

// Custom SVG Graphics matching the requested style (Vibrant bg + abstract UI metaphors)
const renderGraphic = (title) => {
  switch (title) {
    case "Hero banners":
    case "Campaign Visual Assets":
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          <rect width="400" height="300" fill="#FB7185" /> {/* Coral */}
          <g transform="translate(50, 60)">
            {/* Browser/Banner Frame */}
            <rect x="0" y="0" width="300" height="180" rx="12" fill="#881337" opacity="0.2" />
            {/* The Banner Image Area */}
            <rect x="20" y="20" width="260" height="100" rx="8" fill="#FFF1F2" opacity="0.9" />

            {/* Abstract Content inside Banner */}
            <circle cx="230" cy="70" r="30" fill="#FB7185" opacity="0.5" />
            <rect x="40" y="50" width="100" height="10" rx="5" fill="#FB7185" opacity="0.8" />
            <rect x="40" y="70" width="60" height="8" rx="4" fill="#FB7185" opacity="0.6" />

            {/* CTA Button below banner */}
            <rect x="110" y="140" width="80" height="20" rx="10" fill="#FFF1F2" opacity="0.9" />
          </g>
        </svg>
      );
    case "Category imagery":
    case "Product Assortment Guide":
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          <rect width="400" height="300" fill="#34D399" /> {/* Emerald */}
          <g transform="translate(75, 50)">
            {/* Product Grid Layout */}
            <rect x="0" y="0" width="115" height="115" rx="12" fill="#064E3B" opacity="0.2" />
            <circle cx="57.5" cy="57.5" r="25" fill="#ECFDF5" opacity="0.8" />

            <rect x="135" y="0" width="115" height="50" rx="12" fill="#064E3B" opacity="0.2" />
            <rect x="135" y="65" width="50" height="50" rx="12" fill="#064E3B" opacity="0.2" />
            <rect x="200" y="65" width="50" height="50" rx="12" fill="#064E3B" opacity="0.2" />

            {/* Abstract decorative elements */}
            <rect x="145" y="15" width="40" height="6" rx="3" fill="#ECFDF5" opacity="0.6" />
            <circle cx="160" cy="90" r="10" fill="#ECFDF5" opacity="0.6" />
            <rect x="215" y="80" width="20" height="20" rx="4" fill="#ECFDF5" opacity="0.6" />
          </g>
        </svg>
      );
    case "Social formats":
    case "Social Media Assets":
    case "Social Media Templates":
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          <rect width="400" height="300" fill="#A78BFA" /> {/* Purple */}
          <g transform="translate(130, 40)">
            {/* Mobile Phone Shape */}
            <rect x="0" y="0" width="140" height="220" rx="20" fill="#4C1D95" opacity="0.25" />

            {/* Screen Content */}
            <rect x="15" y="15" width="110" height="130" rx="8" fill="#F5F3FF" opacity="0.9" />
            <rect x="15" y="155" width="110" height="10" rx="5" fill="#F5F3FF" opacity="0.5" />
            <rect x="15" y="175" width="70" height="10" rx="5" fill="#F5F3FF" opacity="0.5" />

            {/* Floating Heart Notification */}
            <g transform="translate(100, 100)">
              <circle cx="0" cy="0" r="25" fill="#DDD6FE" />
              <path d="M0 5 L-5 0 C-10 -5, -10 -10, -5 -15 C0 -20, 0 -15, 0 -15 C0 -15, 0 -20, 5 -15 C10 -10, 10 -5, 5 0 Z" fill="#7C3AED" transform="translate(0, 8) scale(1.2)" />
            </g>
          </g>
        </svg>
      );
    case "Campaign headlines":
    case "Copy Library":
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          <rect width="400" height="300" fill="#60A5FA" /> {/* Blue */}
          <g transform="translate(80, 70)">
            {/* Document/Text block */}
            <rect x="0" y="0" width="10" height="160" rx="5" fill="#1E3A8A" opacity="0.2" /> {/* Margin line */}

            {/* Headlines */}
            <rect x="40" y="10" width="200" height="24" rx="4" fill="#EFF6FF" opacity="0.95" />
            <rect x="40" y="45" width="160" height="24" rx="4" fill="#EFF6FF" opacity="0.95" />

            {/* Paragraphs */}
            <rect x="40" y="90" width="180" height="8" rx="4" fill="#DBEAFE" opacity="0.7" />
            <rect x="40" y="108" width="180" height="8" rx="4" fill="#DBEAFE" opacity="0.7" />
            <rect x="40" y="126" width="120" height="8" rx="4" fill="#DBEAFE" opacity="0.7" />

            {/* Cursor */}
            <rect x="245" y="10" width="4" height="24" fill="#1E40AF" className="blink-anim" />
          </g>
        </svg>
      );
    case "Member variants":
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          <rect width="400" height="300" fill="#818CF8" /> {/* Indigo */}
          <g transform="translate(110, 60)">
            {/* Profile Card */}
            <rect x="0" y="0" width="180" height="180" rx="90" fill="#312E81" opacity="0.15" />

            {/* Avatar Head */}
            <circle cx="90" cy="70" r="35" fill="#E0E7FF" opacity="0.9" />
            {/* Avatar Body */}
            <path d="M50 140 C50 110, 130 110, 130 140 L130 150 H50 Z" fill="#E0E7FF" opacity="0.9" />

            {/* Loyal Badge */}
            <g transform="translate(130, 10)">
              <circle cx="0" cy="0" r="22" fill="#FCD34D" stroke="#818CF8" strokeWidth="4" />
              <path d="M0 -8 L2 -2 H8 L3 2 L5 8 L0 4 L-5 8 L-3 2 L-8 -2 H-2 Z" fill="#B45309" transform="scale(1.2)" />
            </g>
          </g>
        </svg>
      );
    case "Figma master file":
    case "Brand Guidelines":
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          <rect width="400" height="300" fill="#FB923C" /> {/* Orange */}
          <g transform="translate(125, 50)">
            {/* Abstract Figma-ish Shape Nodes */}
            <circle cx="0" cy="50" r="35" fill="#7C2D12" opacity="0.2" />
            <rect x="75" y="15" width="70" height="70" rx="20" fill="#7C2D12" opacity="0.2" />
            <path d="M0 120 L35 180 L70 120 Z" fill="#7C2D12" opacity="0.2" />

            {/* Pen Tool / Vector Path */}
            <path d="M35 50 Q 75 120 110 50" stroke="#FFF7ED" strokeWidth="6" fill="none" strokeLinecap="round" />
            <circle cx="35" cy="50" r="8" fill="#FFF7ED" />
            <circle cx="110" cy="50" r="8" fill="#FFF7ED" />

            {/* Selection Box */}
            <rect x="20" y="90" width="110" height="80" rx="4" stroke="#FFF7ED" strokeWidth="2" strokeDasharray="6 4" fill="none" />
          </g>
        </svg>
      );
    case "Component specs":
    case "Technical Specs":
      return (
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          <rect width="400" height="300" fill="#A3E635" /> {/* Lime */}
          <g transform="translate(60, 80)">
            {/* The Component (Button) */}
            <rect x="60" y="40" width="160" height="60" rx="30" fill="#ECFCCB" shadow="0 4px 0 rgba(0,0,0,0.1)" />
            <rect x="100" y="65" width="80" height="10" rx="5" fill="#365314" opacity="0.4" />

            {/* Measurement Lines (Red) */}
            {/* Width */}
            <line x1="60" y1="120" x2="220" y2="120" stroke="#BE123C" strokeWidth="2" />
            <line x1="60" y1="115" x2="60" y2="125" stroke="#BE123C" strokeWidth="2" />
            <line x1="220" y1="115" x2="220" y2="125" stroke="#BE123C" strokeWidth="2" />
            <rect x="125" y="112" width="30" height="16" rx="4" fill="#BE123C" />

            {/* Height */}
            <line x1="240" y1="40" x2="240" y2="100" stroke="#BE123C" strokeWidth="2" />
            <line x1="235" y1="40" x2="245" y2="40" stroke="#BE123C" strokeWidth="2" />
            <line x1="235" y1="100" x2="245" y2="100" stroke="#BE123C" strokeWidth="2" />
          </g>
        </svg>
      );
    default:
      return (
        <div className="preview-placeholder">
          Graphic
        </div>
      );
  }
};

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getResources().then(data => {
      const enhancedData = (data || []).map(r => ({
        ...r,
        formats: getFormatsForTitle(r.title)
      }));
      setResources(enhancedData);
      setLoading(false);
    });
  }, []);

  const getFormatsForTitle = (title) => {
    // Map based on original hardcoded values plus new mappings
    if (title.includes("Hero") || title.includes("Visual") || title.includes("Assets")) return ["SVG", "JPG", "PNG"];
    if (title.includes("Category") || title.includes("Assortment")) return ["JPG", "PNG"];
    if (title.includes("Social")) return ["MP4", "GIF"];
    if (title.includes("Campaign") || title.includes("Copy") || title.includes("Headline")) return ["DOCX", "PDF"];
    if (title.includes("Member")) return ["DOCX"];
    if (title.includes("Figma") || title.includes("Brand")) return ["FIGMA"];
    if (title.includes("Component") || title.includes("Technical") || title.includes("Specs")) return ["PDF"];
    return ["FILE"];
  };



  return (
    <div className="resources-page">
      <Header />

      <main className="resources-main-content">
        <div className="outer-container">
          <section className="page-header">
            <h1>Assets & Resources</h1>
            <p>
              All assets, copy and templates needed to activate campaigns are housed here.
            </p>
          </section>

          <div className="inner-content-wrapper">
            <div className="resources-container">
              <div className="resources-grid animate-fade-in">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="resource-asset-card glass"
                    onClick={() => navigate(`/resources/${res.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="asset-preview">
                      {/* Render custom graphic based on title */}
                      {renderGraphic(res.title)}
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
