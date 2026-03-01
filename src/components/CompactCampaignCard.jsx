import React from 'react';
import { Link } from 'react-router-dom';
import './CompactCampaignCard.css';

/**
 * CalendarIcon – inline SVG for activation dates
 */
const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

/**
 * ChannelsIcon – inline SVG for channels/locations
 */
const ChannelsIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

/**
 * CampaignCard — Vertical variant (default for homepage grid)
 * Card bg = campaign primaryColor, 16:9 hero image, scope pill, title, subtitle, meta rows
 */
const CampaignCard = ({
    id,
    name,
    subtitle,
    heroImage,
    activationDates,
    scope,
    channels,
    primaryColor,
    variant = 'vertical',
    onClick
}) => {
    const accentColor = primaryColor || '#8F53F0';

    // Determine if text should be dark based on background luminance
    const isDarkText = isLightColor(accentColor);
    const textClass = isDarkText ? 'dark-text' : '';

    const cardContent = (
        <div
            className={`campaign-card campaign-card--${variant} ${textClass}`}
            style={variant === 'vertical' ? { backgroundColor: accentColor } : undefined}
        >
            {/* Image */}
            <div className={`campaign-card__image ${variant === 'horizontal' ? 'campaign-card__image--square' : ''}`}>
                {heroImage && !heroImage.includes('placehold') ? (
                    <img src={heroImage} alt={name} />
                ) : (
                    <div className="campaign-card__image-fallback" style={{ backgroundColor: variant === 'horizontal' ? accentColor : 'rgba(0,0,0,0.15)' }}>
                        <span className="campaign-card__image-initial">{name?.charAt(0)}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="campaign-card__content">
                {/* Scope pill */}
                {scope && (
                    <div className="campaign-card__scope-row">
                        <span className={`campaign-card__scope-pill ${variant === 'horizontal' ? 'campaign-card__scope-pill--dark' : ''}`}>
                            {scope}
                        </span>
                    </div>
                )}

                {/* Title + Subtitle */}
                <div className="campaign-card__text">
                    <h3 className="campaign-card__title">{name}</h3>
                    {subtitle && (
                        <p className="campaign-card__subtitle">{subtitle}</p>
                    )}
                </div>

                {/* Meta rows */}
                <div className="campaign-card__meta">
                    {activationDates && (
                        <div className="campaign-card__meta-item">
                            <CalendarIcon />
                            <span>{activationDates}</span>
                        </div>
                    )}
                    {channels && (
                        <div className="campaign-card__meta-item">
                            <ChannelsIcon />
                            <span>{channels}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // If onClick provided (admin), render as button
    if (onClick) {
        return (
            <button className="campaign-card__wrapper campaign-card__wrapper--button" onClick={onClick}>
                {cardContent}
            </button>
        );
    }

    // Otherwise, render as link (homepage)
    return (
        <Link to={`/customer-journey?campaignId=${id}`} className="campaign-card__wrapper">
            {cardContent}
        </Link>
    );
};

/**
 * Simple luminance check to determine if a hex color is "light"
 * Returns true if the color is light enough to need dark text
 */
function isLightColor(hex) {
    if (!hex) return false;
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    // Relative luminance approximation
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
}

export default CampaignCard;
