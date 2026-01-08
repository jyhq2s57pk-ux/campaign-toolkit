import React from 'react';
import './ResourceEmbed.css';

export default function ResourceEmbed({ title, body, cta, image, label, bodyLabel, ctaLabel }) {
    if (!title && !body && !image) return null;

    return (
        <div className="resource-embed-component">
            <div className="res-embed-content">
                <div className="res-embed-image-col">
                    <div className="res-embed-image-frame">
                        {image ? (
                            <img src={image} alt={title || "Resource Image"} className="res-embed-img" />
                        ) : (
                            <div className="res-img-placeholder">No Image</div>
                        )}
                    </div>
                </div>
                <div className="res-embed-text-col">
                    <div className="res-embed-text-group">
                        <div className="res-embed-label">{label || "Touchpoint"}</div>
                        <div className="res-embed-desc">{title || "Summer Joy!"}</div>
                    </div>
                    <div className="res-embed-text-group">
                        <div className="res-embed-label">{bodyLabel || "Body copy"}</div>
                        <div className="res-embed-desc">{body || "Everything to make your journey joyful!"}</div>
                    </div>
                    <div className="res-embed-text-group">
                        <div className="res-embed-label">{ctaLabel || "CTA"}</div>
                        <div className="res-embed-desc">{cta || "Shop all"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
