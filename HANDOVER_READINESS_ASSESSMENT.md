# Campaign Toolkit: Handover Readiness Assessment

**Date**: January 2026
**Assessor**: Senior Product Designer / Internal Tooling Specialist
**Purpose**: Evaluate whether the Campaign Toolkit can be handed over to a Content Team member for independent operation

---

## A. Handover Readiness Assessment

**Overall Confidence Score: LOW**

This toolkit is not currently ready for independent content ownership. While a well-designed admin panel exists for managing Customer Touchpoints, Calendar, and Resources, significant portions of the application contain hardcoded content that cannot be modified without developer intervention. Most critically, the core campaign identity (title, year, scope, dates), the entire "Ways of Working" workflow, the "Insights" data page, and portions of the "Omnichannel" page are baked into React components. A content owner tasked with creating "the next campaign toolkit" would successfully update some sections but would immediately encounter walls where the admin panel provides no controls, forcing them to either leave outdated content in place or escalate to engineering.

---

## B. Critical Blockers

These are points where a content owner would be **completely unable to proceed** without developer help:

| Blocker | Location | Impact |
|---------|----------|--------|
| **Campaign title/branding cannot be changed** | `HeroCampaignCard.jsx:24-29` defaults "The Magic of Joy Holiday Season", "2026 Global campaign", scope, channels, dates | Content owner cannot rebrand for new campaign |
| **Year "2026" is hardcoded** | `HomePage.jsx:24`, `AdminPage.jsx:229`, multiple references | Cannot update toolkit for 2027, 2028, etc. |
| **Ways of Working page is entirely static** | `WaysOfWorkingPage.jsx:35-86` | 3-step workflow (Global → Regions → Content), specific names like "Surekha Matte", JIRA references, tips—all frozen |
| **Insights page has no admin** | `InsightsPage.jsx` (entire file) | Flight routes, statistics, charts are all hardcoded; no database connection |
| **Summer Joy Ideas carousel is static** | `OmnichannelPage.jsx:62-71` | 8 campaign ideas with descriptions/images cannot be edited |
| **Navigation structure is fixed** | `Header.jsx:32-39`, `App.jsx` routes | Cannot add/remove/rename pages from admin |
| **Homepage navigation cards are hardcoded** | `HomePage.jsx:33-40` | Card titles and descriptions cannot be updated |

---

## C. Capability Gaps

Admin features that are **missing, unclear, or unsafe**:

### Missing Admin Panels

| Content Area | Database Table Exists | Admin UI Exists | Status |
|--------------|----------------------|-----------------|--------|
| Campaign Metadata | `campaigns` table | No | **Gap**: Table exists but no admin to edit campaign title, year, scope, dates |
| Ways of Working Steps | `wow_process` table | No | **Gap**: API exists (`api.getWaysOfWorking()`) but page ignores it |
| Ways of Working Timeline | `wow_timeline` table | No | **Gap**: Unused |
| Omnichannel Carousel | No table | No | **Gap**: Hardcoded array |
| Insights Data | No table | No | **Gap**: No data layer at all |
| Calendar Tiers | `calendar_tiers` table | No | **Gap**: Tiers are hardcoded in CSV import logic |

### Unclear or Confusing Behaviors

1. **Tier name normalization is opaque** (`AdminPage.jsx:77-94`): CSV uses "Omnichannel Campaigns" but database stores "Campaigns". A content owner importing a CSV would not understand why tier names change.

2. **Calendar import is destructive**: "This will REPLACE all existing calendar events" with no backup, undo, or preview functionality.

3. **Platform-Touchpoint linking is fragile**: Touchpoints link to platforms by name string. Renaming a platform requires cascading updates handled in code—if it fails, touchpoints become orphaned.

### Missing Safety Controls

- **No access control**: `/admin` is publicly accessible with no authentication
- **No content preview**: Changes publish immediately
- **No version history**: Deleted content is permanently lost
- **No confirmation for deletes beyond browser `confirm()`**
- **No audit log**: No record of who changed what

---

## D. Risk Areas

Where incorrect usage could **damage quality or consistency**:

| Risk | Scenario | Consequence |
|------|----------|-------------|
| **Inconsistent campaign year** | User updates calendar for 2027 but can't change "2026" references | Mixed messaging, unprofessional appearance |
| **Stale workflow content** | "Surekha Matte" leaves the company; her name is hardcoded | Incorrect process documentation |
| **Orphaned touchpoints** | User renames a platform; touchpoints linked by old name are lost | Missing content on Customer Journey page |
| **Lost calendar data** | User imports malformed CSV; old data is deleted before import fails | Complete data loss, must reset to defaults |
| **Tier confusion** | User creates CSV with "Digital Campaigns" tier; appears as "Other Global Campaigns" in calendar | Unexpected categorization |
| **Broken resource cards** | User deletes image from Supabase storage; resource shows broken image | Unprofessional resource library |
| **Inconsistent seasonal branding** | "Summer Joy Ideas" hardcoded for summer campaign; toolkit reused for winter | Off-brand seasonal messaging |

---

## E. Immediate Recommendations

The minimum changes required to enable confident content ownership:

### Priority 1: Unblock Campaign Identity (Critical)

1. **Create Campaign Admin tab** in AdminPage
   - Connect to existing `campaigns` table
   - Allow editing: campaign name, subtitle, year, scope, channels, activation dates
   - Wire `HomePage` and `HeroCampaignCard` to pull from database instead of defaults

2. **Make year dynamic**
   - Remove hardcoded "2026" from all components
   - Display year from campaign record

### Priority 2: Unblock Static Pages (Critical)

3. **Create Ways of Working Admin**
   - Wire `WaysOfWorkingPage` to `wow_process` and `wow_timeline` tables
   - Add admin UI for editing the 3-step workflow and tips
   - Remove hardcoded content from component

4. **Create Omnichannel Admin**
   - Create `omnichannel_ideas` table for carousel items
   - Add admin UI for managing Summer Joy Ideas (or seasonal equivalents)

### Priority 3: Add Essential Guardrails (High)

5. **Add CSV import preview**
   - Show parsed data before replacing calendar
   - Display clear tier mapping ("Omnichannel Campaigns" → "Campaigns")
   - Require explicit confirmation after preview

6. **Add export-before-import prompt**
   - Automatically prompt to download backup before destructive import

7. **Clarify tier nomenclature**
   - Align CSV tier names with display tier names (one vocabulary)
   - Document valid tier values in admin UI

### Priority 4: Add Basic Protection (Medium)

8. **Add admin authentication**
   - Implement Supabase Auth with SSO (as mentioned in requirements)
   - Restrict `/admin` route to authenticated users

9. **Add delete confirmation dialogs**
   - Replace browser `confirm()` with proper modal confirmations
   - Show what will be deleted (e.g., "Delete 'Homepage' and its 5 touchpoints?")

### Priority 5: Document the Boundaries (Medium)

10. **Create inline admin guidance**
    - Add help text to each admin section explaining what it controls
    - Clearly indicate "Coming soon" for areas without admin (Insights)

---

## Summary Matrix

| Area | Current State | Handover Ready? | Priority Fix |
|------|---------------|-----------------|--------------|
| Customer Touchpoints | Full admin exists | Yes | — |
| Calendar Events | Admin exists (CSV-based) | Risky | Add preview, clarify tiers |
| Resources | Full admin exists | Yes | — |
| Campaign Identity | Hardcoded | No | Create admin, wire to DB |
| Ways of Working | Hardcoded | No | Create admin, wire to DB |
| Omnichannel Carousel | Hardcoded | No | Create table and admin |
| Insights Page | Hardcoded | No | Requires design decision* |
| Navigation | Hardcoded | Acceptable | Document as fixed structure |
| Access Control | None | No | Implement SSO/auth |

*Note: The Insights page contains data visualizations that may require a different approach (e.g., embedded dashboards from a BI tool) rather than editable content fields.

---

## Appendix: Hardcoded Content Locations

### Files Requiring Code Changes for Content Updates

| File | Hardcoded Content |
|------|-------------------|
| `src/components/HeroCampaignCard.jsx:24-29` | Campaign title, year, scope, channels, dates |
| `src/pages/HomePage.jsx:24` | "2026 campaign" pill |
| `src/pages/HomePage.jsx:33-40` | Navigation card titles and descriptions |
| `src/pages/WaysOfWorkingPage.jsx:35-86` | Complete 3-step workflow, person names, tips |
| `src/pages/InsightsPage.jsx` | All flight data, statistics, charts |
| `src/pages/OmnichannelPage.jsx:62-71` | 8 Summer Joy Ideas with images |
| `src/pages/AdminPage.jsx:12-44` | Seeded calendar events for reset |
| `src/pages/AdminPage.jsx:77-94` | Tier name normalization mapping |
| `src/pages/AdminPage.jsx:229` | Export filename "campaign-calendar-2026.csv" |
| `src/components/Header.jsx:32-39` | Navigation links and labels |

### Database Tables Available But Unused by Admin

| Table | Purpose | Connected to UI | Has Admin |
|-------|---------|-----------------|-----------|
| `campaigns` | Campaign metadata | Partially (API exists) | No |
| `wow_process` | Workflow steps | No (page ignores it) | No |
| `wow_timeline` | Timeline phases | No | No |
| `calendar_tiers` | Tier definitions | No (hardcoded instead) | No |

---

## Conclusion

**Bottom Line**: A content owner handed this toolkit today would be able to manage touchpoints, resources, and calendar events successfully. However, they would be unable to rebrand for a new campaign, update the year, modify the workflow documentation, or change seasonal promotional content—making the toolkit essentially frozen to the "Magic of Joy 2026" campaign until engineering intervenes.

**Recommended Next Step**: Address Priority 1 and Priority 2 items before handover. These represent approximately 4-6 development tasks that would unlock the core use case of campaign rebranding.
