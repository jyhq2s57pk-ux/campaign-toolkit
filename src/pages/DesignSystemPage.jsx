import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './DesignSystemPage.css';

// Component Imports
import ActivationIdeas from '../components/ActivationIdeas';
import Badge from '../components/Badge';
import Carousel from '../components/Carousel';
import ContentsList from '../components/ContentsList';
import FeatureBlock from '../components/FeatureBlock';
import FlexibleHeroCard from '../components/FlexibleHeroCard';
import FooterLogo from '../components/FooterLogo';
import ImplementationLevels from '../components/ImplementationLevels';
import ImplementationTips from '../components/ImplementationTips';
import JourneyAdmin from '../components/JourneyAdmin';
import LinkHeroCard from '../components/LinkHeroCard';
import MiniLinkCard from '../components/MiniLinkCard';
import HeroCampaignCard from '../components/HeroCampaignCard';
import MarkerEditor from '../components/MarkerEditor';
import NumberMarker from '../components/NumberMarker';
import PlatformChip from '../components/PlatformChip';
import ResourceEmbed from '../components/ResourceEmbed';
import ResourcesAdmin from '../components/ResourcesAdmin';
import ScreenshotPlaceholder from '../components/ScreenshotPlaceholder';
import StrategyOverview from '../components/StrategyOverview';
import TouchpointItem from '../components/TouchpointItem';
import TouchpointSection from '../components/TouchpointSection';

const COMPONENTS_LIST = [
    {
        name: 'ActivationIdeas',
        component: ActivationIdeas,
        defaultProps: {},
        usage: 'HomePage.jsx',
    },
    {
        name: 'Badge',
        component: Badge,
        defaultProps: { children: 'New', variant: 'new' },
        usage: 'JourneyAdmin.jsx, Carousel.jsx',
    },
    {
        name: 'Carousel',
        component: Carousel,
        defaultProps: {},
        usage: 'ImplementationLevels.jsx, HomePage.jsx',
        wide: true,
    },
    {
        name: 'ContentsList',
        component: ContentsList,
        defaultProps: {
            items: [
                { id: 'section1', label: 'Section 1' },
                { id: 'section2', label: 'Section 2' },
            ]
        },
        usage: 'HomePage.jsx',
        wide: true,
    },
    {
        name: 'FeatureBlock',
        component: FeatureBlock,
        defaultProps: {
            title: 'Feature Block Title',
            description: 'This is a description for the feature block component.',
            image: 'https://placehold.co/600x400',
        },
        usage: 'TouchpointItem.jsx',
    },
    {
        name: 'FlexibleHeroCard',
        component: FlexibleHeroCard,
        defaultProps: {
            title: 'Flexible Hero Card',
            description: 'A flexible card component for various hero sections.',
            image: 'https://placehold.co/800x400',
            tag: 'Hero',
        },
        usage: 'ResourceDetailPage.jsx',
        wide: true,
    },
    {
        name: 'FooterLogo',
        component: FooterLogo,
        defaultProps: {},
        usage: 'Footer.jsx',
        wide: true,
    },
    {
        name: 'ImplementationLevels',
        component: ImplementationLevels,
        defaultProps: {},
        usage: 'CustomerJourneyPage.jsx',
        wide: true,
    },
    {
        name: 'ImplementationTips',
        component: ImplementationTips,
        defaultProps: { items: ['Tip 1: Always test code.', 'Tip 2: Verify inputs.'] },
        usage: 'WaysOfWorkingPage.jsx',
        wide: true,
    },
    {
        name: 'LinkHeroCard',
        component: LinkHeroCard,
        defaultProps: {
            title: 'Link Hero Card',
            description: 'A card that links to external resources.',
            link: '#',
        },
        usage: 'Not indexed',
    },
    {
        name: 'MiniLinkCard',
        component: MiniLinkCard,
        defaultProps: {
            title: 'Customer journey',
            description: 'Optional description text.',
            link: '#',
        },
        usage: 'HomePage.jsx',
    },
    {
        name: 'HeroCampaignCard',
        component: HeroCampaignCard,
        defaultProps: {
            title: 'The Magic of Joy Holiday Season',
            year: '2026 Global campaign',
            image: 'https://placehold.co/600x400',
        },
        usage: 'HomePage.jsx',
        wide: true,
    },
    {
        name: 'MarkerEditor',
        component: MarkerEditor,
        defaultProps: {
            imageUrl: 'https://placehold.co/600x400',
            markers: [{ number: 1, top: '50%' }],
            onChange: () => { },
        },
        usage: 'JourneyAdmin.jsx',
    },
    {
        name: 'NumberMarker',
        component: NumberMarker,
        defaultProps: { number: 1 },
        usage: 'TouchpointItem.jsx',
    },
    {
        name: 'PlatformChip',
        component: PlatformChip,
        defaultProps: { platform: 'instagram' },
        usage: 'Not indexed',
    },
    {
        name: 'ResourceEmbed',
        component: ResourceEmbed,
        defaultProps: {
            title: 'Resource Embed',
            description: 'Embedded resource content.',
            url: 'https://example.com',
        },
        usage: 'ResourceDetailPage.jsx',
        wide: true,
    },
    {
        name: 'ScreenshotPlaceholder',
        component: ScreenshotPlaceholder,
        defaultProps: { width: '100%', height: '200px', label: 'Screenshot' },
        usage: 'TouchpointSection.jsx',
    },
    {
        name: 'StrategyOverview',
        component: StrategyOverview,
        defaultProps: {},
        usage: 'Not indexed',
        wide: true,
    },
    {
        name: 'TouchpointItem',
        component: TouchpointItem,
        defaultProps: {
            stepNumber: 1,
            title: 'Touchpoint Example',
            description: 'Example description.'
        },
        usage: 'TouchpointSection.jsx',
        wide: true,
    },
    {
        name: 'TouchpointSection',
        component: TouchpointSection,
        defaultProps: {
            platform: 'Platform Name',
            platformType: 'Web',
            title: 'Touchpoint Section',
            touchpoints: []
        },
        usage: 'Not indexed',
        wide: true,
    },
];

const ColorCard = ({ name, token, bg, text }) => (
    <div className="token-card">
        <div className="token-swatch" style={{ backgroundColor: bg }}>
            {text && <span style={{ color: text }}>Text</span>}
        </div>
        <div className="token-info">
            <h4>{name}</h4>
            <code>{token}</code>
        </div>
    </div>
);

const DesignSystemPage = () => {
    const [activeTab, setActiveTab] = useState('foundations');

    return (
        <div className="ds-page">
            <Header />
            <main className="ds-container">
                <header className="ds-header">
                    <h1 className="ds-title">Design System</h1>
                    <p className="ds-subtitle">The single source of truth for Campaign Toolkit's tokens, styles, and components.</p>
                </header>

                <nav className="ds-tabs">
                    <button
                        className={`ds-tab-btn ${activeTab === 'foundations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('foundations')}
                    >
                        Foundations & Tokens
                    </button>
                    <button
                        className={`ds-tab-btn ${activeTab === 'components' ? 'active' : ''}`}
                        onClick={() => setActiveTab('components')}
                    >
                        Component Library
                    </button>
                </nav>

                {activeTab === 'foundations' ? (
                    <div className="ds-content">
                        {/* SURFACES */}
                        <section className="ds-section">
                            <h2 className="ds-section-title">Colors: Surfaces</h2>
                            <div className="ds-grid-4">
                                <ColorCard name="Surface Default" token="var(--surface-default)" bg="var(--surface-default)" text="var(--text-primary)" />
                                <ColorCard name="Surface Elevated" token="var(--surface-elevated)" bg="var(--surface-elevated)" text="var(--text-primary)" />
                                <ColorCard name="Surface Card" token="var(--surface-card)" bg="var(--surface-card)" text="var(--text-primary)" />
                                <ColorCard name="Surface Glass" token="var(--surface-glass)" bg="var(--surface-elevated)" text="var(--text-primary)" />
                            </div>
                        </section>

                        {/* ACCENTS */}
                        <section className="ds-section">
                            <h2 className="ds-section-title">Colors: Brand Accents</h2>
                            <div className="ds-grid-4">
                                <ColorCard name="Accent Green" token="var(--accent-green)" bg="var(--accent-green)" text="#000" />
                                <ColorCard name="Accent Purple" token="var(--accent-purple)" bg="var(--accent-purple)" text="#fff" />
                                <ColorCard name="Accent Blue" token="var(--accent-blue)" bg="var(--accent-blue)" text="#fff" />
                                <ColorCard name="Accent Coral" token="var(--accent-coral)" bg="var(--accent-coral)" text="#000" />
                                <ColorCard name="Accent Orange" token="var(--accent-orange)" bg="var(--accent-orange)" text="#000" />
                            </div>
                        </section>

                        {/* BADGES */}
                        <section className="ds-section">
                            <h2 className="ds-section-title">Colors: Badge Tokens</h2>
                            <div className="ds-grid-4">
                                <ColorCard name="Badge Premium" token="var(--badge-premium-bg)" bg="var(--badge-premium-bg)" text="var(--badge-premium-text)" />
                                <ColorCard name="Badge Executive" token="var(--badge-executive-bg)" bg="var(--badge-executive-bg)" text="var(--badge-executive-text)" />
                                <ColorCard name="Badge Standard" token="var(--badge-standard-bg)" bg="var(--badge-standard-bg)" text="var(--badge-standard-text)" />
                                <ColorCard name="Badge New" token="var(--badge-new-bg)" bg="var(--badge-new-bg)" text="var(--badge-new-text)" />
                            </div>
                        </section>

                        <section className="ds-section">
                            <h2 className="ds-section-title">Typography: Scale</h2>
                            <table className="type-table">
                                <tbody>
                                    <tr className="type-row">
                                        <td className="type-meta">
                                            <span className="type-label">Heading XXXL (H1)</span><br />
                                            <span className="type-font">Saans SemiBold</span><br />
                                            <code>var(--h-xxxl)</code>
                                        </td>
                                        <td className="type-example"><h1 style={{ fontSize: 'var(--h-xxxl)', lineHeight: 1.1, margin: 0 }}>The quick brown fox jumps over the lazy dog</h1></td>
                                    </tr>
                                    <tr className="type-row">
                                        <td className="type-meta">
                                            <span className="type-label">Heading XXL (H2)</span><br />
                                            <span className="type-font">Saans SemiBold</span><br />
                                            <code>var(--h-xxl)</code>
                                        </td>
                                        <td className="type-example"><h2 style={{ fontSize: 'var(--h-xxl)', lineHeight: 1.1, margin: 0 }}>The quick brown fox jumps over the lazy dog</h2></td>
                                    </tr>
                                    <tr className="type-row">
                                        <td className="type-meta">
                                            <span className="type-label">Heading XL (H3)</span><br />
                                            <span className="type-font">Saans SemiBold</span><br />
                                            <code>var(--h-xl)</code>
                                        </td>
                                        <td className="type-example"><h3 style={{ fontSize: 'var(--h-xl)', lineHeight: 1.2, margin: 0 }}>The quick brown fox jumps over the lazy dog</h3></td>
                                    </tr>
                                    <tr className="type-row">
                                        <td className="type-meta">
                                            <span className="type-label">Heading L (H4)</span><br />
                                            <span className="type-font">Saans Medium</span><br />
                                            <code>var(--h-l)</code>
                                        </td>
                                        <td className="type-example"><h4 style={{ fontSize: 'var(--h-l)', lineHeight: 1.2, margin: 0 }}>The quick brown fox jumps over the lazy dog</h4></td>
                                    </tr>
                                    <tr className="type-row">
                                        <td className="type-meta">
                                            <span className="type-label">Body Large</span><br />
                                            <span className="type-font">Saans Regular</span><br />
                                            <code>var(--length-body-large)</code>
                                        </td>
                                        <td className="type-example"><p style={{ fontSize: 'var(--length-body-large)', margin: 0 }}>The quick brown fox jumps over the lazy dog. Used for lead paragraphs.</p></td>
                                    </tr>
                                    <tr className="type-row">
                                        <td className="type-meta">
                                            <span className="type-label">Body Default</span><br />
                                            <span className="type-font">Saans Regular</span><br />
                                            <code>var(--length-body-default)</code>
                                        </td>
                                        <td className="type-example"><p style={{ fontSize: 'var(--length-body-default)', margin: 0 }}>The quick brown fox jumps over the lazy dog. Used for standard reading context.</p></td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                ) : (
                    <div className="ds-content">
                        {/* COMPONENTS LIST */}
                        <div className="ds-component-grid">
                            {COMPONENTS_LIST.map((item) => {
                                const Comp = item.component;
                                return (
                                    <div key={item.name} className="comp-card">
                                        <div className="comp-header">
                                            <h3 className="comp-title">/{item.name}</h3>
                                            <span className="comp-usage">Used in: {item.usage}</span>
                                        </div>
                                        <div className="comp-preview">
                                            {/* Wrapper to ensure full width components don't get constrained by flex center if they need to stretch? 
                                                Actually flex center might break full-width items like Carousel. 
                                                Let's add a width 100% wrapper if needed, but centering relies on width being auto for small items.
                                                Best of both: width 100% for the child, but max-width? 
                                                No, the requirement is "if the component is small... center it". 
                                                Large components should fill. 
                                                So we generally want `align-items: center` on the parent, 
                                                and the component to be its natural width, UP TO 100%. 
                                            */}
                                            <div style={{ width: item.wide ? '100%' : 'auto', maxWidth: '100%' }}>
                                                <Comp {...item.defaultProps} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default DesignSystemPage;
