import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./WaysOfWorkingPage.css";

function ChecklistCard({ title, items }) {
  return (
    <div className="checklist-card">
      <div className="checklist-title">{title}</div>
      <div className="checklist-items">
        {items.map((x, i) => (
          <label key={i} className="checklist-item">
            <input type="checkbox" className="checklist-checkbox" />
            <span>{x}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function WaysOfWorkingPage() {
  return (
    <div className="ways-page">
      <Header />

      <main style={{ paddingTop: '56px' }}>
        <div className="page-header">
          <p className="page-subtitle">Ecom Trading Toolkit Template</p>
          <h1 className="page-title">Ways of working</h1>
        </div>

        <div className="ways-main">
          <div className="checklist-grid">
          <ChecklistCard
            title="Global"
            items={[
              "Create the main Epic in Jira.",
              "Create one child ticket per region.",
              "Add the global proposal, copy, and reference links.",
            ]}
          />
          <ChecklistCard
            title="Regions"
            items={[
              "Confirm activation level and locations.",
              "Confirm start and end dates.",
              "Add selected visuals and translations.",
              "Request support via DCCR if needed.",
              "Reassign to Content when ready.",
            ]}
          />
          <ChecklistCard
            title="Content"
            items={[
              "Implement changes across agreed touchpoints.",
              "Validate links, copy, and tier logic.",
              "Coordinate scheduling and go-live.",
            ]}
          />
        </div>

          <div className="warning-card">
            <div className="warning-title">Do not</div>
            <div className="warning-text">
              Avoid late changes once a ticket is complete and assigned to Content.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
