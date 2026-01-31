import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './TradePerformancePage.css';

export default function TradePerformancePage() {
    const kpiData = [
        { label: 'Value Ordered', value: '4.5M', change: '↑ 8% vs PY', positive: true },
        { label: 'Total Traffic', value: '4.5M', change: '↑ 8% vs PY', positive: true, highlighted: true },
        { label: 'Conversion (CVR)', value: '4.5%', change: '↑ 8% vs PY', positive: true },
        { label: 'Target Completion', value: '45%', change: 'Target: 1.91M', isTarget: true },
    ];

    const regionalData = [
        { region: 'LATAM', value: '1,264K', change: '+11%', percentage: 100 },
        { region: 'EMEA', value: '927K', change: '+2%', percentage: 73 },
        { region: 'APAC', value: '177K', change: '+27%', percentage: 14 },
    ];

    const latamMarkets = [
        { market: 'Brazil', valueOrd: '10.4M', change: '-26%', positive: false, traffic: '4.4%', pickup: '66%', pickupAlert: true },
        { market: 'Mexico', valueOrd: '6.7M', change: '+11%', positive: true, traffic: '1.1%', pickup: '78%', pickupAlert: false },
        { market: 'Caribbean', valueOrd: '3.0M', change: '+35%', positive: true, traffic: '1.9%', pickup: '66%', pickupAlert: false },
    ];

    const keyInsights = [
        { bold: 'Brazil:', text: 'Main driver of regional downtrend (Sao Paulo pickup down).' },
        { bold: 'APAC:', text: 'Performing exceptionally with +27% growth.' },
        { bold: 'Purchase Cycle:', text: '36% of orders completed, but collections lagging.' },
    ];

    const strategicActions = [
        'Optimize localized catalogue translations.',
        'Deploy aggressive traffic recovery in Brazil.',
        'Focus on LATAM "Collection Conversion."',
    ];

    return (
        <div className="trade-performance-page">
            <Header />
            <main className="trade-main">
                {/* Sub Header */}
                <div className="trade-subheader">
                    <div className="trade-subheader-content">
                        <div className="trade-subheader-left">
                            <h1 className="trade-title">Trade Performance Dashboard</h1>
                            <p className="trade-subtitle">
                                Week 46 Overview • <span className="growth-positive">Global Growth +8%</span>
                            </p>
                        </div>
                        <div className="trade-subheader-actions">
                            <button className="btn-secondary">Share Report</button>
                            <button className="btn-primary">Export PDF</button>
                        </div>
                    </div>
                </div>

                <div className="trade-content">
                    {/* Top KPIs */}
                    <div className="kpi-grid">
                        {kpiData.map((kpi, index) => (
                            <div
                                key={index}
                                className={`kpi-card ${kpi.highlighted ? 'kpi-highlighted' : ''}`}
                            >
                                <p className="kpi-label">{kpi.label}</p>
                                <h3 className="kpi-value">{kpi.value}</h3>
                                <p className={`kpi-change ${kpi.isTarget ? 'kpi-target' : kpi.positive ? 'kpi-positive' : 'kpi-negative'}`}>
                                    {kpi.change}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Middle Charts */}
                    <div className="charts-grid">
                        {/* Regional Breakdown */}
                        <div className="chart-card">
                            <h4 className="chart-title">Regional Performance (Value Ordered)</h4>
                            <div className="regional-bars">
                                {regionalData.map((region, index) => (
                                    <div key={index} className="regional-item">
                                        <div className="regional-header">
                                            <span className={index === 0 ? 'region-name-primary' : 'region-name'}>{region.region}</span>
                                            <span className={index === 0 ? 'region-value-primary' : 'region-value'}>
                                                {region.value} ({region.change})
                                            </span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div
                                                className={`progress-bar-fill progress-bar-${index}`}
                                                style={{ width: `${region.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LATAM Market Table */}
                        <div className="chart-card">
                            <h4 className="chart-title latam-title">LATAM Deep Dive</h4>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Market</th>
                                            <th>Value Ord</th>
                                            <th className="text-center">Traffic</th>
                                            <th className="text-right">Pickup%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latamMarkets.map((market, index) => (
                                            <tr key={index}>
                                                <td>{market.market}</td>
                                                <td>
                                                    {market.valueOrd}{' '}
                                                    <span className={market.positive ? 'change-positive' : 'change-negative'}>
                                                        ({market.change})
                                                    </span>
                                                </td>
                                                <td className="text-center">{market.traffic}</td>
                                                <td className={`text-right ${market.pickupAlert ? 'pickup-alert' : ''}`}>
                                                    {market.pickup}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Insights Section */}
                    <div className="insights-grid">
                        {/* Inventory Alert */}
                        <div className="inventory-alert-card">
                            <h4 className="alert-title">Inventory Alert</h4>
                            <div className="alert-value">81%</div>
                            <p className="alert-text">
                                Total Inventory is currently categorized as{' '}
                                <span className="alert-highlight">Non-Moving</span>.
                                Immediate liquidation strategies required.
                            </p>
                        </div>

                        {/* Key Insights & Strategic Actions */}
                        <div className="insights-actions-card">
                            <div className="insights-actions-grid">
                                <div className="insights-section">
                                    <h4 className="section-title">
                                        <span className="dot-blue"></span> Key Insights
                                    </h4>
                                    <ul className="insights-list">
                                        {keyInsights.map((insight, index) => (
                                            <li key={index}>
                                                • <strong>{insight.bold}</strong> {insight.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="actions-section">
                                    <h4 className="section-title">
                                        <span className="dot-green"></span> Strategic Actions
                                    </h4>
                                    <ul className="actions-list">
                                        {strategicActions.map((action, index) => (
                                            <li key={index}>• {action}</li>
                                        ))}
                                    </ul>
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
