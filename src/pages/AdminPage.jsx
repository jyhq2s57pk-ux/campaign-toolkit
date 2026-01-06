import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import MarkerEditor from '../components/MarkerEditor';
import './AdminPage.css';
import JourneyAdmin from '../components/JourneyAdmin';
import ResourcesAdmin from '../components/ResourcesAdmin';

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
  const [activeTab, setActiveTab] = useState('touchpoints');
  const [touchpoints, setTouchpoints] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [csvError, setCsvError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    platform: '',
    description: '',
    tier_premium: false,
    tier_executive: false,
    is_new: false,
    is_optional: false,
    sort_order: 1,
    image_url: '',
    marker_positions: []
  });

  // Fetch touchpoints from Supabase
  const fetchTouchpoints = async () => {
    const { data, error } = await supabase
      .from('touchpoints')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching touchpoints:', error);
    } else {
      setTouchpoints(data || []);
    }
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

  useEffect(() => {
    fetchTouchpoints();
    fetchCalendarEvents();

    // Check for URL parameters
    const params = new URLSearchParams(window.location.search);
    const platformParam = params.get('platform');
    const showFormParam = params.get('showForm');

    if (platformParam) {
      setFormData(prev => ({ ...prev, platform: platformParam }));
    }
    if (showFormParam === 'true' || platformParam) {
      setShowForm(true);
      setActiveTab('touchpoints');
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingItem) {
      // Update existing
      const { error } = await supabase
        .from('touchpoints')
        .update(formData)
        .eq('id', editingItem.id);

      if (error) console.error('Error updating:', error);
    } else {
      // Create new
      const { error } = await supabase
        .from('touchpoints')
        .insert([formData]);

      if (error) console.error('Error creating:', error);
    }

    // Reset form
    setFormData({
      title: '',
      slug: '',
      platform: '',
      description: '',
      tier_premium: false,
      tier_executive: false,
      is_new: false,
      is_optional: false,
      sort_order: 1,
      image_url: '',
      marker_positions: []
    });
    setEditingItem(null);
    setShowForm(false);
    fetchTouchpoints();
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this touchpoint?')) {
      const { error } = await supabase
        .from('touchpoints')
        .delete()
        .eq('id', id);

      if (error) console.error('Error deleting:', error);
      fetchTouchpoints();
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `touchpoints/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('touchpoint-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('touchpoint-images')
        .getPublicUrl(filePath);

      // Update form data with image URL
      setFormData({ ...formData, image_url: publicUrl });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle CSV upload
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const data = results.data.map(row => ({
          title: row.title || row.Title,
          slug: row.slug || row.Slug,
          platform: row.platform || row.Platform,
          description: row.description || row.Description,
          tier_premium: row.tier_1 === 'Premium' || row.tier_premium === 'true',
          tier_executive: row.tier_2 === 'Executive' || row.tier_executive === 'true',
          is_new: row.is_new === 'TRUE' || row.is_new === 'true',
          is_optional: row.is_optional === 'TRUE' || row.is_optional === 'true',
          sort_order: parseInt(row.sortOrder || row.sort_order || 1)
        })).filter(item => item.title); // Filter out empty rows

        const { error } = await supabase
          .from('touchpoints')
          .insert(data);

        if (error) {
          console.error('Error uploading CSV:', error);
          alert('Error uploading CSV: ' + error.message);
        } else {
          alert(`Successfully uploaded ${data.length} touchpoints!`);
          fetchTouchpoints();
        }
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        alert('Error parsing CSV file');
      }
    });
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

        if (!confirm(`Found ${parsed.length} campaigns. This will REPLACE all existing calendar events. Continue?`)) {
          return;
        }

        console.log("Events to insert:", parsed);

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
          .insert(parsed.map(e => ({
            title: e.title,
            start_date: e.startDate,
            end_date: e.endDate,
            tier: e.tier
          })));

        if (error) {
          console.error('Error importing calendar:', error);
          alert('Error importing calendar: ' + error.message);
        } else {
          alert(`Successfully imported ${parsed.length} campaigns!`);
          fetchCalendarEvents();
        }
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        setCsvError('Error parsing CSV file: ' + error.message);
      }
    });
  };

  const handleCalendarExport = () => {
    const itemsToExport = calendarEvents.length > 0 ? calendarEvents.map(e => ({
      title: e.title,
      startDate: e.start_date,
      endDate: e.end_date,
      tier: e.tier
    })) : seededCalendarEvents;

    const blob = new Blob([calendarToCSV(itemsToExport)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaign-calendar-2026.csv";
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

  return (
    <div className="app">
      <Header />

      <main style={{ paddingTop: '56px' }}>
        <div className="admin-container inner-content-wrapper">
          <div className="admin-header">
            <h1>Admin</h1>
          </div>

          {/* Tab Navigation */}
          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === 'touchpoints' ? 'active' : ''}`}
              onClick={() => setActiveTab('touchpoints')}
            >
              Manage Touchpoints
            </button>
            <button
              className={`admin-tab ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              Manage Calendar
            </button>
            <button
              className={`admin-tab ${activeTab === 'journey' ? 'active' : ''}`}
              onClick={() => setActiveTab('journey')}
            >
              Journey Pages
            </button>
            <button
              className={`admin-tab ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </button>
          </div>

          {activeTab === 'resources' && <ResourcesAdmin />}

          {/* Touchpoints Tab */}
          {activeTab === 'touchpoints' && (
            <>
              <div className="admin-section-header">
                <h2>Touchpoint Management</h2>
                <div className="admin-actions">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (!showForm) {
                        setEditingItem(null);
                        setFormData({
                          title: '',
                          slug: '',
                          platform: '',
                          description: '',
                          tier_premium: false,
                          tier_executive: false,
                          is_new: false,
                          is_optional: false,
                          sort_order: touchpoints.length + 1,
                          image_url: '',
                          marker_positions: []
                        });
                      }
                      setShowForm(!showForm);
                    }}
                  >
                    {showForm ? 'Cancel' : '+ Add Touchpoint'}
                  </button>
                  <label className="btn-secondary">
                    Upload CSV
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <div className="admin-form-card">
                  <h2>{editingItem ? 'Edit Touchpoint' : 'Add New Touchpoint'}</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title *</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Slug</label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Platform *</label>
                        <input
                          type="text"
                          value={formData.platform}
                          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Sort Order</label>
                        <input
                          type="number"
                          value={formData.sort_order}
                          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="4"
                      />
                    </div>

                    <div className="form-group">
                      <label>Screenshot Image</label>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                          {uploading ? 'Uploading...' : 'Upload Image'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            disabled={uploading}
                          />
                        </label>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px', alignSelf: 'center' }}>
                          or paste URL below
                        </span>
                      </div>
                      <input
                        type="url"
                        value={formData.image_url || ''}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.image_url && (
                        <div style={{ marginTop: '10px' }}>
                          <img src={formData.image_url} alt="Preview" style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }} />
                        </div>
                      )}
                    </div>

                    <div className="form-checkboxes">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.tier_premium}
                          onChange={(e) => setFormData({ ...formData, tier_premium: e.target.checked })}
                        />
                        Premium
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.tier_executive}
                          onChange={(e) => setFormData({ ...formData, tier_executive: e.target.checked })}
                        />
                        Executive
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.is_new}
                          onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                        />
                        New
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.is_optional}
                          onChange={(e) => setFormData({ ...formData, is_optional: e.target.checked })}
                        />
                        Optional
                      </label>
                    </div>

                    <MarkerEditor
                      imageUrl={formData.image_url}
                      markers={formData.marker_positions || []}
                      onChange={(markers) => setFormData({ ...formData, marker_positions: markers })}
                    />

                    <button type="submit" className="btn-primary">
                      {editingItem ? 'Update' : 'Create'} Touchpoint
                    </button>
                  </form>
                </div>
              )}

              {/* Touchpoints List */}
              <div className="admin-list">
                <h2>Touchpoints ({touchpoints.length})</h2>
                <div className="touchpoints-table">
                  {touchpoints.map((item) => (
                    <div key={item.id} className="touchpoint-row">
                      <div className="touchpoint-info">
                        <h3>{item.title}</h3>
                        <p>{item.platform}</p>
                        <div className="touchpoint-badges">
                          {item.is_new && <span className="badge-new">New</span>}
                          {item.tier_premium && <span className="badge-premium">Premium</span>}
                          {item.tier_executive && <span className="badge-executive">Executive</span>}
                          {item.is_optional && <span className="badge-optional">Optional</span>}
                        </div>
                      </div>
                      <div className="touchpoint-actions">
                        <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Calendar Tab */}
          {activeTab === 'journey' && (
            <JourneyAdmin />
          )}

          {activeTab === 'calendar' && (
            <div className="calendar-admin-section">
              <div className="admin-section-header">
                <h2>Campaign Calendar Management</h2>
              </div>

              <div className="calendar-admin-card">
                <p className="calendar-admin-info">
                  Manage your 2026 campaign calendar data. Import/export campaigns as CSV or reset to defaults.
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
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
