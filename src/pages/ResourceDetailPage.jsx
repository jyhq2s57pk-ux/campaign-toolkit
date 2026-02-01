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
                    {resource.description && (
                        <p className="page-description">{resource.description}</p>
                    )}
                </div>

                {/* Resource Card */}
                <div className="resource-detail-card glass">
                    {resource.thumbnail_url && (
                        <div className="resource-detail-image">
                            <img src={resource.thumbnail_url} alt={resource.title} />
                        </div>
                    )}

                    <div className="resource-detail-content">
                        <div className="resource-detail-meta">
                            <span className="resource-category-badge">{resource.category}</span>
                        </div>

                        {resource.cta_url && (
                            <div className="resource-detail-actions">
                                <a
                                    href={resource.cta_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                >
                                    {resource.cta_label || 'View Resource'}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="resource-detail-info">
                    <p className="info-text">
                        Resources link to external documents, Figma files, and tools.
                        Click the button above to access the full resource.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
