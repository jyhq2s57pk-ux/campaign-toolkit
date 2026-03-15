import React from 'react';

export default {
  title: 'Design System/Tokens',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    actions: { disable: true },
  },
};

/* ── Helpers ── */

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 48 }}>
    <h2 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, marginBottom: 20 }}>
      {title}
    </h2>
    {children}
  </div>
);

const SwatchGrid = ({ children }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>{children}</div>
);

const Swatch = ({ name, token, color, border }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 140 }}>
    <div
      style={{
        width: 140,
        height: 80,
        borderRadius: 12,
        background: color,
        border: border || '1px solid rgba(255,255,255,0.1)',
      }}
    />
    <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{name}</span>
    <code style={{ color: '#8a8a8a', fontSize: 11 }}>{token}</code>
  </div>
);

const TokenRow = ({ token, value, preview }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    {preview && <div style={{ flexShrink: 0 }}>{preview}</div>}
    <code style={{ color: '#fff', fontSize: 13, minWidth: 200 }}>{token}</code>
    <span style={{ color: '#8a8a8a', fontSize: 13 }}>{value}</span>
  </div>
);

/* ── Stories ── */

export const Colors = {
  render: () => (
    <div>
      <Section title="Surfaces">
        <SwatchGrid>
          <Swatch name="Default" token="--surface-default" color="#000000" />
          <Swatch name="Elevated" token="--surface-elevated" color="#111111" />
          <Swatch name="Card" token="--surface-card" color="#1A1A1A" />
          <Swatch name="Card Hover" token="--surface-card-hover" color="#222222" />
          <Swatch name="Glass" token="--surface-glass" color="rgba(255,255,255,0.02)" border="1px solid rgba(255,255,255,0.15)" />
        </SwatchGrid>
      </Section>

      <Section title="Text">
        <SwatchGrid>
          <Swatch name="Primary" token="--text-primary" color="#FFFFFF" />
          <Swatch name="Secondary" token="--text-secondary" color="#B0B0B5" />
          <Swatch name="Muted" token="--text-muted" color="#8A8A8A" />
          <Swatch name="Inverse" token="--text-inverse" color="#000000" />
        </SwatchGrid>
      </Section>

      <Section title="Brand Accents">
        <SwatchGrid>
          <Swatch name="Green" token="--accent-green" color="#BEF264" />
          <Swatch name="Purple" token="--accent-purple" color="#8F53F0" />
          <Swatch name="Blue" token="--accent-blue" color="#3B82F6" />
          <Swatch name="Coral" token="--accent-coral" color="#FB7185" />
          <Swatch name="Orange" token="--accent-orange" color="#F97316" />
        </SwatchGrid>
      </Section>

      <Section title="Badge Colors">
        <SwatchGrid>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 140 }}>
            <div style={{ width: 140, height: 80, borderRadius: 12, background: 'rgba(128,86,240,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#A772FF', fontSize: 14, fontWeight: 600 }}>Premium</span>
            </div>
            <code style={{ color: '#8a8a8a', fontSize: 11 }}>--badge-premium-*</code>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 140 }}>
            <div style={{ width: 140, height: 80, borderRadius: 12, background: 'rgba(0,151,20,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#26C8AD', fontSize: 14, fontWeight: 600 }}>Executive</span>
            </div>
            <code style={{ color: '#8a8a8a', fontSize: 11 }}>--badge-executive-*</code>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 140 }}>
            <div style={{ width: 140, height: 80, borderRadius: 12, background: 'rgba(209,43,114,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#EF9653', fontSize: 14, fontWeight: 600 }}>New</span>
            </div>
            <code style={{ color: '#8a8a8a', fontSize: 11 }}>--badge-new-*</code>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 140 }}>
            <div style={{ width: 140, height: 80, borderRadius: 12, background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#D8D8D8', fontSize: 14, fontWeight: 600 }}>Standard</span>
            </div>
            <code style={{ color: '#8a8a8a', fontSize: 11 }}>--badge-standard-*</code>
          </div>
        </SwatchGrid>
      </Section>

      <Section title="Borders">
        <SwatchGrid>
          <Swatch name="Default" token="--border-default" color="transparent" border="2px solid rgba(255,255,255,0.08)" />
          <Swatch name="Light" token="--border-light" color="transparent" border="2px solid rgba(255,255,255,0.05)" />
          <Swatch name="Glass" token="--border-glass" color="transparent" border="2px solid rgba(255,255,255,0.1)" />
        </SwatchGrid>
      </Section>
    </div>
  ),
};

export const Typography = {
  render: () => (
    <div>
      <Section title="Headings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            { label: 'H-XXXL', token: '--h-xxxl', size: '64px → 36px' },
            { label: 'H-XXL', token: '--h-xxl', size: '45px → 30px' },
            { label: 'H-XL', token: '--h-xl', size: '36px → 26px' },
            { label: 'H-L', token: '--h-l', size: '28px → 22px' },
            { label: 'H-M', token: '--h-m', size: '20px → 18px' },
            { label: 'H-S', token: '--h-s', size: '18px → 16px' },
          ].map(({ label, token, size }) => (
            <div key={token} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16 }}>
              <p
                style={{
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: `var(${token})`,
                  fontWeight: 600,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {label}
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                <code style={{ color: '#8a8a8a', fontSize: 12 }}>{token}</code>
                <span style={{ color: '#555', fontSize: 12 }}>{size}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { label: 'Body Large', token: '--length-body-large', size: '16px' },
            { label: 'Body Default', token: '--length-body-default', size: '14px' },
            { label: 'Body Small', token: '--length-body-small', size: '12px' },
          ].map(({ label, token, size }) => (
            <div key={token} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
              <p
                style={{
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: `var(${token})`,
                  fontWeight: 400,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {label} — The quick brown fox jumps over the lazy dog
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                <code style={{ color: '#8a8a8a', fontSize: 12 }}>{token}</code>
                <span style={{ color: '#555', fontSize: 12 }}>{size}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Font Families">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TokenRow token="--font-display" value="Saans, system fallbacks" preview={<span style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 16 }}>Aa</span>} />
          <TokenRow token="--font-body" value="Saans, system fallbacks" preview={<span style={{ fontFamily: 'var(--font-body)', color: '#fff', fontSize: 16 }}>Aa</span>} />
          <TokenRow token="--font-mono" value="Courier New, Cascadia Code" preview={<span style={{ fontFamily: 'var(--font-mono)', color: '#fff', fontSize: 16 }}>Aa</span>} />
        </div>
      </Section>
    </div>
  ),
};

export const Spacing = {
  render: () => (
    <div>
      <Section title="Spacing Scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'XS', token: '--space-xs', value: '4px' },
            { name: 'SM', token: '--space-sm', value: '8px' },
            { name: 'MD', token: '--space-md', value: '16px' },
            { name: 'LG', token: '--space-lg', value: '24px' },
            { name: 'XL', token: '--space-xl', value: '32px' },
            { name: '2XL', token: '--space-2xl', value: '48px' },
            { name: '3XL', token: '--space-3xl', value: '64px' },
            { name: '4XL', token: '--space-4xl', value: '80px' },
          ].map(({ name, token, value }) => (
            <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <code style={{ color: '#fff', fontSize: 13, width: 140 }}>{token}</code>
              <div
                style={{
                  width: `var(${token})`,
                  height: 24,
                  background: 'var(--accent-purple)',
                  borderRadius: 4,
                  opacity: 0.6,
                }}
              />
              <span style={{ color: '#8a8a8a', fontSize: 13 }}>{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Border Radius">
        <SwatchGrid>
          {[
            { name: 'MD', token: '--radius-md', value: '12px' },
            { name: 'LG', token: '--radius-lg', value: '16px' },
            { name: 'XL', token: '--radius-xl', value: '24px' },
            { name: 'Pill', token: '--radius-pill', value: '100px' },
          ].map(({ name, token, value }) => (
            <div key={token} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: 'var(--surface-card)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: `var(${token})`,
                }}
              />
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{name}</span>
              <code style={{ color: '#8a8a8a', fontSize: 11 }}>{value}</code>
            </div>
          ))}
        </SwatchGrid>
      </Section>
    </div>
  ),
};
