import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AdminComponents.css';

export default function CampaignAdmin() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id: 'campaign-2026',
    name: '',
    subtitle: '',
    year: '',
    scope: '',
    channels: '',
    activation_start_date: '',
    activation_end_date: '',
    activation_dates: '',
    overview: '',
    hero_image_url: ''
  });

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', 'campaign-2026')
        .single();

      if (error) {
        console.error('Error fetching campaign:', error);
        setMessage({ type: 'error', text: 'Error loading campaign data' });
      } else if (data) {
        setCampaign(data);
        setFormData({
          id: data.id || 'campaign-2026',
          name: data.name || '',
          subtitle: data.subtitle || '',
          year: data.year || '',
          scope: data.scope || '',
          channels: data.channels || '',
          activation_start_date: data.activation_start_date || '',
          activation_end_date: data.activation_end_date || '',
          activation_dates: data.activation_dates || '',
          overview: data.overview || '',
          hero_image_url: data.hero_image_url || 'https://placehold.co/600x400'
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage({ type: 'error', text: 'Error loading campaign data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('campaigns')
        .upsert({
          ...formData,
          id: 'campaign-2026' // Ensure we're always updating the same campaign
        }, {
          onConflict: 'id'
        });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Campaign updated successfully!' });
      fetchCampaign(); // Refresh data
    } catch (err) {
      console.error('Error saving campaign:', err);
      setMessage({ type: 'error', text: 'Error saving campaign: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading campaign data...</div>;
  }

  return (
    <div className="campaign-admin-section">
      <div className="admin-section-header">
        <h2>Campaign Metadata</h2>
        <p className="section-description">
          Edit the core campaign information displayed on the homepage and throughout the toolkit.
        </p>
      </div>

      {message && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-grid">
          {/* Campaign Name */}
          <div className="form-group full-width">
            <label htmlFor="name">Campaign Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., The Magic of Joy Holiday Season"
            />
          </div>

          {/* Subtitle */}
          <div className="form-group full-width">
            <label htmlFor="subtitle">Subtitle / Description</label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="e.g., A global celebration bringing joy to travelers worldwide"
            />
          </div>

          {/* Year */}
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
            <small className="form-help">Used for display labels and export filenames</small>
          </div>

          {/* Scope */}
          <div className="form-group">
            <label htmlFor="scope">Scope *</label>
            <input
              type="text"
              id="scope"
              name="scope"
              value={formData.scope}
              onChange={handleChange}
              required
              placeholder="e.g., Global, Regional, Local"
            />
          </div>

          {/* Channels */}
          <div className="form-group full-width">
            <label htmlFor="channels">Channels *</label>
            <input
              type="text"
              id="channels"
              name="channels"
              value={formData.channels}
              onChange={handleChange}
              required
              placeholder="e.g., Reserve & Collect (Web / APP) Emporium"
            />
          </div>

          {/* Activation Dates - Structured */}
          <div className="form-group">
            <label htmlFor="activation_start_date">Activation Start Date *</label>
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
            <label htmlFor="activation_end_date">Activation End Date *</label>
            <input
              type="date"
              id="activation_end_date"
              name="activation_end_date"
              value={formData.activation_end_date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Activation Dates - Display Text */}
          <div className="form-group full-width">
            <label htmlFor="activation_dates">Activation Dates (Display Text)</label>
            <input
              type="text"
              id="activation_dates"
              name="activation_dates"
              value={formData.activation_dates}
              onChange={handleChange}
              placeholder="e.g., October-December 2025 (Activation date may vary by location)"
            />
            <small className="form-help">Optional custom display text. If empty, dates will be auto-formatted.</small>
          </div>

          {/* Overview */}
          <div className="form-group full-width">
            <label htmlFor="overview">Overview</label>
            <textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              rows="4"
              placeholder="Campaign overview and description..."
            />
          </div>

          {/* Hero Image URL */}
          <div className="form-group full-width">
            <label htmlFor="hero_image_url">Hero Image URL</label>
            <input
              type="text"
              id="hero_image_url"
              name="hero_image_url"
              value={formData.hero_image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg or /src/assets/hero.png"
            />
            <small className="form-help">URL or path to the hero image displayed on homepage (recommended: 600x400px)</small>
            {formData.hero_image_url && (
              <div style={{ marginTop: '0.5rem' }}>
                <img
                  src={formData.hero_image_url}
                  alt="Hero preview"
                  style={{
                    maxWidth: '200px',
                    height: 'auto',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Campaign'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={fetchCampaign}
            disabled={saving}
          >
            Reset
          </button>
        </div>
      </form>

      <div className="admin-info-box">
        <h3>What gets updated?</h3>
        <ul>
          <li><strong>Homepage:</strong> Campaign pill, hero card, title, and metadata</li>
          <li><strong>Export filenames:</strong> Year is used in calendar CSV exports</li>
          <li><strong>Display dates:</strong> Activation dates shown in hero card</li>
        </ul>
      </div>
    </div>
  );
}
