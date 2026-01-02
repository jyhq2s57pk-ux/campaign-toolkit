import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./WaysOfWorkingPage.css";

export default function WaysOfWorkingPage() {
  const steps = [
    {
      number: "1",
      title: "Global",
      description: "Global Digital creates a Jira EPIC containing the full toolkit setup. Child tickets are created for each region.",
      tasks: ["Create Jira EPIC", "Generate child tickets", "Attach global assets"]
    },
    {
      number: "2",
      title: "Regions",
      description: "Regional teams review their ticket, confirm activation level, locations and dates, and validate copy, visuals and translations.",
      tasks: ["Review EPIC", "Confirm activation level", "Validate translations"]
    },
    {
      number: "3",
      title: "Content Team",
      description: "Once approved, the content team schedules and implements the campaign.",
      tasks: ["Schedule activation", "Live execution", "Final testing"]
    }
  ];

  const tips = [
    "Always define activation level first",
    "Include start and end dates",
    "Attach final visuals and translations",
    "Avoid changes once tickets are approved"
  ];

  return (
    <div className="ways-page">
      <Header />

      <main className="ways-main-content">
        <div className="outer-container">
          <section className="page-header">
            <h1>Ways of Working</h1>
            <p>
              This section explains how campaigns move from toolkit to live execution.
            </p>
          </section>

          <div className="inner-content-wrapper">
            <div className="workflow-container">
              <div className="workflow-steps">
                {steps.map((step, index) => (
                  <div key={index} className="workflow-step-card glass">
                    <div className="step-badge">{step.number}</div>
                    <div className="step-content">
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-desc">{step.description}</p>
                      <ul className="step-tasks">
                        {step.tasks.map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </div>
                    {index < steps.length - 1 && <div className="step-arrow">→</div>}
                  </div>
                ))}
              </div>
            </div>

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
