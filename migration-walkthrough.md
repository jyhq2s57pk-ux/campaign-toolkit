# Migration Walkthrough: Container & Card Styles

This document expands on the initial migration plan by focusing on the specific "Container" and "Card" styles identified across the application on pages such as Resources, Calendar, Admin, Ways of Working, and Omnichannel.

## 1. Audit Findings

### A. Resource Cards (`ResourcesPage.css`)
*   **Current State**:
    *   Top section (`.asset-preview`) has `height: 220px`, `background: var(--surface-card)`.
    *   Bottom section (`.asset-info`) has padding `24px`.
    *   Overall radius: `24px` (`border-radius: 24px`).
*   **Target State**:
    *   Align with `card-elevated` or `card-default` token logic.
    *   Radius `24px` maps effectively to `--radius-lg` (or `xl` depending on scale).
    *   Ensure use of tokens like `--surface-card` instead of any hardcoded values (code already looks partially tokenized, good job!).

### B. Calendar Grid (`CalendarPage.css`)
*   **Current State**:
    *   Container uses `background: var(--surface-glass)`.
    *   Cells use `background-color: rgba(255, 255, 255, 0.01)`.
    *   Headers use `background-color: rgba(255, 255, 255, 0.02)`.
*   **Target State**:
    *   Retain the "Glass" aesthetic but standardize opacity tokens if possible.
    *   Currently, the implementation uses ad-hoc alpha values (`0.01`, `0.02`). Ideally, define a `--surface-glass-faint` or similar token if these micro-opacities are critical for depth.

### C. Admin / Accordion Lists (`CustomerJourneyPage.css`)
*   **Current State**:
    *   Accordion Items: `background: var(--neutral-800)` where `neutral-800` is `#262626`.
    *   Header Hover: `background: rgba(255, 255, 255, 0.05)`.
    *   Image Frame: `background: var(--neutral-100)` (Light mode artifact? `#F5F5F5`). This seems like a potential visual bug or intentional high contrast area.
*   **Target State**:
    *   Replace `var(--neutral-800)` / `#262626` with `--surface-card` (`#161616`) or `--surface-elevated` (`#111111`).
    *   Standardize the hover state to use `--surface-glass` or similar.

### D. Ways of Working Steps (`WaysOfWorkingPage.css`)
*   **Current State**:
    *   `.workflow-step-card`: Large card with `border-radius: 32px` and `padding: 40px`.
    *   *Missing Background*: The CSS (`workflow-step-card`) actually *lacks* a background color definition in the shared snippet, implying it might be transparent or inherited, or relying on a parent. *Wait, checking snippet...*
    *   *Correction*: The snippet shows `.workflow-step-card` has NO background color set. This might mean it visually blends into the black background, or it relies on a class not seen. If it needs to be a visible card, it should use `--surface-card`.

### E. Omnichannel Cards (`OmnichannelPage.css`)
*   **Current State**:
    *   `.strategy-card`: `padding: 32px`, `border-radius: 24px`.
    *   Backgrounds/Borders: Relies on `.card-blue`, `.card-green` etc. which set a `border-left: 4px solid ...`.
    *   *Note*: The code mentions "Premium Overhaul" and uses some hardcoded gradients/colors like `black` (`#000`).
*   **Target State**:
    *   Ensure base background is `--surface-card` or `--surface-elevated` instead of raw transparency or hardcoded black.
    *   Map the specific "Color Borders" to the accent tokens (`--accent-blue`, `--accent-green`, etc.), which appears to be partially done.

## 2. Updated Refactoring Plan

| Component | Current Implementation | Refactor Action |
| :--- | :--- | :--- |
| **Resource Card** | partial tokens | Verify `--surface-card` is `#161616`. Ensure bottom section matches. |
| **Calendar** | `rgba(255,255,255,0.01)` | Keep as-is (Glass style) but ensure borders use `--border-glass`. |
| **Admin Accordion** | `#262626` (via neutral-800) | Change to `var(--surface-elevated)` (#111). |
| **Ways of Working** | No bg set | Add `background: var(--surface-card)` if distinct card desired. |
| **Omnichannel** | Hardcoded `#000` | Change page bg to `var(--surface-default)`. Card bg to `var(--surface-card)`. |

## 3. Visual Validation
Use the "side-by-side" approach in the Style Gallery to test one of these complex cards (e.g., the "Omnichannel" or "Ways of Working" card) before rolling out to the full page.
