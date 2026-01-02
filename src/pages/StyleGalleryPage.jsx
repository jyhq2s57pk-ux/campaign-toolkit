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

                    {/* Migration Impact Preview */}
                    <section className="gallery-section">
                        <h2 className="section-title">Migration Impact Preview</h2>
                        <p className="section-desc">Visual comparison of current hardcoded values vs. proposed tokenized styles.</p>

                        <div className="comparison-container">

                            {/* Example 1: Hero Card Surface */}
                            <div className="comparison-row">
                                <div className="comparison-col">
                                    <div className="tag tag-current">Current (Hardcoded)</div>
                                    <div className="demo-box" style={{
                                        backgroundColor: '#262626',
                                        borderRadius: '40px',
                                        padding: '40px',
                                        color: 'white'
                                    }}>
                                        <h3 style={{ fontSize: '40px', margin: '0 0 10px 0' }}>Hero Card</h3>
                                        <p style={{ color: '#989898', fontSize: '20px' }}>Background: #262626<br />Radius: 40px<br />Text: 40px / 20px</p>
                                    </div>
                                </div>
                                <div className="comparison-col">
                                    <div className="tag tag-target">Target (Tokens)</div>
                                    <div className="demo-box card-elevated" style={{ height: '100%' }}>
                                        <h3 className="h-xl" style={{ margin: '0 0 10px 0' }}>Hero Card</h3>
                                        <p className="b-large" style={{ color: 'var(--text-secondary)' }}>Surface: Elevated (#111)<br />Radius: LG (24px)<br />Text: XL (36px) / M (22px)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Example 2: Badges */}
                            <div className="comparison-row">
                                <div className="comparison-col">
                                    <div className="tag tag-current">Current (Mixed)</div>
                                    <div className="demo-box" style={{ background: '#1a1a1a' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{
                                                background: 'rgba(255, 102, 196, 0.2)',
                                                color: '#FF66C4',
                                                padding: '2px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px'
                                            }}>New</span>
                                            <span style={{
                                                background: '#282828',
                                                color: '#ffffff',
                                                padding: '0 20px',
                                                height: '36px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                borderRadius: '20px',
                                                fontSize: '13px'
                                            }}>Hero Badge</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="comparison-col">
                                    <div className="tag tag-target">Target (Unified)</div>
                                    <div className="demo-box card-default">
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span className="badge-token badge-magenta">New</span>
                                            <span className="badge-token badge-default">Hero Badge</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Example 3: Admin / Container Cards */}
                            <div className="comparison-row">
                                <div className="comparison-col">
                                    <div className="tag tag-current">Current (Admin - #262626)</div>
                                    <div className="demo-box" style={{ background: '#262626', borderRadius: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <strong style={{ color: 'white' }}>Ways of Working (Admin)</strong>
                                            <span style={{ color: '#aaa' }}>#262626</span>
                                        </div>
                                        <p style={{ color: '#aaa', fontSize: '14px' }}>
                                            This card uses the "neutral-800" color from the Admin styling. Note how it is lighter than the Evo Night theme.
                                        </p>
                                    </div>
                                </div>
                                <div className="comparison-col">
                                    <div className="tag tag-target">Target (Surface Elevated - #111)</div>
                                    <div className="demo-box card-elevated" style={{ height: '100%', borderRadius: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <strong style={{ color: 'var(--text-primary)' }}>Ways of Working (Evo)</strong>
                                            <span style={{ color: 'var(--text-secondary)' }}>#111111</span>
                                        </div>
                                        <p className="b-default">
                                            This card uses <code>--surface-elevated</code>. It is darker and lighter, providing better contrast for content pop using proper tokens.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>



                    {/* Container Unification Lab (New) */}
                    <section className="gallery-section">
                        <h2 className="section-title">Container Unification Lab</h2>
                        <p className="section-desc">Harmonizing 9+ variations into 2 Master Styles based on the browser audit.</p>

                        <div className="subsection">
                            <h3>Master Style 01: Glass Content Card (Target)</h3>
                            <p style={{ color: '#888', marginBottom: '24px' }}>Recommendation for: Workflow, Resources, Calendar, Bento</p>

                            <div className="comparison-row">
                                <div className="comparison-col">
                                    <div className="tag tag-current">Current (Fragmented)</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div className="demo-box" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '0.55px solid rgba(255,255,255,0.1)' }}>
                                            <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>Resource (Radius 24px)</p>
                                        </div>
                                        <div className="demo-box" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '32px', border: 'none' }}>
                                            <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>Bento (No Border, Radius 32px)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="comparison-col">
                                    <div className="tag tag-target">Unified Master Style</div>
                                    <div className="demo-box card-glass" style={{ height: '100%', borderRadius: '32px', border: '0.5px solid rgba(255,255,255,0.15)', padding: '40px' }}>
                                        <h4 style={{ color: 'white', margin: '0 0 8px' }}>Unified Glass Card</h4>
                                        <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
                                            <li>Radius: 32px (Consistent)</li>
                                            <li>Border: 0.5px White (15%)</li>
                                            <li>Backdrop: Blur 20px</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="subsection">
                            <h3>Master Style 02: Elevated Container (Target)</h3>
                            <p style={{ color: '#888', marginBottom: '24px' }}>Recommendation for: Hero, Admin, Main Wrappers</p>

                            <div className="comparison-row">
                                <div className="comparison-col">
                                    <div className="tag tag-current">Current (Legacy Grey)</div>
                                    <div className="demo-box" style={{ background: '#262626', borderRadius: '40px' }}>
                                        <p style={{ margin: 0, color: '#white', fontSize: '14px' }}>Hero / Admin (#262626)</p>
                                    </div>
                                </div>
                                <div className="comparison-col">
                                    <div className="tag tag-target">Unified Master Style</div>
                                    <div className="demo-box card-elevated" style={{ height: '100%', borderRadius: '40px', padding: '40px', border: '1px solid var(--border-light)' }}>
                                        <h4 style={{ color: 'white', margin: '0 0 8px' }}>Unified Elevated Surface</h4>
                                        <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
                                            <li>Background: #111111</li>
                                            <li>Radius: 40px (Hero-class)</li>
                                            <li>Depth: Richer Black</li>
                                        </ul>
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
