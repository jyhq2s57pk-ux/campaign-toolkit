import React from 'react';
import './UniversalCard.css';

/**
 * UniversalCard Component
 * Unifies 'idea-card' and 'resource-asset-card' styles.
 * 
 * @param {string} image - URL for the image or null for placeholder
 * @param {string} category - Category text (appears as badge in image or text above title depending on prop?? 
 *                          Let's support both styles or standardize. 
 *                          ResourcesPage uses badge overlay. ActivationIdeas uses colored text above title.
 *                          The user asked to "make these two card styles the same component".
 *                          I will support the "badge" style for Resources and "text" style for Activation as an option, 
 *                          or default to one if not specified.
 *                          Actually, ActivationIdeas has `category: "Multi-level activation"` text. 
 *                          ResourcesPage has `category` which is shown as a badge.
 *                          I will add a prop `categoryStyle` = 'badge' | 'text' (default 'text').
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {string} buttonText - Text for the CTA button. If null, no button.
 * @param {function} onButtonClick - Handler for the button click.
 * @param {function} onClick - Handler for the card click.
 */
export default function UniversalCard({
    image,
    category,
    categoryStyle = 'text', // 'badge' or 'text'
    title,
    description,
    buttonText,
    onButtonClick,
    onClick,
    className = ''
}) {
    return (
        <div
            className={`universal-card ${onClick ? 'clickable' : ''} ${className}`}
            onClick={onClick}
        >
            {/* Image / Preview Area */}
            <div className="uc-preview">
                {image ? (
                    <img src={image} alt={title} />
                ) : (
                    <div className="uc-placeholder">
                        {/* You could add an icon or text here if needed */}
                    </div>
                )}

                {/* Badge Category Style */}
                {category && categoryStyle === 'badge' && (
                    <div className="uc-category-badge">
                        {category}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="uc-content">
                {/* Text Category Style */}
                {category && categoryStyle === 'text' && (
                    <div className="uc-category-text">{category}</div>
                )}

                <h3 className="uc-title">{title}</h3>

                {description && (
                    <p className="uc-desc">{description}</p>
                )}
            </div>

            {/* Footer / Button Area */}
            {buttonText && (
                <div className="uc-footer">
                    <button
                        className="uc-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onButtonClick) onButtonClick(e);
                        }}
                    >
                        {buttonText}
                    </button>
                </div>
            )}
        </div>
    );
}
