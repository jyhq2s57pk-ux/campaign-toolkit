import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MarkerEditor from './MarkerEditor';
import MediaLibrary from './MediaLibrary';
import './Badge.css';
import './JourneyAdmin.css';

// Marker Line SVG (Matches Frontend)
const MarkerLine = () => (
  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.375 9L0.375001 9" stroke="#D6D6D6" strokeWidth="0.75" strokeLinecap="round" />
  </svg>
);

const PLATFORM_TYPES = ['Web', 'App', 'In-Store'];

export default function JourneyAdmin({ campaignId }) {
  const [pages, setPages] = useState([]);
  const [components, setComponents] = useState({});
  const [expandedPage, setExpandedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

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

  useEffect(() => { fetchAllData(); }, [campaignId]);

  const fetchAllData = async () => {
    setLoading(true);
    // 1. Fetch Platforms (Pages) — scoped to campaign
    let platformsQuery = supabase
      .from('platforms')
      .select('*');

    if (campaignId) {
      platformsQuery = platformsQuery.eq('campaign_id', campaignId);
    }

    const { data: platformsData, error: pagesError } = await platformsQuery
      .order('sort_order', { ascending: true });

    if (pagesError) console.error('Error fetching platforms:', pagesError);

    // Map platforms to the internal 'page' structure expected by UI
    const mappedPages = (platformsData || []).map(p => ({
      id: p.id,
      title: p.name,
      platform_type: p.type || 'Web',
      accent_color: p.accent_color || '#22c55e',
      screenshot_url: p.screenshot_url,
      sort_order: p.sort_order || 0,
      is_active: p.is_active !== false
    }));
    setPages(mappedPages);

    // 2. Fetch Touchpoints (Components) — scoped to campaign
    let touchpointsQuery = supabase
      .from('touchpoints')
      .select('*');

    if (campaignId) {
      touchpointsQuery = touchpointsQuery.eq('campaign_id', campaignId);
    }

    const { data: touchpointsData, error: compsError } = await touchpointsQuery
      .order('sort_order', { ascending: true });

    if (compsError) console.error('Error fetching touchpoints:', compsError);

    // Group touchpoints by platform ID matching
    const grouped = {};
    (touchpointsData || []).forEach(c => {
      // Find the platform that matches this touchpoint's platform string name
      const page = mappedPages.find(p => p.title === c.platform);
      // Fallback: if platform renamed, might lose link, but for now strict match
      if (page) {
        if (!grouped[page.id]) grouped[page.id] = [];
        // Add virtual marker number if missing
        if (!c.marker_number) c.marker_number = grouped[page.id].length + 1;
        grouped[page.id].push(c);
      }
    });

    setComponents(grouped);
    setLoading(false);
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      // Generate unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      // Store in a 'journey-pages' folder to keep things organized
      const filePath = `journey-pages/${fileName}`;

      // Upload to the existing 'touchpoint-images' bucket
      const { error: uploadError } = await supabase.storage
        .from('touchpoint-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('touchpoint-images')
        .getPublicUrl(filePath);

      // Update the form data
      if (type === 'page') {
        setPageFormData(prev => ({ ...prev, screenshot_url: data.publicUrl }));
      }
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
    // Prepare data for 'platforms' table
    const data = {
      name: pageFormData.title,
      type: pageFormData.platform_type,
      accent_color: pageFormData.accent_color,
      screenshot_url: pageFormData.screenshot_url,
      sort_order: pageFormData.sort_order || (pages.length + 1),
      campaign_id: campaignId || null
    };

    if (editingPage) {
      await supabase.from('platforms').update(data).eq('id', editingPage.id);
      // If name changed, we really should update related touchpoints' platform string, 
      // but that's complex without foreign keys. Warn or ignore for now (or simple update).
      if (editingPage.title !== pageFormData.title) {
        let renameQuery = supabase.from('touchpoints')
          .update({ platform: pageFormData.title })
          .eq('platform', editingPage.title);
        if (campaignId) {
          renameQuery = renameQuery.eq('campaign_id', campaignId);
        }
        await renameQuery;
      }
    } else {
      await supabase.from('platforms').insert([data]);
    }
    resetPageForm();
    fetchAllData();
  };

  const handleDeletePage = async (id) => {
    if (confirm('Delete this page and all its components?')) {
      const page = pages.find(p => p.id === id);
      if (page) {
        // Delete components first (by platform name, scoped to campaign)
        let deleteQuery = supabase.from('touchpoints').delete().eq('platform', page.title);
        if (campaignId) {
          deleteQuery = deleteQuery.eq('campaign_id', campaignId);
        }
        await deleteQuery;
        // Delete platform
        await supabase.from('platforms').delete().eq('id', id);
      }
      if (expandedPage === id) setExpandedPage(null);
      fetchAllData();
    }
  };

  const handleToggleActive = async (pageId) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    const newActive = !page.is_active;

    // Optimistic update
    setPages(prev => prev.map(p =>
      p.id === pageId ? { ...p, is_active: newActive } : p
    ));

    const { error } = await supabase
      .from('platforms')
      .update({ is_active: newActive })
      .eq('id', pageId);

    if (error) {
      console.error('Error toggling page active state:', error);
      // Revert on error
      setPages(prev => prev.map(p =>
        p.id === pageId ? { ...p, is_active: !newActive } : p
      ));
    }
  };

  const handleMovePage = async (pageId, direction) => {
    const currentIndex = pages.findIndex(p => p.id === pageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= pages.length) return;

    const updatedList = [...pages];
    [updatedList[currentIndex], updatedList[newIndex]] = [updatedList[newIndex], updatedList[currentIndex]];

    const updates = updatedList.map((p, idx) => ({
      id: p.id,
      sort_order: idx + 1
    }));

    // Optimistic update
    setPages(updatedList.map((p, idx) => ({ ...p, sort_order: idx + 1 })));

    // Persist to DB
    const updatePromises = updates.map(u =>
      supabase.from('platforms').update({ sort_order: u.sort_order }).eq('id', u.id)
    );

    const results = await Promise.all(updatePromises);
    const error = results.find(r => r.error)?.error;

    if (error) {
      console.error('Error reordering pages:', error);
      fetchAllData(); // Revert on error
    }
  };

  const resetPageForm = () => {
    setEditingPage(null);
    setPageFormData({ title: '', platform_type: 'Web', accent_color: '#22c55e', screenshot_url: '', sort_order: 0 });
    setShowPageForm(false);
  };

  const openNewPageForm = () => {
    resetPageForm();
    setShowPageForm(true);
  }

  // Component CRUD
  const handleComponentSubmit = async (e) => {
    e.preventDefault();
    // valid pages - use loose equality to handle potential string/number type mismatches
    const page = pages.find(p => p.id == expandedPage);

    if (!page) {
      console.error('HandleComponentSubmit: Page not found for expandedPage ID:', expandedPage);
      alert('Error: No active page found. Please try closing and re-opening the page accordion.');
      return;
    }

    const pageComps = components[expandedPage] || [];

    // Data for 'touchpoints' table
    const data = {
      title: componentFormData.title,
      description: componentFormData.description,
      platform: page.title, // LINKING BY NAME
      tier_premium: componentFormData.tier_premium,
      tier_executive: componentFormData.tier_executive,
      tier_standard: componentFormData.tier_standard,
      is_new: componentFormData.is_new,
      is_optional: componentFormData.is_optional,
      marker_positions: componentFormData.marker_positions || [],
      sort_order: componentFormData.sort_order || (pageComps.length + 1),
      campaign_id: campaignId || null,
    };

    if (editingComponent) {
      await supabase.from('touchpoints').update(data).eq('id', editingComponent.id);
    } else {
      await supabase.from('touchpoints').insert([data]);
    }
    resetComponentForm();
    fetchAllData();
  };

  const handleDeleteComponent = async (id) => {
    if (confirm('Delete this touchpoint?')) {
      await supabase.from('touchpoints').delete().eq('id', id);
      fetchAllData();
    }
  };

  const handleMoveComponent = async (compId, pageId, direction) => {
    const pageComps = components[pageId] || [];
    const currentIndex = pageComps.findIndex(c => c.id === compId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= pageComps.length) return; // Out of bounds

    // Create a copy of the list to manipulate
    const updatedList = [...pageComps];

    // Swap elements
    [updatedList[currentIndex], updatedList[newIndex]] = [updatedList[newIndex], updatedList[currentIndex]];

    // Re-assign sort_orders based on new index
    const updates = updatedList.map((c, idx) => ({
      id: c.id,
      sort_order: idx + 1
    }));

    // Optimistic update: Update local state immediately
    setComponents(prev => ({
      ...prev,
      [pageId]: updatedList.map((c, idx) => ({ ...c, sort_order: idx + 1 }))
    }));

    // Persist to DB
    // Using individual updates is safer than upsert as it bypasses required-field constraints for existing rows
    const updatePromises = updates.map(u =>
      supabase.from('touchpoints').update({ sort_order: u.sort_order }).eq('id', u.id)
    );

    const results = await Promise.all(updatePromises);
    const error = results.find(r => r.error)?.error;

    if (error) {
      console.error('Error reordering components:', error);
      alert('Failed to save new order');
      fetchAllData(); // Revert on error
    }
  };

  const resetComponentForm = () => {
    setEditingComponent(null);
    setComponentFormData({ title: '', description: '', tier_premium: true, tier_executive: true, tier_standard: true, is_new: false, is_optional: false, marker_number: 1, sort_order: 0, marker_positions: [] });
    setShowComponentForm(false);
  };

  const startEditPage = (page) => {
    setEditingPage(page);
    setPageFormData({
      title: page.title || '',
      platform_type: page.platform_type || 'Web',
      accent_color: page.accent_color || '#22c55e',
      screenshot_url: page.screenshot_url || '',
      sort_order: page.sort_order || 0
    });
    setShowPageForm(true);
  };

  const startEditComponent = (comp) => {
    setEditingComponent(comp);
    setComponentFormData({
      title: comp.title || '',
      description: comp.description || '',
      tier_premium: comp.tier_premium || false,
      tier_executive: comp.tier_executive || false,
      tier_standard: comp.tier_standard !== false,
      is_new: comp.is_new || false,
      is_optional: comp.is_optional || false,
      marker_number: comp.marker_number || 1,
      sort_order: comp.sort_order || 0,
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
        <h2>Customer Touchpoints</h2>
        <button className="btn-primary" onClick={openNewPageForm}>+ Add Page</button>
      </div>

      {/* Accordion - Mirrors Front-End */}
      <div className="admin-accordion">
        {pages.map((page, index) => {
          const pageComps = components[page.id] || [];
          const isExpanded = expandedPage === page.id;

          return (
            <div key={page.id} className={`admin-accordion-item ${isExpanded ? 'expanded' : ''} ${!page.is_active ? 'inactive' : ''}`}>
              {/* Header Row */}
              <div className="admin-accordion-header" style={{ '--accent': page.accent_color }}>
                <div className="accent-bar" />
                <div className="page-reorder">
                  <button
                    className="btn-icon-tiny"
                    disabled={index === 0}
                    onClick={() => handleMovePage(page.id, 'up')}
                    title="Move Up"
                  >▲</button>
                  <button
                    className="btn-icon-tiny"
                    disabled={index === pages.length - 1}
                    onClick={() => handleMovePage(page.id, 'down')}
                    title="Move Down"
                  >▼</button>
                </div>
                <div className="header-content" onClick={() => setExpandedPage(isExpanded ? null : page.id)}>
                  <span className="platform-tag">{page.platform_type}</span>
                  <h3>{page.title}</h3>
                  <span className="comp-count">{pageComps.length} Touchpoints</span>
                  {!page.is_active && <span className="hidden-badge">Hidden</span>}
                </div>
                <div className="header-actions">
                  <button
                    className={`btn-icon ${page.is_active ? '' : 'btn-muted'}`}
                    onClick={() => handleToggleActive(page.id)}
                    title={page.is_active ? 'Hide from front-end' : 'Show on front-end'}
                  >{page.is_active ? '👁️' : '👁️‍🗨️'}</button>
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
                          <div className="screenshot-wrapper">
                            <img src={page.screenshot_url} alt={page.title} />
                            {/* Markers Container */}
                            <div className="admin-markers-container">
                              {pageComps.map((c) => {
                                const markers = c.marker_positions || [];
                                return markers.map((marker, mi) => (
                                  <div key={`${c.id}-${mi}`} className="marker-row" style={{ top: marker.top }}>
                                    <MarkerLine />
                                    <div className="number-label">
                                      <span className="number-label-text">{c.marker_number}</span>
                                    </div>
                                  </div>
                                ));
                              })}
                            </div>
                          </div>
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
                        <span>Touchpoints</span>
                        <button className="btn-primary btn-sm" onClick={startAddComponent}>+ Add Touchpoint</button>
                      </div>

                      <div className="components-list">
                        {pageComps.map((comp, index) => (
                          <div key={comp.id} className="admin-component-card">
                            <div className="comp-reorder">
                              <button
                                className="btn-icon-tiny"
                                disabled={index === 0}
                                onClick={() => handleMoveComponent(comp.id, page.id, 'up')}
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                className="btn-icon-tiny"
                                disabled={index === pageComps.length - 1}
                                onClick={() => handleMoveComponent(comp.id, page.id, 'down')}
                                title="Move Down"
                              >
                                ▼
                              </button>
                            </div>
                            <div className="comp-marker">{comp.marker_number}</div>
                            <div className="comp-content">
                              <h4>{comp.title}</h4>
                              <p>{comp.description?.substring(0, 80)}{comp.description?.length > 80 ? '...' : ''}</p>
                              <div className="comp-badges">
                                {comp.is_new && <span className="badge badge--new">New</span>}
                                {comp.tier_premium && <span className="badge badge--premium">Premium</span>}
                                {comp.tier_executive && <span className="badge badge--executive">Executive</span>}
                                {comp.tier_standard !== false && <span className="badge badge--standard">Standard</span>}
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
                            <p>No touchpoints yet</p>
                            <button className="btn-primary btn-sm" onClick={startAddComponent}>+ Add First Touchpoint</button>
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
            <button className="btn-primary" onClick={openNewPageForm}>+ Add First Page</button>
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
                <input type="text" value={pageFormData.title || ''} onChange={(e) => setPageFormData({ ...pageFormData, title: e.target.value })} required placeholder="e.g., Tailored Content Landing Page" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Platform</label>
                  <select value={pageFormData.platform_type || 'Web'} onChange={(e) => setPageFormData({ ...pageFormData, platform_type: e.target.value })}>
                    {PLATFORM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <div className="color-picker-hidden" style={{ display: 'none' }}></div>
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
                  <button type="button" className="btn-secondary upload-btn" onClick={() => setShowMediaLibrary(true)}>
                    Browse Library
                  </button>
                  <span className="or-text">or paste URL:</span>
                </div>
                <input type="url" value={pageFormData.screenshot_url || ''} onChange={(e) => setPageFormData({ ...pageFormData, screenshot_url: e.target.value })} placeholder="https://..." />
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
            <h2>{editingComponent ? 'Edit Touchpoint' : 'Add Touchpoint'}</h2>
            <form onSubmit={handleComponentSubmit}>
              <div className="form-group">
                <label>Touchpoint Title *</label>
                <input type="text" value={componentFormData.title || ''} onChange={(e) => setComponentFormData({ ...componentFormData, title: e.target.value })} required placeholder="e.g., Hero Banner" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={componentFormData.description || ''} onChange={(e) => setComponentFormData({ ...componentFormData, description: e.target.value })} rows="3" placeholder="What does this touchpoint do?" />
              </div>
              <div className="form-checkboxes">
                <label><input type="checkbox" checked={componentFormData.tier_premium || false} onChange={(e) => setComponentFormData({ ...componentFormData, tier_premium: e.target.checked })} /> Premium</label>
                <label><input type="checkbox" checked={componentFormData.tier_executive || false} onChange={(e) => setComponentFormData({ ...componentFormData, tier_executive: e.target.checked })} /> Executive</label>
                <label><input type="checkbox" checked={componentFormData.tier_standard !== false} onChange={(e) => setComponentFormData({ ...componentFormData, tier_standard: e.target.checked })} /> Standard</label>
                <label><input type="checkbox" checked={componentFormData.is_new || false} onChange={(e) => setComponentFormData({ ...componentFormData, is_new: e.target.checked })} /> New</label>
                <label><input type="checkbox" checked={componentFormData.is_optional || false} onChange={(e) => setComponentFormData({ ...componentFormData, is_optional: e.target.checked })} /> Optional</label>
              </div>

              {/* Marker Editor */}
              <MarkerEditor
                imageUrl={getCurrentPageScreenshot()}
                markers={componentFormData.marker_positions || []}
                onChange={(markers) => setComponentFormData({ ...componentFormData, marker_positions: markers })}
              />

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetComponentForm}>Cancel</button>
                <button type="submit" className="btn-primary">{editingComponent ? 'Update' : 'Add'} Touchpoint</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(url) => {
          setPageFormData({ ...pageFormData, screenshot_url: url });
          setShowMediaLibrary(false);
        }}
      />
    </div>
  );
}
