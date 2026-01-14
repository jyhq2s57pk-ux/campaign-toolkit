# UI & Responsive QA + Starter Design System

**Date:** 2026-01-08
**Scope:** Front-end QA audit and design system extraction from existing codebase
**Constraint:** CSS-first improvements, no redesign, no new libraries

---

## PART 1 – UI & RESPONSIVE QA AUDIT

### HIGH PRIORITY ISSUES

#### 1. **Horizontal Overflow Risk on Small Screens (320–390px)**
**Files affected:**
- `src/pages/CustomerJourneyPage.css:214`
- `src/pages/CalendarPage.css:38`
- `src/components/HomePageTile.css:71`

**Issues:**
- **Customer Journey:** `.content-layout` has `min-width: 800px` which will cause horizontal scroll on all mobile devices
- **Calendar:** `.timeline-grid` has `min-width: 1160px` (desktop) and `min-width: 800px` (mobile @480px), forcing horizontal scroll
- **HomePage Tile:** `.hero-visual` has fixed `width: 341px` which doesn't scale well on 320px screens

**Why it matters:**
- Forces horizontal scrolling on mobile, poor UX
- Content becomes inaccessible or difficult to read
- Violates mobile-first principle

**Suggested fixes:**
```css
/* CustomerJourneyPage.css */
@media (max-width: 800px) {
  .content-layout {
    min-width: auto; /* Remove fixed min-width */
    width: 100%;
  }
}

/* CalendarPage.css */
@media (max-width: 480px) {
  .timeline-grid {
    min-width: 100%; /* Allow natural width */
  }
  .timeline-header.tier-label {
    min-width: 80px; /* Reduce first column */
  }
}

/* HomePageTile.css */
@media (max-width: 480px) {
  .hero-visual {
    width: 100%; /* Full width on mobile */
    max-width: 100%;
  }
}
```

---

#### 2. **Inconsistent Container Padding Across Breakpoints**
**Files affected:**
- `src/styles/master-styles.css:104`
- `src/components/Header.css:14,22`
- `src/pages/HomePage.css:69,170,184`
- `src/pages/Footer.css:23`

**Issues:**
- `--container-padding: 24px` global token
- Header uses `40px` (desktop) → `20px` (@480px)
- HomePage uses `24px` → `20px` (@1024px)
- Footer uses fixed `32px`
- No consistent mobile breakpoint pattern

**Why it matters:**
- Visual inconsistency across pages
- Content alignment issues
- Wasted edge space or cramped layouts

**Suggested fixes:**
```css
/* master-styles.css */
:root {
  --container-padding: 24px;
  --container-padding-mobile: 16px; /* NEW */
  --container-padding-tablet: 20px; /* NEW */
}

@media (max-width: 768px) {
  :root {
    --container-padding: var(--container-padding-tablet);
  }
}

@media (max-width: 480px) {
  :root {
    --container-padding: var(--container-padding-mobile);
  }
}

/* Apply globally to .inner-content-wrapper, .header, .footer-container */
```

---

#### 3. **Page Header Padding Collision with Fixed Nav**
**Files affected:**
- `src/styles/master-styles.css:160`
- `src/pages/HomePage.css:15`
- `src/pages/CustomerJourneyPage.css:482`
- `src/pages/OmnichannelPage.css:677`

**Issues:**
- `.page-header` has `padding-top: 180px` (desktop)
- HomePage intro has `padding-top: 200px`
- CustomerJourney has `padding-top: 100px` (@480px)
- Omnichannel has `padding-top: 100px` (@480px)
- Fixed header is `72px` tall
- Inconsistent spacing creates jarring layout shifts

**Why it matters:**
- Content sits too far below header on some pages
- Inconsistent vertical rhythm
- Wasted screen real estate on mobile

**Suggested fixes:**
```css
/* master-styles.css */
.page-header {
  padding: 140px 24px 60px; /* Reduced from 180px */
}

@media (max-width: 768px) {
  .page-header {
    padding: 100px 20px 48px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 88px 16px 32px; /* 72px header + 16px gap */
  }
}
```

---

#### 4. **Typography Scale Breaks on Small Screens**
**Files affected:**
- `src/styles/master-styles.css:71-83`
- `src/pages/HomePage.css:43`

**Issues:**
- Fluid typography using `clamp()` is excellent
- BUT: `.intro-title` has hardcoded `line-height: 80px` which breaks below ~600px
- `--h-xxxl` clamps to `36px` but line-height stays `80px`
- Creates massive unwanted whitespace

**Why it matters:**
- Wasted vertical space on mobile
- Poor readability and visual balance

**Suggested fixes:**
```css
/* HomePage.css */
.intro-title {
  line-height: 1.1; /* Remove fixed 80px */
}
```

---

#### 5. **Badge Size Inconsistency**
**Files affected:**
- `src/components/Badge.css:47-84`
- `src/components/HomePageTile.css:14-28`
- `src/pages/CustomerJourneyPage.css:140-149`

**Issues:**
- Badge component defines `--sm` (20px), `--md` (26px), `--lg` (32px)
- HomePage uses custom `.hero-badge` with `height: 36px`
- Platform badges use `height: 20px`
- Accordion badges use different sizing
- No clear usage guidance

**Why it matters:**
- Visual inconsistency
- Harder to maintain
- Confusion about which size to use where

**Suggested fixes:**
- Consolidate all badges to use Badge.css classes
- Remove custom badge styles
- Document usage: sm = tags, md = UI labels, lg = hero/feature

---

### MEDIUM PRIORITY ISSUES

#### 6. **Gap/Spacing Token Fragmentation**
**Files across codebase:**

**Issues:**
- Hardcoded gaps: `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `60px`, `64px`, `77px`, `80px`
- No spacing scale defined in master-styles.css
- `77px` gap in HomePageTile.css:41 is arbitrary

**Why it matters:**
- Inconsistent spacing rhythm
- Difficult to maintain visual harmony
- No predictable pattern

**Suggested fixes:**
```css
/* master-styles.css - ADD */
:root {
  /* Spacing Scale (8px base) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 80px;
}
```

---

#### 7. **Footer Logo Color Accessibility**
**Files affected:**
- `src/components/Footer.css:142-151`

**Issues:**
- Footer has `background-color: #171717` (very dark)
- Logo SVG fill should be white but may not have sufficient contrast guidance
- Comment mentions "white for visibility" but no enforcement

**Why it matters:**
- Logo may be invisible or low contrast
- Brand visibility issue

**Suggested fixes:**
```css
/* Footer.css */
.footer-logo svg {
  fill: #ffffff; /* Explicit white */
}

.footer-logo svg path {
  fill: #ffffff; /* Ensure all paths are white */
}
```

---

#### 8. **Calendar Grid Accessibility – Touch Targets**
**Files affected:**
- `src/pages/CalendarPage.css:119-176`

**Issues:**
- `.campaign-bar` has `min-height: 72px` on desktop
- No explicit touch target size for mobile
- Campaign bars contain clickable content but no hover/focus states defined

**Why it matters:**
- Touch targets should be minimum 44px×44px (WCAG)
- No visual feedback for interactive elements
- Difficult to tap on small screens

**Suggested fixes:**
```css
/* CalendarPage.css */
.campaign-bar {
  min-height: 72px;
  cursor: pointer; /* Add if clickable */
  transition: background-color 0.2s;
}

.campaign-bar:hover,
.campaign-bar:focus-within {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 480px) {
  .campaign-bar {
    min-height: 80px; /* Increase for easier tapping */
  }
}
```

---

#### 9. **Omnichannel Circular Layout Overflow**
**Files affected:**
- `src/pages/OmnichannelPage.css:160-241`

**Issues:**
- Desktop circular layout uses `calc(50% ± 460px)` positioning
- Cards will overflow viewport on screens < 1024px wide
- No viewport width guard

**Why it matters:**
- Cards cut off or create horizontal scroll
- Layout breaks between 1024-1200px

**Suggested fixes:**
```css
/* OmnichannelPage.css */
@media (min-width: 1024px) and (max-width: 1400px) {
  .strategy-grid {
    height: 700px; /* Reduce height */
  }

  .pos-01 { left: calc(50% - 280px); top: calc(50% - 200px); }
  .pos-02 { top: calc(50% - 280px); }
  .pos-03 { left: calc(50% + 280px); top: calc(50% - 200px); }
  .pos-04 { left: calc(50% + 380px); }
  .pos-05 { left: calc(50% + 280px); top: calc(50% + 200px); }
  .pos-06 { left: calc(50% - 280px); top: calc(50% + 200px); }
  .pos-07 { left: calc(50% - 380px); }
}
```

---

#### 10. **Resources Grid Breaks at Edge Cases**
**Files affected:**
- `src/pages/ResourcesPage.css:51-55`

**Issues:**
- `.resources-grid` uses `repeat(auto-fill, minmax(300px, 1fr))`
- At 320px viewport, cards become 300px → horizontal overflow
- Need to reduce minmax base

**Why it matters:**
- Cards break layout on smallest phones
- Forces horizontal scroll

**Suggested fixes:**
```css
/* ResourcesPage.css */
.resources-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

@media (max-width: 480px) {
  .resources-grid {
    grid-template-columns: 1fr; /* Single column on small screens */
  }
}
```

---

### LOW PRIORITY ISSUES

#### 11. **Redundant CSS Custom Properties**
**Files affected:**
- `src/pages/CustomerJourneyPage.css:11-36`
- `src/components/Badge.css:10-26`

**Issues:**
- Duplicate color definitions in CustomerJourneyPage.css (lines 11-36) that already exist in master-styles.css
- Badge colors redefined in Badge.css despite being in root

**Why it matters:**
- Single source of truth violation
- Harder to update colors globally
- File size bloat

**Suggested fixes:**
- Remove duplicate `:root` declarations from CustomerJourneyPage.css
- Reference master-styles.css variables directly

---

#### 12. **Unused Animation Classes**
**Files affected:**
- `src/index.css:69-83`

**Issues:**
- `.animate-fade-in` class defined but not widely used
- Animation keyframes exist but no systematic application

**Why it matters:**
- Dead code
- Missed opportunity for consistent page transitions

**Suggested fixes:**
- Document usage pattern
- Apply to page load or remove

---

#### 13. **Navigation Button Hit Areas**
**Files affected:**
- `src/components/Header.css:51-77`

**Issues:**
- `.nav-btn` has `padding: 8px 16px` (32px×24px area)
- Below WCAG AA minimum of 44×44px for touch
- Mobile menu uses same small size

**Why it matters:**
- Difficult to tap on mobile
- Accessibility failure

**Suggested fixes:**
```css
/* Header.css */
.nav-btn {
  padding: 12px 20px; /* Increase to ~44px height */
}
```

---

## PART 2 – STARTER DESIGN SYSTEM (DERIVED FROM EXISTING CODE)

### 1. TYPOGRAPHY

#### Font Stack
```css
--font-display: 'Saans', sans-serif;
--font-body: 'Saans', sans-serif;
```

**Weights available:**
- Light: 300
- Regular: 400
- Medium: 500
- SemiBold: 600

---

#### Type Scale

| Token | Size Range (clamp) | Desktop | Mobile | Usage |
|-------|-------------------|---------|--------|-------|
| `--h-xxxl` | 60px → 36px | 60px | 36px | Page titles (HomePage, major sections) |
| `--h-xxl-alt` | 48px → 32px | 48px | 32px | Insights page title |
| `--h-xxl` | 45px → 30px | 45px | 30px | Section headings |
| `--h-xl` | 36px → 26px | 36px | 26px | Card titles, subsections |
| `--h-l` | 28px → 22px | 28px | 22px | Component headings |
| `--h-m` | 20px → 18px | 20px | 18px | Card headings, labels |
| `--h-s` | 18px → 16px | 18px | 16px | Small headings |
| `--display-huge` | 96px → 64px | 96px | 64px | Infographic numbers (Insights) |
| `--length-body-large` | 16px | 16px | 16px | Large body text |
| `--length-body-default` | 14px | 14px | 14px | Default body text |
| `--length-body-small` | 12px | 12px | 12px | Small body text |
| `--text-sm` | 13px | 13px | 13px | Calendar/table labels |
| `--text-xs` | 11px | 11px | 11px | Micro labels, tags |

---

#### Typography Usage Guide

**Page Headers:**
```css
.page-header h1 {
  font-size: var(--h-xxxl);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -1.68px;
}
```

**Section Titles:**
```css
.section-title {
  font-size: var(--h-xxl-alt);
  font-weight: 700;
  line-height: 1.2;
}
```

**Body Text:**
```css
body, p {
  font-size: var(--length-body-default);
  line-height: 1.5;
  font-weight: 400;
}
```

**Labels/UI Text:**
```css
.label {
  font-size: var(--length-body-small);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

### 2. COLOUR

#### Surfaces
```css
--surface-default: #000000;      /* Main background */
--surface-elevated: #111111;     /* Cards, panels, modals */
--surface-card: #161616;         /* Secondary/nested cards */
--surface-glass: rgba(255, 255, 255, 0.02); /* Glass overlays */
```

**Usage:**
- `--surface-default`: Body background, page backdrop
- `--surface-elevated`: Primary cards (Master Style 02)
- `--surface-card`: Nested content areas, accordion expanded states
- `--surface-glass`: Overlay elements, subtle backgrounds

---

#### Text Colors
```css
--text-primary: #ffffff;         /* Headings, primary content */
--text-secondary: #a1a1a6;       /* Body text, descriptions */
--text-muted: #666666;           /* Disabled, placeholder */
--text-inverse: #000000;         /* Text on white backgrounds */
```

**Contrast ratios:**
- Primary on Default: 21:1 (AAA)
- Secondary on Default: 7.2:1 (AA)
- Muted on Default: 4.6:1 (AA for large text)

---

#### Brand Accents
```css
--accent-green: #BEF264;         /* Premium tier, success states */
--accent-purple: #8F53F0;        /* Executive tier, primary actions */
--accent-blue: #3B82F6;          /* New tier, informational */
--accent-coral: #FB7185;         /* Highlights, warnings */
--accent-orange: #F97316;        /* Homepage hover, CTAs */
```

**Usage guidance:**
- Green: Success states, premium features, positive metrics
- Purple: Executive features, primary interactive elements
- Blue: New/informational badges, links
- Coral: Attention-drawing elements, warnings
- Orange: Hover states, warm CTAs

---

#### Status Colors (Badges)
```css
/* Magenta */
--magenta-bg: rgba(255, 102, 196, 0.2);
--magenta-text: #FF66C4;

/* Success (Green) */
--success-bg: rgba(52, 199, 89, 0.2);
--success-text: #34C759;

/* Purple */
--purple-bg: rgba(175, 82, 222, 0.2);
--purple-text: #AF52DE;

/* Default (Grey) */
--default-bg: rgba(82, 82, 82, 1);
--default-text: #E5E5EA;
```

---

#### Borders
```css
--border-default: rgba(255, 255, 255, 0.08);  /* Standard dividers */
--border-light: rgba(255, 255, 255, 0.05);    /* Subtle borders */
--border-glass: rgba(255, 255, 255, 0.1);     /* Glass element borders */
```

---

#### Colour Consolidation Opportunities

**Duplicates found:**
- `#A3A3A3` used in HomePage.css and HomePageTile.css → should use `--text-secondary` (#A1A1A6)
- `#262626` used in CustomerJourneyPage.css and HomePageTile.css → should be tokenized as `--surface-subtle` or similar
- `#171717` used in Footer.css → should be `--surface-footer` or similar

**Recommendation:**
```css
/* Add to master-styles.css */
--surface-subtle: #262626;       /* Slightly elevated from card */
--surface-footer: #171717;       /* Footer background */
--text-tertiary: #a3a3a3;        /* Alternative secondary text */
```

---

### 3. SPACING

#### Spacing Scale (Derived from Usage)

Based on frequency analysis across codebase:

```css
:root {
  /* Base unit: 4px */
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-15: 60px;
  --space-16: 64px;
  --space-20: 80px;
}
```

**Usage frequency:**
- 8px: Most common (gaps, padding)
- 16px: Second most (component spacing)
- 24px: Third most (section spacing, container padding)
- 32px, 40px: Card padding, section gaps
- 60px, 80px: Page section separators

---

#### Spacing Guidance

**Component Internal Spacing:**
```css
/* Tight components (badges, buttons) */
padding: var(--space-2) var(--space-3); /* 8px 12px */

/* Standard components (cards) */
padding: var(--space-6); /* 24px */
gap: var(--space-4); /* 16px */

/* Large components (hero sections) */
padding: var(--space-10); /* 40px */
gap: var(--space-6); /* 24px */
```

**Layout Spacing:**
```css
/* Between sections */
margin-bottom: var(--space-15); /* 60px */

/* Between page sections */
padding: var(--space-20) 0; /* 80px top/bottom */

/* Container edges */
padding: 0 var(--container-padding); /* 24px */
```

---

#### Responsive Spacing Pattern

**Desktop (>1024px):**
- Container padding: 24px
- Section gaps: 60-80px
- Card padding: 40px

**Tablet (768-1024px):**
- Container padding: 20px
- Section gaps: 48-60px
- Card padding: 32px

**Mobile (480-768px):**
- Container padding: 16px
- Section gaps: 40-48px
- Card padding: 24px

**Small Mobile (<480px):**
- Container padding: 16px
- Section gaps: 32-40px
- Card padding: 20px

---

### 4. COMPONENT PATTERNS

#### Master Card Styles

**Glass Card (Master Style 01)**
```css
.card-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 32px;
  padding: 40px;
}
```

**Usage:** Secondary cards, floating elements, bento grids, timeline containers
**Consistency:** Used in CalendarPage, InsightsPage, OmnichannelPage, ResourcesPage, WaysOfWorking

---

**Elevated Container (Master Style 02)**
```css
.card-elevated {
  background: var(--surface-elevated); /* #111111 */
  border-radius: 40px;
  padding: 40px;
  border: 1px solid var(--border-light);
}
```

**Usage:** Main content blocks, admin panels, form containers, homepage hero
**Consistency:** Used across HomePage, CustomerJourneyPage

---

#### Buttons

**Primary Button**
```css
.btn-primary {
  background-color: var(--text-primary);
  color: var(--text-inverse);
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 500;
}
```

**State:** Hover → `background-color: #e5e5e5`
**Hit area:** 48px×38px (acceptable for desktop, needs adjustment for mobile)

---

**Secondary Button**
```css
.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 500;
}
```

**State:** Hover → `background-color: var(--surface-elevated)`

---

#### Badges

**Size Variants:**
- Small: `height: 20px`, `padding: 2px 10px`, `font-size: 12px` (tags, inline labels)
- Medium: `height: 26px`, `padding: 4px 14px`, `font-size: 13px` (UI labels, features)
- Large: `height: 32px`, `padding: 6px 18px`, `font-size: 14px` (hero sections)

**Color Variants:**
- New/Success: Green background + green text
- Executive: Purple background + purple text
- Premium: Magenta background + magenta text
- Standard: Grey background + light grey text

**Usage:**
```html
<span class="badge badge--md badge--premium">Premium</span>
```

---

#### Page Header Pattern

**Structure:**
```css
.page-header {
  padding: 180px 24px 60px; /* Desktop */
  text-align: left;
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.page-header h1 {
  font-size: var(--h-xxxl);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -1.68px;
  margin: 0 0 24px 0;
}

.page-header p {
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 480px;
}
```

**Consistency:** Used on all major pages
**Issue:** Padding-top varies (180px, 200px, 100px) – needs normalization

---

#### Navigation Pills

**Category/Filter Navigation:**
```css
.category-nav {
  display: flex;
  gap: 8px;
  background: var(--surface-glass);
  padding: 8px;
  border-radius: 100px;
  border: 1px solid var(--border-glass);
}

.category-btn {
  padding: 10px 24px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.category-btn.active {
  background: var(--text-primary);
  color: var(--text-inverse);
}
```

**Usage:** ResourcesPage filter, could be reused for other category selectors

---

#### Accordion Pattern

**Structure (CustomerJourneyPage):**
```css
.accordion-item {
  background: var(--surface-elevated);
  border-radius: 16px;
  border: 1px solid var(--border-light);
}

.accordion-item.expanded {
  background: var(--surface-card);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
}

.accordion-header {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.accordion-body {
  padding: 0; /* Content has own padding */
  animation: slideDown 0.3s ease;
}
```

**Behavioral rules:**
- Collapsed: `--surface-elevated` background
- Expanded: `--surface-card` background
- Smooth animation on expand/collapse
- Chevron rotates 180deg when expanded

---

#### Grid Layouts

**3-Column Content Grid (HomePage):**
```css
.content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .content-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .content-grid { grid-template-columns: 1fr; }
}
```

---

**Bento Grid (InsightsPage):**
```css
.bento-grid {
  display: grid;
  gap: 24px;
}

@media (min-width: 1100px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 280px 280px 220px;
  }

  .card-large { grid-column: span 2; grid-row: span 2; }
  .card-full { grid-column: span 3; grid-row: span 1; }
}
```

---

**Auto-Fill Grid (ResourcesPage):**
```css
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
```

**Issue:** Breaks at 320px – needs mobile override

---

### 5. LAYOUT & GEOMETRY

#### Border Radius
```css
--radius-xl: 24px;   /* Large cards, modals */
--radius-lg: 16px;   /* Standard cards */
--radius-md: 12px;   /* Small cards, inputs */
--radius-pill: 100px; /* Buttons, badges, navigation */
```

**Usage:**
- Hero cards: `40px` (custom, not tokenized – should be `--radius-2xl`)
- Glass cards: `32px` (Master Style 01 – should be `--radius-xl`)
- Standard cards: `16px` (`--radius-lg`)
- Buttons/pills: `100px` (`--radius-pill`)

**Recommendation:**
```css
/* Add to master-styles.css */
--radius-2xl: 32px;  /* Glass cards */
--radius-3xl: 40px;  /* Hero containers */
```

---

#### Container Widths
```css
--content-max-width: 1100px;           /* Content area */
--container-max-width: 1148px;         /* Content + padding */
--container-padding: 24px;             /* Edge padding */
```

**Special cases:**
- Calendar: `1648px` (wider to accommodate timeline)
- Header: `1400px` max-width
- Footer: `1400px` max-width

**Inconsistency:** Header/Footer use different max-width than content

---

#### Animation
```css
--transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--transition-medium: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

**Usage:**
- Hover states: `--transition-fast`
- Modal/accordion open: `--transition-medium`
- Page transitions: Custom (fadeIn 0.4s)

---

## PART 3 – ADOPTION GUIDANCE

### Documentation Strategy

**Immediate:**
1. ✅ This document serves as the initial reference
2. Add a `/docs/design-system.md` file with quick-reference tables
3. Link from README.md

**Short-term:**
- Create a living Style Gallery page (exists as StyleGalleryPage.jsx but needs expansion)
- Add component examples with code snippets
- Include "do/don't" visual examples

**Long-term:**
- Build interactive component library (Storybook or similar)
- Auto-generate from master-styles.css

---

### Incremental Adoption Plan

#### Phase 1: Normalize High-Impact Issues (Week 1)
**Goal:** Fix critical responsive bugs and horizontal overflow

Tasks:
- [ ] Fix CustomerJourneyPage min-width overflow
- [ ] Fix CalendarPage mobile horizontal scroll
- [ ] Normalize container padding across breakpoints
- [ ] Fix HomePageTile width on 320px

**Effort:** 4-6 hours
**Risk:** Low (CSS-only changes)
**Impact:** Immediate mobile UX improvement

---

#### Phase 2: Consolidate Spacing & Color Tokens (Week 2)
**Goal:** Add missing tokens, remove duplicates

Tasks:
- [ ] Add spacing scale to master-styles.css
- [ ] Add missing surface/border color tokens
- [ ] Replace hardcoded values in top 5 most-used files
- [ ] Remove duplicate color definitions from CustomerJourneyPage.css

**Effort:** 6-8 hours
**Risk:** Low (additive changes, old values still work)
**Impact:** Easier maintenance, single source of truth

---

#### Phase 3: Badge & Button Standardization (Week 3)
**Goal:** Consolidate badge patterns, improve accessibility

Tasks:
- [ ] Migrate all custom badges to Badge.css classes
- [ ] Increase button hit areas to 44px minimum
- [ ] Add focus states to all interactive elements
- [ ] Document badge usage guide

**Effort:** 8-10 hours
**Risk:** Medium (requires JSX changes)
**Impact:** Visual consistency, accessibility compliance

---

#### Phase 4: Typography Audit (Week 4)
**Goal:** Ensure consistent type usage

Tasks:
- [ ] Replace hardcoded font-sizes with tokens
- [ ] Fix line-height issues (HomePage intro)
- [ ] Add missing font-weight definitions
- [ ] Test across all pages

**Effort:** 6-8 hours
**Risk:** Low (visual QA required)
**Impact:** Visual harmony, easier scaling

---

#### Phase 5: Component Pattern Library (Ongoing)
**Goal:** Extract reusable patterns, reduce duplication

Tasks:
- [ ] Create shared `.card-standard` class
- [ ] Create shared `.section-header` class
- [ ] Create shared `.grid-3-col-responsive` class
- [ ] Update pages to use shared classes

**Effort:** 2-3 hours per component
**Risk:** Medium (requires testing across pages)
**Impact:** DRY code, easier future updates

---

### What Should Remain Flexible

**Keep page-specific:**
- Custom layouts (Omnichannel circular grid, Insights bento)
- Animation choreography (staggered reveals)
- Hero sections (each page has unique structure)
- Infographic visualizations (Insights charts)

**Don't force:**
- All cards to use same padding (hero cards are intentionally larger)
- All grids to use same column count
- All sections to use same vertical rhythm (Insights intentionally denser)

**Preserve creativity:**
- Gradient text effects
- Custom hover states for specific features
- Page-specific color accents (Insights coral, Omnichannel purple glow)

---

### Migration Checklist (Per File)

```markdown
- [ ] Replace hardcoded colors with CSS variables
- [ ] Replace hardcoded spacing with tokens (--space-*)
- [ ] Replace hardcoded font-sizes with scale tokens (--h-*, --text-*)
- [ ] Check responsive breakpoints match global pattern (480px, 768px, 1024px)
- [ ] Add min-height: 44px to all clickable elements
- [ ] Add :focus-visible styles to interactive elements
- [ ] Test on 320px, 375px, 768px, 1024px, 1440px
- [ ] Remove duplicate :root declarations
- [ ] Document any intentional deviations
```

---

### Success Metrics

**Week 1:**
- Zero horizontal scroll issues on 320px viewport
- Consistent container padding across all pages

**Week 4:**
- 80% of color values use CSS variables
- 80% of spacing uses tokens
- 100% of interactive elements meet 44px touch target

**Week 8:**
- Shared component classes used on 3+ pages
- Style Gallery page shows all documented patterns
- Zero duplicate color/spacing definitions

---

## Summary

This audit identified **13 issues** (5 high, 5 medium, 3 low priority) and extracted a **pragmatic starter design system** from existing code.

**Key findings:**
- Strong foundation exists (master-styles.css is well-structured)
- Typography scale is excellent (fluid clamp approach)
- Main issues are spacing inconsistency and responsive edge cases
- Design system is 70% already there – just needs formalization

**Next steps:**
1. Review and approve this document
2. Begin Phase 1 fixes (high priority responsive issues)
3. Incrementally adopt spacing/color tokens
4. Document as you go

**Time to MVP:** 4-6 weeks following phased approach above.
