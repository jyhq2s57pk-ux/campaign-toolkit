import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AdminComponents.css';

export default function OmnichannelIdeasAdmin() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingIdea, setEditingIdea] = useState(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('omnichannel_ideas')
        .select('*')
        .order('sort_order');

      if (error) throw error;

      setIdeas(data || []);
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setMessage({ type: 'error', text: 'Error loading ideas' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingIdea.id) {
        // Update existing
        const { error } = await supabase
          .from('omnichannel_ideas')
          .update({
            title: editingIdea.title,
            description: editingIdea.description,
            image_url: editingIdea.image_url,
            tag: editingIdea.tag,
            sort_order: editingIdea.sort_order,
            is_active: editingIdea.is_active
          })
          .eq('id', editingIdea.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Idea updated successfully!' });
      } else {
        // Create new
        const { error } = await supabase
          .from('omnichannel_ideas')
          .insert({
            title: editingIdea.title,
            description: editingIdea.description,
            image_url: editingIdea.image_url,
            tag: editingIdea.tag,
            sort_order: editingIdea.sort_order,
            is_active: editingIdea.is_active
          });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Idea created successfully!' });
      }

      setEditingIdea(null);
      fetchIdeas();
    } catch (err) {
      console.error('Error saving idea:', err);
      setMessage({ type: 'error', text: 'Error saving idea: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this idea?')) return;

    try {
      const { error } = await supabase
        .from('omnichannel_ideas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Idea deleted successfully!' });
      fetchIdeas();
    } catch (err) {
      console.error('Error deleting idea:', err);
      setMessage({ type: 'error', text: 'Error deleting idea: ' + err.message });
    }
  };

  const handleToggleActive = async (idea) => {
    try {
      const { error } = await supabase
        .from('omnichannel_ideas')
        .update({ is_active: !idea.is_active })
        .eq('id', idea.id);

      if (error) throw error;

      setMessage({ type: 'success', text: `Idea ${!idea.is_active ? 'activated' : 'deactivated'}!` });
      fetchIdeas();
    } catch (err) {
      console.error('Error toggling idea:', err);
      setMessage({ type: 'error', text: 'Error updating idea: ' + err.message });
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading omnichannel ideas...</div>;
  }

  return (
    <div className="omnichannel-ideas-admin-section">
      <div className="admin-section-header">
        <h2>Omnichannel Ideas Management</h2>
        <p className="section-description">
          Manage the carousel of activation ideas displayed on the Omnichannel page.
        </p>
      </div>

      {message && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="ideas-list">
        {ideas.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No ideas yet</h3>
            <p>Add your first omnichannel activation idea to get started.</p>
          </div>
        ) : (
          <ul className="admin-list">
            {ideas.map((idea) => (
              <li key={idea.id} className="admin-list-item" style={{ opacity: idea.is_active ? 1 : 0.6 }}>
                <div className="admin-list-item-content">
                  <div className="admin-list-item-title">
                    {idea.title}
                    {!idea.is_active && <span style={{ marginLeft: '8px', fontSize: '0.8em', color: 'var(--text-secondary)' }}>(Hidden)</span>}
                  </div>
                  <div className="admin-list-item-meta">
                    {idea.tag && <span className="idea-tag">{idea.tag}</span>}
                    {' · '}
                    Sort order: {idea.sort_order}
                  </div>
                  <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {idea.description?.substring(0, 100)}{idea.description?.length > 100 ? '...' : ''}
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleToggleActive(idea)}
                  >
                    {idea.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setEditingIdea({ ...idea })}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => handleDelete(idea.id)}
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
          onClick={() => setEditingIdea({
            title: '',
            description: '',
            image_url: '',
            tag: '',
            sort_order: ideas.length + 1,
            is_active: true
          })}
        >
          Add New Idea
        </button>
      </div>

      {editingIdea && (
        <div className="modal-overlay" onClick={() => setEditingIdea(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingIdea.id ? 'Edit Idea' : 'Add New Idea'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="idea-title">Title *</label>
                <input
                  type="text"
                  id="idea-title"
                  value={editingIdea.title}
                  onChange={(e) => setEditingIdea({ ...editingIdea, title: e.target.value })}
                  required
                  placeholder="e.g., Balloon Modelling + Loyalty Boost"
                />
              </div>

              <div className="form-group">
                <label htmlFor="idea-description">Description *</label>
                <textarea
                  id="idea-description"
                  value={editingIdea.description}
                  onChange={(e) => setEditingIdea({ ...editingIdea, description: e.target.value })}
                  required
                  rows="4"
                  placeholder="Brief description of the activation idea..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="idea-tag">Tag</label>
                <input
                  type="text"
                  id="idea-tag"
                  value={editingIdea.tag}
                  onChange={(e) => setEditingIdea({ ...editingIdea, tag: e.target.value })}
                  placeholder="e.g., Loyalty, Engagement, Fun"
                />
                <small className="form-help">Optional category or theme tag</small>
              </div>

              <div className="form-group">
                <label htmlFor="idea-image">Image URL</label>
                <input
                  type="text"
                  id="idea-image"
                  value={editingIdea.image_url}
                  onChange={(e) => setEditingIdea({ ...editingIdea, image_url: e.target.value })}
                  placeholder="/src/assets/omni/gen/balloon.png"
                />
                <small className="form-help">Path to image file or URL</small>
              </div>

              <div className="form-group">
                <label htmlFor="idea-sort">Sort Order *</label>
                <input
                  type="number"
                  id="idea-sort"
                  value={editingIdea.sort_order}
                  onChange={(e) => setEditingIdea({ ...editingIdea, sort_order: parseInt(e.target.value) })}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingIdea.is_active}
                    onChange={(e) => setEditingIdea({ ...editingIdea, is_active: e.target.checked })}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Active (visible on page)
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Idea'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingIdea(null)}
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
          <li><strong>Omnichannel Page:</strong> Ideas carousel displays active ideas ordered by sort_order</li>
          <li><strong>Visibility:</strong> Use Hide/Show to control which ideas appear on the page</li>
          <li><strong>Tags:</strong> Optional labels displayed as badges on each card</li>
        </ul>
      </div>
    </div>
  );
}
