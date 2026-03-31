import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Badge from '../components/Badge';
import ContentCard from '../components/ContentCard';
import CompactCampaignCard from '../components/CompactCampaignCard';
import FeatureBlock from '../components/FeatureBlock';
import sampleBalloon from '../assets/omni/gen/balloon.png';
import sampleOrigami from '../assets/omni/gen/origami.png';
import './FigmaCapture.css';

/* ─── Tokens Page ─── */
function TokensCapture() {
  return (
    <div className="fc-page">
      <h1 className="fc-page-title">Design Tokens</h1>

      {/* Surfaces */}
      <section className="fc-section">
        <h2 className="fc-section-title">Surfaces</h2>
        <div className="fc-swatch-grid">
          <Swatch name="Default" token="--surface-default" hex="#000000" />
          <Swatch name="Elevated" token="--surface-elevated" hex="#111111" />
          <Swatch name="Card" token="--surface-card" hex="#1A1A1A" />
          <Swatch name="Card Hover" token="--surface-card-hover" hex="#222222" />
          <Swatch name="Glass" token="--surface-glass" hex="rgba(255,255,255,0.02)" bg="rgba(255,255,255,0.02)" />
        </div>
      </section>

      {/* Text Colors */}
      <section className="fc-section">
        <h2 className="fc-section-title">Text</h2>
        <div className="fc-swatch-grid">
          <Swatch name="Primary" token="--text-primary" hex="#FFFFFF" />
          <Swatch name="Secondary" token="--text-secondary" hex="#B0B0B5" />
          <Swatch name="Muted" token="--text-muted" hex="#8A8A8A" />
          <Swatch name="Inverse" token="--text-inverse" hex="#000000" border />
        </div>
      </section>

      {/* Brand Accents */}
      <section className="fc-section">
        <h2 className="fc-section-title">Brand Accents</h2>
        <div className="fc-swatch-grid">
          <Swatch name="Green" token="--accent-green" hex="#BEF264" />
          <Swatch name="Purple" token="--accent-purple" hex="#8F53F0" />
          <Swatch name="Blue" token="--accent-blue" hex="#3B82F6" />
          <Swatch name="Coral" token="--accent-coral" hex="#FB7185" />
          <Swatch name="Orange" token="--accent-orange" hex="#F97316" />
        </div>
      </section>

      {/* Badge Tokens */}
      <section className="fc-section">
        <h2 className="fc-section-title">Badge Colors</h2>
        <div className="fc-swatch-grid">
          <Swatch name="Premium" token="--badge-premium" hex="#A772FF" bgHex="rgba(128,86,240,0.15)" />
          <Swatch name="Executive" token="--badge-executive" hex="#26C8AD" bgHex="rgba(0,151,20,0.15)" />
          <Swatch name="New" token="--badge-new" hex="#EF9653" bgHex="rgba(209,43,114,0.15)" />
          <Swatch name="Standard" token="--badge-standard" hex="#D8D8D8" bgHex="#262626" />
        </div>
      </section>

      {/* Borders */}
      <section className="fc-section">
        <h2 className="fc-section-title">Borders</h2>
        <div className="fc-swatch-grid">
          <Swatch name="Default" token="--border-default" hex="rgba(255,255,255,0.08)" bg="rgba(255,255,255,0.08)" border />
          <Swatch name="Light" token="--border-light" hex="rgba(255,255,255,0.05)" bg="rgba(255,255,255,0.05)" border />
          <Swatch name="Glass" token="--border-glass" hex="rgba(255,255,255,0.1)" bg="rgba(255,255,255,0.1)" border />
        </div>
      </section>

      {/* Typography */}
      <section className="fc-section">
        <h2 className="fc-section-title">Typography Scale</h2>
        <div className="fc-type-list">
          <TypeRow label="H-XXXL" token="--h-xxxl" size="64px → 36px" sample="Display Heading" style={{ fontSize: 'var(--h-xxxl)', fontWeight: 600, letterSpacing: '-1.68px' }} />
          <TypeRow label="H-XXL" token="--h-xxl" size="45px → 30px" sample="Section Heading" style={{ fontSize: 'var(--h-xxl)', fontWeight: 600 }} />
          <TypeRow label="H-XL" token="--h-xl" size="36px → 26px" sample="Card Heading" style={{ fontSize: 'var(--h-xl)', fontWeight: 600 }} />
          <TypeRow label="H-L" token="--h-l" size="28px → 22px" sample="Subsection Title" style={{ fontSize: 'var(--h-l)', fontWeight: 500 }} />
          <TypeRow label="H-M" token="--h-m" size="20px → 18px" sample="Small Heading" style={{ fontSize: 'var(--h-m)', fontWeight: 500 }} />
          <TypeRow label="Body Large" token="--length-body-large" size="16px" sample="Lead paragraph text for introductions and summaries." style={{ fontSize: 16, fontWeight: 400 }} />
          <TypeRow label="Body Default" token="--length-body-default" size="14px" sample="Standard reading text used throughout the application." style={{ fontSize: 14, fontWeight: 400 }} />
          <TypeRow label="Body Small" token="--length-body-small" size="12px" sample="Captions, labels, and supporting metadata." style={{ fontSize: 12, fontWeight: 400 }} />
        </div>
      </section>

      {/* Spacing */}
      <section className="fc-section">
        <h2 className="fc-section-title">Spacing</h2>
        <div className="fc-spacing-list">
          {[
            ['XS', '4px'], ['SM', '8px'], ['MD', '16px'], ['LG', '24px'],
            ['XL', '32px'], ['2XL', '48px'], ['3XL', '64px'], ['4XL', '80px'],
          ].map(([name, val]) => (
            <div key={name} className="fc-spacing-row">
              <span className="fc-spacing-label">{name}</span>
              <div className="fc-spacing-bar" style={{ width: val }} />
              <code className="fc-spacing-value">{val}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Radius */}
      <section className="fc-section">
        <h2 className="fc-section-title">Border Radius</h2>
        <div className="fc-radius-grid">
          {[
            ['MD', '12px'], ['LG', '16px'], ['XL', '24px'], ['Pill', '100px'],
          ].map(([name, val]) => (
            <div key={name} className="fc-radius-item">
              <div className="fc-radius-box" style={{ borderRadius: val }} />
              <span className="fc-radius-label">{name}</span>
              <code className="fc-radius-value">{val}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Components Page ─── */
function ComponentsCapture() {
  return (
    <div className="fc-page">
      <h1 className="fc-page-title">Components</h1>

      {/* Badge */}
      <section className="fc-section">
        <h2 className="fc-section-title">Badge</h2>
        <div className="fc-component-row">
          <div className="fc-variant">
            <span className="fc-variant-label">Variants</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge variant="default">Default</Badge>
              <Badge variant="new">New</Badge>
              <Badge variant="executive">Executive</Badge>
              <Badge variant="premium">Premium</Badge>
              <Badge variant="standard">Standard</Badge>
              <Badge variant="success">Success</Badge>
            </div>
          </div>
          <div className="fc-variant">
            <span className="fc-variant-label">Sizes</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge variant="premium" size="sm">Small</Badge>
              <Badge variant="premium" size="md">Medium</Badge>
              <Badge variant="premium" size="lg">Large</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* ContentCard */}
      <section className="fc-section">
        <h2 className="fc-section-title">ContentCard</h2>
        <div className="fc-card-grid-3">
          <div className="fc-variant">
            <span className="fc-variant-label">Default</span>
            <ContentCard
              title="Balloon Pop Experience"
              imageUrl={sampleBalloon}
              channels={['In-Store', 'Digital', 'Social']}
            />
          </div>
          <div className="fc-variant">
            <span className="fc-variant-label">With Description</span>
            <ContentCard
              title="Origami Workshop"
              imageUrl={sampleOrigami}
              channels={['In-Store']}
              description="An interactive paper-folding activation."
            />
          </div>
          <div className="fc-variant">
            <span className="fc-variant-label">No Image</span>
            <ContentCard
              title="Placeholder Card"
              channels={['Digital', 'Social']}
            />
          </div>
        </div>
      </section>

      {/* CompactCampaignCard */}
      <section className="fc-section">
        <h2 className="fc-section-title">CompactCampaignCard</h2>
        <div className="fc-card-grid-3">
          <div className="fc-variant">
            <span className="fc-variant-label">Purple</span>
            <CompactCampaignCard
              id="1"
              name="The Magic of Joy"
              subtitle="Holiday Season"
              heroImage={sampleBalloon}
              activationDates="Oct–Dec 2025"
              scope="Global"
              channels="In-Store, Digital"
              primaryColor="#8F53F0"
              onClick={() => {}}
            />
          </div>
          <div className="fc-variant">
            <span className="fc-variant-label">Green (light text detect)</span>
            <CompactCampaignCard
              id="2"
              name="Summer Refresh"
              subtitle="Q3 2026"
              heroImage={sampleOrigami}
              activationDates="Jul–Sep 2026"
              scope="Regional"
              channels="Digital"
              primaryColor="#BEF264"
              onClick={() => {}}
            />
          </div>
          <div className="fc-variant">
            <span className="fc-variant-label">No Image</span>
            <CompactCampaignCard
              id="3"
              name="Travel Exclusive"
              subtitle="Year-round"
              scope="Global"
              channels="In-Store"
              primaryColor="#3B82F6"
              onClick={() => {}}
            />
          </div>
        </div>
      </section>

      {/* FeatureBlock */}
      <section className="fc-section">
        <h2 className="fc-section-title">FeatureBlock</h2>
        <div className="fc-stack">
          <div className="fc-variant">
            <span className="fc-variant-label">With Badges</span>
            <FeatureBlock
              number={1}
              title="CLP Hero"
              description="Feature special SKUs by category in a new carousel to appear before Bestsellers."
              badges={[
                { label: 'New', color: 'new' },
                { label: 'Executive', color: 'executive' },
                { label: 'Premium', color: 'premium' },
                { label: 'Standard', color: 'standard' },
              ]}
            />
          </div>
          <div className="fc-variant">
            <span className="fc-variant-label">Minimal</span>
            <FeatureBlock
              number={2}
              title="Homepage Banner"
              description="Full-width hero banner on the store homepage with campaign key visual."
              badges={[]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Helpers ─── */
function Swatch({ name, token, hex, bg, bgHex, border }) {
  const swatchBg = bg || bgHex || hex;
  return (
    <div className="fc-swatch">
      <div
        className="fc-swatch-color"
        style={{
          backgroundColor: swatchBg,
          border: border ? '1px solid rgba(255,255,255,0.15)' : undefined,
        }}
      />
      <div className="fc-swatch-meta">
        <span className="fc-swatch-name">{name}</span>
        <code className="fc-swatch-token">{token}</code>
        <code className="fc-swatch-hex">{hex}</code>
      </div>
    </div>
  );
}

function TypeRow({ label, token, size, sample, style }) {
  return (
    <div className="fc-type-row">
      <div className="fc-type-meta">
        <span className="fc-type-label">{label}</span>
        <code className="fc-type-token">{token}</code>
        <span className="fc-type-size">{size}</span>
      </div>
      <div className="fc-type-sample" style={style}>{sample}</div>
    </div>
  );
}

/* ─── Router Entry ─── */
export default function FigmaCapture() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 'tokens';

  if (page === 'components') return <ComponentsCapture />;
  return <TokensCapture />;
}
