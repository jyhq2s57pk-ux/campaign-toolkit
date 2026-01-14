import React from 'react';
import './FeatureBlock.css';
import Badge from './Badge';

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
        { label: 'New', color: 'new' },
        { label: 'Executive', color: 'executive' },
        { label: 'Premium', color: 'premium' },
        { label: 'Standard', color: 'standard' }
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
                            <Badge key={index} variant={badge.color} size="sm">
                                {badge.label}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureBlock;
