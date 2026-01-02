import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import "./CalendarPage.css";

const STORAGE_KEY = "avolta_toolkit_calendar_v1";

export default function CalendarPage() {
  const seeded = [
    // Overarching Campaign
    { id: "ov-1", title: "Moments of Joy (2025)", startDate: "2025-01-01", endDate: "2025-12-31", tier: "Overarching Campaign", status: "Planned" },
    { id: "ov-2", title: "Love your journey", startDate: "2025-04-01", endDate: "2025-12-31", tier: "Overarching Campaign", status: "Planned" },

    // Category-Led
    { id: "cat-1", title: "Value Club / Summer (Southern Hemisphere)", startDate: "2025-01-01", endDate: "2025-03-31", tier: "Category-Led", status: "Planned" },
    { id: "cat-2", title: "Tasting Club", startDate: "2025-04-01", endDate: "2025-04-30", tier: "Category-Led", status: "Planned" },
    { id: "cat-3", title: "Summer Club", startDate: "2025-07-01", endDate: "2025-07-31", tier: "Category-Led", status: "Planned" },
    { id: "cat-4", title: "Festive Club", startDate: "2025-10-01", endDate: "2025-10-31", tier: "Category-Led", status: "Planned" },

    // Omnichannel Campaigns
    { id: "omni-1", title: "Valentine's Day", startDate: "2025-02-14", endDate: "2025-02-14", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "omni-2", title: "Mother's & Father's Day", startDate: "2025-03-01", endDate: "2025-03-31", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "omni-3", title: "Easter", startDate: "2025-04-02", endDate: "2025-04-03", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "omni-4", title: "Sales", startDate: "2025-06-01", endDate: "2025-06-30", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "omni-5", title: "Golden Week", startDate: "2025-10-01", endDate: "2025-10-07", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "omni-6", title: "Diwali", startDate: "2025-11-08", endDate: "2025-11-08", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "omni-7", title: "Ramadan", startDate: "2025-02-17", endDate: "2025-03-19", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "omni-8", title: "CNY", startDate: "2025-02-17", endDate: "2025-02-17", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "omni-9", title: "Champagne Festival", startDate: "2025-11-01", endDate: "2025-11-30", tier: "Omnichannel Campaigns", status: "Planned" },
    { id: "omni-10", title: "Black Friday", startDate: "2025-11-27", endDate: "2025-11-27", tier: "Omnichannel Campaigns", status: "Planned" },

    // Digital Campaigns
    { id: "dig-1", title: "Blue Monday", startDate: "2025-01-19", endDate: "2025-01-19", tier: "Digital Campaigns", status: "Planned" },
    { id: "dig-2", title: "Spring (Spring fragrances)", startDate: "2025-04-01", endDate: "2025-06-30", tier: "Digital Campaigns", status: "Planned" },
    { id: "dig-3", title: "Back to Routine", startDate: "2025-08-01", endDate: "2025-09-30", tier: "Digital Campaigns", status: "Planned" },
    { id: "dig-4", title: "Autumn", startDate: "2025-10-01", endDate: "2025-12-31", tier: "Digital Campaigns", status: "Planned" },
    { id: "dig-5", title: "Best of 2025", startDate: "2025-01-01", endDate: "2025-01-31", tier: "Digital Campaigns", status: "Planned" },
    { id: "dig-6", title: "Singles Day", startDate: "2025-11-11", endDate: "2025-11-11", tier: "Digital Campaigns", status: "Planned" },
    { id: "dig-7", title: "Double 12", startDate: "2025-12-12", endDate: "2025-12-12", tier: "Digital Campaigns", status: "Planned" },

    // Local Campaigns
    { id: "loc-1", title: "Carnival (BR)", startDate: "2025-02-13", endDate: "2025-02-18", tier: "Local Campaigns (supported by Global)", status: "Planned" },
    { id: "loc-2", title: "Eid al adha (ME)", startDate: "2025-05-27", endDate: "2025-05-27", tier: "Local Campaigns (supported by Global)", status: "Planned" },
    { id: "loc-3", title: "Moon Festival", startDate: "2025-09-25", endDate: "2025-09-25", tier: "Local Campaigns (supported by Global)", status: "Planned" },
  ];

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;

      // For now, prioritize the seeded data to match the design precisely as requested
      // If we want to merge with DB, we'd do it differently
      setEvents(seeded);

      /* 
      if (data && data.length > 0) {
        setEvents(data.map(e => ({
          id: e.id,
          title: e.title,
          startDate: e.start_date,
          endDate: e.end_date,
          tier: e.tier,
          status: e.status
        })));
      } else {
        setEvents(seeded);
      }
      */
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents(seeded);
    } finally {
      setLoading(false);
    }
  };

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

  const tiers = [
    { name: "Overarching Campaign", color: "#E9B1F2" },
    { name: "Category-Led", color: "#57D9A3" },
    { name: "Omnichannel Campaigns", color: "#B5A6F2" },
    { name: "Digital Campaigns", color: "#FCD6A8" },
    { name: "Local Campaigns (supported by Global)", color: "#D4D4D8" },
  ];

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
