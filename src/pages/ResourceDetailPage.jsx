import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../lib/api';
import './ResourceDetailPage.css';
import ResourceEmbed from '../components/ResourceEmbed';

export default function ResourceDetailPage() {
    const { id } = useParams();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app we would have an api.getResourceById(id)
        // For now we can fetch all and find, or implement the specific call.
        // Let's implement fetch all and find for simplicity unless the list is huge.
        // Actually, let's assume I'll add getResourceById to api.js
        api.getResourceById(id).then(data => {
            setResource(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="resource-detail-page">
                <Header />
                <main className="resource-detail-main loading">
                    <div className="spinner">Loading...</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="resource-detail-page">
                <Header />
                <main className="resource-detail-main not-found">
                    <h2>Resource not found</h2>
                    <Link to="/resources" className="back-link">← Back to Resources</Link>
                </main>
                <Footer />
            </div>
        );
    }

    // Determine cards to display: use hero_cards array if available, otherwise fallback to flat fields
    const displayCards = (resource.hero_cards && resource.hero_cards.length > 0)
        ? resource.hero_cards
        : [{
            image_url: resource.image_url,
            detail_headline: resource.detail_headline || resource.title,
            detail_content: resource.detail_content,
            link: resource.link
        }];

    // Default to true if undefined for backward compatibility
    const showEmbed = resource.show_embed !== false;

    return (
        <div className="resource-detail-page">
            <Header />

            <main className="resource-detail-main inner-content-wrapper">
                {/* Breadcrumbs */}
                <div className="resource-breadcrumbs">
                    <Link to="/resources">Assets and resources</Link>
                    <span className="separator">›</span>
                    <span className="current">{resource.title}</span>
                </div>

                {/* Page Header */}
                <div className="resource-header">
                    <h1 className="page-title">{resource.title}</h1>
                    <p className="page-description">
                        {resource.description || "Customize the perfect journey with different levels of implementation based on local relevance"}
                    </p>
                </div>

                {/* Hero Cards Loop */}
                {displayCards.map((card, index) => (
                    <div className="resource-hero-card" key={index}>
                        <div className="hero-visual-side">
                            {card.image_url ? (
                                <img src={card.image_url} alt={card.detail_headline || resource.title} className="hero-image" />
                            ) : (
                                <div className="hero-placeholder">
                                    <span>No Preview Available</span>
                                </div>
                            )}
                        </div>

                        <div className="hero-content-side">
                            <div className="detail-group">
                                <span className="detail-label">Campaign</span>
                                <h2 className="detail-heading">{card.detail_headline || resource.title}</h2>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Channels</span>
                                <div className="detail-value">Paid media platforms</div>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Details</span>
                                <div className="detail-text">
                                    {card.detail_content ? (
                                        <div dangerouslySetInnerHTML={{ __html: card.detail_content }} />
                                    ) : (
                                        <>
                                            <p>Please see below for {resource.title} assets to support your campaign activities.</p>
                                            <p>To adapt the file, please duplicate the master file or download the assets using the link below.</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {card.link && (
                                <a href={card.link} target="_blank" rel="noreferrer" className="primary-action-btn">
                                    Primary Action
                                </a>
                            )}
                        </div>
                    </div>
                ))}

                {/* Embed Section */}
                {showEmbed && (
                    <div className="resource-embed-section">
                        <div className="embed-label-row">
                            <span className="embed-label-small">Campaign</span>
                            <h3 className="embed-title">Figma file name</h3>
                        </div>

                        <div className="embed-container-wrapper">
                            {resource.embed_code ? (
                                <div
                                    className="custom-embed-frame"
                                    dangerouslySetInnerHTML={{ __html: resource.embed_code }}
                                />
                            ) : resource.link && resource.link.includes('figma.com') ? (
                                <iframe
                                    className="figma-iframe"
                                    src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(resource.link)}`}
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="embed-placeholder">
                                    <p>No embed available</p>
                                </div>
                            )}
                        </div>

                        <div className="embed-footer-row">
                            <div className="footer-left">
                                <span className="embed-label-small">Campaign</span>
                                <h3 className="embed-title-small">Figma file name</h3>
                            </div>
                            {resource.link && (
                                <a href={resource.link} target="_blank" rel="noreferrer" className="secondary-action-btn">
                                    Primary Action
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Resource Card Components (Optional) */}
                {resource.show_resource_card && resource.resource_card && (
                    <>
                        {Array.isArray(resource.resource_card) ? (
                            resource.resource_card.map((card, idx) => (
                                <ResourceEmbed
                                    key={idx}
                                    title={card.title}
                                    body={card.body}
                                    cta={card.cta}
                                    image={card.image}
                                    label={card.label}
                                    bodyLabel={card.body_label}
                                    ctaLabel={card.cta_label}
                                />
                            ))
                        ) : (
                            <ResourceEmbed
                                title={resource.resource_card.title}
                                body={resource.resource_card.body}
                                cta={resource.resource_card.cta}
                                image={resource.resource_card.image}
                                label={resource.resource_card.label}
                                bodyLabel={resource.resource_card.body_label}
                                ctaLabel={resource.resource_card.cta_label}
                            />
                        )}
                    </>
                )}

            </main>

            <Footer />
        </div>
    );
}
