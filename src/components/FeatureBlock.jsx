import React from 'react';
import './FeatureBlock.css';

/**
 * Badge component for displaying status labels
 * @param {string} color - Color variant: 'magenta', 'success', 'purple', 'default'
 * @param {React.ReactNode} children - Badge content
 */
const FeatureBadge = ({ color = 'default', children }) => {
    return (
        <div className={`feature-badge feature-badge--${color}`}>
            <span className="feature-badge__text">{children}</span>
        </div>
    );
};

/**
 * FeatureBlock component - Displays a feature with numbered label, title, description and badges
 * Based on CLP Hero design from Figma
 * 
 * @param {number} number - The feature number (displayed in circular badge)
 * @param {string} title - Feature title (e.g., "CLP Hero")
 * @param {string} description - Feature description text
 * @param {Array} badges - Array of badge objects with { label, color } properties
 */
const FeatureBlock = ({
    number = 1,
    title = 'CLP Hero',
    description = 'Feature special SKUs by category in a new carousel to appear before Bestsellers one Beauty: Exclusive Gifting Sets (fragrance & skincare sets Liquor: Festive Spirits to Celebrate (wine & champagne)',
    badges = [
        { label: 'New', color: 'magenta' },
        { label: 'Executive', color: 'success' },
        { label: 'Premium', color: 'purple' },
        { label: 'Standard', color: 'default' }
    ]
}) => {
    return (
        <div className="feature-block">
            <div className="feature-block__content">
                <div className="feature-block__header-section">
                    {/* Header with number and title */}
                    <div className="feature-block__header">
                        <div className="feature-block__number">
                            <span className="feature-block__number-text">{number}</span>
                        </div>
                        <h3 className="feature-block__title">{title}</h3>
                    </div>

                    {/* Description */}
                    <div className="feature-block__description-wrapper">
                        <p className="feature-block__description">{description}</p>
                    </div>
                </div>

                {/* Badges */}
                <div className="feature-block__badges">
                    <div className="feature-block__badges-container">
                        {badges.map((badge, index) => (
                            <FeatureBadge key={index} color={badge.color}>
                                {badge.label}
                            </FeatureBadge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { FeatureBadge };
export default FeatureBlock;
