import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./WaysOfWorkingPage.css";
import ImplementationTips from "../components/ImplementationTips";
import { api } from "../lib/api";


export default function WaysOfWorkingPage() {
  const [steps, setSteps] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getWaysOfWorking();

      // Map process data to steps format
      const stepsData = data.process.map((step, index) => ({
        icon: getIconForStep(index),
        title: step.title,
        content: renderStepContent(step.description)
      }));

      // Map timeline data to tips (using phase field as tip text)
      const tipsData = data.timeline.map(item => item.phase);

      setSteps(stepsData);
      setTips(tipsData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper to get appropriate icon for each step
  const getIconForStep = (index) => {
    const icons = [IconExpand, IconGroup, IconStar];
    const IconComponent = icons[index] || IconStar;
    return <IconComponent />;
  };

  // Helper to render step description with formatting support
  const renderStepContent = (description) => {
    if (!description) return null;

    // Split by line breaks and process each part
    const parts = description.split('\n\n');

    return (
      <>
        {parts.map((part, i) => {
          // Check if part contains highlight-text class
          if (part.includes('<div class="highlight-text">')) {
            return (
              <div key={i} className="highlight-text" dangerouslySetInnerHTML={{ __html: part.replace(/<div[^>]*>|<\/div>/g, '') }} />
            );
          }

          // Check if part contains inline-new-badge
          if (part.includes('<span class="inline-new-badge">')) {
            return <p key={i} dangerouslySetInnerHTML={{ __html: part }} />;
          }

          // Regular paragraph with markdown-style bold
          const htmlContent = part.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
          return <p key={i} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
        })}
      </>
    );
  };

  const IconExpand = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 3H21V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21H3V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3L14 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21L10 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const IconGroup = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const IconStar = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (loading) {
    return (
      <div className="ways-page">
        <Header />
        <main className="ways-main-content">
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading ways of working...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="ways-page">
      <Header />

      <main className="ways-main-content">
        <div className="outer-container">
          <section className="page-header">
            <h1>
              Ways of working in <br />
              3 simple steps
            </h1>
          </section>

          <div className="inner-content-wrapper">
            <div className="workflow-container">
              <div className="workflow-steps">
                {steps.map((step, index) => (
                  <div key={index} className="workflow-step-card glass">
                    <div className="step-icon-wrapper">
                      {step.icon}
                    </div>
                    <div className="step-content">
                      <h3 className="step-title text-purple">{step.title}</h3>
                      <div className="step-body-content">
                        {step.content}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="step-arrow-container">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <ImplementationTips />

            <section className="best-practice-section">
              <h2 className="section-label centered">Best Practice Tips</h2>
              <div className="tips-grid">
                {tips.map((tip, i) => (
                  <div key={i} className="tip-card glass">
                    <span className="tip-bullet">✓</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
