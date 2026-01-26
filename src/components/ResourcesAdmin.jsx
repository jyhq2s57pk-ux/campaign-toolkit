import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AdminComponents.css';

export default function ResourcesAdmin() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  const categories = [
    "Visual Assets", "Copy & Messaging", "Templates", "Creative",
    "Content", "Product", "Brand", "Technical", "Social Media"
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('sort_order');

      if (error) throw error;

      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setMessage({ type: 'error', text: 'Error loading resources' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingResource.id) {
        // Update existing
        const { error } = await supabase
          .from('resources')
          .update({
            title: editingResource.title,
            category: editingResource.category,
            description: editingResource.description,
            thumbnail_url: editingResource.thumbnail_url,
            cta_label: editingResource.cta_label,
            cta_url: editingResource.cta_url,
            sort_order: editingResource.sort_order,
            active: editingResource.active,
            campaign_id: editingResource.campaign_id || null
          })
          .eq('id', editingResource.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Resource updated successfully!' });
      } else {
        // Create new
        const { error } = await supabase
          .from('resources')
          .insert({
            title: editingResource.title,
            category: editingResource.category,
            description: editingResource.description,
            thumbnail_url: editingResource.thumbnail_url,
            cta_label: editingResource.cta_label,
            cta_url: editingResource.cta_url,
            sort_order: editingResource.sort_order,
            active: editingResource.active,
            campaign_id: editingResource.campaign_id || null
          });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Resource created successfully!' });
      }

      setEditingResource(null);
      fetchResources();
    } catch (err) {
      console.error('Error saving resource:', err);
      setMessage({ type: 'error', text: 'Error saving resource: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Resource deleted successfully!' });
      fetchResources();
    } catch (err) {
      console.error('Error deleting resource:', err);
      setMessage({ type: 'error', text: 'Error deleting resource: ' + err.message });
    }
  };

  const handleToggleActive = async (resource) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ active: !resource.active })
        .eq('id', resource.id);

      if (error) throw error;

      setMessage({ type: 'success', text: `Resource ${!resource.active ? 'activated' : 'deactivated'}!` });
      fetchResources();
    } catch (err) {
      console.error('Error toggling resource:', err);
      setMessage({ type: 'error', text: 'Error updating resource: ' + err.message });
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading resources...</div>;
  }

  return (
    <div className="resources-admin-section">
      <div className="admin-section-header">
        <h2>Resources Management</h2>
        <p className="section-description">
          Manage links to external documents, tools, and campaign assets.
        </p>
      </div>

      {message && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="resources-list">
        {resources.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No resources yet</h3>
            <p>Add your first resource link to get started.</p>
          </div>
        ) : (
          <ul className="admin-list">
            {resources.map((resource) => (
              <li key={resource.id} className="admin-list-item" style={{ opacity: resource.active ? 1 : 0.6 }}>
                <div className="admin-list-item-content">
                  <div className="admin-list-item-title">
                    {resource.title}
                    {!resource.active && <span style={{ marginLeft: '8px', fontSize: '0.8em', color: 'var(--text-secondary)' }}>(Hidden)</span>}
                  </div>
                  <div className="admin-list-item-meta">
                    <span className="resource-category">{resource.category || 'Uncategorized'}</span>
                    {' · '}
                    Sort order: {resource.sort_order}
                    {resource.cta_url && (
                      <>
                        {' · '}
                        <a href={resource.cta_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                          {resource.cta_label || 'Link'} ↗
                        </a>
                      </>
                    )}
                  </div>
                  {resource.description && (
                    <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {resource.description.substring(0, 100)}{resource.description.length > 100 ? '...' : ''}
                    </div>
                  )}
                </div>
                <div className="admin-list-item-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleToggleActive(resource)}
                  >
                    {resource.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setEditingResource({ ...resource })}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => handleDelete(resource.id)}
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
          onClick={() => setEditingResource({
            title: '',
            category: 'Visual Assets',
            description: '',
            thumbnail_url: '',
            cta_label: 'View Resource',
            cta_url: '',
            sort_order: resources.length + 1,
            active: true,
            campaign_id: null
          })}
        >
          Add New Resource
        </button>
      </div>

      {editingResource && (
        <div className="modal-overlay" onClick={() => setEditingResource(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingResource.id ? 'Edit Resource' : 'Add New Resource'}</h3>
            <form onSubmit={handleSubmit}>
              {/* BASICS */}
              <div className="form-section">
                <h4 className="form-section-title">Basics</h4>

                <div className="form-group">
                  <label htmlFor="resource-title">Title *</label>
                  <input
                    type="text"
                    id="resource-title"
                    value={editingResource.title}
                    onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                    required
                    placeholder="e.g., Campaign Visual Assets"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="resource-category">Category *</label>
                  <select
                    id="resource-category"
                    value={editingResource.category}
                    onChange={(e) => setEditingResource({ ...editingResource, category: e.target.value })}
                    required
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="resource-description">Description</label>
                  <textarea
                    id="resource-description"
                    value={editingResource.description || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                    rows="3"
                    placeholder="Brief description of this resource..."
                  />
                  <small className="form-help">Optional. Displayed on resource cards.</small>
                </div>
              </div>

              {/* PRESENTATION */}
              <div className="form-section">
                <h4 className="form-section-title">Presentation</h4>

                <div className="form-group">
                  <label htmlFor="resource-thumbnail">Thumbnail URL</label>
                  <input
                    type="text"
                    id="resource-thumbnail"
                    value={editingResource.thumbnail_url || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, thumbnail_url: e.target.value })}
                    placeholder="https://example.com/image.png or /src/assets/..."
                  />
                  <small className="form-help">Optional. Image displayed on the resource card.</small>
                </div>

                <div className="form-group">
                  <label htmlFor="resource-cta-label">Call-to-Action Label *</label>
                  <input
                    type="text"
                    id="resource-cta-label"
                    value={editingResource.cta_label}
                    onChange={(e) => setEditingResource({ ...editingResource, cta_label: e.target.value })}
                    required
                    placeholder="e.g., View Resource, Download Assets, Open Figma"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="resource-cta-url">Call-to-Action URL *</label>
                  <input
                    type="url"
                    id="resource-cta-url"
                    value={editingResource.cta_url}
                    onChange={(e) => setEditingResource({ ...editingResource, cta_url: e.target.value })}
                    required
                    placeholder="https://figma.com/... or https://docs.google.com/..."
                  />
                  <small className="form-help">Where the resource button should link to.</small>
                </div>
              </div>

              {/* VISIBILITY */}
              <div className="form-section">
                <h4 className="form-section-title">Visibility</h4>

                <div className="form-group">
                  <label htmlFor="resource-sort">Sort Order *</label>
                  <input
                    type="number"
                    id="resource-sort"
                    value={editingResource.sort_order}
                    onChange={(e) => setEditingResource({ ...editingResource, sort_order: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                  />
                  <small className="form-help">Lower numbers appear first.</small>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editingResource.active}
                      onChange={(e) => setEditingResource({ ...editingResource, active: e.target.checked })}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Active (visible on page)
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Resource'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingResource(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-info-box" style={{ marginTop: '2rem' }}>
        <h3>About Resources</h3>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Resources link to external documents or tools. Content is not authored here.</strong>
        </p>
        <ul>
          <li><strong>Resources Page:</strong> Active resources are displayed as cards ordered by sort_order</li>
          <li><strong>External Links:</strong> Each resource must link to an external document, Figma file, or tool</li>
          <li><strong>Visibility:</strong> Use Hide/Show to control which resources appear on the page</li>
        </ul>
      </div>
    </div>
  );
}
