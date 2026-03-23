import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AdminComponents.css';

export default function WaysOfWorkingAdmin({ campaignId }) {
  const [steps, setSteps] = useState([]);
  const [tips, setTips] = useState([]);
  const [implTips, setImplTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [editingTip, setEditingTip] = useState(null);
  const [editingImplTip, setEditingImplTip] = useState(null);

  useEffect(() => {
    fetchData();
  }, [campaignId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch process steps — scoped to campaign
      let processQuery = supabase
        .from('wow_process')
        .select('*');
      if (campaignId) {
        processQuery = processQuery.eq('campaign_id', campaignId);
      }
      const { data: processData, error: processError } = await processQuery.order('sort_order');

      if (processError) throw processError;

      // Fetch tips (stored in wow_timeline) — scoped to campaign
      let tipsQuery = supabase
        .from('wow_timeline')
        .select('*');
      if (campaignId) {
        tipsQuery = tipsQuery.eq('campaign_id', campaignId);
      }
      const { data: tipsData, error: tipsError } = await tipsQuery.order('sort_order');

      if (tipsError) throw tipsError;

      // Fetch implementation tips — scoped to campaign
      let implQuery = supabase
        .from('implementation_tips')
        .select('*');
      if (campaignId) {
        implQuery = implQuery.eq('campaign_id', campaignId);
      }
      const { data: implData, error: implError } = await implQuery.order('sort_order');
      if (implError) console.error('Error fetching implementation tips:', implError);

      setSteps(processData || []);
      setTips(tipsData || []);
      setImplTips(implData || []);
    } catch (err) {
      console.error('Error fetching ways of working:', err);
      setMessage({ type: 'error', text: 'Error loading data' });
    } finally {
      setLoading(false);
    }
  };

  // Step management
  const handleStepSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingStep.id) {
        // Update existing
        const { error } = await supabase
          .from('wow_process')
          .update({
            title: editingStep.title,
            description: editingStep.description,
            sort_order: editingStep.sort_order,
            campaign_id: campaignId || null
          })
          .eq('id', editingStep.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Step updated successfully!' });
      } else {
        // Create new
        const { error } = await supabase
          .from('wow_process')
          .insert({
            title: editingStep.title,
            description: editingStep.description,
            sort_order: editingStep.sort_order,
            campaign_id: campaignId || null
          });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Step created successfully!' });
      }

      setEditingStep(null);
      fetchData();
    } catch (err) {
      console.error('Error saving step:', err);
      setMessage({ type: 'error', text: 'Error saving step: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStep = async (id) => {
    if (!confirm('Are you sure you want to delete this step?')) return;

    try {
      const { error } = await supabase
        .from('wow_process')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Step deleted successfully!' });
      fetchData();
    } catch (err) {
      console.error('Error deleting step:', err);
      setMessage({ type: 'error', text: 'Error deleting step: ' + err.message });
    }
  };

  // Tip management
  const handleTipSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingTip.id) {
        // Update existing
        const { error } = await supabase
          .from('wow_timeline')
          .update({
            phase: editingTip.phase,
            sort_order: editingTip.sort_order,
            campaign_id: campaignId || null
          })
          .eq('id', editingTip.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Tip updated successfully!' });
      } else {
        // Create new
        const { error } = await supabase
          .from('wow_timeline')
          .insert({
            phase: editingTip.phase,
            date_text: '',
            sort_order: editingTip.sort_order,
            campaign_id: campaignId || null
          });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Tip created successfully!' });
      }

      setEditingTip(null);
      fetchData();
    } catch (err) {
      console.error('Error saving tip:', err);
      setMessage({ type: 'error', text: 'Error saving tip: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTip = async (id) => {
    if (!confirm('Are you sure you want to delete this tip?')) return;

    try {
      const { error } = await supabase
        .from('wow_timeline')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Tip deleted successfully!' });
      fetchData();
    } catch (err) {
      console.error('Error deleting tip:', err);
      setMessage({ type: 'error', text: 'Error deleting tip: ' + err.message });
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading ways of working data...</div>;
  }

  return (
    <div className="wow-admin-section">
      <div className="admin-section-header">
        <h2>Ways of Working Management</h2>
        <p className="section-description">
          Edit the 3-step workflow process and best practice tips displayed on the Ways of Working page.
        </p>
      </div>

      {message && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Process Steps Section */}
      <div className="wow-admin-subsection">
        <h3>Workflow Steps (Global → Regions → Content Implementation)</h3>

        <ul className="admin-list">
          {steps.map((step) => (
            <li key={step.id} className="admin-list-item">
              <div className="admin-list-item-content">
                <div className="admin-list-item-title">{step.title}</div>
                <div className="admin-list-item-meta">
                  Sort order: {step.sort_order}
                </div>
              </div>
              <div className="admin-list-item-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setEditingStep({ ...step })}
                >
                  Edit
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleDeleteStep(step.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button
          className="btn-primary"
          onClick={() => setEditingStep({
            title: '',
            description: '',
            sort_order: steps.length + 1
          })}
        >
          Add New Step
        </button>

        {editingStep && (
          <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setEditingStep(null)} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <h3>{editingStep.id ? 'Edit Step' : 'Add New Step'}</h3>
              <form onSubmit={handleStepSubmit}>
                <div className="form-group">
                  <label htmlFor="step-title">Step Title *</label>
                  <input
                    type="text"
                    id="step-title"
                    value={editingStep.title}
                    onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                    required
                    placeholder="e.g., 1. Global"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="step-description">Description *</label>
                  <textarea
                    id="step-description"
                    value={editingStep.description}
                    onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                    required
                    rows="6"
                    placeholder="Use **bold** for emphasis and line breaks for structure..."
                  />
                  <small className="form-help">
                    Supports **bold**, __underline__, line breaks, and links: [link text](https://url.com)
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="step-sort">Sort Order *</label>
                  <input
                    type="number"
                    id="step-sort"
                    value={editingStep.sort_order}
                    onChange={(e) => setEditingStep({ ...editingStep, sort_order: parseInt(e.target.value) })}
                    required
                    min="1"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Step'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingStep(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Best Practice Tips Section */}
      <div className="wow-admin-subsection" style={{ marginTop: '3rem' }}>
        <h3>Best Practice Tips</h3>

        <ul className="admin-list">
          {tips.map((tip) => (
            <li key={tip.id} className="admin-list-item">
              <div className="admin-list-item-content">
                <div className="admin-list-item-title">{tip.phase}</div>
                <div className="admin-list-item-meta">
                  Sort order: {tip.sort_order}
                </div>
              </div>
              <div className="admin-list-item-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setEditingTip({ ...tip })}
                >
                  Edit
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleDeleteTip(tip.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button
          className="btn-primary"
          onClick={() => setEditingTip({
            phase: '',
            sort_order: tips.length + 1
          })}
        >
          Add New Tip
        </button>

        {editingTip && (
          <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setEditingTip(null)} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <h3>{editingTip.id ? 'Edit Tip' : 'Add New Tip'}</h3>
              <form onSubmit={handleTipSubmit}>
                <div className="form-group">
                  <label htmlFor="tip-text">Tip Text *</label>
                  <input
                    type="text"
                    id="tip-text"
                    value={editingTip.phase}
                    onChange={(e) => setEditingTip({ ...editingTip, phase: e.target.value })}
                    required
                    placeholder="e.g., Always define activation level first"
                  />
                  <small className="form-help">Supports links: [link text](https://url.com)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="tip-sort">Sort Order *</label>
                  <input
                    type="number"
                    id="tip-sort"
                    value={editingTip.sort_order}
                    onChange={(e) => setEditingTip({ ...editingTip, sort_order: parseInt(e.target.value) })}
                    required
                    min="1"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Tip'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingTip(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Implementation Tips Management */}
      <div className="wow-admin-subsection" style={{ marginTop: '2rem' }}>
        <h3>Implementation Tips</h3>
        <p className="section-description">Numbered tips shown in the "Tips for making the implementation smoother" section. Leave empty to use defaults.</p>

        {implTips.length > 0 ? (
          <ul className="admin-list">
            {implTips.map((tip) => (
              <li key={tip.id} className="admin-list-item">
                <div className="admin-list-item-content">
                  <div className="admin-list-item-title">
                    {tip.sort_order}. {tip.text?.substring(0, 80)}{tip.text?.length > 80 ? '...' : ''}
                    {tip.is_new && <span style={{ marginLeft: '8px', fontSize: '0.75em', color: '#22c55e', background: 'rgba(34,197,94,0.15)', padding: '2px 8px', borderRadius: '4px' }}>NEW</span>}
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button className="btn-secondary" onClick={() => setEditingImplTip({ ...tip })}>Edit</button>
                  <button className="btn-secondary" onClick={async () => {
                    if (!confirm('Delete this tip?')) return;
                    await supabase.from('implementation_tips').delete().eq('id', tip.id);
                    setMessage({ type: 'success', text: 'Tip deleted!' });
                    fetchData();
                  }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>No custom tips. Default tips will be shown.</p>
        )}

        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setEditingImplTip({
          text: '', sort_order: implTips.length + 1, is_new: false, campaign_id: campaignId || null
        })}>
          Add Implementation Tip
        </button>

        {editingImplTip && (
          <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setEditingImplTip(null)} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <h3>{editingImplTip.id ? 'Edit Implementation Tip' : 'Add Implementation Tip'}</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setMessage(null);
                try {
                  const payload = {
                    text: editingImplTip.text,
                    sort_order: editingImplTip.sort_order,
                    is_new: editingImplTip.is_new || false,
                    campaign_id: campaignId || null
                  };
                  if (editingImplTip.id) {
                    const { error } = await supabase.from('implementation_tips').update(payload).eq('id', editingImplTip.id);
                    if (error) throw error;
                    setMessage({ type: 'success', text: 'Tip updated!' });
                  } else {
                    const { error } = await supabase.from('implementation_tips').insert(payload);
                    if (error) throw error;
                    setMessage({ type: 'success', text: 'Tip created!' });
                  }
                  setEditingImplTip(null);
                  fetchData();
                } catch (err) {
                  setMessage({ type: 'error', text: 'Error saving tip: ' + err.message });
                } finally {
                  setSaving(false);
                }
              }}>
                <div className="form-group">
                  <label htmlFor="impl-tip-text">Tip Text *</label>
                  <textarea
                    id="impl-tip-text"
                    value={editingImplTip.text}
                    onChange={(e) => setEditingImplTip({ ...editingImplTip, text: e.target.value })}
                    required
                    rows="3"
                    placeholder="Enter the tip text..."
                  />
                  <small className="form-help">Supports **bold**, __underline__, and [links](url)</small>
                </div>
                <div className="form-group">
                  <label htmlFor="impl-tip-sort">Sort Order *</label>
                  <input
                    type="number"
                    id="impl-tip-sort"
                    value={editingImplTip.sort_order}
                    onChange={(e) => setEditingImplTip({ ...editingImplTip, sort_order: parseInt(e.target.value) || 1 })}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editingImplTip.is_new || false}
                      onChange={(e) => setEditingImplTip({ ...editingImplTip, is_new: e.target.checked })}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Mark as NEW
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Tip'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setEditingImplTip(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="admin-info-box" style={{ marginTop: '2rem' }}>
        <h3>What gets updated?</h3>
        <ul>
          <li><strong>Workflow Steps:</strong> The 3-step process shown on Ways of Working page</li>
          <li><strong>Best Practice Tips:</strong> Checklist of tips at the bottom of the page</li>
          <li><strong>Implementation Tips:</strong> Numbered tips in the "Tips for making implementation smoother" section</li>
          <li><strong>Formatting:</strong> Use **text** for bold, __text__ for underline, [text](url) for links</li>
        </ul>
      </div>
    </div>
  );
}
