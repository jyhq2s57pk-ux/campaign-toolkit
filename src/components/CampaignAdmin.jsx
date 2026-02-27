import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import ImageUpload from './ImageUpload';
import './AdminComponents.css';

const EMPTY_FORM = {
  id: '',
  name: '',
  subtitle: '',
  year: '',
  scope: '',
  channels: '',
  activation_start_date: '',
  activation_end_date: '',
  activation_dates: '',
  overview: '',
  hero_image_url: '',
  primary_color: '#8F53F0',
  features: [],
  modules: {}
};

const DEFAULT_MODULES = {
  omnichannel_hero: true,
  insights_charts: true,
  insights_bento: true,
  ways_of_working_tips: true,
  page_calendar: true,
  page_resources: true
};

const MODULE_LABELS = {
  page_calendar: { label: 'Calendar Page', group: 'Pages' },
  page_resources: { label: 'Resources Page', group: 'Pages' },
  omnichannel_hero: { label: 'Omnichannel Hero Banner', group: 'Sections' },
  insights_bento: { label: 'Insights Bento Grid', group: 'Sections' },
  insights_charts: { label: 'Insights Charts', group: 'Sections' },
  ways_of_working_tips: { label: 'Implementation Tips', group: 'Sections' }
};

export default function CampaignAdmin({ campaignId }) {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedId, setSelectedId] = useState(campaignId || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [duplicateFromId, setDuplicateFromId] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (campaignId && campaignId !== selectedId) {
      setSelectedId(campaignId);
    }
  }, [campaignId]);

  useEffect(() => {
    if (selectedId) {
      loadCampaign(selectedId);
    }
  }, [selectedId]);

  const fetchCampaigns = async () => {
    setLoading(true);
    const data = await api.getCampaigns();
    setCampaigns(data || []);
    // Auto-select if we have a campaignId prop or pick first
    if (!selectedId && data && data.length > 0) {
      const target = campaignId ? data.find(c => c.id === campaignId) : data[0];
      if (target) setSelectedId(target.id);
    }
    setLoading(false);
  };

  const loadCampaign = async (id) => {
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      populateForm(campaign);
      return;
    }
    // Fallback: fetch from API
    const data = await api.getCampaignById(id);
    if (data) populateForm(data);
  };

  const populateForm = (data) => {
    setFormData({
      id: data.id || '',
      name: data.name || '',
      subtitle: data.subtitle || '',
      year: data.year || '',
      scope: data.scope || '',
      channels: data.channels || '',
      activation_start_date: data.activation_start_date || '',
      activation_end_date: data.activation_end_date || '',
      activation_dates: data.activation_dates || '',
      overview: data.overview || '',
      hero_image_url: data.hero_image_url || '',
      primary_color: data.primary_color || '#8F53F0',
      features: data.features || [],
      modules: { ...DEFAULT_MODULES, ...(data.modules || {}) }
    });
    setShowCreateForm(false);
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectCampaign = (id) => {
    setSelectedId(id);
    setShowCreateForm(false);
  };

  const handleCreateNew = () => {
    // Duplicate from last campaign if available
    if (campaigns.length > 0) {
      const last = campaigns[0]; // Most recent
      setDuplicateFromId(last.id);
      setFormData({
        ...EMPTY_FORM,
        id: `campaign-new-${Date.now()}`,
        scope: last.scope || '',
        channels: last.channels || '',
        year: last.year || '',
        primary_color: '#8F53F0',
        modules: { ...DEFAULT_MODULES, ...(last.modules || {}) }
      });
    } else {
      setDuplicateFromId(null);
      setFormData({ ...EMPTY_FORM, id: `campaign-new-${Date.now()}` });
    }
    setSelectedId(null);
    setShowCreateForm(true);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Generate a clean ID for new campaigns
      let saveId = formData.id;
      if (showCreateForm) {
        saveId = 'campaign-' + formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') + '-' + formData.year;
      }

      const payload = {
        ...formData,
        id: saveId,
        features: formData.features || [],
        modules: formData.modules || {}
      };

      if (!supabase) {
        setMessage({ type: 'error', text: 'Database not connected. Cannot save.' });
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('campaigns')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;

      let dupMessage = '';

      // Duplicate related data if creating from an existing campaign
      if (showCreateForm && duplicateFromId) {
        const dupResult = await api.duplicateCampaignData(duplicateFromId, saveId);
        if (dupResult.copied.length > 0) {
          dupMessage = ` Copied ${dupResult.copied.length} item(s) from source campaign.`;
        }
        if (dupResult.errors.length > 0) {
          dupMessage += ` (${dupResult.errors.length} copy error(s))`;
        }
        setDuplicateFromId(null);
      }

      setMessage({
        type: 'success',
        text: (showCreateForm ? 'Campaign created!' : 'Campaign updated!') + dupMessage
      });

      if (showCreateForm) {
        setShowCreateForm(false);
        setSelectedId(saveId);
      }

      // Refresh list
      const freshData = await api.getCampaigns();
      setCampaigns(freshData || []);
    } catch (err) {
      console.error('Error saving campaign:', err);
      setMessage({ type: 'error', text: 'Error saving: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading campaigns...</div>;
  }

  return (
    <div className="campaign-admin-section">
      {/* Campaign Selector */}
      <div className="campaign-selector">
        <div className="campaign-selector-header">
          <h2>Campaigns</h2>
          <button className="btn-primary" onClick={handleCreateNew}>
            + New Campaign
          </button>
        </div>

        <div className="campaign-selector-list">
          {campaigns.map((c) => (
            <button
              key={c.id}
              className={`campaign-selector-item ${selectedId === c.id && !showCreateForm ? 'active' : ''}`}
              onClick={() => handleSelectCampaign(c.id)}
            >
              <span
                className="campaign-selector-dot"
                style={{ backgroundColor: c.primary_color || '#8F53F0' }}
              />
              <span className="campaign-selector-name">{c.name}</span>
              <span className="campaign-selector-year">{c.year}</span>
            </button>
          ))}
          {campaigns.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', padding: '1rem', margin: 0 }}>
              No campaigns yet. Create your first one.
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      {(selectedId || showCreateForm) && (
        <>
          <div className="admin-section-header" style={{ marginTop: '2rem' }}>
            <h2>{showCreateForm ? 'Create New Campaign' : 'Edit Campaign'}</h2>
            <p className="section-description">
              {showCreateForm
                ? `Fill in the details for your new campaign.${duplicateFromId ? ` Content will be duplicated from "${campaigns.find(c => c.id === duplicateFromId)?.name || duplicateFromId}".` : ''}`
                : 'Edit the campaign information displayed on the homepage and throughout the toolkit.'}
            </p>
          </div>

          {message && (
            <div className={`admin-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="campaign-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="name">Campaign Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Value Club"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="subtitle">Subtitle / Description</label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g., Ecommerce Trading Toolkits"
                />
              </div>

              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2026"
                />
              </div>

              <div className="form-group">
                <label htmlFor="primary_color">Brand Color</label>
                <div className="color-input-row">
                  <input
                    type="color"
                    id="primary_color_picker"
                    value={formData.primary_color || '#8F53F0'}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    id="primary_color"
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    placeholder="#8F53F0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="scope">Scope *</label>
                <input
                  type="text"
                  id="scope"
                  name="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Global"
                />
              </div>

              <div className="form-group">
                <label htmlFor="channels">Channels *</label>
                <input
                  type="text"
                  id="channels"
                  name="channels"
                  value={formData.channels}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Reserve & Collect (Web / APP)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="activation_start_date">Start Date *</label>
                <input
                  type="date"
                  id="activation_start_date"
                  name="activation_start_date"
                  value={formData.activation_start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="activation_end_date">End Date *</label>
                <input
                  type="date"
                  id="activation_end_date"
                  name="activation_end_date"
                  value={formData.activation_end_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="activation_dates">Activation Dates (Display Text)</label>
                <input
                  type="text"
                  id="activation_dates"
                  name="activation_dates"
                  value={formData.activation_dates}
                  onChange={handleChange}
                  placeholder="e.g., Jan 1st to March 31st 2026"
                />
                <small className="form-help">Optional custom display text.</small>
              </div>

              <div className="form-group full-width">
                <label htmlFor="overview">Overview</label>
                <textarea
                  id="overview"
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Campaign overview..."
                />
              </div>

              <div className="form-group full-width">
                <ImageUpload
                  label="Hero Image"
                  value={formData.hero_image_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, hero_image_url: url }))}
                  placeholder="Paste image URL or upload"
                  folder="campaigns"
                />
                <small className="form-help">Recommended: 600x400px</small>
              </div>
            </div>

            {/* Module Toggles */}
            <div className="modules-section">
              <h3 className="modules-heading">Visible Modules</h3>
              <p className="section-description">Toggle pages and sections on or off for this campaign.</p>
              {['Pages', 'Sections'].map(group => (
                <div key={group} className="modules-group">
                  <span className="modules-group-label">{group}</span>
                  <div className="modules-toggles">
                    {Object.entries(MODULE_LABELS)
                      .filter(([, v]) => v.group === group)
                      .map(([key, { label }]) => {
                        const modules = { ...DEFAULT_MODULES, ...formData.modules };
                        const isOn = modules[key] !== false;
                        return (
                          <label key={key} className="module-toggle">
                            <div
                              className={`admin-toggle-switch ${isOn ? 'active' : ''}`}
                              onClick={() =>
                                setFormData(prev => ({
                                  ...prev,
                                  modules: { ...DEFAULT_MODULES, ...prev.modules, [key]: !isOn }
                                }))
                              }
                            >
                              <div className="toggle-knob" />
                            </div>
                            <span className="module-toggle-label">{label}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : (showCreateForm ? 'Create Campaign' : 'Save Campaign')}
              </button>
              {!showCreateForm && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => loadCampaign(selectedId)}
                  disabled={saving}
                >
                  Reset
                </button>
              )}
              {showCreateForm && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    if (campaigns.length > 0) setSelectedId(campaigns[0].id);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
