import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import './AdminPage.css';
import CampaignAdmin from '../components/CampaignAdmin';
import WaysOfWorkingAdmin from '../components/WaysOfWorkingAdmin';
import OmnichannelIdeasAdmin from '../components/OmnichannelIdeasAdmin';
import JourneyAdmin from '../components/JourneyAdmin';
import ResourcesAdmin from '../components/ResourcesAdmin';
import InsightPagesAdmin from '../components/InsightPagesAdmin';

const STORAGE_KEY = "avolta_toolkit_calendar_v1";

// Calendar seeded data
const seededCalendarEvents = [
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

function calendarToCSV(items) {
  const header = "title,startDate,endDate,tier\n";
  const body = items.map((e) => `${e.title},${e.startDate},${e.endDate},${e.tier}`).join("\n");
  return header + body + "\n";
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('campaign');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [csvError, setCsvError] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [csvPreview, setCsvPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [creating, setCreating] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaignId');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Fetch calendar events from Supabase
  const fetchCalendarEvents = async () => {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events:', error);
    } else {
      setCalendarEvents(data || []);
    }
  };

  // Fetch all campaigns for dropdown (admin sees all, including hidden)
  const fetchAllCampaigns = async () => {
    const data = await api.getCampaigns({ includeHidden: true });
    setCampaigns(data || []);
  };

  // Fetch campaign data — use campaignId from URL if available
  const fetchCampaign = async () => {
    if (campaignId) {
      const data = await api.getCampaignById(campaignId);
      setCampaign(data);
      setCreating(false); // Exit create mode when a campaign is selected
    } else {
      setCampaign(null);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
    fetchAllCampaigns();
  }, []);

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const handleNewCampaign = () => {
    setCreating(true);
    setActiveTab('campaign');
  };

  const handleCampaignSelect = (e) => {
    const id = e.target.value;
    if (id) {
      navigate(`/admin?campaignId=${id}`);
    }
  };

  // Calendar management functions
  // Helper to validate and normalize tier
  const normalizeTier = (rawTier) => {
    const t = rawTier ? rawTier.trim() : "";

    // Direct mappings from CSV/Excel to Database Tier Names
    const map = {
      "Overarching Campaign": "Overarching Campaign",
      "Category-Led": "Category-Led",
      "Omnichannel Campaigns": "Campaigns", // map to DB
      "Digital Campaigns": "Other Global Campaigns", // map to DB
      "Local Campaigns (supported by Global)": "Other Local Campaigns", // map to DB
      "Local Campaigns": "Other Local Campaigns"
    };

    if (map[t]) return map[t];

    // Fallback/Validation
    const validDbTiers = Object.values(map);
    return validDbTiers.includes(t) ? t : "Other Global Campaigns";
  };

  const handleCalendarImport = (file) => {
    setCsvError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy', // Better than true for whitespace lines
      transformHeader: (h) => h.trim().replace(/^\uFEFF/, ''), // Remove BOM and trim
      complete: async (results) => {
        console.log("CSV Parse Results:", results);

        if (results.errors.length > 0) {
          console.warn("CSV Parse Errors:", results.errors);
        }

        if (!results.data || results.data.length === 0) {
          setCsvError("Could not import CSV. File appears to be empty.");
          return;
        }

        const normalizeDate = (val) => {
          if (!val) return null;
          const v = val.trim();
          // if already YYYY-MM-DD, keep it.
          if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

          // Try parsing
          const d = new Date(v);
          if (!isNaN(d.getTime())) {
            // Note: This returns UTC date part. 
            // If user inputs '1/1/2026', local time might be 2026-01-01 00:00:00 local. 
            // But .toISOString() is UTC. For simple date strings without time, this is usually acceptable 
            // or safer to just simplistic format if needed. 
            return d.toISOString().split('T')[0];
          }
          return v;
        };

        const parsed = results.data.map((row, index) => {
          // flexible key matching
          const getVal = (keyCandidates) => {
            for (const k of keyCandidates) {
              if (row[k] !== undefined) return row[k];
            }
            // Case-insensitive fallback
            const rowKeys = Object.keys(row);
            for (const k of keyCandidates) {
              const found = rowKeys.find(rk => rk.toLowerCase() === k.toLowerCase());
              if (found) return row[found];
            }
            return undefined;
          };

          const title = getVal(['title', 'Title', 'Campaign Name']);
          const startDate = getVal(['startDate', 'startdate', 'Start Date', 'start_date']);
          const endDate = getVal(['endDate', 'enddate', 'End Date', 'end_date']);
          const tierRaw = getVal(['tier', 'Tier', 'Category']) || "Digital Campaigns";

          // Log invalid rows for debugging
          if (!title || !startDate || !endDate) {
            console.warn(`Row ${index + 1} missing data:`, row);
          }

          return {
            title: title ? title.trim() : null,
            startDate: normalizeDate(startDate),
            endDate: normalizeDate(endDate),
            tier: normalizeTier(tierRaw ? tierRaw.trim() : ""),
            status: "Planned"
          };
        }).filter(e => e.title && e.startDate && e.endDate); // Filter invalid rows

        if (parsed.length === 0) {
          setCsvError("No valid events found. Please check CSV format. Valid headers: title, startDate, endDate.");
          return;
        }

        // Show preview instead of immediately importing
        setCsvPreview(parsed);
        setShowPreview(true);
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        setCsvError('Error parsing CSV file: ' + error.message);
      }
    });
  };

  const handleConfirmImport = async () => {
    if (!csvPreview || csvPreview.length === 0) return;

    try {
      // 1. Delete all existing events to avoid ID collisions and duplicates
      const { error: deleteError } = await supabase
        .from('calendar_events')
        .delete()
        .gt('id', 0); // Assuming positive integer IDs

      if (deleteError) {
        console.error('Error clearing calendar:', deleteError);
        alert('Error clearing existing calendar: ' + deleteError.message);
        return;
      }

      // 2. Insert new events
      const { error } = await supabase
        .from('calendar_events')
        .insert(csvPreview.map(e => ({
          title: e.title,
          start_date: e.startDate,
          end_date: e.endDate,
          tier: e.tier
        })));

      if (error) {
        console.error('Error importing calendar:', error);
        alert('Error importing calendar: ' + error.message);
      } else {
        alert(`Successfully imported ${csvPreview.length} campaigns!`);
        setShowPreview(false);
        setCsvPreview(null);
        fetchCalendarEvents();
      }
    } catch (err) {
      console.error('Import error:', err);
      alert('Error importing calendar: ' + err.message);
    }
  };

  const handleCancelImport = () => {
    setShowPreview(false);
    setCsvPreview(null);
    setCsvError(null);
  };

  const handleCalendarExport = () => {
    const itemsToExport = calendarEvents.length > 0 ? calendarEvents.map(e => ({
      title: e.title,
      startDate: e.start_date,
      endDate: e.end_date,
      tier: e.tier
    })) : seededCalendarEvents;

    const year = campaign?.year || '2026';
    const blob = new Blob([calendarToCSV(itemsToExport)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-calendar-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCalendarReset = async () => {
    if (confirm('Are you sure you want to reset the calendar to default campaigns? This will delete all current campaigns.')) {
      // First delete all
      const { error: deleteError } = await supabase
        .from('calendar_events')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) {
        console.error('Error resetting calendar:', deleteError);
        return;
      }

      const { error: insertError } = await supabase
        .from('calendar_events')
        .insert(seededCalendarEvents.map(e => ({
          title: e.title,
          start_date: e.startDate,
          end_date: e.endDate,
          tier: e.tier
        })));

      if (insertError) {
        console.error('Error seeding calendar:', insertError);
      } else {
        alert('Calendar reset to defaults!');
        fetchCalendarEvents();
      }
    }
  };

  // Whether to show admin content (tabs + panels)
  const showAdminContent = !!campaignId || creating;

  return (
    <div className="admin-page-wrapper">
      <Header />

      <main style={{ paddingTop: '56px' }}>
        <div className="admin-container inner-content-wrapper">
          {/* Page Header — Figma 883:39169 */}
          <div className="admin-header">
            <h1 className="admin-title">Admin</h1>
            <div className="admin-header-meta">
              {user && (
                <p className="admin-logged-in">
                  Logged in as: {user.email}
                </p>
              )}
              <button onClick={handleSignOut} className="admin-signout-btn">
                Sign Out
              </button>
            </div>
          </div>

          {/* Campaign Toolbar — Figma 883:40739 */}
          <div className="admin-campaign-toolbar">
            <div className="admin-campaign-toolbar-left">
              <h2 className="admin-campaign-toolbar-heading">Campaigns</h2>
              <div className="admin-campaign-select-wrap">
                <select
                  className="admin-campaign-select"
                  value={campaignId || ''}
                  onChange={handleCampaignSelect}
                >
                  <option value="" disabled>Select</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.is_visible === false ? ' (Hidden)' : ''}
                    </option>
                  ))}
                </select>
                <svg className="admin-campaign-select-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <button className="admin-new-campaign-btn" onClick={handleNewCampaign}>
              + New Campaign
            </button>
          </div>

          {/* Admin Content — only when campaign selected or creating */}
          {showAdminContent && (
            <>
              {/* Tab Navigation */}
              <div className="admin-tabs">
                <button
                  className={activeTab === 'campaign' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setActiveTab('campaign')}
                >
                  Campaign
                </button>
                <button
                  className={activeTab === 'wow' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setActiveTab('wow')}
                >
                  Ways of Working
                </button>
                <button
                  className={activeTab === 'omnichannel' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setActiveTab('omnichannel')}
                >
                  Omnichannel Ideas
                </button>
                <button
                  className={activeTab === 'journey' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setActiveTab('journey')}
                >
                  Customer Touchpoints
                </button>
                <button
                  className={activeTab === 'calendar' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setActiveTab('calendar')}
                >
                  Manage Calendar
                </button>
                <button
                  className={activeTab === 'resources' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setActiveTab('resources')}
                >
                  Resources
                </button>
                <button
                  className={activeTab === 'insights' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setActiveTab('insights')}
                >
                  Insight Pages
                </button>
              </div>

              {/* Campaign Tab */}
              {activeTab === 'campaign' && (
                <CampaignAdmin
                  campaignId={campaign?.id}
                  startInCreateMode={creating}
                  onCampaignCreated={(newId) => {
                    setCreating(false);
                    fetchAllCampaigns();
                    navigate(`/admin?campaignId=${newId}`);
                  }}
                  onVisibilityChanged={() => {
                    fetchAllCampaigns();
                  }}
                />
              )}

              {/* Ways of Working Tab */}
              {activeTab === 'wow' && <WaysOfWorkingAdmin campaignId={campaignId} />}

              {/* Omnichannel Ideas Tab */}
              {activeTab === 'omnichannel' && <OmnichannelIdeasAdmin />}

              {/* Journey Tab */}
              {activeTab === 'journey' && <JourneyAdmin campaignId={campaignId} />}

              {/* Resources Tab */}
              {activeTab === 'resources' && <ResourcesAdmin />}

              {/* Insight Pages Tab */}
              {activeTab === 'insights' && <InsightPagesAdmin />}

              {activeTab === 'calendar' && (
                <div className="calendar-admin-section">
                  <div className="admin-section-header">
                    <h2>Campaign Calendar Management</h2>
                  </div>

                  <div className="calendar-admin-card">
                    <p className="calendar-admin-info">
                      Manage your {campaign?.year || '2026'} campaign calendar data. Import/export campaigns as CSV or reset to defaults.
                    </p>
                    {csvError && <div className="import-error">{csvError}</div>}

                    <div className="calendar-admin-actions">
                      <label className="btn-primary">
                        Import CSV
                        <input
                          type="file"
                          accept=".csv,text/csv"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleCalendarImport(f);
                          }}
                        />
                      </label>

                      <button onClick={handleCalendarExport} className="btn-secondary">
                        Export CSV
                      </button>

                      <button onClick={handleCalendarReset} className="btn-secondary">
                        Reset to Defaults
                      </button>
                    </div>

                    <div className="calendar-admin-help">
                      <h3>CSV Format</h3>
                      <code>title,startDate,endDate,tier</code>
                      <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Valid tiers: Overarching Campaign, Category-Led, Omnichannel Campaigns, Digital Campaigns, Local Campaigns (supported by Global)
                      </p>
                    </div>

                    {/* CSV Preview Modal */}
                    {showPreview && csvPreview && (
                      <div className="modal-overlay" onClick={handleCancelImport}>
                        <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
                          <h3>CSV Import Preview</h3>

                          <div className="admin-message info">
                            <strong>Warning:</strong> This will replace ALL {calendarEvents.length} existing calendar events with {csvPreview.length} new events from the CSV.
                          </div>

                          <div style={{ marginBottom: '1rem' }}>
                            <p><strong>Preview of events to import:</strong></p>
                            <div style={{
                              maxHeight: '400px',
                              overflowY: 'auto',
                              background: 'rgba(0,0,0,0.2)',
                              padding: '1rem',
                              borderRadius: '6px',
                              marginTop: '0.5rem'
                            }}>
                              <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Title</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Start</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>End</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Tier (Normalized)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {csvPreview.map((event, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                      <td style={{ padding: '0.5rem' }}>{event.title}</td>
                                      <td style={{ padding: '0.5rem' }}>{event.startDate}</td>
                                      <td style={{ padding: '0.5rem' }}>{event.endDate}</td>
                                      <td style={{ padding: '0.5rem' }}>
                                        <span style={{
                                          background: 'rgba(139, 92, 246, 0.2)',
                                          padding: '2px 8px',
                                          borderRadius: '4px',
                                          fontSize: '0.85em'
                                        }}>
                                          {event.tier}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="admin-info-box" style={{ marginTop: '1rem' }}>
                            <h3>Tier Mapping Applied:</h3>
                            <ul style={{ fontSize: '0.85rem' }}>
                              <li>"Omnichannel Campaigns" → "Campaigns"</li>
                              <li>"Digital Campaigns" → "Other Global Campaigns"</li>
                              <li>"Local Campaigns (supported by Global)" → "Other Local Campaigns"</li>
                            </ul>
                          </div>

                          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                            <button
                              className="btn-secondary"
                              onClick={handleCalendarExport}
                              style={{ marginRight: 'auto' }}
                            >
                              Export Current Events (Backup)
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={handleCancelImport}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn-primary"
                              onClick={handleConfirmImport}
                            >
                              Confirm Import
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
