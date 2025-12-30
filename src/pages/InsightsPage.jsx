import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './InsightsPage.css';

export default function InsightsPage() {
    const stats = [
        { label: 'Pre-travel Traffic', value: '62%', trend: '+12% from LY' },
        { label: 'Gift Finder Conversion', value: '4.8%', trend: '+0.5% vs site avg' },
        { label: 'Mobile App Share', value: '45%', trend: '+8% growth' },
    ];

    const insights = [
        {
            title: 'Passenger Flow Trends',
            description: 'More than half of shoppers begin seasonal purchasing before peak travel dates, reinforcing the importance of early ecommerce visibility.',
            type: 'behaviour'
        },
        {
            title: 'Category Performance',
            description: 'Beauty and Confectionery lead seasonal activations, with Spirits showing strong uplift from product bundles.',
            type: 'sales'
        },
        {
            title: 'Search Intent',
            description: 'High volume of "last minute gift" searches in the 48 hours before Christmas demonstrates need for rapid fulfillment messaging.',
            type: 'search'
        }
    ];

    return (
        <div className="insights-page">
            <Header />
            <main className="insights-main">
                <div className="outer-container">
                    <section className="page-header">
                        <h1 className="page-title">Insights & Performance</h1>
                        <p className="page-subtitle-grey">
                            Insights help teams understand what works and where to optimise.
                        </p>
                    </section>

                    <div className="inner-content-wrapper">
                        <section className="stats-strip">
                            {stats.map((stat, i) => (
                                <div key={i} className="stat-card glass">
                                    <span className="stat-label">{stat.label}</span>
                                    <div className="stat-value">{stat.value}</div>
                                    <span className="stat-trend">{stat.trend}</span>
                                </div>
                            ))}
                        </section>

                        <section className="charts-mockup-section">
                            <div className="chart-container glass">
                                <div className="chart-header">
                                    <h3>Seasonal Performance Flow</h3>
                                    <span>Jan - Dec 2025</span>
                                </div>
                                <div className="chart-bars-mockup">
                                    {[40, 60, 45, 80, 55, 70, 95, 85, 60, 75, 90, 100].map((h, i) => (
                                        <div key={i} className="bar-wrapper">
                                            <div className="bar" style={{ height: `${h}%` }}></div>
                                            <span className="bar-label">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="insights-grid">
                            {insights.map((insight, i) => (
                                <div key={i} className="insight-content-block glass">
                                    <div className={`insight-tag ${insight.type}`}>{insight.type}</div>
                                    <h3 className="insight-title">{insight.title}</h3>
                                    <p className="insight-desc">{insight.description}</p>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
