import React, { useState } from 'react';
import '../pages/CustomerJourneyPage.css'; // Reusing page styles for consistency
import './ImplementationLevels.css';

// Duplicate icons to avoid circular dependencies or export issues
const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 10.9998L3 5.9998L3.7 5.2998L8 9.5998L12.3 5.2998L13 5.9998L8 10.9998Z" fill="var(--theme-icon-1, #F1F1F1)" />
    </svg>
);

const ChevronUp = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5L13 10L12.3 10.7L8 6.4L3.7 10.7L3 10L8 5Z" fill="var(--theme-icon-1, #F1F1F1)" />
    </svg>
);

export default function ImplementationLevels() {
    // Default expanded: Premium
    const [expandedLevel, setExpandedLevel] = useState(null);

    const toggleLevel = (level) => {
        if (expandedLevel === level) {
            setExpandedLevel(null);
        } else {
            setExpandedLevel(level);
        }
    };

    return (
        <div className="implementation-levels">
            <div className="implementation-header">
                <h2>Activation Levels</h2>
            </div>

            <div className="accordion-container">
                {/* 1. Premium */}
                <div className={`accordion-item ${expandedLevel === 'premium' ? 'expanded' : ''} level-item level-premium`}>
                    <div className="accordion-header level-header" onClick={() => toggleLevel('premium')}>
                        <div className="level-badge-wrapper">
                            <span className="badge badge--premium badge--accordion-lg">Premium</span>
                        </div>
                        <div className="level-title">Full visibility</div>
                        <div className="accordion-chevron">
                            {expandedLevel === 'premium' ? <ChevronUp /> : <ChevronDown />}
                        </div>
                    </div>
                    {expandedLevel === 'premium' && (
                        <div className="accordion-body level-body">
                            <div className="level-grid three-cols">
                                {/* Col 1 */}
                                <div className="level-col">
                                    <div className="level-group">
                                        <h4>Home</h4>
                                        <ul>
                                            <li>Hero Banner</li>
                                            <li>Most Popular Carousel</li>
                                        </ul>
                                    </div>
                                    <div className="level-group">
                                        <h4>CLP</h4>
                                        <ul>
                                            <li>Tailored CLP</li>
                                            <li>CLP Hero</li>
                                            <li>Dual Content Block</li>
                                        </ul>
                                    </div>
                                    <div className="level-group">
                                        <h4>PLP</h4>
                                        <ul>
                                            <li>Tailored PLP creation</li>
                                            <li>PLP Inline Banner</li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Col 2 */}
                                <div className="level-col">
                                    <div className="level-group">
                                        <h4>Mega menu</h4>
                                        <ul>
                                            <li>Top Menu</li>
                                            <li>Under each main category</li>
                                            <li>Mega Menu Brands Banner</li>
                                        </ul>
                                    </div>
                                    <div className="level-group">
                                        <h4>Search</h4>
                                        <ul>
                                            <li>Boost SKUs</li>
                                            <li>Search Redirections</li>
                                            <li>Popular Searches</li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Col 3 */}
                                <div className="level-col">
                                    <div className="level-group">
                                        <h4>PDP</h4>
                                        <ul>
                                            <li>MK Banner</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Executive */}
                <div className={`accordion-item ${expandedLevel === 'executive' ? 'expanded' : ''} level-item level-executive`}>
                    <div className="accordion-header level-header" onClick={() => toggleLevel('executive')}>
                        <div className="level-badge-wrapper">
                            <span className="badge badge--executive badge--accordion-lg">Executive</span>
                        </div>
                        <div className="level-title">Medium visibility</div>
                        <div className="accordion-chevron">
                            {expandedLevel === 'executive' ? <ChevronUp /> : <ChevronDown />}
                        </div>
                    </div>
                    {expandedLevel === 'executive' && (
                        <div className="accordion-body level-body">
                            <div className="level-grid two-cols">
                                {/* Col 1 */}
                                <div className="level-col">
                                    <div className="level-group">
                                        <h4>Home</h4>
                                        <ul>
                                            <li>Most Popular Carousel</li>
                                            <li>What's Trending Carousel / Content Editorial Banner</li>
                                        </ul>
                                    </div>
                                    <div className="level-group">
                                        <h4>PLP</h4>
                                        <ul>
                                            <li>Tailored PLP creation</li>
                                            <li>PLP Inline Banner</li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Col 2 */}
                                <div className="level-col">
                                    <div className="level-group">
                                        <h4>Megamenu</h4>
                                        <ul>
                                            <li>Under each main category</li>
                                            <li>Mega Menu Brands Banner</li>
                                        </ul>
                                    </div>
                                    <div className="level-group">
                                        <h4>Search</h4>
                                        <ul>
                                            <li>Boost SKUs</li>
                                            <li>Search Redirections</li>
                                            <li>Popular Searches</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Standard */}
                <div className={`accordion-item ${expandedLevel === 'standard' ? 'expanded' : ''} level-item level-standard`}>
                    <div className="accordion-header level-header" onClick={() => toggleLevel('standard')}>
                        <div className="level-badge-wrapper">
                            <span className="badge badge--standard badge--accordion-lg">Standard</span>
                        </div>
                        <div className="level-title">Regular visibility</div>
                        <div className="accordion-chevron">
                            {expandedLevel === 'standard' ? <ChevronUp /> : <ChevronDown />}
                        </div>
                    </div>
                    {expandedLevel === 'standard' && (
                        <div className="accordion-body level-body">
                            <div className="level-grid two-cols">
                                {/* Col 1 */}
                                <div className="level-col">
                                    <div className="level-group">
                                        <h4>Home</h4>
                                        <ul>
                                            <li>What's Trending Carousel / Content Editorial Banner</li>
                                        </ul>
                                    </div>
                                    <div className="level-group">
                                        <h4>PLP</h4>
                                        <ul>
                                            <li>Tailored PLP creation</li>
                                            <li>PLP Inline Banner</li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Col 2 */}
                                <div className="level-col">
                                    <div className="level-group">
                                        <h4>Megamenu</h4>
                                        <ul>
                                            <li>Mega Menu Brands Banner</li>
                                        </ul>
                                    </div>
                                    <div className="level-group">
                                        <h4>Search</h4>
                                        <ul>
                                            <li>Search Redirections</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
