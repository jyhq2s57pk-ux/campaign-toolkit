import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from 'recharts';
import './ValentineInsights.css';

const spendingData = [
    { year: '2009', value: 102.50 },
    { year: '2010', value: 103.00 },
    { year: '2011', value: 116.21 },
    { year: '2012', value: 126.03 },
    { year: '2013', value: 130.97 },
    { year: '2014', value: 133.91 },
    { year: '2015', value: 142.31 },
    { year: '2016', value: 146.84 },
    { year: '2017', value: 136.57 },
    { year: '2018', value: 143.61 },
    { year: '2019', value: 161.96 },
    { year: '2020', value: 196.31 },
    { year: '2021', value: 164.76 },
    { year: '2022', value: 175.41 },
    { year: '2023', value: 192.80 },
    { year: '2024', value: 185.81 },
    { year: '2025', value: 196.31 }
];

const categoryData = [
    { label: 'Fragrances', value: 49 },
    { label: 'Treatment', value: 15 },
    { label: 'Whisky', value: 11 },
    { label: 'Make Up', value: 4 },
    { label: 'White & Other Spirits', value: 4 },
    { label: 'Champagne & Wine', value: 3 },
    { label: 'Confectionery', value: 3 }
];
// top 7 categories

const reasonsData = [
    { label: "It's important to my significant other", value: 52 },
    { label: "It's a fun thing to do with friends and family", value: 43 },
    { label: "Valentine's Day is one of my favorite holidays", value: 20 },
    { label: "It's expected of me", value: 10 }
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label}: $${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export default function ValentineInsights() {
    return (
        <section className="valentine-section">
            <h2 className="valentine-header">Valentine's Day Insights</h2>

            {/* Stats Grid */}
            <div className="valentine-stats-grid">
                <div className="v-stat-card">
                    <div className="v-stat-number text-red">49%</div>
                    <div className="v-stat-text">
                        Fragrances dominated February 2025 orders, accounting for 49% of the total value collected. Treatment products followed with 15%, and Whisky with 11%.
                    </div>
                </div>
                <div className="v-stat-card">
                    <div className="v-stat-number text-red">52%</div>
                    <div className="v-stat-text">
                        The top reason shoppers say they are celebrating Valentine's Day is because it is important to their significant other.
                    </div>
                </div>
                <div className="v-stat-card">
                    <div className="v-stat-number text-red">79%</div>
                    <div className="v-stat-text">
                        In the UK, Gen Z are the most likely generation to celebrate Valentine's Day in 2025, with 79% marking the occasion.
                    </div>
                </div>
            </div>

            <div className="source-text">Source: NRF and Avolta Power BI Data.</div>

            {/* Middle Row Charts */}
            <div className="valentine-charts-grid">
                {/* Spending Evolution (Line Chart) */}
                <div className="v-chart-card">
                    <h3 className="v-chart-title">Per-person Spending Evolution</h3>
                    <div className="v-chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={spendingData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fill: '#999', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={2}
                                />
                                <YAxis
                                    tick={{ fill: '#999', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={[0, 220]}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#D32F2F"
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: '#D32F2F' }}
                                    activeDot={{ r: 6 }}
                                >
                                    <LabelList
                                        dataKey="value"
                                        position="top"
                                        fill="#D32F2F"
                                        fontSize={10}
                                        formatter={(val) => val > 150 ? `$${val}` : ''}
                                    />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="chart-source">Source: NRF's Valentine's Day Survey</div>
                    </div>
                </div>

                {/* Top Categories (Bar Chart) */}
                <div className="v-chart-card">
                    <h3 className="v-chart-title">Top Categories – February 2025</h3>
                    <div className="v-bar-chart-vertical">
                        {categoryData.map((item, index) => (
                            <div key={index} className="v-bar-row">
                                <div className="v-bar-label">{item.label}</div>
                                <div className="v-bar-track">
                                    <div
                                        className="v-bar-fill red-fill"
                                        style={{ width: `${item.value}%` }}
                                    >
                                        <span className="v-bar-value">{item.value}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="chart-source">Source: Avolta Power BI. Top groups sold in Avolta Ecommerce during February 2025 (based on Value Collected)</div>
                </div>
            </div>

            {/* Bottom Chart: Why Consumers Celebrate */}
            <div className="v-chart-card wide-card">
                <h3 className="v-chart-title">Why Consumers Celebrate Valentine's Day</h3>
                <div className="v-bar-chart-vertical wide-bars">
                    {reasonsData.map((item, index) => {
                        // Alternating colors for visual interest or mapped to specific logic
                        // Using different shades of pink/purple for variety
                        const colors = ['#C2185B', '#CE93D8', '#7B1FA2', '#F48FB1'];
                        const color = colors[index % colors.length];
                        return (
                            <div key={index} className="v-bar-row-wide">
                                <div className="v-bar-label-wide">{item.label}</div>
                                <div className="v-bar-track">
                                    <div
                                        className="v-bar-fill"
                                        style={{ width: `${item.value}%`, backgroundColor: color }}
                                    >
                                        <span className="v-bar-value-outside">{item.value}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="chart-source right-align">Source: NRF's Valentine's Day Survey</div>
            </div>
        </section>
    );
}
