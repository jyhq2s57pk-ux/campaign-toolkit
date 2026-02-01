import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AdminComponents.css';

export default function InsightPagesAdmin() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingPage, setEditingPage] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('insight_pages')
        .select('*')
        .order('campaign_id');

      if (error) throw error;

      setPages(data || []);
    } catch (err) {
      console.error('Error fetching insight pages:', err);
      setMessage({ type: 'error', text: 'Error loading insight pages' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingPage.id) {
        // Update existing
        const { error } = await supabase
          .from('insight_pages')
          .update({
            title: editingPage.title,
            subtitle: editingPage.subtitle,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPage.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Insight page updated successfully!' });
      } else {
        // Create new
        const { error } = await supabase
          .from('insight_pages')
          .insert({
            campaign_id: editingPage.campaign_id,
            title: editingPage.title,
            subtitle: editingPage.subtitle
          });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Insight page created successfully!' });
      }

      setEditingPage(null);
      fetchPages();
    } catch (err) {
      console.error('Error saving insight page:', err);
      setMessage({ type: 'error', text: 'Error saving insight page: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this insight page?')) return;

    try {
      const { error } = await supabase
        .from('insight_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Insight page deleted successfully!' });
      fetchPages();
    } catch (err) {
      console.error('Error deleting insight page:', err);
      setMessage({ type: 'error', text: 'Error deleting insight page: ' + err.message });
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading insight pages...</div>;
  }

  return (
    <div className="insight-pages-admin-section">
      <div className="admin-section-header">
        <h2>Insight Pages Management</h2>
        <p className="section-description">
          Manage insight page titles and subtitles for each campaign.
        </p>
      </div>

      {message && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="pages-list">
        {pages.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No insight pages yet</h3>
            <p>Add your first insight page to get started.</p>
          </div>
        ) : (
          <ul className="admin-list">
            {pages.map((page) => (
              <li key={page.id} className="admin-list-item">
                <div className="admin-list-item-content">
                  <div className="admin-list-item-title">
                    {page.title}
                  </div>
                  <div className="admin-list-item-meta">
                    Campaign: {page.campaign_id}
                  </div>
                  {page.subtitle && (
                    <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {page.subtitle.substring(0, 100)}{page.subtitle.length > 100 ? '...' : ''}
                    </div>
                  )}
                </div>
                <div className="admin-list-item-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setEditingPage({ ...page })}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => handleDelete(page.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          className="btn-primary"
          style={{ marginTop: '1rem' }}
          onClick={() => setEditingPage({
            campaign_id: '',
            title: '',
            subtitle: ''
          })}
        >
          Add New Insight Page
        </button>
      </div>

      {editingPage && (
        <div className="modal-overlay" onClick={() => setEditingPage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingPage.id ? 'Edit Insight Page' : 'Add New Insight Page'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="page-campaign-id">Campaign ID *</label>
                <input
                  type="text"
                  id="page-campaign-id"
                  value={editingPage.campaign_id}
                  onChange={(e) => setEditingPage({ ...editingPage, campaign_id: e.target.value })}
                  required
                  disabled={!!editingPage.id}
                  placeholder="e.g., campaign-2026"
                />
                {editingPage.id && (
                  <small className="form-help">Cannot change campaign ID for existing page</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="page-title">Title *</label>
                <input
                  type="text"
                  id="page-title"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  required
                  placeholder="e.g., Insights & Performance"
                />
              </div>

              <div className="form-group">
                <label htmlFor="page-subtitle">Subtitle</label>
                <textarea
                  id="page-subtitle"
                  value={editingPage.subtitle || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
                  rows="3"
                  placeholder="Brief description (supports line breaks)"
                />
                <small className="form-help">Optional. Line breaks will be preserved.</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Page'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingPage(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-info-box" style={{ marginTop: '2rem' }}>
        <h3>What gets updated?</h3>
        <ul>
          <li><strong>Insights Page:</strong> Title and subtitle appear at the top of the insights page</li>
          <li><strong>Campaign Specific:</strong> Each campaign can have its own insight page settings</li>
          <li><strong>Fallback:</strong> If no page exists, hardcoded defaults are shown</li>
        </ul>
      </div>
    </div>
  );
}
