# Resources Admin Quick Start Guide

## Overview
The Resources admin allows you to manage external links to documents, tools, and assets that support your campaigns.

**Important:** Resources are **external links only**. They do not contain authored content - they point to Figma files, Google Docs, PDFs, etc.

---

## Accessing the Admin

1. Navigate to: http://localhost:5173/admin
2. Click the "Resources" tab
3. You'll see a list of all resources with their status and sort order

---

## Adding a New Resource

### Step 1: Click "Add New Resource"

### Step 2: Fill in Required Fields

**Basics Section:**
- **Title*** - Internal name (e.g., "Summer Campaign Visual Assets")
- **Category*** - Select from dropdown:
  - Visual Assets
  - Copy & Messaging
  - Templates
  - Creative
  - Content
  - Product
  - Brand
  - Technical
  - Social Media
- **Description** - Optional brief description shown on resource cards

**Presentation Section:**
- **Thumbnail URL** - Optional image to display on the card (can be URL or asset path)
- **Call-to-Action Label*** - Button text (e.g., "Download Assets", "Open Figma", "View Deck")
- **Call-to-Action URL*** - Where clicking the button takes users (e.g., https://figma.com/...)

**Visibility Section:**
- **Sort Order*** - Number controlling display order (lower = appears first)
- **Active** - Checkbox controlling if resource appears on the front-end

### Step 3: Click "Save Resource"

The resource will now appear in the list and on the front-end (if active).

---

## Editing an Existing Resource

1. Find the resource in the list
2. Click "Edit" button
3. Update fields in the modal
4. Click "Save Resource"

---

## Hiding/Showing Resources

**Quick Toggle:**
- Click "Hide" to remove from front-end (inactive but still in database)
- Click "Show" to make visible again

**Via Edit:**
- Uncheck "Active (visible on page)" to hide
- Check it to show

Hidden resources appear dimmed in the list with "(Hidden)" label.

---

## Deleting a Resource

1. Click "Delete" button on the resource
2. Confirm deletion in the popup
3. Resource is permanently removed

**Warning:** This cannot be undone!

---

## Reordering Resources

Resources appear on the front-end in **sort_order** (low to high).

**To reorder:**
1. Edit the resource
2. Change "Sort Order" field
3. Save

**Pro tip:** Use gaps (10, 20, 30) so you can insert new resources without renumbering everything.

---

## Common Use Cases

### Linking to a Figma File
```
Title: Brand Guidelines 2026
Category: Brand
Description: Complete brand identity system and design tokens
Thumbnail URL: (leave empty or add screenshot)
CTA Label: Open in Figma
CTA URL: https://figma.com/design/abc123...
Sort Order: 10
Active: ✓
```

### Linking to Google Drive
```
Title: Campaign Copy Deck
Category: Copy & Messaging
Description: Approved headlines, body copy, and CTAs for all channels
CTA Label: View Document
CTA URL: https://docs.google.com/presentation/d/...
Sort Order: 20
Active: ✓
```

### Linking to a Download
```
Title: Social Media Templates
Category: Templates
Description: Pre-sized templates for Instagram, Facebook, and Twitter
Thumbnail URL: /src/assets/resources/social-thumb.png
CTA Label: Download ZIP
CTA URL: https://drive.google.com/file/d/.../view
Sort Order: 30
Active: ✓
```

---

## Field Reference

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Title | Text | Yes | - | Internal name, shown in admin and front-end |
| Category | Dropdown | Yes | Visual Assets | Displayed as badge on cards |
| Description | Textarea | No | - | Brief description, shown on cards |
| Thumbnail URL | Text | No | - | Image for the card (URL or path) |
| CTA Label | Text | Yes | View Resource | Button text |
| CTA URL | URL | Yes | - | External link destination |
| Sort Order | Number | Yes | auto | Display order (low → high) |
| Active | Checkbox | Yes | true | Visibility on front-end |

---

## Tips & Best Practices

### Naming Resources
✅ **Do:** Use descriptive titles that explain what the resource contains
- "Summer Campaign Visual Assets"
- "Q1 Social Media Calendar Template"
- "Brand Voice Guidelines 2026"

❌ **Don't:** Use vague or generic titles
- "Resource 1"
- "Assets"
- "Document"

### Organizing by Sort Order
Use a numbering scheme that allows for insertions:
```
10 - Brand Guidelines (always first)
20 - Visual Assets
30 - Copy Templates
40 - Social Media Assets
50 - Technical Specs
```

If you need to add something between 20 and 30, use 25.

### Writing Good Descriptions
Keep descriptions short (1-2 sentences). Examples:

✅ "Pre-approved headlines, taglines, and CTAs for all campaign touchpoints."
✅ "Master Figma file with components, tokens, and page templates."
✅ "Analytics dashboard showing campaign performance across all markets."

❌ "This resource contains various assets and materials that you might need for the campaign activities. Please make sure to review all sections before using."

### CTA Label Best Practices
Be specific about what happens when clicked:

✅ Clear actions:
- "Download Assets" (for ZIP files)
- "Open in Figma" (for Figma links)
- "View Deck" (for presentations)
- "Access Dashboard" (for analytics)

❌ Generic labels:
- "Click Here"
- "Link"
- "Go"

### Using Thumbnails
Thumbnails are optional but recommended for visual resources:

**Good for thumbnails:**
- Visual assets packages
- Templates
- Design systems
- Social media content

**Not needed for thumbnails:**
- Text documents
- Spreadsheets
- Generic links

---

## Troubleshooting

### Resource not showing on front-end
✓ Check "Active" checkbox is enabled
✓ Verify resource was saved (check list view)
✓ Clear browser cache and refresh

### Resource appears in wrong order
✓ Check "Sort Order" values
✓ Lower numbers appear first
✓ Resources with same sort order may appear in creation order

### CTA button not working
✓ Verify "Call-to-Action URL" starts with https://
✓ Test the URL directly in browser
✓ Check for typos in the URL

### Thumbnail not displaying
✓ Verify URL is publicly accessible
✓ Check image file format (PNG, JPG recommended)
✓ Try pasting URL directly in browser to test

---

## Data Structure

For reference, here's what the database stores:

```sql
resources (
  id              BIGINT (auto-generated)
  title           TEXT (required)
  category        TEXT (from dropdown)
  description     TEXT (optional)
  thumbnail_url   TEXT (optional)
  cta_label       TEXT (default: "View Resource")
  cta_url         TEXT (required)
  sort_order      INTEGER (default: 0)
  active          BOOLEAN (default: true)
  campaign_id     TEXT (optional foreign key)
  created_at      TIMESTAMP (auto-generated)
)
```

---

## Migration from Old System

If you have existing resources with complex nested data:

### Old System (Legacy)
- Multiple "hero cards" per resource
- Embedded content (iframes, rich text)
- Internal content authoring

### New System (Canonical)
- One external link per resource
- Simple metadata
- No content authoring

### Migration Steps
1. Open old resource in new admin
2. Extract primary information:
   - Title ← original title
   - CTA URL ← first hero card link OR legacy link field
   - CTA Label ← first hero card button text OR default
   - Thumbnail ← first hero card image OR legacy image
3. Set sort order and active status
4. Save
5. Repeat for all resources

**Note:** Complex nested data will be ignored by new system but remains in database.

---

## FAQ

**Q: Can I add multiple links to one resource?**
A: No. Each resource has one CTA URL. If you need multiple links, create multiple resources.

**Q: Can I upload files directly?**
A: No. Resources link to external files (Figma, Google Drive, etc.). Upload files to your preferred hosting first.

**Q: Can I write content in the resource (like a blog post)?**
A: No. Resources are links only. For content authoring, use an external tool (Google Docs, Notion) and link to it.

**Q: What happens if I set two resources to the same sort order?**
A: They'll appear in database creation order. Best practice: use unique sort orders.

**Q: Can I associate a resource with a specific campaign?**
A: Yes, there's an optional "campaign_id" field in the database. Future admin updates may expose this in the UI.

**Q: What if I need to temporarily hide a resource without deleting it?**
A: Use the "Hide" button or uncheck "Active" when editing. It stays in the database but won't appear on front-end.

**Q: Can I see which resources are hidden?**
A: Yes. Hidden resources appear dimmed in the admin list with "(Hidden)" label.

---

## Support

Need help?
- Check the field has the correct format (URLs should start with https://)
- Verify all required fields (*) are filled
- Look for success/error messages after saving
- Check browser console for JavaScript errors

---

**Admin URL:** http://localhost:5173/admin (Resources tab)
**Front-End:** http://localhost:5173/resources
**Last Updated:** 2026-01-24
