import React from 'react';
import './FlexibleHeroCard.css';

export default function FlexibleHeroCard({
    image,
    eyebrow,
    title,
    subtitleLabel,
    subtitle,
    detailsLabel,
    description,
    actions = []
}) {
    return (
        <div className="resource-hero-card flexible-card">
            <div className="hero-visual-side">
                {image ? (
                    <img src={image} alt={title} className="hero-image" />
                ) : (
                    <div className="hero-placeholder">
                        <span>No Preview Available</span>
                    </div>
                )}
            </div>

            <div className="hero-content-side">
                {/* Title Section: Conditionally Show Eyebrow */}
                <div className="detail-group title-group">
                    {eyebrow && <span className="detail-label">{eyebrow}</span>}
                    {title && <h2 className="detail-heading">{title}</h2>}
                </div>

                {/* Subtitle Section: Only render if subtitle data exists */}
                {subtitle && (
                    <div className="detail-group subtitle-group">
                        {subtitleLabel && <span className="detail-label">{subtitleLabel}</span>}
                        <div className="detail-value">{subtitle}</div>
                    </div>
                )}

                {/* Details/Description Section: Only render if description exists */}
                {description && (
                    <div className="detail-group description-group">
                        {detailsLabel && <span className="detail-label">{detailsLabel}</span>}
                        <div className="detail-text">
                            <div dangerouslySetInnerHTML={{ __html: description }} />
                        </div>
                    </div>
                )}

                {/* Actions */}
                {actions.length > 0 && (
                    <div className="actions-row">
                        {actions.map((action, idx) => (
                            <a
                                key={idx}
                                href={action.url}
                                target="_blank"
                                rel="noreferrer"
                                className="primary-action-btn"
                            >
                                {action.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
