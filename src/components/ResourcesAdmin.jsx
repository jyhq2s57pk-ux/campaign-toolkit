import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MarkerEditor from './MarkerEditor'; // Re-use if needed, though maybe not for resources yet
import './ResourcesAdmin.css'; // We'll create this or use AdminPage.css

export default function ResourcesAdmin() {
    const [resources, setResources] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0); // For uploading images to specific card

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Visual Assets',
        hero_cards: [], // Array of { image_url, detail_headline, detail_content, link }
        show_embed: true,
        embed_code: '',
        // Resource Card Component
        show_resource_card: false,
        // Resource Card Components (Array)
        show_resource_card: false,
        resource_cards: [], // Array of { title, body, cta, image, link, label, body_label, cta_label }
        // Legacy/Root fields for compatibility/thumbnails
        image_url: '',
        link: ''
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

    const handleImageUpload = async (e, cardIndex) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploading(true);
        setActiveCardIndex(cardIndex);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `res-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `resource-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('touchpoint-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('touchpoint-images')
                .getPublicUrl(filePath);

            const newCards = [...formData.hero_cards];
            newCards[cardIndex] = { ...newCards[cardIndex], image_url: publicUrl };
            setFormData({ ...formData, hero_cards: newCards });

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
            setActiveCardIndex(-1);
        }
    };

    const handleResourceCardImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `res-card-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `resource-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('touchpoint-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('touchpoint-images')
                .getPublicUrl(filePath);

            const newCards = [...formData.resource_cards];
            newCards[index] = { ...newCards[index], image: publicUrl };
            setFormData({ ...formData, resource_cards: newCards });

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAddResourceCard = () => {
        setFormData({
            ...formData,
            resource_cards: [
                ...formData.resource_cards,
                { title: '', body: '', cta: '', image: '', link: '', label: '', body_label: '', cta_label: '' }
            ]
        });
    };

    const handleRemoveResourceCard = (index) => {
        const newCards = formData.resource_cards.filter((_, i) => i !== index);
        setFormData({ ...formData, resource_cards: newCards });
    };

    const handleResourceCardChange = (index, field, value) => {
        const newCards = [...formData.resource_cards];
        newCards[index] = { ...newCards[index], [field]: value };
        setFormData({ ...formData, resource_cards: newCards });
    };

    const handleAddCard = () => {
        setFormData({
            ...formData,
            hero_cards: [
                ...formData.hero_cards,
                {
                    image_url: '',
                    detail_headline: '',
                    detail_content: '',
                    link: ''
                }
            ]
        });
    };

    const handleRemoveCard = (index) => {
        const newCards = formData.hero_cards.filter((_, i) => i !== index);
        setFormData({ ...formData, hero_cards: newCards });
    };

    const handleCardChange = (index, field, value) => {
        const newCards = [...formData.hero_cards];
        newCards[index] = { ...newCards[index], [field]: value };
        setFormData({ ...formData, hero_cards: newCards });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Sync root fields with first card for backward compatibility/preview
        const rootImage = formData.hero_cards[0]?.image_url || '';
        const rootLink = formData.hero_cards[0]?.link || '';

        // Also sync old legacy fields if needed, but primarily we rely on hero_cards now.
        const rootHeadline = formData.hero_cards[0]?.detail_headline || '';
        const rootContent = formData.hero_cards[0]?.detail_content || '';

        const dataToSave = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            hero_cards: formData.hero_cards,
            show_embed: formData.show_embed,
            embed_code: formData.embed_code,
            show_resource_card: formData.show_resource_card,
            show_resource_card: formData.show_resource_card,
            // Save as 'resource_card' column but sending an array (JSONB allows array) or handle name change.
            // Let's stick to the column name 'resource_card' for simplicity but store the array.
            resource_card: formData.resource_cards,
            // Legacy/Mirror fields
            image_url: rootImage,
            link: rootLink,
            detail_headline: rootHeadline,
            detail_content: rootContent
        };

        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('resources')
                    .update(dataToSave)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('resources')
                    .insert([dataToSave]);
                if (error) throw error;
            }

            resetForm();
            fetchResources();
        } catch (error) {
            console.error('Error saving resource:', error);
            if (
                (error.message && error.message.includes('column "hero_cards" of relation "resources" does not exist')) ||
                (error.message && error.message.includes('column "show_embed" of relation "resources" does not exist')) ||
                (error.message && error.message.includes('column "show_resource_card" of relation "resources" does not exist')) ||
                (error.message && error.message.includes('column "resource_card" of relation "resources" does not exist'))
            ) {
                alert(
                    "DATABASE UPDATE REQUIRED:\n\n" +
                    "Please run this in Supabase SQL Editor:\n\n" +
                    "ALTER TABLE resources \n" +
                    "ADD COLUMN IF NOT EXISTS hero_cards JSONB DEFAULT '[]'::jsonb,\n" +
                    "ADD COLUMN IF NOT EXISTS show_embed BOOLEAN DEFAULT true,\n" +
                    "ADD COLUMN IF NOT EXISTS show_resource_card BOOLEAN DEFAULT false,\n" +
                    "ADD COLUMN IF NOT EXISTS resource_card JSONB DEFAULT '{}'::jsonb;"
                );
            } else if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
                alert(
                    "DATABASE SEQUENCE ERROR:\n\n" +
                    "Your database ID sequence is out of sync. Please run this SQL command in Supabase to fix it:\n\n" +
                    "SELECT setval('resources_id_seq', (SELECT MAX(id) FROM resources));"
                );
            } else {
                alert('Error saving resource: ' + error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'Visual Assets',
            hero_cards: [{ image_url: '', detail_headline: '', detail_content: '', link: '' }],
            show_embed: true,
            embed_code: '',
            show_resource_card: false,
            resource_cards: [{ title: '', body: '', cta: '', image: '', link: '', label: '', body_label: '', cta_label: '' }],
            image_url: '',
            link: ''
        });
        setEditingItem(null);
        setShowForm(false);
    };

    const handleEdit = (item) => {
        setEditingItem(item);

        // Populate hero_cards: use existing if available, else standard fallback
        let cards = item.hero_cards;
        if (!cards || !Array.isArray(cards) || cards.length === 0) {
            // Check if there is legacy data to migrate into a card
            if (item.image_url || item.detail_headline) {
                cards = [{
                    image_url: item.image_url || '',
                    detail_headline: item.detail_headline || '',
                    detail_content: item.detail_content || '',
                    link: item.link || ''
                }];
            } else {
                cards = [{ image_url: '', detail_headline: '', detail_content: '', link: '' }];
            }
        }

        setFormData({
            title: item.title || '',
            description: item.description || '',
            category: item.category || 'Visual Assets',
            hero_cards: cards,
            show_embed: item.show_embed !== undefined ? item.show_embed : (!!item.embed_code || true),
            embed_code: item.embed_code || '',
            show_resource_card: item.show_resource_card || false,
            // Handle migration from object to array if needed
            resource_cards: Array.isArray(item.resource_card)
                ? item.resource_card.map(card => ({
                    ...card,
                    label: card.label || '',
                    body_label: card.body_label || '',
                    cta_label: card.cta_label || ''
                }))
                : (item.resource_card ? [{
                    ...item.resource_card,
                    label: item.resource_card.label || '',
                    body_label: item.resource_card.body_label || '',
                    cta_label: item.resource_card.cta_label || ''
                }] : [{ title: '', body: '', cta: '', image: '', link: '', label: '', body_label: '', cta_label: '' }]),
            image_url: item.image_url || '',
            link: item.link || ''
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
                        if (showForm) {
                            resetForm();
                        } else {
                            resetForm(); // Ensure clean state
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm ? 'Cancel' : '+ Add Resource'}
                </button>
            </div>

            {showForm && (
                <div className="admin-form-card">
                    <h2>{editingItem ? 'Edit Resource' : 'Add New Resource'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="rs-form-section">
                            <h3>General Info</h3>
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
                        </div>

                        <div className="rs-form-section">
                            <div className="section-header-row">
                                <h3>Hero Cards</h3>
                                <button type="button" onClick={handleAddCard} className="btn-secondary btn-sm"> + Add Card</button>
                            </div>

                            {formData.hero_cards.map((card, index) => (
                                <div key={index} className="card-editor-item">
                                    <div className="card-editor-header">
                                        <h4>Card #{index + 1}</h4>
                                        {formData.hero_cards.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveCard(index)} className="btn-delete-text">Remove</button>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Detail Page Headline</label>
                                        <input
                                            type="text"
                                            value={card.detail_headline}
                                            onChange={e => handleCardChange(index, 'detail_headline', e.target.value)}
                                            placeholder="e.g. Creating impactful advertising..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Detail Page Content (Markdown/HTML)</label>
                                        <textarea
                                            value={card.detail_content}
                                            onChange={e => handleCardChange(index, 'detail_content', e.target.value)}
                                            rows="4"
                                            placeholder="Enter the detailed description..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Figma/External Link</label>
                                        <input
                                            type="text"
                                            value={card.link}
                                            onChange={e => handleCardChange(index, 'link', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Card Image</label>
                                        <div className="image-upload-row">
                                            <label className="btn-secondary">
                                                {uploading && activeCardIndex === index ? 'Uploading...' : 'Upload Image'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, index)}
                                                    style={{ display: 'none' }}
                                                    disabled={uploading}
                                                />
                                            </label>
                                            <input
                                                type="text"
                                                value={card.image_url}
                                                onChange={e => handleCardChange(index, 'image_url', e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        {card.image_url && (
                                            <div className="preview-image-container-small">
                                                <img src={card.image_url} alt="Preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rs-form-section">
                            <h3>Embed Section</h3>
                            <div className="form-group-checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.show_embed}
                                        onChange={e => setFormData({ ...formData, show_embed: e.target.checked })}
                                    />
                                    Show Embed/Iframe Component
                                </label>
                            </div>

                            {formData.show_embed && (
                                <div className="form-group">
                                    <label>Embed Code (iframe)</label>
                                    <textarea
                                        value={formData.embed_code}
                                        onChange={e => setFormData({ ...formData, embed_code: e.target.value })}
                                        rows="3"
                                        placeholder='<iframe src="..." ...></iframe>'
                                    />
                                </div>
                            )}
                        </div>

                        <div className="rs-form-section">
                            <h3>Optional Resource Card</h3>
                            <div className="form-group-checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.show_resource_card}
                                        onChange={e => setFormData({ ...formData, show_resource_card: e.target.checked })}
                                    />
                                    Show Resource Card Component
                                </label>
                            </div>

                            {formData.show_resource_card && (
                                <div className="resource-cards-list">
                                    <div className="section-header-row">
                                        <h4>Resource Cards Config</h4>
                                        <button type="button" onClick={handleAddResourceCard} className="btn-secondary btn-sm"> + Add Another Card</button>
                                    </div>

                                    {formData.resource_cards.map((card, index) => (
                                        <div key={index} className="card-editor-item">
                                            <div className="card-editor-header">
                                                <h4>Card #{index + 1}</h4>
                                                {formData.resource_cards.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveResourceCard(index)} className="btn-delete-text">Remove</button>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    value={card.title}
                                                    onChange={e => handleResourceCardChange(index, 'title', e.target.value)}
                                                    placeholder="e.g. Summer Joy!"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Label</label>
                                                <input
                                                    type="text"
                                                    value={card.label || ''}
                                                    onChange={e => handleResourceCardChange(index, 'label', e.target.value)}
                                                    placeholder="e.g. Touchpoint"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Body Label</label>
                                                <input
                                                    type="text"
                                                    value={card.body_label || ''}
                                                    onChange={e => handleResourceCardChange(index, 'body_label', e.target.value)}
                                                    placeholder="e.g. Headline"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Body Copy</label>
                                                <input
                                                    type="text"
                                                    value={card.body}
                                                    onChange={e => handleResourceCardChange(index, 'body', e.target.value)}
                                                    placeholder="e.g. Everything to make your journey joyful!"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>CTA Label</label>
                                                <input
                                                    type="text"
                                                    value={card.cta_label || ''}
                                                    onChange={e => handleResourceCardChange(index, 'cta_label', e.target.value)}
                                                    placeholder="e.g. Action"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>CTA Text</label>
                                                <input
                                                    type="text"
                                                    value={card.cta}
                                                    onChange={e => handleResourceCardChange(index, 'cta', e.target.value)}
                                                    placeholder="e.g. Shop all"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Card Image</label>
                                                <div className="image-upload-row">
                                                    <label className="btn-secondary">
                                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleResourceCardImageUpload(e, index)}
                                                            style={{ display: 'none' }}
                                                            disabled={uploading}
                                                        />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={card.image}
                                                        onChange={e => handleResourceCardChange(index, 'image', e.target.value)}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                {card.image && (
                                                    <div className="preview-image-container-small">
                                                        <img src={card.image} alt="Preview" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-actions-footer">
                            <button type="submit" className="btn-primary">
                                {editingItem ? 'Update' : 'Create'} Resource
                            </button>
                        </div>
                    </form>
                </div >
            )
            }

            <div className="admin-list">
                <h3>All Resources ({resources.length})</h3>
                <div className="resources-list-grid">
                    {resources.map(res => (
                        <div key={res.id} className="admin-resource-item">
                            <div className="res-content">
                                {res.image_url && <img src={res.image_url} alt="" className="res-list-thumb" />}
                                <div>
                                    <h4>{res.title}</h4>
                                    <span className="res-cat">{res.category}</span>
                                </div>
                            </div>
                            <div className="res-actions">
                                <button onClick={() => handleEdit(res)} className="btn-edit">Edit</button>
                                <button onClick={() => handleDelete(res.id)} className="btn-delete">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
