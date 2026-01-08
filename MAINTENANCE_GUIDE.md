# Campaign Toolkit - Content Management System (CMS) Guide

This guide explains how to use the Admin panel to maintain and update content across the Campaign Toolkit site.

## 1. Accessing the Admin Panel

To access the Content Management System, navigate to the `/admin` route in your browser.

*   **URL**: `http://localhost:5173/admin` (or your production domain/admin)

The Admin interface is divided into four main sections using tabs:
1.  **Manage Touchpoints**
2.  **Manage Calendar**
3.  **Journey Pages**
4.  **Resources**

---

## 2. Manage Touchpoints

This section controls the individual touchpoints that appear on the Customer Journey visualization (often the specific nodes or interaction points).

### Adding a Touchpoint
1.  Click the **+ Add Touchpoint** button.
2.  Fill in the details:
    *   **Title**: Name of the touchpoint.
    *   **Platform**: The platform it belongs to (e.g., Web, App).
    *   **Description**: Short summary.
    *   **Tiers**: Check `Premium` or `Executive` if applicable.
    *   **Image**: Upload a screenshot or paste a URL.
3.  **Markers**: Uses the Marker Editor to position the specific dot/marker on the image. Click on the image to place a marker.
4.  Click **Create Touchpoint** to save.

### Bulk Import via CSV
You can upload multiple touchpoints at once using a CSV file.
1.  Click **Upload CSV**.
2.  Select a `.csv` file with headers: `title, slug, platform, description, tier_premium, tier_executive, is_new, is_optional, sort_order`.

---

## 3. Manage Calendar

This section allows you to update the events and campaigns displayed on the global **Calendar** page.

### Important Note
The calendar system currently works by **replacing** the entire calendar dataset when you perform an import. This ensures clean data without duplicates.

### How to Update the Calendar
1.  **Export Current Data**: Click **Export CSV** to download the current calendar as a backup or template.
2.  **Edit CSV**: Open the file in Excel or a text editor. Add or modify rows.
    *   **Required Columns**: `title`, `startDate` (YYYY-MM-DD), `endDate` (YYYY-MM-DD), `tier`.
    *   **Valid Tiers**:
        *   `Overarching Campaign`
        *   `Category-Led`
        *   `Omnichannel Campaigns`
        *   `Digital Campaigns`
        *   `Local Campaigns (supported by Global)`
3.  **Import CSV**: Click **Import CSV** and select your updated file.
    *   *Warning*: This will delete all existing events and replace them with the ones in your file.

### Reset to Search Defaults
If you make a mistake, you can click **Reset to Defaults** to restore the original seeded test data.

---

## 4. Journey Pages (CMS)

This is the primary area for managing the structure of the **Customer Journey** page. It uses a hierarchy: **Pages (Platforms)** contain **Components**.

### Managing Pages (Platforms)
The "Pages" represent the main platform streams (e.g., Web, App, In-Store).
*   **Add Page**: Click **+ Add Page**. Set the Title, Platform Type, and Accent Color.
*   **Edit Page**: Click the Pencil icon on a page header. You can update the **Screenshot Image** here, which creates the visual background for that platform's section.

### Managing Components
Components are the content blocks within a platform.
1.  **Expand a Page**: Click the accordion arrow to open a page.
2.  **Add Component**: Click **+ Add Component**.
    *   **Title & Description**: Detailed text for the component.
    *   **Badges**: Set specific tiers (Standard, Premium, Executive) or flags (New, Optional).
    *   **Marker Positioning**:
        *   The form shows the Page's screenshot.
        *   **Click on the screenshot** to add markers (numbered dots) that indicate where this component "lives" on the interface.
        *   You can drag or remove markers as needed.
3.  **Reorder**: Use the Up/Down arrows in the list to change the display order of components.

---

## 5. Resources

This section manages the content on the **Resources** library page.

### Adding a Resource
1.  Click **+ Add Resource**.
2.  **Details**:
    *   **Title**: Display name.
    *   **Category**: Filters the resource (e.g., Visual Assets, Copy & Messaging).
    *   **Preview Image**: The thumbnail shown on the card.
    *   **External Link**: (Optional) Direct link to Figma or other tools.
3.  **Detail Page Content**:
    *   **Headline**: The main title on the internal detail page.
    *   **Detail Content**: The full body text. You can use simple Markdown here.
    *   **Embed Code**: Optional HTML (like an `<iframe>`) to embed detailed views or prototypes.

### Editing/Deleting
*   Use the **Edit** and **Delete** buttons on the list view to manage existing resources.
