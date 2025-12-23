import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import MarkerEditor from '../components/MarkerEditor';
import './AdminPage.css';

export default function AdminPage() {
  const [touchpoints, setTouchpoints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    platform: '',
    description: '',
    tier_premium: false,
    tier_executive: false,
    is_new: false,
    is_optional: false,
    sort_order: 1,
    image_url: '',
    marker_positions: []
  });

  // Fetch touchpoints from Supabase
  const fetchTouchpoints = async () => {
    const { data, error } = await supabase
      .from('touchpoints')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching touchpoints:', error);
    } else {
      setTouchpoints(data || []);
    }
  };

  useEffect(() => {
    fetchTouchpoints();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingItem) {
      // Update existing
      const { error } = await supabase
        .from('touchpoints')
        .update(formData)
        .eq('id', editingItem.id);

      if (error) console.error('Error updating:', error);
    } else {
      // Create new
      const { error } = await supabase
        .from('touchpoints')
        .insert([formData]);

      if (error) console.error('Error creating:', error);
    }

    // Reset form
    setFormData({
      title: '',
      slug: '',
      platform: '',
      description: '',
      tier_premium: false,
      tier_executive: false,
      is_new: false,
      is_optional: false,
      sort_order: 1,
      image_url: '',
      marker_positions: []
    });
    setEditingItem(null);
    setShowForm(false);
    fetchTouchpoints();
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this touchpoint?')) {
      const { error } = await supabase
        .from('touchpoints')
        .delete()
        .eq('id', id);

      if (error) console.error('Error deleting:', error);
      fetchTouchpoints();
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  // Handle CSV upload
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const data = results.data.map(row => ({
          title: row.title || row.Title,
          slug: row.slug || row.Slug,
          platform: row.platform || row.Platform,
          description: row.description || row.Description,
          tier_premium: row.tier_1 === 'Premium' || row.tier_premium === 'true',
          tier_executive: row.tier_2 === 'Executive' || row.tier_executive === 'true',
          is_new: row.is_new === 'TRUE' || row.is_new === 'true',
          is_optional: row.is_optional === 'TRUE' || row.is_optional === 'true',
          sort_order: parseInt(row.sortOrder || row.sort_order || 1)
        })).filter(item => item.title); // Filter out empty rows

        const { error } = await supabase
          .from('touchpoints')
          .insert(data);

        if (error) {
          console.error('Error uploading CSV:', error);
          alert('Error uploading CSV: ' + error.message);
        } else {
          alert(`Successfully uploaded ${data.length} touchpoints!`);
          fetchTouchpoints();
        }
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        alert('Error parsing CSV file');
      }
    });
  };

  return (
    <div className="app">
      <Header />

      <main style={{ paddingTop: '56px' }}>
        <div className="admin-container">
          <div className="admin-header">
            <h1>Touchpoint Management</h1>
            <div className="admin-actions">
              <button
                className="btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : '+ Add Touchpoint'}
              </button>
              <label className="btn-secondary">
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="admin-form-card">
              <h2>{editingItem ? 'Edit Touchpoint' : 'Add New Touchpoint'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Platform *</label>
                    <input
                      type="text"
                      value={formData.platform}
                      onChange={(e) => setFormData({...formData, platform: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Sort Order</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image_url && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={formData.image_url} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                    </div>
                  )}
                </div>

                <div className="form-checkboxes">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.tier_premium}
                      onChange={(e) => setFormData({...formData, tier_premium: e.target.checked})}
                    />
                    Premium
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.tier_executive}
                      onChange={(e) => setFormData({...formData, tier_executive: e.target.checked})}
                    />
                    Executive
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_new}
                      onChange={(e) => setFormData({...formData, is_new: e.target.checked})}
                    />
                    New
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_optional}
                      onChange={(e) => setFormData({...formData, is_optional: e.target.checked})}
                    />
                    Optional
                  </label>
                </div>

                <MarkerEditor
                  imageUrl={formData.image_url}
                  markers={formData.marker_positions || []}
                  onChange={(markers) => setFormData({...formData, marker_positions: markers})}
                />

                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update' : 'Create'} Touchpoint
                </button>
              </form>
            </div>
          )}

          {/* Touchpoints List */}
          <div className="admin-list">
            <h2>Touchpoints ({touchpoints.length})</h2>
            <div className="touchpoints-table">
              {touchpoints.map((item) => (
                <div key={item.id} className="touchpoint-row">
                  <div className="touchpoint-info">
                    <h3>{item.title}</h3>
                    <p>{item.platform}</p>
                    <div className="touchpoint-badges">
                      {item.is_new && <span className="badge-new">New</span>}
                      {item.tier_premium && <span className="badge-premium">Premium</span>}
                      {item.tier_executive && <span className="badge-executive">Executive</span>}
                      {item.is_optional && <span className="badge-optional">Optional</span>}
                    </div>
                  </div>
                  <div className="touchpoint-actions">
                    <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
