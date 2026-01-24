# Resources Refactor Summary

## Overview
Successfully refactored the Resources admin to use a single canonical Resource model following the standardized CRUD pattern, matching the OmnichannelIdeas implementation.

---

## Changes Made

### 1. Database Migration (`supabase/migrations/008_simplify_resources.sql`)

**Added canonical fields:**
- `thumbnail_url` TEXT - Optional image for resource card
- `cta_label` TEXT DEFAULT 'View Resource' - Button label
- `cta_url` TEXT - External link URL
- `sort_order` INTEGER DEFAULT 0 - Display ordering
- `active` BOOLEAN DEFAULT true - Visibility toggle
- `campaign_id` TEXT REFERENCES campaigns(id) - Optional campaign association

**Added indexes:**
- `idx_resources_active_sort` on (active, sort_order)
- `idx_resources_campaign` on (campaign_id)

**Legacy fields (existing in current DB, NOT in migrations):**
- `hero_cards` (JSONB array) - DEPRECATED
- `embed_code`, `show_embed` - DEPRECATED
- `resource_card`, `show_resource_card` - DEPRECATED
- `image_url`, `link`, `detail_headline`, `detail_content` - DEPRECATED

These legacy fields exist in the live database but are not part of the migration files. They will be ignored by the new implementation.

---

### 2. Admin Component (`src/components/ResourcesAdmin.jsx`)

**REMOVED:**
- ❌ Split-screen editor with live preview
- ❌ Nested hero_cards array editing
- ❌ Embed code textarea
- ❌ FlexibleHeroCard preview rendering
- ❌ Image upload to storage
- ❌ Legacy field sync logic
- ❌ ResourcesAdmin.css (now uses AdminComponents.css)

**ADDED:**
- ✅ List view with title, category, status, sort_order
- ✅ Modal-based editing (matches OmnichannelIdeas pattern)
- ✅ Hide/Show toggle via `active` field
- ✅ Add/Edit/Delete actions
- ✅ Form sections: Basics, Presentation, Visibility
- ✅ Helper text: "Resources link to external documents or tools. Content is not authored here."

**Form Fields:**
```
Basics:
  - Title * (text)
  - Category * (dropdown: Visual Assets, Copy & Messaging, etc.)
  - Description (textarea, optional)

Presentation:
  - Thumbnail URL (text, optional)
  - CTA Label * (text, default: "View Resource")
  - CTA URL * (url, required)

Visibility:
  - Sort Order * (number, default: length+1)
  - Active checkbox (default: true)
```

---

### 3. API Updates (`src/lib/api.js`)

**Changed:**
```javascript
// OLD
.order('title');

// NEW
.eq('active', true)
.order('sort_order');
```

Now filters by active status and orders by sort_order instead of alphabetically.

---

### 4. Front-End Pages

#### ResourcesPage.jsx (`src/pages/ResourcesPage.jsx`)
- ✅ **No visual changes** - continues to display custom SVG graphics
- ✅ Removed legacy title fix ("ard title" → "Card title")
- ✅ Still uses only: id, title, description, category
- ✅ Front-end rendering UNCHANGED

#### ResourceDetailPage.jsx (`src/pages/ResourceDetailPage.jsx`)
**REMOVED:**
- ❌ Complex hero_cards array handling
- ❌ FlexibleHeroCard component rendering
- ❌ Embed section with iframe/embed_code
- ❌ ResourceEmbed component
- ❌ Legacy field fallback logic

**ADDED:**
- ✅ Simple card layout with thumbnail, category, CTA button
- ✅ Links to external resources via cta_url
- ✅ Info text explaining external linking
- ✅ Clean, minimal detail view

---

## Migration Instructions

### Step 1: Run Database Migration

**Option A: Supabase Dashboard (Recommended)**
1. Go to: https://zzbhflojierricqvswwq.supabase.co
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/008_simplify_resources.sql`
4. Paste and click "Run"

**Option B: Using script**
```bash
node run-migration-008.js
```
(This script shows instructions; actual execution requires service_role key)

### Step 2: Verify Migration

Check that new columns exist:
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'resources'
ORDER BY ordinal_position;
```

Expected new columns:
- thumbnail_url (text)
- cta_label (text, default 'View Resource')
- cta_url (text)
- sort_order (integer, default 0)
- active (boolean, default true)
- campaign_id (text)

### Step 3: Test Admin Interface

1. Start dev server: `npm run dev`
2. Navigate to: http://localhost:5173/admin
3. Click "Resources" tab
4. Test operations:
   - ✅ Create new resource
   - ✅ Edit existing resource
   - ✅ Toggle Hide/Show
   - ✅ Delete resource
   - ✅ Verify sort_order changes
5. Check that modal form has three sections: Basics, Presentation, Visibility

### Step 4: Test Front-End Pages

1. Navigate to: http://localhost:5173/resources
2. Verify:
   - ✅ Resource cards display with custom SVG graphics
   - ✅ Only active resources shown
   - ✅ Resources ordered by sort_order
   - ✅ Clicking a card navigates to detail page

3. On detail page, verify:
   - ✅ Title and description display
   - ✅ Category badge shows
   - ✅ CTA button links to external URL
   - ✅ Thumbnail displays (if set)
   - ✅ No complex nested cards or embeds

---

## Data Migration Notes

### Existing Resources in Database
Current resources table contains legacy fields:
- `hero_cards`: JSONB array of card objects
- `embed_code`: HTML/iframe embed code
- `image_url`, `link`: Flat legacy fields
- `detail_headline`, `detail_content`: Rich content fields

### Migration Strategy
**Phase 1: Dual Support (Current)**
- New fields (`thumbnail_url`, `cta_url`, etc.) added
- Legacy fields remain in database but unused by new code
- Existing resources will have NULL values for new fields initially

**Phase 2: Data Population (Manual)**
Admins should:
1. Open each existing resource in new admin
2. Populate new fields:
   - `cta_url` ← first hero_card link OR legacy `link` field
   - `cta_label` ← first hero_card cta_text OR default
   - `thumbnail_url` ← first hero_card image_url OR legacy `image_url`
   - `sort_order` ← assign ordering (1, 2, 3...)
   - `active` ← set to true/false
3. Save

**Phase 3: Cleanup (Future)**
After all resources migrated, legacy columns can be dropped:
```sql
ALTER TABLE resources
DROP COLUMN IF EXISTS hero_cards,
DROP COLUMN IF EXISTS embed_code,
DROP COLUMN IF EXISTS show_embed,
DROP COLUMN IF EXISTS resource_card,
DROP COLUMN IF EXISTS show_resource_card,
DROP COLUMN IF EXISTS image_url,
DROP COLUMN IF EXISTS link,
DROP COLUMN IF EXISTS detail_headline,
DROP COLUMN IF EXISTS detail_content;
```

---

## Canonical Resource Model

### Database Schema
```sql
CREATE TABLE resources (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,

  -- NEW CANONICAL FIELDS
  thumbnail_url TEXT,
  cta_label TEXT DEFAULT 'View Resource',
  cta_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  campaign_id TEXT REFERENCES campaigns(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

### TypeScript Interface (Reference)
```typescript
interface Resource {
  id: number;
  title: string;
  category: string;
  description?: string;
  thumbnail_url?: string;
  cta_label: string;
  cta_url: string;
  sort_order: number;
  active: boolean;
  campaign_id?: string;
  created_at: string;
}
```

---

## CRUD Pattern Consistency

### Admin Pattern (matches OmnichannelIdeas)
✅ List view with metadata display
✅ Modal-based editing
✅ Hide/Show toggle
✅ Add/Edit/Delete actions
✅ Form validation
✅ Success/error messages
✅ Empty state handling
✅ Info box with helper text

### Database Pattern
✅ BIGINT auto-identity primary key
✅ `active` boolean for visibility
✅ `sort_order` integer for ordering
✅ Optional `campaign_id` foreign key
✅ Indexes on (active, sort_order)
✅ Public RLS policies

---

## Files Changed

### Created
- `supabase/migrations/008_simplify_resources.sql` (Migration)
- `run-migration-008.js` (Migration helper script)
- `RESOURCES-REFACTOR-SUMMARY.md` (This file)

### Modified
- `src/components/ResourcesAdmin.jsx` (Complete rewrite)
- `src/pages/ResourceDetailPage.jsx` (Simplified)
- `src/pages/ResourcesPage.jsx` (Minor cleanup)
- `src/lib/api.js` (Updated getResources query)

### Deleted
- `src/components/ResourcesAdmin.css` (No longer needed, uses AdminComponents.css)

---

## Testing Checklist

### Admin Interface
- [ ] Migration ran successfully
- [ ] Resources admin tab loads
- [ ] List view shows existing resources
- [ ] "Add New Resource" opens modal
- [ ] Modal has 3 sections: Basics, Presentation, Visibility
- [ ] Required fields validated (title, category, cta_label, cta_url)
- [ ] Creating resource works
- [ ] Editing resource works
- [ ] Hide/Show toggle works
- [ ] Delete with confirmation works
- [ ] Sort order affects list display
- [ ] Helper text displays at bottom

### Front-End
- [ ] Resources page loads (/resources)
- [ ] Only active resources display
- [ ] Resources ordered by sort_order
- [ ] Custom SVG graphics still render
- [ ] Clicking resource navigates to detail page
- [ ] Detail page shows title, description, category
- [ ] CTA button links to external URL
- [ ] Thumbnail displays if set
- [ ] No console errors

### Data Integrity
- [ ] Existing resources still queryable
- [ ] New resources save correctly
- [ ] Foreign key to campaigns works
- [ ] Indexes created successfully
- [ ] RLS policies unchanged

---

## Notes

### Design Decisions
1. **No content authoring**: Resources strictly link externally, no rich content editing
2. **Single card model**: Removed nested hero_cards array complexity
3. **No live preview**: Admin shows form only, preview on front-end
4. **Modal editing**: Consistent with OmnichannelIdeas pattern
5. **Active filtering**: API returns only active resources by default

### Front-End Preservation
- ResourcesPage.jsx custom SVG graphics **unchanged**
- Card layout and styling **unchanged**
- Navigation flow **unchanged**
- Only data source changed (new fields instead of legacy)

### Future Enhancements
- Drag-and-drop reordering (like JourneyAdmin)
- Image upload for thumbnail_url
- Bulk import/export (like Calendar)
- Campaign filtering
- Category management

---

## Support

For questions or issues:
1. Check migration ran successfully in Supabase Dashboard
2. Verify new columns exist in resources table
3. Check browser console for errors
4. Review this document for expected behavior

**Branch:** `claude/admin-campaign-ownership-YYy2K`
**Date:** 2026-01-24
