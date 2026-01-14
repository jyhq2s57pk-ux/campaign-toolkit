import React from 'react';
import './ContentsList.css';
import { Link } from 'react-router-dom';

const CONTENTS_ITEMS = [
    { n: '01', title: 'Customer Touchpoints', href: '/customer-journey' },
    { n: '02', title: 'Campaign insights', href: '/insights' }, // Assuming insights page exists or map to existing
    { n: '03', title: 'Activation', href: '/ways-of-working' },
    { n: '04', title: 'Omnichannel consistency', href: '/omnichannel' },
    { n: '05', title: 'Trading calendar', href: '/calendar' },
    { n: '06', title: 'Resources', href: '/resources' },
];

export default function ContentsList() {
    return (
        <div className="contents-container">
            <div className="contents-header">
                <h3 className="contents-label">Contents</h3>
            </div>
            <div className="contents-list">
                {CONTENTS_ITEMS.map((item, idx) => (
                    <Link to={item.href} key={idx} className="content-item-row">
                        <span className="content-n">{item.n}</span>
                        <span className="content-title">{item.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
