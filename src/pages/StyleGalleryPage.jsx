import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './StyleGalleryPage.css';

const StyleGalleryPage = () => {
    return (
        <div className="app">
            <Header />
            <main className="gallery-content">
                <div className="inner-content-wrapper">
                    <section className="gallery-header">
                        <h1 className="gallery-title">Design System Artifact</h1>
                        <p className="gallery-subtitle">Inferred tokens and rules from code audit</p>
                    </section>

                    {/* Applied Master Styles: Surfaces */}
                    <section className="gallery-section">
                        <h2 className="section-title">Surfaces & Cards</h2>
                        <div className="card-grid">
                            <div className="card-token card-elevated">
                                <h4>Elevated Surface</h4>
                                <p>Used for primary content islands. Background: #111111</p>
                                <div className="token-label">.card-elevated</div>
                            </div>
                            <div className="card-token card-default">
                                <h4>Card Surface</h4>
                                <p>Used for secondary cards. Background: #161616</p>
                                <div className="token-label">.card-default</div>
                            </div>
                            <div className="card-token card-glass">
                                <h4>Glass Surface</h4>
                                <p>Used for overlays. Backdrop blur effect.</p>
                                <div className="token-label">.card-glass</div>
                            </div>
                        </div>
                    </section>

                    {/* Applied Master Styles: Layout */}
                    <section className="gallery-section">
                        <h2 className="section-title">Applied Master Styles: Layout</h2>
                        <p className="section-desc">Global structural classes defined in index.css</p>

                        <div className="layout-grid">
                            {/* Page Header Spec */}
                            <div className="spec-card card-elevated">
                                <h3 className="h-l">.page-header</h3>
                                <div className="spec-details">
                                    <div className="spec-row">
                                        <span className="spec-label">Usage</span>
                                        <span className="spec-value">Standard H1 + Subtitle block (Top of page)</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-label">Top Padding</span>
                                        <span className="spec-value">180px (Clears fixed nav)</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-label">Max Width</span>
                                        <span className="spec-value">1148px (Matches global wrapper)</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-label">Dimensions</span>
                                        <span className="spec-value">H1: 72px (600) / P: 16px (400)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Wrapper Spec */}
                            <div className="spec-card card-elevated">
                                <h3 className="h-l">.inner-content-wrapper</h3>
                                <div className="spec-details">
                                    <div className="spec-row">
                                        <span className="spec-label">Usage</span>
                                        <span className="spec-value">Main container for consistent margins</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-label">Max Width</span>
                                        <span className="spec-value">1100px (+ 48px padding = 1148px)</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-label">Padding</span>
                                        <span className="spec-value">0 24px (Horizontal)</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-label">Alignment</span>
                                        <span className="spec-value">Centered (margin: 0 auto)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Color Palette */}
                    <section className="gallery-section">
                        <h2 className="section-title">Color Palette</h2>

                        <div className="subsection">
                            <h3>Surfaces (Dark Mode)</h3>
                            <div className="color-grid">
                                <ColorCard name="Surface Default" value="#000000" variable="--surface-default" />
                                <ColorCard name="Surface Elevated" value="#111111" variable="--surface-elevated" />
                                <ColorCard name="Surface Card" value="#161616" variable="--surface-card" />
                                <ColorCard name="Surface Glass" value="rgba(255, 255, 255, 0.02)" variable="--surface-glass" />
                            </div>
                        </div>

                        <div className="subsection">
                            <h3>Accents (Tiers)</h3>
                            <div className="color-grid">
                                <ColorCard name="Accent Green (Premium)" value="#BEF264" variable="--accent-green" />
                                <ColorCard name="Accent Purple (Exec)" value="#8F53F0" variable="--accent-purple" />
                                <ColorCard name="Accent Blue (New)" value="#3B82F6" variable="--accent-blue" />
                                <ColorCard name="Accent Coral" value="#FB7185" variable="--accent-coral" />
                            </div>
                        </div>

                        <div className="subsection">
                            <h3>Status & Badges</h3>
                            <div className="color-grid">
                                <ColorCard name="Status Magenta" value="#FF66C4" bg="rgba(255, 102, 196, 0.2)" />
                                <ColorCard name="Status Success" value="#34C759" bg="rgba(52, 199, 89, 0.2)" />
                                <ColorCard name="Status Purple" value="#AF52DE" bg="rgba(175, 82, 222, 0.2)" />
                                <ColorCard name="Status Default" value="#E5E5EA" bg="rgba(82, 82, 82, 1)" />
                            </div>
                        </div>
                    </section>

                    {/* Typography */}
                    <section className="gallery-section">
                        <h2 className="section-title">Typography</h2>
                        <div className="type-specimen">
                            <div className="type-row">
                                <span className="type-label">Heading XXXL (60px)</span>
                                <h1 className="h-xxxl">The quick brown fox</h1>
                            </div>
                            <div className="type-row">
                                <span className="type-label">Heading XXL (45px)</span>
                                <h2 className="h-xxl">The quick brown fox</h2>
                            </div>
                            <div className="type-row">
                                <span className="type-label">Heading XL (36px)</span>
                                <h3 className="h-xl">The quick brown fox</h3>
                            </div>
                            <div className="type-row">
                                <span className="type-label">Heading L (28px)</span>
                                <h4 className="h-l">The quick brown fox</h4>
                            </div>
                            <div className="type-row">
                                <span className="type-label">Heading M (20px)</span>
                                <h5 className="h-m" style={{ fontSize: '20px', fontWeight: 500, margin: 0 }}>The quick brown fox</h5>
                            </div>
                            <div className="type-row">
                                <span className="type-label">Body Large (16px)</span>
                                <p className="b-large">Campaign Toolkit provides resources for global marketing teams.</p>
                            </div>
                            <div className="type-row">
                                <span className="type-label">Body Default (14px)</span>
                                <p className="b-default">Campaign Toolkit provides resources for global marketing teams.</p>
                            </div>
                        </div>
                    </section>

                    {/* Components */}
                    <section className="gallery-section">
                        <h2 className="section-title">Components</h2>

                        <div className="component-row">
                            <div className="component-group">
                                <h3>Buttons</h3>
                                <div className="button-group">
                                    <button className="btn-token btn-primary">Primary Action</button>
                                    <button className="btn-token btn-secondary">Secondary Action</button>
                                    <button className="btn-token btn-outline">Outline Action</button>
                                </div>
                            </div>

                            <div className="component-group">
                                <h3>Badges</h3>
                                <div className="badge-group">
                                    <span className="badge-token badge-magenta">New Arrival</span>
                                    <span className="badge-token badge-success">Approved</span>
                                    <span className="badge-token badge-purple">Executive</span>
                                    <span className="badge-token badge-default">Draft</span>
                                </div>
                            </div>
                        </div>

                        <div className="component-group">
                            <h3>Cards & Surfaces</h3>
                            <div className="card-grid">
                                <div className="card-token card-elevated">
                                    <h4>Elevated Surface</h4>
                                    <p>Used for primary content islands. Background: #111111</p>
                                </div>
                                <div className="card-token card-default">
                                    <h4>Card Surface</h4>
                                    <p>Used for secondary cards. Background: #161616</p>
                                </div>
                                <div className="card-token card-glass">
                                    <h4>Glass Surface</h4>
                                    <p>Used for overlays. Backdrop blur effect.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Site Components (Audited) */}
                    <section className="gallery-section">
                        <h2 className="section-title">Site Components (Audited)</h2>
                        <p className="section-desc">Key patterns identified from site-wide audit.</p>

                        <div className="component-row">
                            <div className="component-group">
                                <h3>Campaign Tile (Home)</h3>
                                <div className="demo-box" style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    background: '#111',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '40px',
                                    padding: '40px',
                                    color: 'white'
                                }}>
                                    <h2 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>Summer 2025</h2>
                                    <p style={{ color: '#a1a1a6', margin: 0 }}>Campaign Tile Style</p>
                                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <span className="token-label">Radius: 40px</span>
                                        <span className="token-label">Bg: #111</span>
                                        <span className="token-label">Border: 1px solid 5% white</span>
                                    </div>
                                </div>
                            </div>

                            <div className="component-group">
                                <h3>Actions & Inputs (Admin)</h3>
                                <div className="demo-box" style={{ background: '#111', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {/* Input */}
                                    <div>
                                        <label style={{ display: 'block', color: '#666', fontSize: '12px', marginBottom: '8px' }}>Input Field</label>
                                        <input type="text" placeholder="Campaign Name" style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '6px',
                                            padding: '10px 12px',
                                            color: 'white',
                                            width: '100%',
                                            outline: 'none'
                                        }} />
                                        <div className="token-label" style={{ marginTop: '8px' }}>Radius: 6px</div>
                                    </div>

                                    {/* Buttons */}
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn-token btn-primary" style={{ borderRadius: '6px' }}>Primary</button>
                                        <button className="btn-token btn-secondary" style={{ borderRadius: '6px', background: '#161616', border: '1px solid rgba(255,255,255,0.05)' }}>Secondary</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="component-row" style={{ marginTop: '40px' }}>
                            <div className="component-group">
                                <h3>Structure & Data</h3>
                                <div className="card-grid">
                                    {/* Accordion */}
                                    <div className="card-token">
                                        <h4>Accordion Item (Expanded)</h4>
                                        <div style={{
                                            marginTop: '16px',
                                            border: '0.5px solid rgba(255, 255, 255, 0.15)',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            background: 'transparent'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ color: 'white', fontWeight: 500 }}>Global Setup</span>
                                                <span style={{ color: '#666' }}>−</span>
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#a1a1a6' }}>
                                                When expanded, the item becomes transparent with a subtle 0.5px white border (15% opacity).
                                            </p>
                                        </div>
                                        <div className="token-label" style={{ marginTop: '12px' }}>Border: 0.5px White (15%)</div>
                                    </div>

                                    {/* Calendar Bar */}
                                    <div className="card-token">
                                        <h4>Timeline Bar (Calendar)</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                                            <div style={{
                                                background: 'rgb(233, 177, 242)',
                                                borderRadius: '6px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0 12px',
                                                color: 'black',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}>
                                                Overarching 2025
                                            </div>
                                            <div style={{
                                                background: 'rgb(87, 217, 163)',
                                                borderRadius: '6px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0 12px',
                                                color: 'black',
                                                fontSize: '13px',
                                                fontWeight: 500
                                            }}>
                                                Category Led
                                            </div>
                                        </div>
                                        <div className="token-label" style={{ marginTop: '12px' }}>Radius: 6px</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main >
            <Footer />
        </div >
    );
};

const ColorCard = ({ name, value, variable, bg }) => (
    <div className="color-card">
        <div
            className="color-swatch-box"
            style={{ backgroundColor: bg || value, color: bg ? value : undefined }}
        >
            {bg && <span style={{ color: value }}>Text</span>}
        </div>
        <div className="color-info">
            <span className="color-name">{name}</span>
            <span className="color-value">{value}</span>
            {variable && <span className="color-var">{variable}</span>}
        </div>
    </div>
);

export default StyleGalleryPage;
