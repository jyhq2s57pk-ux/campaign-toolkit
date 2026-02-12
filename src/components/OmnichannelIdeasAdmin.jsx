import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AdminComponents.css';

const CHANNEL_OPTIONS = ['Web', 'App', 'Email', 'Social', 'Paid Social', 'Loyalty', 'In-Store'];

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

    const payload = {
      title: editingIdea.title,
      description: editingIdea.description,
      image_url: editingIdea.image_url,
      tag: editingIdea.tag,
      sort_order: editingIdea.sort_order,
      is_active: editingIdea.is_active,
      channels: editingIdea.channels || [],
      headline: editingIdea.headline || null,
      sub_headline: editingIdea.sub_headline || null,
      how_it_works_title: editingIdea.how_it_works_title || 'How it works',
      how_it_works_steps: editingIdea.how_it_works_steps || [],
      modal_images: editingIdea.modal_images || [],
    };

    try {
      if (editingIdea.id) {
        const { error } = await supabase
          .from('omnichannel_ideas')
          .update(payload)
          .eq('id', editingIdea.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Idea updated successfully!' });
      } else {
        const { error } = await supabase
          .from('omnichannel_ideas')
          .insert(payload);

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

  const handleChannelToggle = (channel) => {
    const current = editingIdea.channels || [];
    const updated = current.includes(channel)
      ? current.filter(c => c !== channel)
      : [...current, channel];
    setEditingIdea({ ...editingIdea, channels: updated });
  };

  const handleAddStep = () => {
    const steps = editingIdea.how_it_works_steps || [];
    setEditingIdea({ ...editingIdea, how_it_works_steps: [...steps, ''] });
  };

  const handleRemoveStep = (index) => {
    const steps = [...(editingIdea.how_it_works_steps || [])];
    steps.splice(index, 1);
    setEditingIdea({ ...editingIdea, how_it_works_steps: steps });
  };

  const handleStepChange = (index, value) => {
    const steps = [...(editingIdea.how_it_works_steps || [])];
    steps[index] = value;
    setEditingIdea({ ...editingIdea, how_it_works_steps: steps });
  };

  const handleModalImageChange = (index, value) => {
    const images = [...(editingIdea.modal_images || ['', '', ''])];
    images[index] = value;
    setEditingIdea({ ...editingIdea, modal_images: images.filter((_, i) => i < 3) });
  };

  const startNewIdea = () => {
    setEditingIdea({
      title: '',
      description: '',
      image_url: '',
      tag: '',
      sort_order: ideas.length + 1,
      is_active: true,
      channels: [],
      headline: '',
      sub_headline: '',
      how_it_works_title: 'How it works',
      how_it_works_steps: [],
      modal_images: [],
    });
  };

  if (loading) {
    return <div className="admin-loading">Loading omnichannel ideas...</div>;
  }

  return (
    <div className="omnichannel-ideas-admin-section">
      <div className="admin-section-header">
        <h2>Activation Ideas Management</h2>
        <p className="section-description">
          Manage the activation ideas displayed on the Omnichannel page.
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
            <p>Add your first activation idea to get started.</p>
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
                    {idea.channels?.length > 0 && <span className="idea-tag">{idea.channels.join(', ')}</span>}
                    {idea.tag && <> · {idea.tag}</>}
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
                    onClick={() => setEditingIdea({
                      ...idea,
                      channels: idea.channels || [],
                      how_it_works_steps: idea.how_it_works_steps || [],
                      modal_images: idea.modal_images || [],
                    })}
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
          onClick={startNewIdea}
        >
          Add New Idea
        </button>
      </div>

      {editingIdea && (
        <div className="modal-overlay" onClick={() => setEditingIdea(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
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
                <label>Channels</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {CHANNEL_OPTIONS.map((channel) => (
                    <label key={channel} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', background: editingIdea.channels?.includes(channel) ? 'var(--accent-purple)' : 'var(--surface-card)', color: '#fff', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={editingIdea.channels?.includes(channel) || false}
                        onChange={() => handleChannelToggle(channel)}
                        style={{ display: 'none' }}
                      />
                      {channel}
                    </label>
                  ))}
                </div>
                <small className="form-help">Select which channels this idea applies to</small>
              </div>

              <div className="form-group">
                <label htmlFor="idea-headline">Modal Headline (purple text)</label>
                <input
                  type="text"
                  id="idea-headline"
                  value={editingIdea.headline || ''}
                  onChange={(e) => setEditingIdea({ ...editingIdea, headline: e.target.value })}
                  placeholder="e.g., Treasure Hunt:"
                />
                <small className="form-help">Displayed in purple in the modal title</small>
              </div>

              <div className="form-group">
                <label htmlFor="idea-sub-headline">Modal Subtitle</label>
                <input
                  type="text"
                  id="idea-sub-headline"
                  value={editingIdea.sub_headline || ''}
                  onChange={(e) => setEditingIdea({ ...editingIdea, sub_headline: e.target.value })}
                  placeholder="e.g., Turn Every Store Visit into a Brand-led AR Adventure"
                />
                <small className="form-help">Displayed in dark text below the headline</small>
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
                <label htmlFor="idea-image">Card Image URL</label>
                <input
                  type="text"
                  id="idea-image"
                  value={editingIdea.image_url}
                  onChange={(e) => setEditingIdea({ ...editingIdea, image_url: e.target.value })}
                  placeholder="/src/assets/omni/gen/balloon.png"
                />
                <small className="form-help">Main image shown on the card</small>
              </div>

              <div className="form-group">
                <label>Modal Images (up to 3)</label>
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    type="text"
                    value={(editingIdea.modal_images || [])[i] || ''}
                    onChange={(e) => handleModalImageChange(i, e.target.value)}
                    placeholder={`Modal image ${i + 1} URL`}
                    style={{ marginBottom: '4px' }}
                  />
                ))}
                <small className="form-help">Images shown in the modal left column</small>
              </div>

              <div className="form-group">
                <label>How it works</label>
                <input
                  type="text"
                  value={editingIdea.how_it_works_title || 'How it works'}
                  onChange={(e) => setEditingIdea({ ...editingIdea, how_it_works_title: e.target.value })}
                  placeholder="Section title"
                  style={{ marginBottom: '8px' }}
                />
                {(editingIdea.how_it_works_steps || []).map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleStepChange(i, e.target.value)}
                      placeholder={`Step ${i + 1}`}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleRemoveStep(i)}
                      style={{ padding: '4px 12px' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddStep}
                  style={{ marginTop: '4px' }}
                >
                  + Add Step
                </button>
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
          <li><strong>Activation Ideas Page:</strong> Ideas grid displays active ideas ordered by sort_order</li>
          <li><strong>Channels:</strong> Used for filtering and displayed as badges on each card</li>
          <li><strong>Visibility:</strong> Use Hide/Show to control which ideas appear on the page</li>
          <li><strong>Modal Content:</strong> Headline, subtitle, images, and "How it works" steps shown in the detail modal</li>
        </ul>
      </div>
    </div>
  );
}
