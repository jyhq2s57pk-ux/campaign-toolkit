import React from 'react';
import './ActivationIdeas.css';
import UniversalCard from './UniversalCard';

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
                    <UniversalCard
                        key={idea.id}
                        title={idea.title}
                        category={idea.category}
                        buttonText="Download"
                    // ActivationIdeas previously had a placeholder, so image is null/undefined
                    />
                ))}
            </div>
        </div>
    );
}
