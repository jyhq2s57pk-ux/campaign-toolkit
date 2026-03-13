import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from './ImageUpload';
import './AdminComponents.css';

/* ─── Block Type Definitions ─── */

const BLOCK_TYPES = [
  { value: 'body_copy', label: 'Body Copy', description: 'Paragraph text' },
  { value: 'section_headline', label: 'Section Headline', description: 'Large two-line headline' },
  { value: 'image_text_card', label: 'Image + Text Card', description: 'Card with image and text' },
  { value: 'stats', label: 'Stats', description: 'Title with stat numbers' },
  { value: 'double_image', label: 'Double Image', description: 'Two images side by side' },
];

const BLOCK_TYPE_LABELS = Object.fromEntries(BLOCK_TYPES.map(t => [t.value, t.label]));

function getEmptyBlock(type) {
  switch (type) {
    case 'body_copy':        return { type, body: '' };
    case 'section_headline': return { type, line1: '', line2: '' };
    case 'image_text_card':  return { type, label: '', title: '', body: '', image_url: '' };
    case 'stats':            return { type, title: '', items: [{ number: '', description: '' }] };
    case 'double_image':     return { type, image1_url: '', image2_url: '', caption: '' };
    default:                 return { type: 'body_copy', body: '' };
  }
}

/* ─── Type-Specific Block Editors ─── */

function BodyCopyEditor({ block, index, updateBlock }) {
  return (
    <div className="form-group">
      <label>Body Text</label>
      <textarea
        value={block.body || ''}
        onChange={(e) => updateBlock(index, 'body', e.target.value)}
        rows="4"
        placeholder="Paragraph text..."
      />
      <small className="form-help">Supports **bold** and links: [link text](https://url.com)</small>
    </div>
  );
}

function SectionHeadlineEditor({ block, index, updateBlock }) {
  return (
    <>
      <div className="form-group">
        <label>Line 1 (white)</label>
        <input
          type="text"
          value={block.line1 || ''}
          onChange={(e) => updateBlock(index, 'line1', e.target.value)}
          placeholder="Top line text"
        />
      </div>
      <div className="form-group">
        <label>Line 2 (campaign colour)</label>
        <input
          type="text"
          value={block.line2 || ''}
          onChange={(e) => updateBlock(index, 'line2', e.target.value)}
          placeholder="Bottom line text (displayed in campaign colour)"
        />
      </div>
    </>
  );
}

function ImageTextCardEditor({ block, index, updateBlock }) {
  return (
    <>
      <div className="form-group">
        <label>Label (small text above title)</label>
        <input
          type="text"
          value={block.label || ''}
          onChange={(e) => updateBlock(index, 'label', e.target.value)}
          placeholder="e.g., CATEGORY or INSIGHT"
        />
      </div>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={block.title || ''}
          onChange={(e) => updateBlock(index, 'title', e.target.value)}
          placeholder="Card headline"
        />
      </div>
      <div className="form-group">
        <label>Body</label>
        <textarea
          value={block.body || ''}
          onChange={(e) => updateBlock(index, 'body', e.target.value)}
          rows="3"
          placeholder="Card description text..."
        />
        <small className="form-help">Supports links: [link text](https://url.com)</small>
      </div>
      <ImageUpload
        label="Card Image"
        value={block.image_url || ''}
        onChange={(url) => updateBlock(index, 'image_url', url)}
        placeholder="Paste image URL or upload"
        folder="insights"
      />
    </>
  );
}

function StatsEditor({ block, index, updateBlock }) {
  const items = block.items || [];

  const updateItem = (itemIdx, field, value) => {
    const newItems = [...items];
    newItems[itemIdx] = { ...newItems[itemIdx], [field]: value };
    updateBlock(index, 'items', newItems);
  };

  const addItem = () => {
    updateBlock(index, 'items', [...items, { number: '', description: '' }]);
  };

  const removeItem = (itemIdx) => {
    const newItems = items.filter((_, i) => i !== itemIdx);
    updateBlock(index, 'items', newItems.length > 0 ? newItems : [{ number: '', description: '' }]);
  };

  return (
    <>
      <div className="form-group">
        <label>Section Title (left side)</label>
        <input
          type="text"
          value={block.title || ''}
          onChange={(e) => updateBlock(index, 'title', e.target.value)}
          placeholder="e.g., Key Performance Metrics"
        />
      </div>

      <div className="stats-items-editor">
        <div className="stats-items-header">
          <label>Stat Items</label>
          <button type="button" className="btn-secondary btn-sm" onClick={addItem}>
            + Add Stat
          </button>
        </div>
        {items.map((item, itemIdx) => (
          <div key={itemIdx} className="stats-item-editor">
            <div className="stats-item-fields">
              <div className="form-group form-group-inline">
                <label>Number</label>
                <input
                  type="text"
                  value={item.number || ''}
                  onChange={(e) => updateItem(itemIdx, 'number', e.target.value)}
                  placeholder="e.g., 73% or 2.4M"
                />
              </div>
              <div className="form-group form-group-inline">
                <label>Description</label>
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => updateItem(itemIdx, 'description', e.target.value)}
                  placeholder="What this stat means"
                />
              </div>
            </div>
            {items.length > 1 && (
              <button type="button" className="btn-secondary btn-remove-stat" onClick={() => removeItem(itemIdx)}>
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function DoubleImageEditor({ block, index, updateBlock }) {
  return (
    <>
      <div className="double-image-uploads">
        <ImageUpload
          label="Image 1"
          value={block.image1_url || ''}
          onChange={(url) => updateBlock(index, 'image1_url', url)}
          placeholder="Paste image URL or upload"
          folder="insights"
        />
        <ImageUpload
          label="Image 2"
          value={block.image2_url || ''}
          onChange={(url) => updateBlock(index, 'image2_url', url)}
          placeholder="Paste image URL or upload"
          folder="insights"
        />
      </div>
      <div className="form-group">
        <label>Caption (optional)</label>
        <input
          type="text"
          value={block.caption || ''}
          onChange={(e) => updateBlock(index, 'caption', e.target.value)}
          placeholder="Image caption text"
        />
      </div>
    </>
  );
}

function BlockEditor({ block, index, updateBlock }) {
  switch (block.type) {
    case 'body_copy':        return <BodyCopyEditor block={block} index={index} updateBlock={updateBlock} />;
    case 'section_headline': return <SectionHeadlineEditor block={block} index={index} updateBlock={updateBlock} />;
    case 'image_text_card':  return <ImageTextCardEditor block={block} index={index} updateBlock={updateBlock} />;
    case 'stats':            return <StatsEditor block={block} index={index} updateBlock={updateBlock} />;
    case 'double_image':     return <DoubleImageEditor block={block} index={index} updateBlock={updateBlock} />;
    default:                 return <BodyCopyEditor block={block} index={index} updateBlock={updateBlock} />;
  }
}

/* ─── Main Admin Component ─── */

export default function InsightPagesAdmin({ campaignId }) {
  const [insightPage, setInsightPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  useEffect(() => {
    if (campaignId) fetchPage();
  }, [campaignId]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('insight_pages')
        .select('*')
        .eq('campaign_id', campaignId)
        .maybeSingle();

      if (error) throw error;
      setInsightPage(data);
    } catch (err) {
      console.error('Error fetching insight page:', err);
      setMessage({ type: 'error', text: 'Error loading insight page' });
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (page) => {
    setFormData({
      id: page?.id || null,
      title: page?.title || 'Insights & Performance',
      subtitle: page?.subtitle || '',
      content_blocks: page?.content_blocks || []
    });
    setEditing(true);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        content_blocks: formData.content_blocks || [],
        updated_at: new Date().toISOString()
      };

      if (formData.id) {
        const { error } = await supabase
          .from('insight_pages')
          .update(payload)
          .eq('id', formData.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Insight page updated!' });
      } else {
        const { error } = await supabase
          .from('insight_pages')
          .insert({ ...payload, campaign_id: campaignId });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Insight page created!' });
      }

      setEditing(false);
      setFormData(null);
      fetchPage();
    } catch (err) {
      console.error('Error saving insight page:', err);
      setMessage({ type: 'error', text: 'Error saving: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!insightPage?.id) return;
    if (!confirm('Are you sure you want to delete this insight page?')) return;

    try {
      const { error } = await supabase
        .from('insight_pages')
        .delete()
        .eq('id', insightPage.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Insight page deleted!' });
      setInsightPage(null);
      setEditing(false);
      setFormData(null);
    } catch (err) {
      console.error('Error deleting insight page:', err);
      setMessage({ type: 'error', text: 'Error deleting: ' + err.message });
    }
  };

  /* ─── Block Management ─── */

  const addBlock = (type) => {
    const blocks = formData.content_blocks || [];
    setFormData({
      ...formData,
      content_blocks: [...blocks, getEmptyBlock(type)]
    });
    setShowTypeMenu(false);
  };

  const updateBlock = (index, field, value) => {
    const blocks = [...(formData.content_blocks || [])];
    blocks[index] = { ...blocks[index], [field]: value };
    setFormData({ ...formData, content_blocks: blocks });
  };

  const removeBlock = (index) => {
    const blocks = [...(formData.content_blocks || [])];
    blocks.splice(index, 1);
    setFormData({ ...formData, content_blocks: blocks });
  };

  const moveBlock = (index, direction) => {
    const blocks = [...(formData.content_blocks || [])];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    setFormData({ ...formData, content_blocks: blocks });
  };

  /* ─── Render ─── */

  if (!campaignId) {
    return (
      <div className="admin-empty-state">
        <h3>Select a campaign</h3>
        <p>Choose a campaign from the dropdown above to manage its insight page.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="admin-loading">Loading insight page...</div>;
  }

  const blockCount = (formData?.content_blocks || []).length;

  return (
    <div className="insight-pages-admin-section">
      <div className="admin-section-header">
        <h2>Insight Page</h2>
        <p className="section-description">
          Compose the insight page using different component types. Add any combination of headlines, text, images, stats, and cards.
          When components are added, they replace the default bento grid on the public page.
        </p>
      </div>

      {message && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {!editing && (
        <div className="pages-list">
          {insightPage ? (
            <div className="admin-list">
              <div className="admin-list-item">
                <div className="admin-list-item-content">
                  <div className="admin-list-item-title">{insightPage.title}</div>
                  <div className="admin-list-item-meta">
                    {insightPage.subtitle && <>{insightPage.subtitle} · </>}
                    {(insightPage.content_blocks || []).length} component(s)
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button className="btn-secondary" onClick={() => openEditor(insightPage)}>
                    Edit
                  </button>
                  <button className="btn-secondary" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-empty-state">
              <h3>No insight page yet</h3>
              <p>Create an insight page for this campaign to get started.</p>
            </div>
          )}

          {!insightPage && (
            <button
              className="btn-primary btn-mt"
              onClick={() => openEditor(null)}
            >
              Create Insight Page
            </button>
          )}
        </div>
      )}

      {editing && formData && (
        <div className="modal-overlay" onClick={() => { setEditing(false); setFormData(null); setShowTypeMenu(false); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{formData.id ? 'Edit Insight Page' : 'Create Insight Page'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="page-title">Page Title *</label>
                <input
                  type="text"
                  id="page-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Insights & Performance"
                />
              </div>

              <div className="form-group">
                <label htmlFor="page-subtitle">Subtitle</label>
                <textarea
                  id="page-subtitle"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  rows="2"
                  placeholder="Brief description"
                />
              </div>

              {/* Content Blocks */}
              <div className="content-blocks-section">
                <div className="content-blocks-header">
                  <h4>Components ({blockCount})</h4>
                  <div className="add-block-wrapper">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowTypeMenu(!showTypeMenu)}
                    >
                      + Add Component
                    </button>
                    {showTypeMenu && (
                      <div className="type-menu">
                        {BLOCK_TYPES.map((bt) => (
                          <button
                            key={bt.value}
                            type="button"
                            className="type-menu-item"
                            onClick={() => addBlock(bt.value)}
                          >
                            <span className="type-menu-label">{bt.label}</span>
                            <span className="type-menu-desc">{bt.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {(formData.content_blocks || []).map((block, i) => (
                  <div key={i} className="content-block-editor">
                    <div className="block-editor-header">
                      <div className="block-editor-title-area">
                        <span className="block-editor-label">
                          {i + 1}. {BLOCK_TYPE_LABELS[block.type] || 'Unknown'}
                        </span>
                        <span className="block-type-badge">{block.type}</span>
                      </div>
                      <div className="block-editor-actions">
                        <button
                          type="button"
                          className="btn-secondary btn-icon"
                          onClick={() => moveBlock(i, -1)}
                          disabled={i === 0}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn-secondary btn-icon"
                          onClick={() => moveBlock(i, 1)}
                          disabled={i === blockCount - 1}
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="btn-secondary btn-remove-block"
                          onClick={() => removeBlock(i)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <BlockEditor block={block} index={i} updateBlock={updateBlock} />
                  </div>
                ))}

                {blockCount === 0 && (
                  <p className="content-blocks-empty">
                    No components yet. Click "+ Add Component" to start building the page.
                    Components replace the default bento grid on the public page.
                  </p>
                )}
              </div>

              <div className="form-actions form-actions-mt">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Page'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setEditing(false); setFormData(null); setShowTypeMenu(false); }}>
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
