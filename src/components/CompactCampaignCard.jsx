import React from 'react';
import { Link } from 'react-router-dom';
import './CompactCampaignCard.css';

const CompactCampaignCard = ({
    id,
    name,
    subtitle,
    year,
    heroImage,
    activationDates,
    scope,
    channels,
    primaryColor,
    features
}) => {
    const accentColor = primaryColor || '#8F53F0';

    return (
        <Link to={`/customer-journey?campaignId=${id}`} className="compact-campaign-card">
            <div className="compact-card-image" style={{ backgroundColor: accentColor }}>
                {heroImage && !heroImage.includes('placehold') ? (
                    <img src={heroImage} alt={name} />
                ) : (
                    <div className="compact-card-image-fallback">
                        <span className="compact-card-image-initial">{name?.charAt(0)}</span>
                    </div>
                )}
                <div className="compact-card-color-strip" style={{ backgroundColor: accentColor }} />
            </div>

            <div className="compact-card-body">
                <div className="compact-card-header">
                    <span className="compact-card-year">{year}</span>
                    <span className="compact-card-scope">{scope}</span>
                </div>

                <h3 className="compact-card-title">{name}</h3>

                {subtitle && (
                    <p className="compact-card-subtitle">{subtitle}</p>
                )}

                <div className="compact-card-meta">
                    {activationDates && (
                        <div className="compact-card-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>{activationDates}</span>
                        </div>
                    )}
                    {channels && (
                        <div className="compact-card-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            <span>{channels}</span>
                        </div>
                    )}
                </div>

                {features && features.length > 0 && (
                    <div className="compact-card-features">
                        {features.map((feature, i) => (
                            <span key={i} className="compact-card-feature-pill">{feature.label}</span>
                        ))}
                    </div>
                )}

                <div className="compact-card-enter">
                    <span>Enter Campaign</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
};

export default CompactCampaignCard;
