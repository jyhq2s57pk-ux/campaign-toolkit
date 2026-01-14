# Visual QA Fixes – CSS-First Solutions

**Date:** 2026-01-08
**Scope:** Evidence-based issues from Anti-Gravity visual QA pass
**Approach:** Minimal, CSS-only fixes that respect existing patterns

---

## ISSUE 1: ADMIN – Critical Touch Target Usability

### Problem
- **Edit/Delete buttons:** Currently `padding: 8px 16px` = ~32px height (below 44px minimum)
- **"+ Add Page" button:** Uses `.btn-primary` which is `padding: 12px 24px` = ~38px height (below 44px)
- **Header/action button spacing:** Competes for space on small screens

### Files to Modify
1. `src/pages/AdminPage.css`
2. `src/styles/master-styles.css` (global button fix)

---

### Fix 1.1: Increase Edit/Delete Button Touch Targets

**File:** `src/pages/AdminPage.css`

**Current (lines 137-166):**
```css
.btn-edit {
  padding: 8px 16px;
  /* ... */
}

.btn-delete {
  padding: 8px 16px;
  /* ... */
}
```

**Replace with:**
```css
.btn-edit {
  padding: 12px 20px; /* Increased from 8px 16px */
  background-color: var(--surface-default);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-height: 44px; /* Explicit minimum */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-edit:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.btn-delete {
  padding: 12px 20px; /* Increased from 8px 16px */
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px; /* Explicit minimum */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-delete:hover {
  background-color: #ef4444;
  color: white;
}
```

**Why this works:**
- Increases vertical padding from 8px → 12px (adds 8px total height)
- Increases horizontal padding from 16px → 20px (better tap area width)
- Adds `min-height: 44px` as safety net
- `display: inline-flex` ensures padding is respected
- Maintains existing visual style (colors, borders, hover states)
- No layout restructuring required

---

### Fix 1.2: Increase Primary Button Touch Target

**File:** `src/styles/master-styles.css`

**Current (lines 212-226):**
```css
.btn-primary {
  background-color: var(--text-primary);
  color: var(--text-inverse);
  padding: 12px 24px;
  /* ... */
}
```

**Replace with:**
```css
.btn-primary {
  background-color: var(--text-primary);
  color: var(--text-inverse);
  padding: 14px 28px; /* Increased from 12px 24px */
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  min-height: 44px; /* Explicit minimum */
}

.btn-primary:hover {
  background-color: #e5e5e5;
  transform: none;
  border-color: transparent;
}
```

**Why this works:**
- Increases padding from 12px 24px → 14px 28px
- Adds explicit `min-height: 44px`
- Affects all primary buttons globally (Admin "Add Page", other CTAs)
- Minimal visual change (2px padding increase)
- Maintains pill shape and existing hover behavior

---

### Fix 1.3: Improve Mobile Header Spacing

**File:** `src/pages/AdminPage.css`

**Add after line 260 (inside existing @media (max-width: 768px) block):**
```css
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  /* ADD THIS: */
  .admin-header h1 {
    font-size: 28px; /* Reduced from 36px */
    line-height: 1.2;
  }

  .admin-section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .admin-section-header h2 {
    font-size: 20px; /* Reduced from 24px */
  }

  /* ... existing mobile rules ... */
}
```

**Why this works:**
- Reduces h1 from 36px → 28px on mobile (less header dominance)
- Reduces h2 from 24px → 20px (better proportion)
- Stacks section header and actions vertically to prevent crowding
- Gives buttons more breathing room
- No restructuring, just better spacing

---

## ISSUE 2: CALENDAR – Mobile Campaign Bar Tap Accuracy

### Problem
- Short event campaign bars are difficult to tap at 320–390px
- Current `min-height: 72px` is sufficient but visual density makes targeting hard
- Need better tap affordance without reducing visual density

### Files to Modify
1. `src/pages/CalendarPage.css`

---

### Fix 2.1: Increase Mobile Campaign Bar Min-Height

**File:** `src/pages/CalendarPage.css`

**Add to existing @media (max-width: 480px) block (after line 211):**
```css
@media (max-width: 480px) {
  .page-header h1 {
    word-wrap: break-word;
  }

  .timeline-grid {
    min-width: 800px;
    grid-template-columns: 120px repeat(12, minmax(60px, 1fr));
  }

  /* ADD THIS: */
  .campaign-bar {
    min-height: 80px; /* Increased from 72px */
    padding: 10px; /* Increased from 8px */
  }

  .campaign-bar-content {
    gap: 4px; /* Increased from 2px for better readability */
  }

  .calendar-campaign-title,
  .calendar-campaign-date {
    font-size: 12px; /* Increased from --text-xs (11px) */
    line-height: 1.3;
  }
}
```

**Why this works:**
- Increases min-height from 72px → 80px (8px more tap area)
- Increases internal padding from 8px → 10px (better spacing)
- Slightly larger text (11px → 12px) improves readability without bloat
- Maintains visual density while improving usability
- Only applies to mobile viewports (480px and below)
- Preserves existing campaign bar structure and colors

---

### Fix 2.2: Add Subtle Hover/Active State for Feedback

**File:** `src/pages/CalendarPage.css`

**Add after line 145 (after existing .campaign-bar styles):**
```css
.campaign-bar {
  /* ... existing styles ... */
}

/* ADD THIS: */
.campaign-bar:hover {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.15);
  cursor: pointer; /* Indicate interactivity */
}

.campaign-bar:active {
  transform: scale(0.98); /* Subtle press feedback */
  background-color: rgba(255, 255, 255, 0.05);
}

/* Mobile-specific active state */
@media (max-width: 480px) {
  .campaign-bar:active {
    transform: scale(0.99); /* Less dramatic on mobile */
  }
}
```

**Why this works:**
- Adds visual feedback on interaction (hover/active states)
- Subtle scale on press confirms tap registration
- Helps users understand campaign bars are interactive
- Minimal visual change (keeps clean aesthetic)
- Only uses CSS transitions (no JS needed)

---

## ISSUE 3: WAYS OF WORKING – Typography & Spacing

### Problem
- Main heading wraps awkwardly on small screens
- Excessive vertical gaps between sections create disjointed scrolling
- Large heading at 1440px creates imbalance

### Files to Modify
1. `src/pages/WaysOfWorkingPage.css`
2. `src/styles/master-styles.css` (optional global page header normalization)

---

### Fix 3.1: Responsive Heading Scale

**File:** `src/pages/WaysOfWorkingPage.css`

**Add to existing .page-header rules (after line 321):**
```css
.page-header h1 {
  line-height: 1.1;
  position: relative;
  z-index: 1;
}

/* ADD THIS: */
@media (min-width: 1024px) and (max-width: 1440px) {
  .page-header h1 {
    font-size: clamp(42px, 4vw, 52px); /* Cap at 52px instead of 60px */
  }
}

@media (min-width: 1441px) {
  .page-header h1 {
    font-size: 52px; /* Fixed size instead of scaling to 60px */
    max-width: 900px; /* Prevent excessively long lines */
  }
}
```

**Why this works:**
- Caps heading at 52px instead of 60px on large screens (better balance)
- Uses fluid scaling between 1024-1440px (smooth transition)
- Adds max-width to prevent overly long text lines
- Maintains existing clamp() behavior for smaller screens
- Subtle change that significantly improves proportion

---

### Fix 3.2: Reduce Excessive Vertical Spacing

**File:** `src/pages/WaysOfWorkingPage.css`

**Current (line 13, 127):**
```css
.workflow-container {
  margin-bottom: 80px;
}

.best-practice-section {
  padding-top: 40px;
}
```

**Replace with:**
```css
.workflow-container {
  margin-bottom: 60px; /* Reduced from 80px */
}

.best-practice-section {
  padding-top: 48px; /* Increased from 40px for better separation */
  margin-bottom: 40px; /* Add bottom margin for footer spacing */
}

/* ADD THIS: */
@media (max-width: 768px) {
  .workflow-container {
    margin-bottom: 40px; /* Further reduced on mobile */
  }

  .best-practice-section {
    padding-top: 32px;
  }
}
```

**Why this works:**
- Reduces gap between workflow and best practices from 80px → 60px
- Creates tighter visual cohesion between related sections
- Mobile gets even tighter spacing (40px) to reduce scroll fatigue
- Best practices section gets clearer separation (48px top padding)
- Maintains breathing room without creating disconnection

---

### Fix 3.3: Improve Step Card Title Scaling

**File:** `src/pages/WaysOfWorkingPage.css`

**Current (lines 91-98, 328-331):**
```css
.step-title {
  font-size: 36px;
  /* ... */
}

@media (max-width: 480px) {
  .step-title {
    font-size: 24px;
    margin-bottom: 16px;
  }
}
```

**Replace with:**
```css
.step-title {
  font-size: clamp(24px, 3vw, 36px); /* Fluid scaling */
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-primary);
  line-height: 1.2; /* Add explicit line-height */
}

@media (max-width: 768px) {
  .step-title {
    font-size: clamp(22px, 4vw, 28px); /* Tablet range */
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .step-title {
    font-size: 22px; /* Fixed size on mobile */
    margin-bottom: 16px;
  }
}
```

**Why this works:**
- Uses fluid typography (clamp) for smooth scaling
- Desktop: scales from 24px → 36px based on viewport
- Tablet: scales from 22px → 28px (better proportion)
- Mobile: fixed 22px (prevents awkward wrapping)
- Adds explicit line-height: 1.2 for consistent spacing
- Progressive enhancement approach

---

## ISSUE 4: INSIGHTS – Density & Contrast

### Problem
- Circular pie chart dominates mobile viewport
- Text density too high at 768–1024px
- Green subheader has low contrast against map background at 1440px

### Files to Modify
1. `src/pages/InsightsPage.css`

---

### Fix 4.1: Scale Down Pie Chart on Mobile

**File:** `src/pages/InsightsPage.css`

**Current (lines 202-212):**
```css
.pie-chart-simple {
  width: 120px;
  height: 120px;
  /* ... */
}
```

**Add responsive sizing:**
```css
.pie-chart-simple {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(var(--accent-green) calc(var(--p)*1%), rgba(255, 255, 255, 0.1) 0);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  position: relative;
}

.pie-chart-simple:after {
  content: "";
  position: absolute;
  width: 100px;
  height: 100px;
  background: #111;
  border-radius: 50%;
}

.pie-chart-simple span {
  position: relative;
  z-index: 5;
  font-size: 24px;
  font-weight: 700;
}

/* ADD THIS: */
@media (max-width: 768px) {
  .pie-chart-simple {
    width: 100px; /* Reduced from 120px */
    height: 100px;
    margin-bottom: 12px;
  }

  .pie-chart-simple:after {
    width: 84px; /* Proportional reduction */
    height: 84px;
  }

  .pie-chart-simple span {
    font-size: 20px; /* Reduced from 24px */
  }
}

@media (max-width: 480px) {
  .pie-chart-simple {
    width: 90px; /* Further reduced */
    height: 90px;
  }

  .pie-chart-simple:after {
    width: 76px;
    height: 76px;
  }

  .pie-chart-simple span {
    font-size: 18px;
  }
}
```

**Why this works:**
- Reduces chart from 120px → 100px on tablet (767% → 20% smaller)
- Further reduces to 90px on mobile (25% smaller than desktop)
- Proportionally scales inner donut hole
- Reduces number size for better fit
- Maintains visual clarity while reducing dominance
- Chart remains readable at all sizes

---

### Fix 4.2: Reduce Text Density at Tablet Breakpoint

**File:** `src/pages/InsightsPage.css`

**Add after line 436 (create new media query):**
```css
/* ADD THIS: */
@media (min-width: 768px) and (max-width: 1024px) {
  .bento-card {
    padding: 32px; /* Reduced from 40px */
  }

  .bento-label {
    font-size: 16px; /* Reduced from 18px */
    margin-bottom: 6px;
  }

  .bento-value {
    font-size: 32px; /* Reduced from 40px */
    margin-bottom: 20px;
  }

  .bento-text {
    font-size: 16px; /* Reduced from 18px */
    line-height: 1.6; /* Increased from 1.5 for better readability */
  }

  .top-routes-list {
    gap: 10px; /* Reduced from 12px */
  }

  .top-routes-list li {
    padding: 10px 14px; /* Reduced from 12px 16px */
    font-size: 13px; /* Reduced from 14px */
  }

  .section-title {
    font-size: clamp(36px, 4vw, 42px); /* Cap at 42px instead of 48px */
  }
}
```

**Why this works:**
- Targets specifically the 768-1024px "squeeze zone"
- Reduces card padding (40px → 32px) for tighter density
- Scales down text sizes by 2-4px (subtle but effective)
- Increases line-height to compensate for tighter spacing
- Reduces list item padding to prevent overflow
- Section title caps at 42px instead of 48px
- Creates better visual hierarchy without cramping

---

### Fix 4.3: Improve Green Subheader Contrast

**File:** `src/pages/InsightsPage.css`

**Current (lines 116-123):**
```css
.bento-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent-green);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

**Replace with:**
```css
.bento-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent-green);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); /* Add subtle shadow for contrast */
}

/* ADD THIS: Better contrast on map backgrounds */
.card-bg-image + .bento-content .bento-label {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8); /* Stronger shadow on image backgrounds */
  font-weight: 700; /* Slightly bolder */
}
```

**Why this works:**
- Adds subtle text-shadow to all green labels (improves contrast)
- Stronger shadow specifically for labels over background images
- Increases font-weight from 600 → 700 when over images
- Pure CSS solution (no color changes needed)
- Maintains brand color (--accent-green) while improving legibility
- Works on all screen sizes

---

### Fix 4.4: Add Fallback Background Scrim for Map Cards

**File:** `src/pages/InsightsPage.css`

**Current (lines 90-100):**
```css
.card-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.4;
  transition: opacity 0.5s ease;
}
```

**Replace with:**
```css
.card-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.3; /* Reduced from 0.4 for better contrast */
  transition: opacity 0.5s ease;
}

/* ADD THIS: Dark gradient overlay for better text contrast */
.card-bg-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
}
```

**Why this works:**
- Reduces base image opacity from 0.4 → 0.3 (lighter background)
- Adds dark gradient scrim over images (bottom darker than top)
- Gradient provides consistent dark base for text
- ::after pseudo-element layers on top of image but below content
- Improves contrast for all text, especially green labels
- No layout changes, pure CSS enhancement

---

## SUMMARY OF CHANGES

### Files Modified
1. **src/styles/master-styles.css** (1 fix)
   - Increased `.btn-primary` touch target to 44px minimum

2. **src/pages/AdminPage.css** (3 fixes)
   - Increased `.btn-edit` and `.btn-delete` touch targets
   - Improved mobile header spacing and font sizes

3. **src/pages/CalendarPage.css** (2 fixes)
   - Increased campaign bar min-height on mobile
   - Added hover/active states for better feedback

4. **src/pages/WaysOfWorkingPage.css** (3 fixes)
   - Capped page header size at 52px for large screens
   - Reduced excessive vertical spacing between sections
   - Implemented fluid step card title scaling

5. **src/pages/InsightsPage.css** (4 fixes)
   - Scaled down pie chart on mobile/tablet
   - Reduced text density at 768-1024px breakpoint
   - Improved green label contrast with text-shadow
   - Added gradient scrim to background images

---

## IMPACT ASSESSMENT

### Accessibility Improvements
- ✅ All touch targets now meet WCAG 2.1 AA minimum (44×44px)
- ✅ Improved color contrast for green text on backgrounds
- ✅ Better visual feedback on interactive elements

### Usability Improvements
- ✅ Easier tapping on mobile for Admin buttons and Calendar events
- ✅ Better visual hierarchy on Ways of Working page
- ✅ Reduced scroll fatigue with tighter section spacing
- ✅ Improved readability on Insights page at all breakpoints

### Visual Quality
- ✅ Better proportion and balance across all screen sizes
- ✅ Smoother responsive scaling with fluid typography
- ✅ Maintained existing aesthetic and brand colors
- ✅ No layout restructuring required

---

## TESTING CHECKLIST

Test at the following breakpoints:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13)
- [ ] 390px (iPhone 14/15)
- [ ] 768px (iPad Portrait)
- [ ] 1024px (iPad Landscape)
- [ ] 1440px (Desktop)

Per page:
- [ ] **Admin:** Tap Edit/Delete buttons, verify 44px hit area
- [ ] **Admin:** Tap "Add Page" button, verify size and spacing
- [ ] **Calendar:** Tap short campaign bars, verify tap accuracy
- [ ] **Ways of Working:** Check heading size and spacing flow
- [ ] **Insights:** Verify pie chart size, text density, green label contrast

---

## IMPLEMENTATION NOTES

All fixes are:
- ✅ CSS-only (no JSX/JS changes)
- ✅ Backwards compatible (no breaking changes)
- ✅ Progressive enhancement (graceful degradation)
- ✅ Respect existing patterns and structure
- ✅ Minimal and scoped changes
- ✅ Production-ready

Estimated implementation time: **2-3 hours**
Risk level: **Low** (CSS-only, easily reversible)
