# Product Requirements Document: Campaign Toolkit

## Executive Summary

**Product Name:** Campaign Toolkit
**Version:** 1.0
**Last Updated:** January 2026
**Platform:** Web Application (React + Vite)
**Target Audience:** Global and regional marketing teams at Avolta (travel retail)

Campaign Toolkit is a centralized digital platform designed to streamline the planning, execution, and management of global marketing campaigns across multiple channels and regions. It serves as a single source of truth for campaign strategies, resources, timelines, and implementation workflows.

---

## 1. Product Vision & Objectives

### Vision
To empower Avolta's global and regional marketing teams with a unified platform that simplifies campaign planning, ensures brand consistency, and accelerates time-to-market for omnichannel retail campaigns.

### Primary Objectives
1. **Centralize Campaign Information** - Provide a single hub for all campaign-related content, assets, and documentation
2. **Streamline Global-to-Regional Workflows** - Enable efficient collaboration between global strategists and regional implementers
3. **Enable Tiered Implementation** - Support flexible campaign activation across Standard, Premium, and Executive tiers
4. **Ensure Brand Consistency** - Maintain design system adherence across all touchpoints and regions
5. **Data-Driven Insights** - Surface relevant performance metrics and market insights to inform strategy

---

## 2. Target Users & Personas

### Primary Users

**Global Campaign Strategist**
- **Role:** Designs and launches global campaign initiatives
- **Goals:** Create comprehensive campaign strategies, define touchpoints, set timelines
- **Pain Points:** Ensuring regional teams have everything needed; tracking implementation status
- **Key Features:** Admin panel, customer journey management, calendar planning

**Regional Marketing Manager**
- **Role:** Adapts and implements global campaigns for local markets
- **Goals:** Understand campaign requirements, access localized assets, confirm activation levels
- **Pain Points:** Unclear requirements, missing translations, timeline ambiguity
- **Key Features:** Ways of Working, Resources library, Implementation guides

**Content Implementation Team**
- **Role:** Executes final asset deployment across channels
- **Goals:** Access approved assets, understand specifications, deploy on schedule
- **Pain Points:** Last-minute changes, incomplete handoffs
- **Key Features:** Resources page, Customer touchpoints detail, Design system

**Creative/Design Team**
- **Role:** Creates campaign assets and maintains brand standards
- **Goals:** Access design tokens, understand component specs, maintain consistency
- **Pain Points:** Design drift, unclear specifications
- **Key Features:** Design system, Brand guidelines, Asset library

---

## 3. Core Features & Requirements

### 3.1 Home Page
**Purpose:** Primary navigation hub and campaign overview

**Features:**
- Hero campaign card with quick links to all major sections
- Current campaign identifier (e.g., "2026 Campaign")
- Activation ideas preview
- Responsive navigation to all toolkit sections

**User Stories:**
- As a user, I want to quickly navigate to any section of the toolkit
- As a marketer, I want to see the current active campaign at a glance

---

### 3.2 Customer Journey / Touchpoints
**Purpose:** Interactive exploration of customer touchpoints across platforms

**Features:**
- **Platform Organization:** Web, App, Email, Social Media, In-Store
- **Key Touchpoints Navigation:** Horizontal scroll cards showing platform type and touchpoint count
- **Accordion Interface:** Expandable platform sections
- **Screenshot Annotations:** Visual markers linking to detailed touchpoint descriptions
- **Touchpoint Details:**
  - Title and description
  - Tier badges (Standard, Premium, Executive)
  - "New" badge for recent additions
  - Copy ideas (expandable section)
  - Numbered markers synchronized with screenshot
- **Implementation Levels Guide:** Visual explanation of tier differences

**Technical Requirements:**
- Real-time data sync with Supabase `platforms` and `touchpoints` tables
- Synchronized scrolling between screenshot markers and description list
- Active state highlighting for current touchpoint
- Responsive design with mobile-optimized accordion behavior

**User Stories:**
- As a regional manager, I want to see all touchpoints for a specific platform so I can understand implementation scope
- As a content team member, I want to view copy suggestions for each touchpoint to accelerate content creation
- As a strategist, I want to identify which touchpoints are new or tier-specific

---

### 3.3 Campaign Calendar
**Purpose:** Visual timeline of campaigns throughout the year

**Features:**
- **Grid Layout:** Month columns (Jan-Dec) × Campaign tier rows
- **Campaign Tiers:**
  - Global Campaigns
  - Regional Campaigns
  - Local Campaigns (marked with + icon)
  - Category-specific campaigns
- **Campaign Bars:**
  - Pill-shaped overlays spanning campaign duration
  - Color-coded by tier
  - Display campaign title and date range
  - Hover states for additional details
- **Supporting Notes:** Regional variation disclaimers

**Technical Requirements:**
- Data sourced from Supabase `calendar_events` and `calendar_tiers` tables
- Intelligent row allocation to prevent visual overlaps
- Responsive grid that adapts to mobile (stacked view)
- Color variables tied to tier system

**User Stories:**
- As a planner, I want to see all campaigns for the year in one view to identify timing conflicts
- As a regional team, I want to quickly find campaigns relevant to my tier level
- As a coordinator, I want to export or reference campaign dates for planning purposes

---

### 3.4 Resources & Assets
**Purpose:** Centralized library for downloadable campaign assets

**Features:**
- **Asset Categories:**
  - Hero banners / Campaign visual assets (SVG, JPG, PNG)
  - Category imagery / Product assortment guides (JPG, PNG)
  - Social media formats (MP4, GIF)
  - Campaign headlines / Copy library (DOCX, PDF)
  - Member variant templates (DOCX)
  - Figma master files / Brand guidelines (FIGMA)
  - Component specs / Technical documentation (PDF)

- **Asset Cards:**
  - Custom visual previews (abstract UI representations)
  - Title and description
  - Format badges (file type indicators)
  - Download button
  - Click-through to detailed asset view

- **Detail View (Resource Detail Page):**
  - Large preview or embed
  - Full description
  - Download options
  - Related assets

- **Access Note:** Instructions for accessing assets via Canopy, Figma, and DCCR process

**Technical Requirements:**
- Asset metadata stored in Supabase `resources` table
- File format inference based on asset title/category
- Lazy loading for performance
- Support for external file hosting (Figma, Canopy links)

**User Stories:**
- As a designer, I want to download the latest Figma master file to create localized adaptations
- As a content creator, I want to access approved campaign copy to ensure messaging consistency
- As a social media manager, I want to download social format templates in multiple file types

---

### 3.5 Ways of Working
**Purpose:** 3-step workflow guide for campaign implementation

**Features:**
- **Step 1: Global**
  - EPIC ticket creation in JIRA
  - Regional ticket breakdown with implementation guides
  - Excel template with copies, translations, requirements

- **Step 2: Regions**
  - Review & confirm (location, dates, activation level)
  - Approve assets (copy & translations)
  - Support request process (DCCR tickets)
  - Handover to Content Team

- **Step 3: Content Implementation**
  - Final asset deployment
  - Channel distribution

- **Implementation Tips Component:**
  - Best practice tips
  - Common pitfalls to avoid

- **Best Practice Tips Grid:**
  - Define activation level first
  - Include start/end dates
  - Attach final visuals and translations
  - Avoid changes post-approval

**User Stories:**
- As a global strategist, I want clear workflow documentation so regional teams know exactly what's expected
- As a regional manager, I want to understand my responsibilities in the campaign activation process
- As a content team member, I want to know when campaigns are ready for final implementation

---

### 3.6 Omnichannel Strategy
**Purpose:** 360° activation strategy showcase

**Features:**
- **360° Harmony Grid:**
  - Central brand logomark
  - 7+ channel cards radiating outward
  - Each card includes:
    - Channel number (01-07+)
    - Channel name
    - Channel description
    - Color-coded design (blue, green, purple, orange, red, indigo, pink)
  - Animated entrance (fade + slide on scroll)

- **Summer Joy Ideas Carousel:**
  - Horizontal scrolling carousel
  - 8+ activation ideas
  - Each idea card includes:
    - Large image
    - Category tag (Loyalty, Wow Factor, Engagement, etc.)
    - Title
    - Description
  - Examples: Balloon modelling, magic reveals, tasting bars, origami art, face painting, challenges

**Technical Requirements:**
- Channel data from Supabase `omnichannel` table
- Intersection Observer for scroll-triggered animations
- Smooth horizontal scroll with touch/swipe support
- Lazy-loaded images

**User Stories:**
- As a campaign planner, I want to understand the full omnichannel strategy to ensure coverage across all touchpoints
- As a regional marketer, I want inspiration for activation ideas I can implement locally
- As an event coordinator, I want to see creative in-store activation concepts

---

### 3.7 Insights & Performance
**Purpose:** Data-driven insights to inform campaign strategy

**Features:**
- **Bento Grid Infographics:**
  - Top routes map (interactive visualization)
  - Spain dominance statistic (5 of top 10 routes)
  - Intra-Europe percentage (9/10 routes within Europe)
  - Scandinavian hotspots highlight

- **Performance Charts:**
  - PAX by month (EU) - Line chart comparing year-over-year
  - PAX by week (UK) - Weekly trend analysis with peak highlighting
  - Legend and axis labels
  - Animated path drawing on scroll

- **Insight Cards:**
  - Large format cards for key statistics
  - Medium cards for supporting data
  - Small cards for quick facts
  - Gradient accents and glass morphism styling

**User Stories:**
- As a strategist, I want to see which routes have highest passenger traffic to prioritize campaign investment
- As an analyst, I want to compare year-over-year performance to identify growth opportunities
- As a regional manager, I want to understand seasonal patterns to time campaigns effectively

---

### 3.8 Annex
**Purpose:** Supplementary information and reference materials

**Features:**
- Links to additional documentation
- Reference materials
- Glossary or terminology
- Contact information
- Support resources

**User Stories:**
- As a new team member, I want access to supplementary materials to get up to speed quickly
- As a user, I want quick access to support contacts when I have questions

---

### 3.9 Admin Panel
**Purpose:** Content management interface for authorized users

**Features:**
- **Journey/Touchpoint Management:**
  - Add/edit/delete platforms
  - Add/edit/delete touchpoints
  - Upload screenshots
  - Position marker annotations
  - Set tier assignments (Standard, Premium, Executive)
  - Mark items as "New"
  - Add copy ideas

- **Resources Management:**
  - Upload new assets
  - Edit titles, descriptions
  - Set file formats
  - Manage download links

- **Calendar Management:**
  - Create/edit campaign events
  - Set date ranges
  - Assign to tiers
  - Set colors

**Technical Requirements:**
- Authentication required (Supabase Auth)
- CRUD operations for all content types
- Image upload to Supabase Storage
- Form validation
- Confirmation dialogs for destructive actions

**User Stories:**
- As a global admin, I want to add new touchpoints to the customer journey without developer help
- As a content manager, I want to update campaign calendar dates when timelines shift
- As an asset manager, I want to upload new resources and make them available immediately

---

### 3.10 Design System
**Purpose:** Living style guide and component library

**Features:**
- **Design Tokens:**
  - Color palette (surfaces, text, accents, status, borders)
  - Typography scale (headings, body, captions)
  - Spacing system
  - Border radius values

- **Component Examples:**
  - Buttons (pill-shaped)
  - Badges (tier, status, platform)
  - Cards (glass, elevated)
  - Forms
  - Navigation elements

- **Usage Guidelines:**
  - Layout principles
  - Component best practices
  - Accessibility notes

- **Brand Philosophy:**
  - Evo Night Theme explanation
  - Glassmorphism approach
  - Dark mode premium aesthetic

**User Stories:**
- As a designer, I want to reference exact color values and spacing to maintain consistency
- As a developer, I want to see component examples to implement features correctly
- As a brand manager, I want to ensure all implementations follow our design system

---

## 4. Design System & Brand Guidelines

### Color Palette

**Surfaces (Dark Mode)**
- Surface Default: `#000000` (Main background)
- Surface Elevated: `#111111` (Cards, Panels)
- Surface Card: `#161616` (Secondary Cards)
- Surface Glass: `rgba(255, 255, 255, 0.02)` (Overlays)

**Text**
- Text Primary: `#ffffff` (Headings, Body)
- Text Secondary: `#a1a1a6` (Subtitles, Metadata)
- Text Muted: `#666666` (Labels, Hints)

**Accents & Tiers**
- Accent Green: `#BEF264` (Premium Tier)
- Accent Purple: `#8F53F0` (Executive Tier)
- Accent Blue: `#3B82F6` (New/Standard Tier)
- Accent Coral: `#FB7185`
- Gradient Orange: `linear-gradient(90deg, #F6A52E 0%, #E2543D 100%)`

**Status Badges**
- Magenta: Bg `rgba(255, 102, 196, 0.2)` / Text `#FF66C4`
- Success: Bg `rgba(52, 199, 89, 0.2)` / Text `#34C759`
- Purple: Bg `rgba(175, 82, 222, 0.2)` / Text `#AF52DE`
- Default: Bg `rgba(82, 82, 82, 1)` / Text `#E5E5EA`

### Typography

**Font Family:** 'Saans', 'Inter', system-ui, sans-serif

**Scale:**
- Heading XXXL: 60-72px
- Heading XXL: 45px
- Heading XL: 36px
- Heading L: 28px
- Body Large: 16-17px
- Body Default: 14-15px
- Caption: 12px

### Layout

- Container Max Width: 1100px (content) / 1148px (wrapper)
- Wide Container: 1400px (Calendar)
- Border Radius: 12px (sm), 16px (md), 24px (lg), 32px (xl), 100px (pill)
- Padding: 24px minimum

### Component Patterns

**Cards:**
- Use `--surface-elevated` or `--surface-card`
- 1px border using `--border-light`
- Glass effect with `.glass` helper class

**Buttons:**
- Pill-shaped (border-radius: 100px or 48px)
- High contrast on dark backgrounds

**Badges:**
- Pill-shaped
- Colored backgrounds with matching text
- Semi-transparent backgrounds

---

## 5. Technical Architecture

### Frontend Stack
- **Framework:** React 19.2
- **Build Tool:** Vite 7.2
- **Routing:** React Router DOM 7.11
- **Styling:** CSS Modules / Vanilla CSS with CSS Variables
- **Data Fetching:** Supabase Client

### Backend & Database
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (for images/assets)
- **Tables:**
  - `platforms` - Customer journey platforms
  - `touchpoints` - Individual touchpoints per platform
  - `resources` - Asset library items
  - `calendar_events` - Campaign timeline events
  - `calendar_tiers` - Campaign tier categories
  - `omnichannel` - 360° strategy channels

### Deployment
- **Hosting:** Vercel
- **Domain:** campaign-toolkit.vercel.app
- **Environment:** Production

### Performance Considerations
- Lazy loading for images
- Intersection Observer for scroll animations
- Optimized bundle size
- Responsive images

---

## 6. User Flows

### Flow 1: Regional Manager Implementing a Campaign

1. Land on home page → See current campaign (2026)
2. Navigate to "Ways of Working" → Understand 3-step process
3. Navigate to "Customer Journey" → Review touchpoints for their platform
4. Expand platform (e.g., "Web") → See all touchpoints with tier badges
5. Review implementation level (Standard/Premium/Executive) → Understand scope
6. Navigate to "Resources" → Download required assets (banners, copy)
7. Navigate to "Calendar" → Confirm campaign dates
8. Return to work with JIRA ticket, assets, and clear timeline

### Flow 2: Global Strategist Planning New Campaign

1. Log in to Admin panel
2. Navigate to Calendar admin → Create new campaign event
3. Set dates, tier, title, color
4. Navigate to Customer Journey admin → Add new touchpoints
5. Upload screenshot, position markers
6. Add touchpoint details, copy ideas, tier assignments
7. Navigate to Resources admin → Upload campaign assets
8. Publish changes → Visible to all users immediately
9. Create JIRA EPIC and regional tickets
10. Share toolkit link with regional teams

### Flow 3: Designer Accessing Brand Guidelines

1. Navigate to "Design System"
2. Review color tokens → Copy hex values for design tool
3. Review typography scale → Ensure font sizes match
4. Review component examples → Understand button styling
5. Download Figma master file from "Resources"
6. Create campaign assets following design system

---

## 7. Success Metrics & KPIs

### User Engagement
- Monthly active users (global + regional teams)
- Average session duration
- Pages per session
- Return user rate

### Adoption Metrics
- % of campaigns launched using toolkit
- Number of resources downloaded per campaign
- Admin panel usage frequency

### Efficiency Gains
- Time from campaign creation to regional implementation
- Reduction in back-and-forth communication
- DCCR ticket reduction (fewer design requests due to self-service resources)

### Quality Metrics
- Brand consistency score across regional implementations
- Asset reuse rate
- Feedback satisfaction score from regional teams

---

## 8. Future Enhancements & Roadmap

### Phase 2 (Q2 2026)
- **Multi-language Support:** Interface translation for key markets
- **Campaign Templates:** Pre-configured campaign structures for common scenarios
- **Collaboration Features:** Comments, approvals, notifications within toolkit
- **Analytics Dashboard:** Track campaign performance metrics directly in toolkit

### Phase 3 (Q3 2026)
- **AI-Powered Copy Suggestions:** Generate localized copy variations
- **Asset Versioning:** Track changes to resources over time
- **Integration with Canopy:** Direct asset sync
- **Mobile App:** Native iOS/Android for on-the-go access

### Phase 4 (Q4 2026)
- **Regional Customization:** Allow regional teams to create sub-campaigns
- **Reporting Suite:** Campaign ROI tracking and attribution
- **Workflow Automation:** Automated JIRA ticket creation from toolkit
- **Video Training Library:** Built-in tutorials and onboarding

---

## 9. Constraints & Assumptions

### Constraints
- Must work within existing Supabase infrastructure
- Limited budget for third-party integrations
- Must maintain < 3 second page load times
- Mobile responsiveness required (60% of users on tablet/mobile)

### Assumptions
- Users have access to JIRA for workflow management
- Users have Figma access for design file editing
- Regional teams have basic technical literacy
- Global team acts as content administrators
- Campaigns follow standard tier structure (Standard/Premium/Executive)

---

## 10. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Regional teams don't adopt toolkit | High | Medium | Comprehensive onboarding, training sessions, feedback loops |
| Content becomes outdated quickly | Medium | High | Admin panel for easy updates, quarterly content audits |
| Design drift as campaigns evolve | High | Medium | Enforce design system, provide component library, regular design reviews |
| Performance issues with large asset library | Medium | Medium | Implement pagination, lazy loading, CDN for assets |
| Database downtime (Supabase) | High | Low | SLA with Supabase, status monitoring, cached content for read-only mode |

---

## 11. Glossary

- **DCCR:** Design/Creative Change Request - Process for requesting new assets or modifications
- **EPIC:** High-level JIRA ticket representing a major feature or campaign
- **Tier (Standard/Premium/Executive):** Campaign implementation levels with varying feature sets
- **Touchpoint:** Individual customer interaction point (e.g., email, banner, social post)
- **Omnichannel:** Coordinated marketing across multiple channels (web, mobile, email, in-store)
- **Glassmorphism:** Design trend using semi-transparent backgrounds with blur effects
- **PAX:** Passenger count metric
- **Canopy:** Internal asset management system at Avolta

---

## 12. Appendix

### Related Documents
- `brand-rules.md` - Detailed design system documentation
- `SUPABASE_SETUP.md` - Database schema and setup instructions
- `MAINTENANCE_GUIDE.md` - Technical maintenance procedures
- `migration-walkthrough.md` - Data migration guide

### Stakeholder Contacts
- **Product Owner:** [To be assigned]
- **Technical Lead:** [To be assigned]
- **Design Lead:** [To be assigned]
- **Regional Team Leads:** [To be assigned]

### Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | Claude | Initial PRD created from codebase analysis |

---

**Document Status:** Draft
**Next Review Date:** February 2026
**Approval Required From:** Product Owner, Technical Lead, Design Lead
