
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MarkerEditor from './MarkerEditor'; // Re-use if needed, though maybe not for resources yet
import './ResourcesAdmin.css'; // We'll create this or use AdminPage.css

export default function ResourcesAdmin() {
    const [resources, setResources] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Visual Assets',
        image_url: '',
        link: '' // Figma link
    });

    const categories = [
        "Visual Assets",
        "Copy & Messaging",
        "Templates",
        "Creative",
        "Content",
        "Product",
        "Brand",
        "Technical",
        "Social Media"
    ];

    const fetchResources = async () => {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error('Error fetching resources:', error);
        } else {
            setResources(data || []);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `res-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `resource-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('touchpoint-images') // Re-using existing bucket for now or create new
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('touchpoint-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: publicUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('resources')
                    .update(formData)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('resources')
                    .insert([formData]);
                if (error) throw error;
            }

            setFormData({
                title: '',
                description: '',
                category: 'Visual Assets',
                image_url: '',
                link: ''
            });
            setEditingItem(null);
            setShowForm(false);
            fetchResources();
        } catch (error) {
            console.error('Error saving resource:', error);
            if (
                (error.message && error.message.includes('column "image_url" of relation "resources" does not exist')) ||
                (error.message && error.message.includes('column "link" of relation "resources" does not exist')) ||
                (error.message && error.message.includes('column "detail_headline" of relation "resources" does not exist')) ||
                (error.message && error.message.includes('column "detail_content" of relation "resources" does not exist')) ||
                (error.message && error.message.includes('column "embed_code" of relation "resources" does not exist')) ||
                (error.message && error.message.includes('schema cache'))
            ) {
                alert(
                    "DATABASE UPDATE REQUIRED:\n\n" +
                    "Some columns are missing from your database.\n" +
                    "Please go to your Supabase SQL Editor and run this command:\n\n" +
                    "ALTER TABLE resources \n" +
                    "ADD COLUMN IF NOT EXISTS image_url TEXT,\n" +
                    "ADD COLUMN IF NOT EXISTS link TEXT,\n" +
                    "ADD COLUMN IF NOT EXISTS detail_headline TEXT,\n" +
                    "ADD COLUMN IF NOT EXISTS detail_content TEXT,\n" +
                    "ADD COLUMN IF NOT EXISTS embed_code TEXT;"
                );
            } else {
                alert('Error saving resource: ' + error.message);
            }
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            description: item.description || '',
            category: item.category || 'Visual Assets',
            image_url: item.image_url || '',
            link: item.link || '',
            embed_code: item.embed_code || '',
            detail_headline: item.detail_headline || '',
            detail_content: item.detail_content || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            const { error } = await supabase
                .from('resources')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting:', error);
                alert('Error deleting resource');
            } else {
                fetchResources();
            }
        }
    };

    return (
        <div className="resources-admin">
            <div className="admin-section-header">
                <h2>Resources Management</h2>
                <button
                    className="btn-primary"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingItem(null);
                        setFormData({
                            title: '',
                            description: '',
                            category: 'Visual Assets',
                            image_url: '',
                            link: ''
                        });
                    }}
                >
                    {showForm ? 'Cancel' : '+ Add Resource'}
                </button>
            </div>

            {showForm && (
                <div className="admin-form-card">
                    <h2>{editingItem ? 'Edit Resource' : 'Add New Resource'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Preview Image</label>
                            <div className="image-upload-row">
                                <label className="btn-secondary">
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                        disabled={uploading}
                                    />
                                </label>
                                <span>or URL:</span>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            {formData.image_url && (
                                <div className="preview-image-container">
                                    <img src={formData.image_url} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Embed Code (iframe)</label>
                            <textarea
                                value={formData.embed_code || ''}
                                onChange={e => setFormData({ ...formData, embed_code: e.target.value })}
                                rows="3"
                                placeholder='<iframe src="..." ...></iframe>'
                            />
                        </div>

                        <div className="form-group">
                            <label>Figma/External Link (for Button)</label>
                            <input
                                type="text"
                                value={formData.link || ''}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                                placeholder="https://figma.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Detail Page Headline</label>
                            <input
                                type="text"
                                value={formData.detail_headline || ''}
                                onChange={e => setFormData({ ...formData, detail_headline: e.target.value })}
                                placeholder="e.g. Creating impactful advertising..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Detail Page Content (Markdown/HTML capable)</label>
                            <textarea
                                value={formData.detail_content || ''}
                                onChange={e => setFormData({ ...formData, detail_content: e.target.value })}
                                rows="6"
                                placeholder="Enter the detailed description for the inner page..."
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            {editingItem ? 'Update' : 'Create'} Resource
                        </button>
                    </form>
                </div>
            )}

            <div className="admin-list">
                <h3>All Resources ({resources.length})</h3>
                <div className="resources-list-grid">
                    {resources.map(res => (
                        <div key={res.id} className="admin-resource-item">
                            <div className="res-content">
                                <h4>{res.title}</h4>
                                <span className="res-cat">{res.category}</span>
                            </div>
                            <div className="res-actions">
                                <button onClick={() => handleEdit(res)} className="btn-edit">Edit</button>
                                <button onClick={() => handleDelete(res.id)} className="btn-delete">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
