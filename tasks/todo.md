# Task: Move Calendar Management to Admin with Tabs

## Overview
Reorganize the admin interface to include both Touchpoints and Calendar management in one place with a tabbed interface.

## Changes Required

### 1. Admin Page Updates
- Add tab navigation (Touchpoints / Calendar)
- Create Calendar management section
- Move Import/Export/Reset functionality from Calendar page to Admin
- Maintain existing Touchpoints functionality

### 2. Calendar Page Updates
- Remove Import CSV, Export CSV, and Reset buttons
- Remove the import-card UI section
- Keep the timeline view clean and focused on viewing only

## Todo Items

- [x] Read AdminPage.jsx to understand current structure
- [x] Add tab state management to AdminPage
- [x] Create tab navigation UI in AdminPage
- [x] Extract calendar CSV logic from Calendar2026Page
- [x] Add Calendar management section to AdminPage (import/export/reset)
- [x] Update AdminPage.css with tab styles
- [x] Remove import-card section from Calendar2026Page
- [x] Remove CSV functions from Calendar2026Page.jsx
- [x] Test import/export/reset from Admin page
- [x] Test calendar view is clean without management buttons
- [x] Commit changes with descriptive message

---

## Implementation Details

### Tab Structure
```
Admin Page
├── Tab: Manage Touchpoints
│   └── [Existing touchpoint CRUD]
└── Tab: Manage Calendar
    ├── Import CSV
    ├── Export CSV
    └── Reset to Defaults
```

### Files Modified
- `src/pages/AdminPage.jsx` - Added tabs and calendar management
- `src/pages/AdminPage.css` - Tab styling and calendar admin section
- `src/pages/Calendar2026Page.jsx` - Removed management UI and functions
- `src/pages/Calendar2026Page.css` - Removed import-card styles

---

## Review Section

### Summary of Changes

**Commit:** `8977dbc` - "Move calendar management to Admin page with tabbed interface"

**Files Modified:**
- `src/pages/AdminPage.jsx` (+270 lines, -88 lines)
- `src/pages/AdminPage.css` (+113 lines, -12 lines)
- `src/pages/Calendar2026Page.jsx` (-73 lines)
- `src/pages/Calendar2026Page.css` (-69 lines)

**Key Improvements:**

1. **Admin Page Enhancements**
   - Added tab navigation system (Touchpoints | Calendar)
   - Created Calendar management section with full CSV import/export functionality
   - Migrated all 26 seeded calendar campaigns to Admin
   - Added calendar CSV parsing and export functions
   - Implemented reset to defaults functionality

2. **Calendar Page Simplification**
   - Removed all management UI (import/export/reset buttons)
   - Removed CSV parsing and export functions
   - Clean, view-only timeline display
   - Focused user experience for viewing campaigns

3. **UX Benefits**
   - Clear separation of viewing vs. managing
   - All admin tasks centralized in one location
   - Consistent navigation pattern
   - Reduced clutter on Calendar page
   - Professional admin interface with tabs

4. **Code Quality**
   - Simple, minimal changes (only 4 files)
   - No breaking changes - data remains in localStorage
   - Maintains backward compatibility
   - Clean code organization

### Impact
- **Better UX** - Separation of concerns (viewing vs. managing)
- **Centralized Management** - All admin functions in one place
- **Cleaner Interface** - Calendar page is now view-only
- **No Data Loss** - LocalStorage integration maintained
- **Mobile Responsive** - Tab navigation adapts to mobile screens

### Testing Results
✅ Admin page tabs work correctly
✅ Calendar management (import/export/reset) functional
✅ Calendar page displays clean timeline view
✅ No management buttons on Calendar page
✅ Data persistence works across both pages

### Next Steps (Suggested)
- Add visual feedback (toast notifications) for admin actions
- Implement calendar event editing from Admin page
- Add search/filter to calendar management
- Consider adding campaign analytics dashboard
