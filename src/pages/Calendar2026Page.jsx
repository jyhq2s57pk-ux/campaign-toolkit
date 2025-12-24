import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Calendar2026Page.css";

const STORAGE_KEY = "avolta_toolkit_calendar_v1";

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const idx = (k) => header.indexOf(k);

  const iTitle = idx("title");
  const iStart = idx("startDate");
  const iEnd = idx("endDate");
  const iTier = idx("tier");

  if ([iTitle, iStart, iEnd, iTier].some((i) => i < 0)) return [];

  return lines.slice(1).map((row, r) => {
    const cols = row.split(",").map((c) => c.trim());
    const tierRaw = cols[iTier];
    const tier = ["Tier 1", "Tier 2", "Tier 3"].includes(tierRaw) ? tierRaw : "Tier 2";
    return {
      id: `csv-${r}-${Date.now()}`,
      title: cols[iTitle] || "Untitled",
      startDate: cols[iStart],
      endDate: cols[iEnd],
      tier,
      status: "Planned",
    };
  });
}

function toCSV(items) {
  const header = "title,startDate,endDate,tier\n";
  const body = items.map((e) => `${e.title},${e.startDate},${e.endDate},${e.tier}`).join("\n");
  return header + body + "\n";
}

export default function Calendar2026Page() {
  const seeded = [
    { id: "ev-1", title: "Moments of Joy (2025)", startDate: "2026-01-01", endDate: "2026-12-31", tier: "Tier 1", status: "Planned" },
    { id: "ev-2", title: "Love your journey", startDate: "2026-04-01", endDate: "2026-04-30", tier: "Tier 1", status: "Planned" },
    { id: "ev-3", title: "Value Club / Summer (Southern Hemisphere)", startDate: "2026-01-01", endDate: "2026-03-31", tier: "Tier 2", status: "Planned" },
    { id: "ev-4", title: "Tasting Club", startDate: "2026-04-01", endDate: "2026-04-30", tier: "Tier 2", status: "Planned" },
    { id: "ev-5", title: "Summer Club", startDate: "2026-07-01", endDate: "2026-07-31", tier: "Tier 2", status: "Planned" },
    { id: "ev-6", title: "Festive Club", startDate: "2026-10-01", endDate: "2026-10-31", tier: "Tier 2", status: "Planned" },
    { id: "ev-7", title: "Mother's & Father's Day", startDate: "2026-03-01", endDate: "2026-03-31", tier: "Tier 2", status: "Planned" },
    { id: "ev-8", title: "Valentine's Day", startDate: "2026-02-14", endDate: "2026-02-14", tier: "Tier 3", status: "Planned" },
    { id: "ev-9", title: "Ramadan", startDate: "2026-02-17", endDate: "2026-03-19", tier: "Tier 3", status: "Planned" },
    { id: "ev-10", title: "Easter", startDate: "2026-04-02", endDate: "2026-04-03", tier: "Tier 3", status: "Planned" },
    { id: "ev-11", title: "Golden Week", startDate: "2026-10-01", endDate: "2026-10-07", tier: "Tier 3", status: "Planned" },
    { id: "ev-12", title: "Diwali", startDate: "2026-11-08", endDate: "2026-11-08", tier: "Tier 3", status: "Planned" },
    { id: "ev-13", title: "Champagne Festival", startDate: "2026-11-01", endDate: "2026-11-30", tier: "Tier 3", status: "Planned" },
    { id: "ev-14", title: "CNY", startDate: "2026-02-17", endDate: "2026-02-17", tier: "Tier 3", status: "Planned" },
    { id: "ev-15", title: "Sales", startDate: "2026-06-01", endDate: "2026-06-30", tier: "Tier 3", status: "Planned" },
    { id: "ev-16", title: "Black Friday", startDate: "2026-11-27", endDate: "2026-11-27", tier: "Tier 3", status: "Planned" },
    { id: "ev-17", title: "Blue Monday", startDate: "2026-01-19", endDate: "2026-01-19", tier: "Tier 3", status: "Planned" },
    { id: "ev-18", title: "Singles Day", startDate: "2026-11-11", endDate: "2026-11-11", tier: "Tier 3", status: "Planned" },
    { id: "ev-19", title: "Double 12", startDate: "2026-12-12", endDate: "2026-12-12", tier: "Tier 3", status: "Planned" },
    { id: "ev-20", title: "Best of 2025", startDate: "2026-01-01", endDate: "2026-01-31", tier: "Tier 2", status: "Planned" },
    { id: "ev-21", title: "Spring (Spring fragrances)", startDate: "2026-04-01", endDate: "2026-06-30", tier: "Tier 2", status: "Planned" },
    { id: "ev-22", title: "Back to Routine", startDate: "2026-08-01", endDate: "2026-09-30", tier: "Tier 2", status: "Planned" },
    { id: "ev-23", title: "Autumn", startDate: "2026-10-01", endDate: "2026-12-31", tier: "Tier 2", status: "Planned" },
    { id: "ev-24", title: "Carnival (BR)", startDate: "2026-02-13", endDate: "2026-02-18", tier: "Tier 3", status: "Planned" },
    { id: "ev-25", title: "Eid al adha (ME)", startDate: "2026-05-27", endDate: "2026-05-27", tier: "Tier 3", status: "Planned" },
    { id: "ev-26", title: "Moon Festival", startDate: "2026-09-25", endDate: "2026-09-25", tier: "Tier 3", status: "Planned" },
  ];

  const [events, setEvents] = useState([]);
  const [csvError, setCsvError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
        return;
      } catch {}
    }
    setEvents(seeded);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const months = useMemo(
    () => [
      { key: "01", label: "Jan" },
      { key: "02", label: "Feb" },
      { key: "03", label: "Mar" },
      { key: "04", label: "Apr" },
      { key: "05", label: "May" },
      { key: "06", label: "Jun" },
      { key: "07", label: "Jul" },
      { key: "08", label: "Aug" },
      { key: "09", label: "Sep" },
      { key: "10", label: "Oct" },
      { key: "11", label: "Nov" },
      { key: "12", label: "Dec" },
    ],
    []
  );

  const tiers = ["Tier 1", "Tier 2", "Tier 3"];

  const onImport = async (file) => {
    setCsvError(null);
    const text = await file.text();
    const parsed = parseCSV(text);
    if (!parsed.length) {
      setCsvError("Could not import CSV. Please use: title,startDate,endDate,tier");
      return;
    }
    setEvents(parsed);
  };

  const onExport = () => {
    const blob = new Blob([toCSV(events)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaign-calendar-2026.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="calendar-page">
      <Header />

      <main style={{ paddingTop: '56px' }}>
        <div className="page-header">
          <p className="page-subtitle">Ecom Trading Toolkit Template</p>
          <h1 className="page-title">Campaign calendar</h1>
        </div>

        <div className="calendar-main">
          <div className="import-card">
          <div className="import-info">
            <div>Use this as a lightweight planning view. Import a CSV to add or update campaign blocks.</div>
            <div className="import-format">CSV format: title,startDate,endDate,tier</div>
            {csvError ? <div className="import-error">{csvError}</div> : null}
          </div>

          <div className="import-actions">
            <label className="import-button">
              Import CSV
              <input
                type="file"
                accept=".csv,text/csv"
                className="file-input"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImport(f);
                }}
              />
            </label>

            <button onClick={onExport} className="export-button">
              Export CSV
            </button>

            <button onClick={() => setEvents(seeded)} className="reset-button">
              Reset
            </button>
          </div>
        </div>

        <div className="calendar-grid-container">
          <div className="calendar-grid">
            <div className="grid-header tier-header">Tier</div>
            {months.map((m) => (
              <div key={m.key} className="grid-header month-header">
                {m.label}
              </div>
            ))}

            {tiers.map((tier) => (
              <React.Fragment key={tier}>
                <div className="tier-cell">
                  <div className="tier-name">{tier}</div>
                  <div className="tier-status">Planned</div>
                </div>

                {months.map((m) => (
                  <div key={`${tier}-${m.key}`} className="event-cell">
                    {events
                      .filter((e) => e.tier === tier && e.startDate.slice(5, 7) <= m.key && e.endDate.slice(5, 7) >= m.key)
                      .slice(0, 2)
                      .map((e) => (
                        <div key={e.id + m.key} className="event-item">
                          <div className="event-title">{e.title}</div>
                          <div className="event-dates">{e.startDate} to {e.endDate}</div>
                          <div className="event-badge">{e.status}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </React.Fragment>
            ))}
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
