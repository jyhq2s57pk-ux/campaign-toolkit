import React from 'react';
import './ActivationIdeas.css';

const ACTIVATION_IDEAS = [
    {
        id: 1,
        category: "Multi-level activation",
        title: "The Magic of Joy Holiday Season",
        color: "dark"
    },
    {
        id: 2,
        category: "Multi-level activation",
        title: "The Magic of Joy Holiday Season",
        color: "dark"
    }
];

export default function ActivationIdeas() {
    return (
        <div className="activation-ideas-container">
            <div className="activation-header">
                <span className="activation-pill">Activation ideas</span>
            </div>

            <div className="activation-grid">
                {ACTIVATION_IDEAS.map((idea) => (
                    <div key={idea.id} className="activation-card">
                        {/* Placeholder Image Area */}
                        <div className="activation-img-placeholder"></div>

                        <div className="activation-content">
                            <div className="activation-category">{idea.category}</div>
                            <h4 className="activation-title">{idea.title}</h4>
                            <button className="btn-download">Download</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
