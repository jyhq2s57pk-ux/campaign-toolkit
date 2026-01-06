
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../lib/api';
import './ResourceDetailPage.css';

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

                {/* Hero Card */}
                <div className="resource-hero-card">
                    <div className="hero-visual-side">
                        {resource.image_url ? (
                            <img src={resource.image_url} alt={resource.title} className="hero-image" />
                        ) : (
                            <div className="hero-placeholder">
                                <span>No Preview Available</span>
                            </div>
                        )}
                    </div>

                    <div className="hero-content-side">
                        <div className="detail-group">
                            <span className="detail-label">Campaign</span>
                            <h2 className="detail-heading">{resource.detail_headline || resource.title}</h2>
                        </div>

                        <div className="detail-group">
                            <span className="detail-label">Channels</span>
                            <div className="detail-value">Paid media platforms</div>
                        </div>

                        <div className="detail-group">
                            <span className="detail-label">Details</span>
                            <div className="detail-text">
                                {resource.detail_content ? (
                                    <div dangerouslySetInnerHTML={{ __html: resource.detail_content }} />
                                ) : (
                                    <>
                                        <p>Please see below for {resource.title} assets to support your campaign activities.</p>
                                        <p>To adapt the file, please duplicate the master file or download the assets using the link below.</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {resource.link && (
                            <a href={resource.link} target="_blank" rel="noreferrer" className="primary-action-btn">
                                Primary Action
                            </a>
                        )}
                    </div>
                </div>

                {/* Embed Section */}
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

            </main>

            <Footer />
        </div>
    );
}
