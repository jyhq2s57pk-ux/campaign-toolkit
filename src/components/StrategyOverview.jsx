import React from 'react';
import './StrategyOverview.css';

export default function StrategyOverview() {
    return (
        <section className="strategy-section">
            <div className="strategy-label">STRATEGY OVERVIEW</div>
            <div className="strategy-content">
                <h2 className="strategy-headline">
                    Capturing the emotional connection of giving through <span className="text-white">curated bundles</span> and <span className="text-green">seamless digital gifting</span>.
                </h2>
                <div className="strategy-cards">
                    <div className="strategy-card">
                        <h3 className="card-title text-green">PRIMARY OBJECTIVE</h3>
                        <p className="card-text">Maximize conversion during peak traffic weeks via express checkout features.</p>
                    </div>
                    <div className="strategy-card">
                        <h3 className="card-title">KEY MESSAGE</h3>
                        <p className="card-text italic">"Find the perfect gift for everyone on your list, delivered instantly."</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
