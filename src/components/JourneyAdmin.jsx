import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MarkerEditor from './MarkerEditor';
import './Badge.css';
import './JourneyAdmin.css';

const ACCENT_COLORS = [
  { value: '#a855f7', label: 'Purple' },
  { value: '#22c55e', label: 'Green' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#f97316', label: 'Orange' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#eab308', label: 'Yellow' },
];

const PLATFORM_TYPES = ['Web', 'App', 'In-Store'];

export default function JourneyAdmin() {
  const [pages, setPages] = useState([]);
  const [components, setComponents] = useState({});
  const [expandedPage, setExpandedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Page form state
  const [showPageForm, setShowPageForm] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [pageFormData, setPageFormData] = useState({
    title: '', platform_type: 'Web', accent_color: '#22c55e', screenshot_url: '', sort_order: 0,
  });

  // Component form state
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [componentFormData, setComponentFormData] = useState({
    title: '', description: '', tier_premium: true, tier_executive: true, is_new: false, is_optional: false, marker_number: 1, sort_order: 0, marker_positions: []
  });

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const { data: pagesData } = await supabase.from('journey_pages').select('*').order('sort_order');
    const { data: componentsData } = await supabase.from('journey_components').select('*').order('sort_order');

    setPages(pagesData || []);
    const grouped = {};
    (componentsData || []).forEach(c => {
      if (!grouped[c.page_id]) grouped[c.page_id] = [];
      grouped[c.page_id].push(c);
    });
    setComponents(grouped);
    setLoading(false);
  };

  // Image Upload to Supabase Storage
  const handleImageUpload = async (e, target = 'page') => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `journey-pages/${fileName}`;

      const { data, error } = await supabase.storage
        .from('touchpoint-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('touchpoint-images')
        .getPublicUrl(filePath);

      if (target === 'page') {
        setPageFormData({ ...pageFormData, screenshot_url: publicUrl });
      }
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Page CRUD
  const handlePageSubmit = async (e) => {
    e.preventDefault();
    const slug = pageFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const data = { ...pageFormData, slug };

    if (editingPage) {
      await supabase.from('journey_pages').update(data).eq('id', editingPage.id);
    } else {
      await supabase.from('journey_pages').insert([{ ...data, sort_order: pages.length + 1 }]);
    }
    resetPageForm();
    fetchAllData();
  };

  const handleDeletePage = async (id) => {
    if (confirm('Delete this page and all its components?')) {
      await supabase.from('journey_pages').delete().eq('id', id);
      if (expandedPage === id) setExpandedPage(null);
      fetchAllData();
    }
  };

  const resetPageForm = () => {
    setEditingPage(null);
    setPageFormData({ title: '', platform_type: 'Web', accent_color: '#22c55e', screenshot_url: '', sort_order: 0 });
    setShowPageForm(false);
  };

  // Component CRUD
  const handleComponentSubmit = async (e) => {
    e.preventDefault();
    const pageComps = components[expandedPage] || [];
    const data = { ...componentFormData, page_id: expandedPage };

    if (editingComponent) {
      await supabase.from('journey_components').update(data).eq('id', editingComponent.id);
    } else {
      await supabase.from('journey_components').insert([{ ...data, marker_number: pageComps.length + 1, sort_order: pageComps.length + 1 }]);
    }
    resetComponentForm();
    fetchAllData();
  };

  const handleDeleteComponent = async (id) => {
    if (confirm('Delete this component?')) {
      await supabase.from('journey_components').delete().eq('id', id);
      fetchAllData();
    }
  };

  const resetComponentForm = () => {
    setEditingComponent(null);
    setComponentFormData({ title: '', description: '', tier_premium: true, tier_executive: true, is_new: false, is_optional: false, marker_number: 1, sort_order: 0, marker_positions: [] });
    setShowComponentForm(false);
  };

  const startEditPage = (page) => {
    setEditingPage(page);
    setPageFormData({ title: page.title, platform_type: page.platform_type, accent_color: page.accent_color, screenshot_url: page.screenshot_url || '', sort_order: page.sort_order });
    setShowPageForm(true);
  };

  const startEditComponent = (comp) => {
    setEditingComponent(comp);
    setComponentFormData({
      title: comp.title,
      description: comp.description || '',
      tier_premium: comp.tier_premium,
      tier_executive: comp.tier_executive,
      is_new: comp.is_new,
      is_optional: comp.is_optional,
      marker_number: comp.marker_number,
      sort_order: comp.sort_order,
      marker_positions: comp.marker_positions || []
    });
    setShowComponentForm(true);
  };

  const startAddComponent = () => {
    const pageComps = components[expandedPage] || [];
    setComponentFormData({ title: '', description: '', tier_premium: true, tier_executive: true, is_new: false, is_optional: false, marker_number: pageComps.length + 1, sort_order: pageComps.length + 1, marker_positions: [] });
    setShowComponentForm(true);
  };

  // Get current page for screenshot URL (for MarkerEditor)
  const getCurrentPageScreenshot = () => {
    const page = pages.find(p => p.id === expandedPage);
    return page?.screenshot_url || '';
  };

  if (loading) return <div className="journey-admin"><div className="loading">Loading...</div></div>;

  return (
    <div className="journey-admin">
      <div className="admin-header-row">
        <h2>Journey Pages</h2>
        <button className="btn-primary" onClick={() => { resetPageForm(); setShowPageForm(true); }}>+ Add Page</button>
      </div>

      {/* Accordion - Mirrors Front-End */}
      <div className="admin-accordion">
        {pages.map((page) => {
          const pageComps = components[page.id] || [];
          const isExpanded = expandedPage === page.id;

          return (
            <div key={page.id} className={`admin-accordion-item ${isExpanded ? 'expanded' : ''}`}>
              {/* Header Row */}
              <div className="admin-accordion-header" style={{ '--accent': page.accent_color }}>
                <div className="accent-bar" />
                <div className="header-content" onClick={() => setExpandedPage(isExpanded ? null : page.id)}>
                  <span className="platform-tag">{page.platform_type}</span>
                  <h3>{page.title}</h3>
                  <span className="comp-count">{pageComps.length} components</span>
                </div>
                <div className="header-actions">
                  <button className="btn-icon" onClick={() => startEditPage(page)} title="Edit Page">✏️</button>
                  <button className="btn-icon btn-danger" onClick={() => handleDeletePage(page.id)} title="Delete Page">🗑️</button>
                  <span className={`chevron ${isExpanded ? 'open' : ''}`} onClick={() => setExpandedPage(isExpanded ? null : page.id)}>▼</span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="admin-accordion-body">
                  <div className="admin-split-view">
                    {/* Left: Screenshot Preview with Markers */}
                    <div className="admin-screenshot-panel">
                      {page.screenshot_url ? (
                        <div className="screenshot-preview">
                          <img src={page.screenshot_url} alt={page.title} />
                          {pageComps.map((c) => {
                            const markers = c.marker_positions || [];
                            return markers.map((marker, mi) => (
                              <div key={`${c.id}-${mi}`} className="preview-marker" style={{ top: marker.top, left: marker.left }}>
                                {marker.number}
                              </div>
                            ));
                          })}
                        </div>
                      ) : (
                        <div className="no-screenshot">
                          <p>No screenshot</p>
                          <button className="btn-secondary btn-sm" onClick={() => startEditPage(page)}>Add Screenshot</button>
                        </div>
                      )}
                    </div>

                    {/* Right: Components List */}
                    <div className="admin-components-panel">
                      <div className="components-header">
                        <span>Components</span>
                        <button className="btn-primary btn-sm" onClick={startAddComponent}>+ Add Component</button>
                      </div>

                      <div className="components-list">
                        {pageComps.map((comp) => (
                          <div key={comp.id} className="admin-component-card">
                            <div className="comp-marker" style={{ background: page.accent_color }}>{comp.marker_number}</div>
                            <div className="comp-content">
                              <h4>{comp.title}</h4>
                              <p>{comp.description?.substring(0, 80)}{comp.description?.length > 80 ? '...' : ''}</p>
                              <div className="comp-badges">
                                {comp.is_new && <span className="badge badge--new">New</span>}
                                {comp.tier_premium && <span className="badge badge--premium">Premium</span>}
                                {comp.tier_executive && <span className="badge badge--executive">Executive</span>}
                                {comp.is_optional && <span className="badge badge--optional">Optional</span>}
                              </div>
                              {comp.marker_positions?.length > 0 && (
                                <div className="marker-count">{comp.marker_positions.length} marker{comp.marker_positions.length !== 1 ? 's' : ''} positioned</div>
                              )}
                            </div>
                            <div className="comp-actions">
                              <button className="btn-icon" onClick={() => startEditComponent(comp)}>✏️</button>
                              <button className="btn-icon btn-danger" onClick={() => handleDeleteComponent(comp.id)}>🗑️</button>
                            </div>
                          </div>
                        ))}

                        {pageComps.length === 0 && (
                          <div className="empty-components">
                            <p>No components yet</p>
                            <button className="btn-primary btn-sm" onClick={startAddComponent}>+ Add First Component</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {pages.length === 0 && (
          <div className="empty-pages">
            <p>No pages yet. Create your first page to get started.</p>
            <button className="btn-primary" onClick={() => setShowPageForm(true)}>+ Add First Page</button>
          </div>
        )}
      </div>

      {/* Page Form Modal */}
      {showPageForm && (
        <div className="modal-overlay" onClick={resetPageForm}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPage ? 'Edit Page' : 'Add New Page'}</h2>
            <form onSubmit={handlePageSubmit}>
              <div className="form-group">
                <label>Page Title *</label>
                <input type="text" value={pageFormData.title} onChange={(e) => setPageFormData({ ...pageFormData, title: e.target.value })} required placeholder="e.g., Tailored Content Landing Page" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Platform</label>
                  <select value={pageFormData.platform_type} onChange={(e) => setPageFormData({ ...pageFormData, platform_type: e.target.value })}>
                    {PLATFORM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Accent Color</label>
                  <div className="color-picker">
                    {ACCENT_COLORS.map(c => (
                      <button key={c.value} type="button" className={`color-swatch ${pageFormData.accent_color === c.value ? 'selected' : ''}`} style={{ background: c.value }} onClick={() => setPageFormData({ ...pageFormData, accent_color: c.value })} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="form-group">
                <label>Screenshot Image</label>
                <div className="upload-row">
                  <label className="btn-secondary upload-btn">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'page')} disabled={uploading} style={{ display: 'none' }} />
                  </label>
                  <span className="or-text">or paste URL:</span>
                </div>
                <input type="url" value={pageFormData.screenshot_url} onChange={(e) => setPageFormData({ ...pageFormData, screenshot_url: e.target.value })} placeholder="https://..." />
                {pageFormData.screenshot_url && <img src={pageFormData.screenshot_url} alt="Preview" className="form-preview" />}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetPageForm}>Cancel</button>
                <button type="submit" className="btn-primary">{editingPage ? 'Update' : 'Create'} Page</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Component Form Modal with MarkerEditor */}
      {showComponentForm && (
        <div className="modal-overlay" onClick={resetComponentForm}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{editingComponent ? 'Edit Component' : 'Add Component'}</h2>
            <form onSubmit={handleComponentSubmit}>
              <div className="form-group">
                <label>Component Title *</label>
                <input type="text" value={componentFormData.title} onChange={(e) => setComponentFormData({ ...componentFormData, title: e.target.value })} required placeholder="e.g., Hero Banner" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={componentFormData.description} onChange={(e) => setComponentFormData({ ...componentFormData, description: e.target.value })} rows="3" placeholder="What does this component do?" />
              </div>
              <div className="form-checkboxes">
                <label><input type="checkbox" checked={componentFormData.tier_premium} onChange={(e) => setComponentFormData({ ...componentFormData, tier_premium: e.target.checked })} /> Premium</label>
                <label><input type="checkbox" checked={componentFormData.tier_executive} onChange={(e) => setComponentFormData({ ...componentFormData, tier_executive: e.target.checked })} /> Executive</label>
                <label><input type="checkbox" checked={componentFormData.is_new} onChange={(e) => setComponentFormData({ ...componentFormData, is_new: e.target.checked })} /> New</label>
                <label><input type="checkbox" checked={componentFormData.is_optional} onChange={(e) => setComponentFormData({ ...componentFormData, is_optional: e.target.checked })} /> Optional</label>
              </div>

              {/* Marker Editor */}
              <MarkerEditor
                imageUrl={getCurrentPageScreenshot()}
                markers={componentFormData.marker_positions || []}
                onChange={(markers) => setComponentFormData({ ...componentFormData, marker_positions: markers })}
              />

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetComponentForm}>Cancel</button>
                <button type="submit" className="btn-primary">{editingComponent ? 'Update' : 'Add'} Component</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
