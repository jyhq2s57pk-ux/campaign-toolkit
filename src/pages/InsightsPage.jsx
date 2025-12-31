import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './InsightsPage.css';

// Imported Images
import mapBg from '../assets/omni/gen/map-bg.png';

export default function InsightsPage() {
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
                        <div className="section-header centered">
                            <h2 className="section-title">Summer Season Insights</h2>
                            <p className="section-subtitle">Data-driven opportunities for the season</p>
                        </div>

                        {/* Bento Grid Infographics */}
                        <div className="bento-grid">
                            {/* Card 1: Top Routes Map */}
                            <div className="bento-card card-large map-card glass">
                                <div className="card-bg-image" style={{ backgroundImage: `url(${mapBg})` }}></div>
                                <div className="bento-content">
                                    <h3 className="bento-label">Europe's Most Popular</h3>
                                    <h2 className="bento-value">Summer Flights</h2>
                                    <ul className="top-routes-list">
                                        <li><span className="route-code">FCO-MAD</span> <span className="route-name">Rome - Madrid</span> <span className="route-stat">1.3M</span></li>
                                        <li><span className="route-code">LIS-MAD</span> <span className="route-name">Lisbon - Madrid</span> <span className="route-stat">1.2M</span></li>
                                        <li><span className="route-code">CPH-OSL</span> <span className="route-name">Copenhagen - Oslo</span> <span className="route-stat">1.2M</span></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 2: Spain Dominance */}
                            <div className="bento-card card-medium glass accent-purple-gradient">
                                <div className="bento-content centered-content">
                                    <h2 className="bento-huge-number">5</h2>
                                    <p className="bento-text">of Europe's busiest routes start or end in <strong>Spain</strong>.</p>
                                </div>
                            </div>

                            {/* Card 3: Intra-Europe */}
                            <div className="bento-card card-small glass">
                                <div className="bento-content centered-content">
                                    <div className="pie-chart-simple" style={{ '--p': 90 }}>
                                        <span>9/10</span>
                                    </div>
                                    <p className="bento-subtext">Top 10 routes operate within Europe</p>
                                </div>
                            </div>

                            {/* Card 4: Scandinavian (Full Width) */}
                            <div className="bento-card card-full glass">
                                <div className="bento-content">
                                    <div className="card-full-text">
                                        <h3 className="bento-label">Unexpected Hotspots</h3>
                                        <p className="bento-text">While we think of sunny Rome or Barcelona, two key <strong>Scandinavian</strong> trunk routes feature in the top ten.</p>
                                    </div>
                                    <div className="card-full-visual">
                                        <div className="large-tag">
                                            <span className="tag-code">CPH - OSL</span>
                                            <span className="tag-desc">Copenhagen - Oslo</span>
                                        </div>
                                        <div className="large-tag">
                                            <span className="tag-code">ARN - CPH</span>
                                            <span className="tag-desc">Stockholm - Copenhagen</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="charts-container">
                            {/* Chart 1: PAX by Month */}
                            <div className="chart-card glass">
                                <h3>Avolta LY PAX by month (EU)</h3>
                                <div className="chart-area animated-line-chart">
                                    {/* Simple CSS Line Chart Representation */}
                                    <div className="y-axis">
                                        <span>65M</span><span>60M</span><span>55M</span><span>50M</span><span>45M</span>
                                    </div>
                                    <div className="x-axis">
                                        <span>June</span><span>July</span><span>August</span>
                                    </div>
                                    <svg viewBox="0 0 300 150" className="line-chart-svg">
                                        {/* 2023 Line (Purple) */}
                                        <path d="M 50 100 L 150 50 L 250 45" stroke="#8F53F0" strokeWidth="3" fill="none" className="path-anim" />
                                        {/* 2024 Line (Red) */}
                                        <path d="M 50 70 L 150 30 L 250 20" stroke="#FB7185" strokeWidth="3" fill="none" className="path-anim delay" />
                                    </svg>
                                    <div className="chart-legend">
                                        <span className="legend-item"><span className="dot purple"></span>2023</span>
                                        <span className="legend-item"><span className="dot red"></span>2024</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart 2: PAX by Week */}
                            <div className="chart-card glass">
                                <h3>Avolta LY PAX by week (UK)</h3>
                                <div className="chart-area animated-line-chart">
                                    <div className="y-axis">
                                        <span>4M</span><span>3M</span><span>2M</span>
                                    </div>
                                    <div className="x-axis-dense">
                                        <span>23</span><span>25</span><span>27</span><span>29</span><span>31</span><span>33</span><span>35</span>
                                    </div>
                                    <svg viewBox="0 0 300 150" className="line-chart-svg">
                                        {/* 2023 Curve */}
                                        <path d="M 30 100 Q 80 90 120 80 T 180 70 T 250 85 T 290 120" stroke="#8F53F0" strokeWidth="3" fill="none" className="path-anim" />
                                        {/* 2024 Curve (Higher) */}
                                        <path d="M 30 80 Q 80 75 120 70 T 180 50 T 250 60 T 290 90" stroke="#a0a0a0" strokeWidth="2" strokeDasharray="4" fill="none" className="path-static" />

                                        {/* Highlight Circle */}
                                        <circle cx="180" cy="50" r="10" stroke="#BEF264" strokeWidth="2" fill="none" className="pulse-circle" />
                                    </svg>
                                    <div className="chart-legend">
                                        <span className="legend-item"><span className="dot purple"></span>2023</span>
                                        <span className="legend-item"><span className="dot green-outline"></span>Peak</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
