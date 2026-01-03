# Campaign Toolkit - Design System & Brand Guidelines

## 1. Core Philosophy
The Campaign Toolkit design system (Evo Night Theme) is built on a dark, premium aesthetic that emphasizes depth, clarity, and vibrancy. It uses a "glassmorphism" approach with subtle translucency, deep backgrounds, and high-contrast text, punctuated by vibrant accent colors to denote tiers and status.

## 2. Design Tokens

### Colors

**Surfaces (Dark Mode)**
- `Surface Default`: `#000000` (Main background)
- `Surface Elevated`: `#111111` (Cards, Panels)
- `Surface Card`: `#161616` (Secondary Cards)
- `Surface Glass`: `rgba(255, 255, 255, 0.02)` (Overlays)

**Text**
- `Text Primary`: `#ffffff` (Headings, Body)
- `Text Secondary`: `#a1a1a6` (Subtitles, Metadata)
- `Text Muted`: `#666666` (Labels, Hints)
- `Text Inverse`: `#000000` (Buttons on light fields)

**Accents & Brand**
- `Accent Green`: `#BEF264` (Premium Tier)
- `Accent Purple`: `#8F53F0` (Executive Tier)
- `Accent Blue`: `#3B82F6` (New Tier)
- `Accent Coral`: `#FB7185`
- `Gradient Orange`: `linear-gradient(90deg, #F6A52E 0%, #E2543D 100%)`

**Status & Badges**
- `Magenta`: Bg `rgba(255, 102, 196, 0.2)` / Text `#FF66C4`
- `Success`: Bg `rgba(52, 199, 89, 0.2)` / Text `#34C759`
- `Purple`: Bg `rgba(175, 82, 222, 0.2)` / Text `#AF52DE`
- `Default`: Bg `rgba(82, 82, 82, 1)` / Text `#E5E5EA`

**Borders**
- `Border Default`: `rgba(255, 255, 255, 0.08)`
- `Border Light`: `rgba(255, 255, 255, 0.05)`
- `Border Glass`: `rgba(255, 255, 255, 0.1)`

### Typography

**Font Family**
- `Display`: 'Saans', 'Inter', system-ui, sans-serif
- `Body`: 'Saans', 'Inter', system-ui, sans-serif

**Scale (Headings)**
- `Heading XXXL`: 60px
- `Heading XXL`: 45px
- `Heading XL`: 36px
- `Heading L`: 28px
- `Heading M`: 22px
- `Heading S`: 18px

**Scale (Body)**
- `Body Large`: 16px/17px
- `Body Default`: 14px-15px
- `Body Small`: 13px
- `Caption`: 12px

### Geometry & Layout
- **Container Max Width**: 1100px (Content) / 1148px (Wrapper)
- **Container Max Width (Wide)**: 1400px (Calendar Page)
- **Border Radius**:
  - `sm`: 12px
  - `md`: 16px
  - `lg`: 24px
  - `xl`: 32px (Hero elements)
  - `pill`: 100px (Buttons, badges)

## 3. Usage Guidelines

### Layout
- Pages should use `.inner-content-wrapper` to enforce the 1100px max-width centered layout.
- Padding should generally be `24px` on mobile/tablet and up.

### Components
- **Cards**: Use `--surface-elevated` or `--surface-card` with a 1px border using `--border-light`.
- **Glass Effects**: Use `.glass` helper class for semi-transparent overlaps.
- **Buttons**: Pill-shaped (`border-radius: 100px` or `48px`).
- **Badges**: Use the specific Status color pairings defined above.

## 4. Identified Deviations (Audit)
*Refactoring is recommended to align these areas with the system.*

1.  **Duplicate Color Definitions**:
    - `Badge.css` and `FeatureBlock.css` both manually define the Magenta/Success/Purple/Default color values. These should be centralized in `index.css` or imported from a common module.
2.  **Hardcoded Greys**:
    - `JourneyAdmin.css` uses `#242424`, `#1a1a1a`, `#1e1e1e`.
    - `PlatformChip.css` uses `#2d2d2d`.
    - These "off-black" shades should be consolidated into the Surface palette (e.g. maybe adding a `Surface Elevated High` token).
3.  **Typography**:
    - `FeatureBlock.css` imports Inter directly again, potentially causing double downloads.
    - `HomePageTile.css` uses 40px and 20px font sizes (non-standard steps).
4.  **Border Radius**:
    - Various ad-hoc radii found: `20px` (badge), `32px` (visual card), `40px` (hero card).
5.  **Admin Styling**:
    - The Admin section (`JourneyAdmin.css`) appears to rely heavily on untokenized hex values and uses a slightly different visual language (e.g. green buttons `#22c55e` vs brand green `#BEF264`).

## 5. Applied Master Styles (CSS Reference)
*These global utility classes are defined in `src/index.css` and should be used to maintain consistency.*

### **Surfaces**

**Master Style 01: Glass Content Card**
- **Class:** `.card-glass`
- **Usage:** Secondary cards, floating elements, or areas needing a "light" feel.
- **Properties:**
  - Background: `rgba(255, 255, 255, 0.05)` (approx 5% white)
  - Blur: `20px`
  - Border: `0.5px solid rgba(255, 255, 255, 0.15)`
  - Radius: `32px`
  - Padding: `40px`

**Master Style 02: Elevated Container**
- **Class:** `.card-elevated`
- **Usage:** Main content panels, distinct sections on dark backgrounds.
- **Properties:**
  - Background: `var(--surface-elevated)` (#111111)
  - Border: `1px solid var(--border-light)`
  - Radius: `40px`
  - Padding: `40px`

**Glass Helper**
- **Class:** `.glass`
- **Usage:** General purpose glassmorphism effect for smaller elements.
- **Properties:**
  - Background: `var(--surface-glass)`
  - Blur: `20px`
  - Border: `1px solid var(--border-glass)`

### **Layout & Typography**

**Page Header**
- **Class:** `.page-header`
- **Usage:** The standard standard H1 + Subtitle block at the top of every main page.
- **Properties:**
  - Top Padding: `180px` (clears fixed nav)
  - Layout: Left-aligned
  - Max Width: `1148px` (matches global wrapper)
  - H1: `72px`, SemiBold (600), White
  - P: `16px`, Regular (400), #A3A3A3, Max-width 480px

**Global Content Wrapper**
- **Class:** `.inner-content-wrapper`
- **Usage:** The main container for page content to ensure consistent margins.
- **Properties:**
  - Max Width: `1100px` content + `48px` padding (Total 1148px)
  - Padding: `0 24px` horizontal
  - Alignment: Centered (`margin: 0 auto`)
