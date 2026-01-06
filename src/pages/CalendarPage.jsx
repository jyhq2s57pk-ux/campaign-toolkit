import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./CalendarPage.css";
import { api } from "../lib/api";

const STORAGE_KEY = "avolta_toolkit_calendar_v1";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getCalendarEvents(),
      api.getCalendarTiers()
    ]).then(([eventsData, tiersData]) => {
      if (eventsData) {
        setEvents(eventsData.map(e => ({
          id: e.id,
          title: e.title,
          startDate: e.start_date, // Map snake_case to camelCase
          endDate: e.end_date,
          tier: e.tier,
          color: e.color
        })));
      }
      if (tiersData) {
        // Sort tiers to match original design order if possible, or just by ID?
        // The original had a specific order. If 'sort_order' isn't in DB, we rely on insertion order or name.
        // I'll assume insertion order or ID order from DB is fine for now, or I could hardcode the desired order of names.
        // For now, let's use what we get.
        setTiers(tiersData);
      }
      setLoading(false);
    });
  }, []);

  const months = useMemo(
    () => [
      { key: "01", label: "January", short: "JAN" },
      { key: "02", label: "February", short: "FEB" },
      { key: "03", label: "March", short: "MAR" },
      { key: "04", label: "April", short: "APR" },
      { key: "05", label: "May", short: "MAY" },
      { key: "06", label: "June", short: "JUN" },
      { key: "07", label: "July", short: "JUL" },
      { key: "08", label: "August", short: "AUG" },
      { key: "09", label: "September", short: "SEP" },
      { key: "10", label: "October", short: "OCT" },
      { key: "11", label: "November", short: "NOV" },
      { key: "12", label: "December", short: "DEC" },
    ],
    []
  );

  const tierCampaignRows = useMemo(() => {
    const result = {};
    tiers.forEach(tier => {
      // Robust matching: check exact match or if it's the Local Campaigns tier matching either version
      const tierEvents = events.filter(e => {
        if (e.tier === tier.name) return true;
        if (tier.name.includes("Local Campaigns") && (e.tier === "Local Campaigns" || e.tier?.includes("Local Campaigns"))) return true;
        return false;
      });

      const rows = [];
      tierEvents.forEach(event => {
        const startMonth = parseInt(event.startDate.slice(5, 7));
        const endMonth = parseInt(event.endDate.slice(5, 7));
        let rowIndex = 0;
        while (rowIndex < rows.length) {
          const hasOverlap = rows[rowIndex].some(existingEvent => {
            const existingStart = parseInt(existingEvent.startDate.slice(5, 7));
            const existingEnd = parseInt(existingEvent.endDate.slice(5, 7));
            return !(endMonth < existingStart || startMonth > existingEnd);
          });
          if (!hasOverlap) break;
          rowIndex++;
        }
        if (rowIndex === rows.length) rows.push([]);
        rows[rowIndex].push(event);
      });
      result[tier.name] = rows;
    });
    return result;
  }, [events, tiers]);

  const tierRowInfo = useMemo(() => {
    let currentGridRow = 2;
    const info = {};

    tiers.forEach(tier => {
      const campaignRows = tierCampaignRows[tier.name] || [];
      const numRows = Math.max(campaignRows.length, 1);
      info[tier.name] = {
        startRow: currentGridRow,
        numRows: numRows,
        campaignRows: campaignRows
      };
      currentGridRow += numRows;
    });
    return info;
  }, [tierCampaignRows, tiers]);

  const getCampaignPosition = (event) => {
    const startMonth = parseInt(event.startDate.slice(5, 7));
    const endMonth = parseInt(event.endDate.slice(5, 7));
    return `${startMonth + 1} / ${endMonth + 2}`;
  };

  return (
    <div className="calendar-page">
      <Header />
      <main className="calendar-main-content">
        <section className="page-header">
          <h1>Campaign Calendar</h1>
          <p>
            The campaign calendar maps global trading moments across the year, helping teams align planning, assets and delivery timelines.
          </p>
        </section>

        <div className="inner-content-wrapper full-width">
          <div className="calendar-grid-container glass">
            <div className="timeline-grid">
              {/* Header Row */}
              <div className="timeline-header tier-label">Category</div>
              {months.map((m) => (
                <div key={m.key} className="timeline-header month-label">
                  {m.short}
                </div>
              ))}

              {/* Tier Sections */}
              {tiers.map((tier) => {
                const info = tierRowInfo[tier.name];
                return (
                  <React.Fragment key={tier.name}>
                    <div
                      className="timeline-tier-cell"
                      style={{ gridRow: `span ${info.numRows}` }}
                    >
                      <div className="tier-accent-bar" style={{ backgroundColor: tier.color }}></div>
                      <div className="tier-name-wrapper">
                        {tier.name.includes("Local Campaigns") ? (
                          <div className="local-tier-label">
                            <span className="plus-icon">+</span> {tier.name}
                          </div>
                        ) : (
                          <div className="tier-name-text">{tier.name}</div>
                        )}
                      </div>
                    </div>

                    {Array.from({ length: info.numRows }).map((_, rowIdx) => (
                      <React.Fragment key={`${tier.name}-row-${rowIdx}`}>
                        {months.map((m, mIdx) => (
                          <div
                            key={`${tier.name}-${rowIdx}-${m.key}`}
                            className="timeline-month-cell"
                            style={{
                              gridRow: info.startRow + rowIdx,
                              gridColumn: mIdx + 2
                            }}
                          ></div>
                        ))}
                      </React.Fragment>
                    ))}

                    {info.campaignRows.map((row, rowIdx) =>
                      row.map((event) => {
                        const start = new Date(event.startDate);
                        const end = new Date(event.endDate);
                        const dateString = start.getMonth() === end.getMonth() && start.getDate() === end.getDate()
                          ? `${start.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`
                          : `${start.toLocaleString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`;

                        return (
                          <div
                            key={event.id}
                            className="campaign-bar"
                            style={{
                              gridColumn: getCampaignPosition(event),
                              gridRow: info.startRow + rowIdx,
                              backgroundColor: tier.color,
                              zIndex: 2
                            }}
                          >
                            <div className="campaign-bar-content">
                              <span className="calendar-campaign-title">{event.title}</span>
                              <span className="calendar-campaign-date">{dateString}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="supporting-note glass">
            <p><strong>Note:</strong> Dates may vary by region. Final timing should always be confirmed during regional ticket review.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
