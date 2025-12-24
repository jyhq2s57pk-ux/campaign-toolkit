import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Calendar2026Page.css";

const STORAGE_KEY = "avolta_toolkit_calendar_v1";

export default function Calendar2026Page() {
  const seeded = [
    // Overarching Campaign
    { id: "ev-1", title: "Moments of Joy (2025)", startDate: "2026-01-01", endDate: "2026-12-31", tier: "Overarching Campaign", status: "Planned" },
    { id: "ev-2", title: "Love your journey", startDate: "2026-04-01", endDate: "2026-12-31", tier: "Overarching Campaign", status: "Planned" },

    // Category-Led
    { id: "ev-3", title: "Value Club / Summer (Southern Hemisphere)", startDate: "2026-01-01", endDate: "2026-03-31", tier: "Category-Led", status: "Planned" },
    { id: "ev-4", title: "Tasting Club", startDate: "2026-04-01", endDate: "2026-04-30", tier: "Category-Led", status: "Planned" },
    { id: "ev-5", title: "Summer Club", startDate: "2026-07-01", endDate: "2026-07-31", tier: "Category-Led", status: "Planned" },
    { id: "ev-6", title: "Festive Club", startDate: "2026-10-01", endDate: "2026-10-31", tier: "Category-Led", status: "Planned" },

    // Omnichannel Campaigns
    { id: "ev-7", title: "Mother's & Father's Day", startDate: "2026-03-01", endDate: "2026-03-31", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "ev-8", title: "Valentine's Day", startDate: "2026-02-14", endDate: "2026-02-14", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "ev-9", title: "Ramadan", startDate: "2026-02-17", endDate: "2026-03-19", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "ev-10", title: "Easter", startDate: "2026-04-02", endDate: "2026-04-03", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "ev-11", title: "Golden Week", startDate: "2026-10-01", endDate: "2026-10-07", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "ev-12", title: "Diwali", startDate: "2026-11-08", endDate: "2026-11-08", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "ev-13", title: "Champagne Festival", startDate: "2026-11-01", endDate: "2026-11-30", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "ev-14", title: "CNY", startDate: "2026-02-17", endDate: "2026-02-17", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "ev-15", title: "Sales", startDate: "2026-06-01", endDate: "2026-06-30", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "ev-16", title: "Black Friday", startDate: "2026-11-27", endDate: "2026-11-27", tier: "Omnichannel Campaigns", status: "Planned" },

    // Digital Campaigns
    { id: "ev-17", title: "Blue Monday", startDate: "2026-01-19", endDate: "2026-01-19", tier: "Digital Campaigns", status: "Planned" },
    { id: "ev-18", title: "Best of 2025", startDate: "2026-01-01", endDate: "2026-01-31", tier: "Digital Campaigns", status: "Planned" },
    { id: "ev-19", title: "Spring (Spring fragrances)", startDate: "2026-04-01", endDate: "2026-06-30", tier: "Digital Campaigns", status: "Planned" },
    { id: "ev-20", title: "Back to Routine", startDate: "2026-08-01", endDate: "2026-09-30", tier: "Digital Campaigns", status: "Planned" },
    { id: "ev-21", title: "Autumn", startDate: "2026-10-01", endDate: "2026-12-31", tier: "Digital Campaigns", status: "Planned" },
    { id: "ev-22", title: "Singles Day", startDate: "2026-11-11", endDate: "2026-11-11", tier: "Digital Campaigns", status: "Planned" },
    { id: "ev-23", title: "Double 12", startDate: "2026-12-12", endDate: "2026-12-12", tier: "Digital Campaigns", status: "Planned" },

    // Local Campaigns
    { id: "ev-24", title: "Carnival (BR)", startDate: "2026-02-13", endDate: "2026-02-18", tier: "Local Campaigns (supported by Global)", status: "Planned" },
    { id: "ev-25", title: "Eid al adha (ME)", startDate: "2026-05-27", endDate: "2026-05-27", tier: "Local Campaigns (supported by Global)", status: "Planned" },
    { id: "ev-26", title: "Moon Festival", startDate: "2026-09-25", endDate: "2026-09-25", tier: "Local Campaigns (supported by Global)", status: "Planned" },
  ];

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate that data uses new tier structure (not old "Tier 1", "Tier 2", "Tier 3")
        const validTiers = [
          "Overarching Campaign",
          "Category-Led",
          "Omnichannel Campaigns",
          "Digital Campaigns",
          "Local Campaigns (supported by Global)"
        ];
        const hasValidTiers = parsed.every(event => validTiers.includes(event.tier));
        if (hasValidTiers && parsed.length > 0) {
          setEvents(parsed);
          return;
        }
      } catch {}
    }
    // Fall back to seeded data if no valid stored data
    setEvents(seeded);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const months = useMemo(
    () => [
      { key: "01", label: "January", short: "Jan" },
      { key: "02", label: "February", short: "Feb" },
      { key: "03", label: "March", short: "Mar" },
      { key: "04", label: "April", short: "Apr" },
      { key: "05", label: "May", short: "May" },
      { key: "06", label: "June", short: "Jun" },
      { key: "07", label: "July", short: "Jul" },
      { key: "08", label: "August", short: "Aug" },
      { key: "09", label: "September", short: "Sep" },
      { key: "10", label: "October", short: "Oct" },
      { key: "11", label: "November", short: "Nov" },
      { key: "12", label: "December", short: "Dec" },
    ],
    []
  );

  const tiers = [
    { name: "Overarching Campaign", color: "#E5B8F4" },
    { name: "Category-Led", color: "#7DD3C0" },
    { name: "Omnichannel Campaigns", color: "#C4B5FD" },
    { name: "Digital Campaigns", color: "#FED7AA" },
    { name: "Local Campaigns (supported by Global)", color: "#D4D4D8" }
  ];

  // Group campaigns by tier and calculate rows to prevent overlap
  const tierCampaignRows = useMemo(() => {
    const result = {};

    tiers.forEach(tier => {
      const tierEvents = events.filter(e => e.tier === tier.name);
      const rows = [];

      tierEvents.forEach(event => {
        const startMonth = parseInt(event.startDate.slice(5, 7));
        const endMonth = parseInt(event.endDate.slice(5, 7));

        // Find a row where this event doesn't overlap
        let rowIndex = 0;
        while (rowIndex < rows.length) {
          const hasOverlap = rows[rowIndex].some(existingEvent => {
            const existingStart = parseInt(existingEvent.startDate.slice(5, 7));
            const existingEnd = parseInt(existingEvent.endDate.slice(5, 7));
            // Check if date ranges overlap
            return !(endMonth < existingStart || startMonth > existingEnd);
          });

          if (!hasOverlap) break;
          rowIndex++;
        }

        // Add to found row or create new row
        if (rowIndex === rows.length) {
          rows.push([]);
        }
        rows[rowIndex].push(event);
      });

      result[tier.name] = rows;
    });

    return result;
  }, [events]);

  // Calculate position for campaign bars
  const getCampaignPosition = (event) => {
    const startMonth = parseInt(event.startDate.slice(5, 7));
    const endMonth = parseInt(event.endDate.slice(5, 7));
    const gridColumn = `${startMonth + 1} / ${endMonth + 2}`; // +1 because first column is tier label
    return gridColumn;
  };

  return (
    <div className="calendar-page">
      <Header />

      <main style={{ paddingTop: '56px' }}>
        <div className="page-header">
          <p className="page-subtitle">Ecom Trading Toolkit Template</p>
          <h1 className="page-title">Campaign Calendar</h1>
        </div>

        <div className="calendar-main">
          <div className="timeline-container">
            <div className="timeline-grid" style={{
              display: 'grid',
              gridTemplateColumns: '200px repeat(12, 1fr)',
              gap: '0',
            }}>
              {/* Header Row */}
              <div className="timeline-header tier-label">Category</div>
              {months.map((m) => (
                <div key={m.key} className="timeline-header month-label">
                  {m.short}
                </div>
              ))}

              {/* Tier Sections */}
              {tiers.map((tier, tierIndex) => {
                const campaignRows = tierCampaignRows[tier.name] || [];
                const numRows = Math.max(campaignRows.length, 1); // At least 1 row per tier
                let currentGridRow = tiers.slice(0, tierIndex).reduce((sum, t) =>
                  sum + Math.max((tierCampaignRows[t.name] || []).length, 1), 1) + 1;

                return (
                  <React.Fragment key={tier.name}>
                    {/* Tier label with color bar spanning all rows for this tier */}
                    <div
                      className="timeline-tier-cell"
                      style={{
                        gridColumn: '1',
                        gridRow: `${currentGridRow} / span ${numRows}`,
                      }}
                    >
                      <div className="tier-color-bar" style={{ backgroundColor: tier.color }}></div>
                      <div className="tier-name">{tier.name}</div>
                    </div>

                    {/* Month cells for each row in this tier */}
                    {Array.from({ length: numRows }).map((_, rowIdx) => (
                      <React.Fragment key={`${tier.name}-row-${rowIdx}`}>
                        {months.map((m) => (
                          <div
                            key={`${tier.name}-${rowIdx}-${m.key}`}
                            className="timeline-month-cell"
                            style={{
                              gridRow: currentGridRow + rowIdx,
                            }}
                          ></div>
                        ))}
                      </React.Fragment>
                    ))}

                    {/* Campaign bars */}
                    {campaignRows.map((row, rowIdx) =>
                      row.map((event) => (
                        <div
                          key={event.id}
                          className="campaign-bar"
                          style={{
                            gridColumn: getCampaignPosition(event),
                            gridRow: currentGridRow + rowIdx,
                            backgroundColor: tier.color,
                          }}
                        >
                          <span className="campaign-title">{event.title}</span>
                          <span className="campaign-dates">
                            {event.startDate === event.endDate
                              ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : `${new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            }
                          </span>
                        </div>
                      ))
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {events.length === 0 ? (
            <div className="empty-state">
              No campaigns yet. Import a CSV to get started.
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
