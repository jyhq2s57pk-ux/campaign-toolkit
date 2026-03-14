import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import '../pages/CustomerJourneyPage.css';
import './ImplementationLevels.css';

const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 10.9998L3 5.9998L3.7 5.2998L8 9.5998L12.3 5.2998L13 5.9998L8 10.9998Z" fill="var(--theme-icon-1, #F1F1F1)" />
    </svg>
);

const ChevronUp = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 5L13 10L12.3 10.7L8 6.4L3.7 10.7L3 10L8 5Z" fill="var(--theme-icon-1, #F1F1F1)" />
    </svg>
);

/**
 * Groups touchpoints by activation_group (falling back to platform) for a given tier.
 * Returns an array of { group, items: [label, ...] } sorted by activation_group_sort.
 */
function groupByActivationGroup(touchpoints, tierKey) {
    const grouped = {};
    const groupMeta = {}; // track sort order per group

    for (const tp of touchpoints) {
        if (!tp[tierKey]) continue;

        const group = tp.activation_group || tp.platform;
        const label = tp.activation_label || tp.title;
        const groupSort = tp.activation_group_sort ?? 999;

        if (!grouped[group]) {
            grouped[group] = [];
            groupMeta[group] = groupSort;
        }
        grouped[group].push(label);
        // Keep the lowest sort value for the group
        if (groupSort < groupMeta[group]) {
            groupMeta[group] = groupSort;
        }
    }

    return Object.keys(grouped)
        .sort((a, b) => (groupMeta[a] ?? 999) - (groupMeta[b] ?? 999))
        .map(group => ({
            group,
            items: grouped[group],
        }));
}

/**
 * Decides the grid column class based on the number of groups.
 */
function getGridClass(groupCount) {
    if (groupCount >= 3) return 'three-cols';
    return 'two-cols';
}

const LEVELS = [
    { key: 'premium', tierKey: 'tier_premium', label: 'Premium', subtitle: 'Full visibility' },
    { key: 'executive', tierKey: 'tier_executive', label: 'Executive', subtitle: 'Medium visibility' },
    { key: 'standard', tierKey: 'tier_standard', label: 'Standard', subtitle: 'Regular visibility' },
];

export default function ImplementationLevels({ campaignId }) {
    const [expandedLevel, setExpandedLevel] = useState(null);
    const [touchpoints, setTouchpoints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTouchpoints = async () => {
            setLoading(true);
            if (!supabase) { setLoading(false); return; }

            let query = supabase.from('touchpoints').select('title, platform, tier_premium, tier_executive, tier_standard, sort_order, activation_group, activation_label, activation_group_sort');
            if (campaignId) {
                query = query.eq('campaign_id', campaignId);
            }
            const { data, error } = await query.order('sort_order', { ascending: true });

            if (!error && data) {
                setTouchpoints(data);
            }
            setLoading(false);
        };

        fetchTouchpoints();
    }, [campaignId]);

    const toggleLevel = (level) => {
        setExpandedLevel(expandedLevel === level ? null : level);
    };

    if (loading || touchpoints.length === 0) {
        return null; // Don't render anything while loading or if no data
    }

    return (
        <div className="implementation-levels">
            <div className="implementation-header">
                <h2>Activation Levels</h2>
            </div>

            <div className="accordion-container">
                {LEVELS.map(({ key, tierKey, label, subtitle }) => {
                    const groups = groupByActivationGroup(touchpoints, tierKey);
                    if (groups.length === 0) return null; // Skip tiers with no touchpoints

                    const isExpanded = expandedLevel === key;
                    const gridClass = getGridClass(groups.length);

                    return (
                        <div
                            key={key}
                            className={`accordion-item ${isExpanded ? 'expanded' : ''} level-item level-${key}`}
                        >
                            <button
                                className="accordion-header level-header"
                                onClick={() => toggleLevel(key)}
                                aria-expanded={isExpanded}
                                aria-controls={`level-panel-${key}`}
                            >
                                <div className="level-badge-wrapper">
                                    <span className={`badge badge--${key} badge--accordion-lg`}>{label}</span>
                                </div>
                                <div className="level-title">{subtitle}</div>
                                <div className="accordion-chevron">
                                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                </div>
                            </button>
                            {isExpanded && (
                                <div className="accordion-body level-body" id={`level-panel-${key}`} role="region" aria-labelledby={`level-header-${key}`}>
                                    <div className={`level-grid ${gridClass}`}>
                                        {groups.map(({ group, items }) => (
                                            <div key={group} className="level-col">
                                                <div className="level-group">
                                                    <h4>{group}</h4>
                                                    <ul>
                                                        {items.map((item, idx) => (
                                                            <li key={idx}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
