import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from './ImageUpload';
import './AdminComponents.css';

const EMPTY_BLOCK = { title: '', body: '', image_url: '' };

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
      const payload = {
        title: editingPage.title,
        subtitle: editingPage.subtitle,
        content_blocks: editingPage.content_blocks || [],
        updated_at: new Date().toISOString()
      };

      if (editingPage.id) {
        const { error } = await supabase
          .from('insight_pages')
          .update(payload)
          .eq('id', editingPage.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Insight page updated!' });
      } else {
        const { error } = await supabase
          .from('insight_pages')
          .insert({ ...payload, campaign_id: editingPage.campaign_id });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Insight page created!' });
      }

      setEditingPage(null);
      fetchPages();
    } catch (err) {
      console.error('Error saving insight page:', err);
      setMessage({ type: 'error', text: 'Error saving: ' + err.message });
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
      setMessage({ type: 'success', text: 'Insight page deleted!' });
      fetchPages();
    } catch (err) {
      console.error('Error deleting insight page:', err);
      setMessage({ type: 'error', text: 'Error deleting: ' + err.message });
    }
  };

  const addBlock = () => {
    const blocks = editingPage.content_blocks || [];
    if (blocks.length >= 4) {
      setMessage({ type: 'error', text: 'Maximum 4 content blocks allowed.' });
      return;
    }
    setEditingPage({
      ...editingPage,
      content_blocks: [...blocks, { ...EMPTY_BLOCK }]
    });
  };

  const updateBlock = (index, field, value) => {
    const blocks = [...(editingPage.content_blocks || [])];
    blocks[index] = { ...blocks[index], [field]: value };
    setEditingPage({ ...editingPage, content_blocks: blocks });
  };

  const removeBlock = (index) => {
    const blocks = [...(editingPage.content_blocks || [])];
    blocks.splice(index, 1);
    setEditingPage({ ...editingPage, content_blocks: blocks });
  };

  if (loading) {
    return <div className="admin-loading">Loading insight pages...</div>;
  }

  return (
    <div className="insight-pages-admin-section">
      <div className="admin-section-header">
        <h2>Insight Pages Management</h2>
        <p className="section-description">
          Manage insight page content blocks for each campaign. Up to 4 blocks per page.
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
                  <div className="admin-list-item-title">{page.title}</div>
                  <div className="admin-list-item-meta">
                    Campaign: {page.campaign_id}
                    {' · '}
                    {(page.content_blocks || []).length} content block(s)
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button className="btn-secondary" onClick={() => setEditingPage({
                    ...page,
                    content_blocks: page.content_blocks || []
                  })}>
                    Edit
                  </button>
                  <button className="btn-secondary" onClick={() => handleDelete(page.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          className="btn-primary btn-mt"
          onClick={() => setEditingPage({
            campaign_id: '',
            title: 'Insights & Performance',
            subtitle: '',
            content_blocks: []
          })}
        >
          Add New Insight Page
        </button>
      </div>

      {editingPage && (
        <div className="modal-overlay" onClick={() => setEditingPage(null)}>
          <div className="modal-content modal-content-wide" onClick={(e) => e.stopPropagation()}>
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
                  placeholder="e.g., campaign-value-club-2026"
                />
              </div>

              <div className="form-group">
                <label htmlFor="page-title">Page Title *</label>
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
                  rows="2"
                  placeholder="Brief description"
                />
              </div>

              {/* Content Blocks */}
              <div className="content-blocks-section">
                <div className="content-blocks-header">
                  <h4>
                    Content Blocks ({(editingPage.content_blocks || []).length}/4)
                  </h4>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={addBlock}
                    disabled={(editingPage.content_blocks || []).length >= 4}
                  >
                    + Add Block
                  </button>
                </div>

                {(editingPage.content_blocks || []).map((block, i) => (
                  <div key={i} className="content-block-editor">
                    <div className="block-editor-header">
                      <span className="block-editor-label">Block {i + 1}</span>
                      <button type="button" className="btn-secondary btn-remove-block" onClick={() => removeBlock(i)}>
                        Remove
                      </button>
                    </div>

                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={block.title || ''}
                        onChange={(e) => updateBlock(i, 'title', e.target.value)}
                        placeholder="Block heading"
                      />
                    </div>

                    <div className="form-group">
                      <label>Body</label>
                      <textarea
                        value={block.body || ''}
                        onChange={(e) => updateBlock(i, 'body', e.target.value)}
                        rows="3"
                        placeholder="Block content text..."
                      />
                    </div>

                    <ImageUpload
                      label="Block Image (optional)"
                      value={block.image_url || ''}
                      onChange={(url) => updateBlock(i, 'image_url', url)}
                      placeholder="Paste image URL or upload"
                      folder="insights"
                    />
                  </div>
                ))}

                {(editingPage.content_blocks || []).length === 0 && (
                  <p className="content-blocks-empty">
                    No content blocks yet. Add up to 4 blocks with title, text, and optional image.
                  </p>
                )}
              </div>

              <div className="form-actions form-actions-mt">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Page'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setEditingPage(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
