import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './OmnichannelPage.css';

export default function OmnichannelPage() {
    const channels = [
        { name: 'Web and App', icon: '📱' },
        { name: 'Email and CRM', icon: '✉️' },
        { name: 'Paid & Organic Social', icon: '🤳' },
        { name: 'In-store & Entertainment', icon: '🏪' },
    ];

    const examples = [
        { title: 'App-based games', description: 'Interactive challenges that drive engagement and loyalty.' },
        { title: 'AR treasure hunts', description: 'In-store augmented reality experiences connecting digital and physical.' },
        { title: 'Tastings & Brand moments', description: 'Physical activations that bring the digital campaign to life in-airport.' },
        { title: 'Loyalty experiences', description: 'Tier-based rewards and exclusive access for Red By Dufry members.' },
    ];

    return (
        <div className="omnichannel-page">
            <Header />
            <main className="omnichannel-main">
                <div className="outer-container">
                    <section className="page-header">
                        <h1 className="page-title">Omnichannel Activation</h1>
                        <p className="page-subtitle-grey">
                            Campaigns are designed to feel consistent and connected across all customer touchpoints.
                        </p>
                    </section>

                    <div className="inner-content-wrapper">
                        <section className="radial-concept">
                            <div className="radial-diagram">
                                <div className="central-idea glass">
                                    <h3>One Campaign<br />One Story</h3>
                                </div>
                                {channels.map((channel, i) => (
                                    <div key={i} className={`channel-node node-${i} glass`}>
                                        <span className="node-icon">{channel.icon}</span>
                                        <span className="node-name">{channel.name}</span>
                                    </div>
                                ))}
                                <div className="connection-lines">
                                    <div className="line line-0"></div>
                                    <div className="line line-1"></div>
                                    <div className="line line-2"></div>
                                    <div className="line line-3"></div>
                                </div>
                            </div>
                        </section>

                        <section className="examples-section">
                            <h2 className="section-label centered">Activation Examples</h2>
                            <div className="examples-grid">
                                {examples.map((ex, i) => (
                                    <div key={i} className="example-card glass">
                                        <h3 className="example-title">{ex.title}</h3>
                                        <p className="example-desc">{ex.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
