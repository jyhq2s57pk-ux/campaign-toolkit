import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import FlexibleHeroCard from './FlexibleHeroCard';
import './ResourcesAdmin.css';

export default function ResourcesAdmin() {
    const [resources, setResources] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Visual Assets',
        hero_cards: [],
        show_embed: true,
        embed_code: '',
        show_resource_card: false,
        resource_cards: [],
        image_url: '',
        link: ''
    });

    const categories = [
        "Visual Assets", "Copy & Messaging", "Templates", "Creative",
        "Content", "Product", "Brand", "Technical", "Social Media"
    ];

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('id', { ascending: false });

        if (error) console.error('Error fetching resources:', error);
        else setResources(data || []);
    };

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

    const handleAddCard = () => {
        setFormData({
            ...formData,
            hero_cards: [
                ...formData.hero_cards,
                {
                    image_url: '',
                    detail_headline: '',
                    detail_content: '',
                    link: '',
                    eyebrow: 'Status', // Default label per screenshot
                    subtitle_label: 'Goal',
                    subtitle: '',
                    details_label: 'Description',
                    cta_text: 'Download Assets',
                    show_cta: true
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

    // Helper to sync single fields to first card if needed (for backward compat)
    // or initializes form data from an existing item
    const handleEdit = (item) => {
        setEditingItem(item);
        let cards = item.hero_cards;

        // Safety check / Migration for legacy data
        if (!cards || !Array.isArray(cards) || cards.length === 0) {
            if (item.image_url || item.detail_headline) {
                cards = [{
                    image_url: item.image_url || '',
                    detail_headline: item.detail_headline || '',
                    detail_content: item.detail_content || '',
                    link: item.link || '',
                    eyebrow: 'Status',
                    subtitle_label: 'Goal',
                    details_label: 'Description'
                }];
            } else {
                cards = [{
                    image_url: '', detail_headline: '', detail_content: '', link: '',
                    eyebrow: 'Status', subtitle_label: 'Goal', details_label: 'Description'
                }];
            }
        }

        setFormData({
            title: item.title || '',
            description: item.description || '',
            category: item.category || 'Visual Assets',
            hero_cards: cards,
            show_embed: item.show_embed ?? (!!item.embed_code),
            embed_code: item.embed_code || '',
            show_resource_card: item.show_resource_card || false,
            resource_cards: Array.isArray(item.resource_card) ? item.resource_card : [], // simplified for brevity
            image_url: item.image_url || '',
            link: item.link || ''
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'Visual Assets',
            hero_cards: [{
                image_url: '', detail_headline: '', detail_content: '', link: '',
                eyebrow: 'Status', subtitle_label: 'Goal', details_label: 'Description',
                cta_text: 'Download'
            }],
            show_embed: true,
            embed_code: '',
            show_resource_card: false,
            resource_cards: [],
            image_url: '',
            link: ''
        });
        setEditingItem(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data
        const rootCard = formData.hero_cards[0] || {};
        const dataToSave = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            hero_cards: formData.hero_cards,
            show_embed: formData.show_embed,
            embed_code: formData.embed_code,
            show_resource_card: formData.show_resource_card,
            resource_card: formData.resource_cards,
            // Legacy sync
            image_url: rootCard.image_url || '',
            link: rootCard.link || '',
            detail_headline: rootCard.detail_headline || '',
            detail_content: rootCard.detail_content || ''
        };

        try {
            if (editingItem) {
                const { error } = await supabase.from('resources').update(dataToSave).eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('resources').insert([dataToSave]);
                if (error) throw error;
            }
            resetForm();
            fetchResources();
        } catch (error) {
            console.error('Error saving resource:', error);
            alert('Error saving resource: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            const { error } = await supabase.from('resources').delete().eq('id', id);
            if (error) alert('Error deleting: ' + error.message);
            else fetchResources();
        }
    };

    if (!showForm) {
        return (
            <div className="resources-admin">
                <div className="admin-section-header">
                    <h2>Resources Management</h2>
                    <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                        + Add Resource
                    </button>
                </div>
                <div className="admin-list">
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
            </div>
        );
    }

    // Split View Layout for Editing
    return (
        <div className="resources-admin">
            <div className="admin-section-header">
                <h2>{editingItem ? 'Edit Resource' : 'New Resource'}</h2>
                <div className="header-actions">
                    <button type="button" className="btn-secondary" onClick={resetForm} style={{ marginRight: '12px' }}>
                        Cancel
                    </button>
                    <button type="button" className="btn-primary" onClick={handleSubmit}>
                        {editingItem ? 'Save Changes' : 'Create Resource'}
                    </button>
                </div>
            </div>

            <div className="admin-split-layout">
                {/* LEFT COLUMN: EDITOR */}
                <div className="admin-editor-column">
                    <div className="editor-header-row">
                        <h3>Content Editor</h3>
                        <span className="text-muted text-sm">Fill in details for the feature.</span>
                    </div>

                    <form id="resource-form" onSubmit={handleSubmit}>
                        {/* GLOBAL FIELDS */}
                        <div className="rs-form-section">
                            <div className="form-group">
                                <label>Internal Resource Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="e.g. Summer Campaign 2025"
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
                        </div>

                        {/* CARDS EDITOR LOOP */}
                        {formData.hero_cards.map((card, index) => (
                            <div key={index} className="card-editor-item">
                                <div className="card-editor-header">
                                    <h4>Feature Card #{index + 1}</h4>
                                    {formData.hero_cards.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveCard(index)} className="btn-delete-text">Remove</button>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Feature Title</label>
                                    <input
                                        type="text"
                                        value={card.detail_headline}
                                        onChange={e => handleCardChange(index, 'detail_headline', e.target.value)}
                                        placeholder="New Featured Ad"
                                    />
                                </div>

                                <div className="form-group grid-2-col">
                                    <div>
                                        <label>Label 1 (Status)</label>
                                        <input
                                            type="text"
                                            value={card.eyebrow || ''}
                                            onChange={e => handleCardChange(index, 'eyebrow', e.target.value)}
                                            placeholder="e.g. In Progress"
                                        />
                                    </div>
                                    <div>
                                        <label>Label 2 (Regions/Type)</label>
                                        {/* Using 'subtitle_label' as the label text, but maybe just one field? 
                                            Screenshot shows: Platform, Regions. 
                                            Let's stick to existing schema properties but map them to these inputs.
                                        */}
                                        <input
                                            type="text"
                                            value={card.subtitle_label || ''}
                                            onChange={e => handleCardChange(index, 'subtitle_label', e.target.value)}
                                            placeholder="Label for subtitle"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Goal / Subtitle</label>
                                    <input
                                        type="text"
                                        value={card.subtitle || ''}
                                        onChange={e => handleCardChange(index, 'subtitle', e.target.value)}
                                        placeholder="Increase user engagement by 20%"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={card.detail_content}
                                        onChange={e => handleCardChange(index, 'detail_content', e.target.value)}
                                        rows="4"
                                        placeholder="This feature allows users to..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Image URL (Optional)</label>
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
                                </div>

                                <div className="form-group checkbox-row-tight" style={{ marginTop: '10px' }}>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={card.show_cta !== false}
                                            onChange={e => handleCardChange(index, 'show_cta', e.target.checked)}
                                        />
                                        Show Action Button
                                    </label>
                                </div>
                                {card.show_cta !== false && (
                                    <div className="form-group" style={{ marginTop: '10px' }}>
                                        <label>Button Label</label>
                                        <input
                                            type="text"
                                            value={card.cta_text || ''}
                                            onChange={e => handleCardChange(index, 'cta_text', e.target.value)}
                                            placeholder="Download Assets"
                                        />
                                        <label style={{ marginTop: '8px' }}>Link URL</label>
                                        <input
                                            type="text"
                                            value={card.link}
                                            onChange={e => handleCardChange(index, 'link', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                )}

                            </div>
                        ))}
                        <button type="button" onClick={handleAddCard} className="btn-secondary btn-sm" style={{ width: '100%' }}> + Add Another Feature Card</button>

                        <div style={{ height: '40px' }}></div>

                        {/* OPTIONAL EXTRAS */}
                        <div className="rs-form-section">
                            <h3>Advanced</h3>
                            <div className="form-group checkbox-row-tight">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.show_embed}
                                        onChange={e => setFormData({ ...formData, show_embed: e.target.checked })}
                                    />
                                    Include Embed Section (Figma/Iframe)
                                </label>
                            </div>
                            {formData.show_embed && (
                                <div className="form-group">
                                    <textarea
                                        value={formData.embed_code}
                                        onChange={e => setFormData({ ...formData, embed_code: e.target.value })}
                                        rows="2"
                                        placeholder='<iframe src="..." ...></iframe>'
                                    />
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* RIGHT COLUMN: LIVE PREVIEW */}
                <div className="admin-preview-column">
                    <div className="preview-header">
                        <h3>Live Preview</h3>
                        <span className="preview-badge">Real-time</span>
                    </div>

                    <div className="preview-container">
                        {/* We render a mock of what the detail page looks like */}
                        <div className="preview-page-mockup">
                            {/* Mock Page Header */}
                            {/* 
                                 Note: The ResourceDetailPage usually shows the Resource Title and Description at top.
                                 Then the Hero Cards.
                             */}
                            {/* <div style={{marginBottom: '20px'}}>
                                 <h1 style={{fontSize:'32px', fontWeight:'700', color:'#fff'}}>{formData.title || 'Resource Title'}</h1>
                                 <p style={{color:'#ccc'}}>{formData.description || 'Resource description...'}</p>
                             </div> */}

                            {/* Render Hero Cards */}
                            {formData.hero_cards.map((card, idx) => (
                                <div key={idx} style={{ transform: 'scale(1)', transformOrigin: 'top left', marginBottom: '20px' }}>
                                    <FlexibleHeroCard
                                        image={card.image_url}
                                        eyebrow={card.eyebrow}
                                        title={card.detail_headline || 'Feature Title'}
                                        subtitleLabel={card.subtitle_label}
                                        subtitle={card.subtitle}
                                        detailsLabel={card.details_label}
                                        description={card.detail_content || 'Description content...'}
                                        actions={(card.link && card.show_cta !== false) ? [{ label: card.cta_text || "Action", url: card.link }] : []}
                                    />
                                </div>
                            ))}

                            {formData.hero_cards.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    No cards added. Click "Add Card" to start.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
