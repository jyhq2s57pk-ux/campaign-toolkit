import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './AdminComponents.css';

export default function WaysOfWorkingAdmin() {
  const [steps, setSteps] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [editingTip, setEditingTip] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch process steps
      const { data: processData, error: processError } = await supabase
        .from('wow_process')
        .select('*')
        .order('sort_order');

      if (processError) throw processError;

      // Fetch tips (stored in wow_timeline for now)
      const { data: tipsData, error: tipsError } = await supabase
        .from('wow_timeline')
        .select('*')
        .order('sort_order');

      if (tipsError) throw tipsError;

      setSteps(processData || []);
      setTips(tipsData || []);
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
            sort_order: editingStep.sort_order
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
            sort_order: editingStep.sort_order
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
            sort_order: editingTip.sort_order
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
            sort_order: editingTip.sort_order
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
          <div className="modal-overlay" onClick={() => setEditingStep(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                    Supports markdown-style formatting: **bold**, line breaks, HTML tags
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
          <div className="modal-overlay" onClick={() => setEditingTip(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

      <div className="admin-info-box" style={{ marginTop: '2rem' }}>
        <h3>What gets updated?</h3>
        <ul>
          <li><strong>Workflow Steps:</strong> The 3-step process shown on Ways of Working page</li>
          <li><strong>Best Practice Tips:</strong> Checklist of tips at the bottom of the page</li>
          <li><strong>Formatting:</strong> Use **text** for bold, line breaks for structure</li>
        </ul>
      </div>
    </div>
  );
}
