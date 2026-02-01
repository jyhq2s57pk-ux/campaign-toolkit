-- Migration: Seed data for Ways of Working
-- Phase 1 FR-03: Ways of Working Admin

-- Seed wow_process table (3-step workflow)
INSERT INTO wow_process (title, description, sort_order) VALUES
(
  '1. Global',
  E'**EPIC Ticket in JIRA** – Global Digital Team to open an EPIC ticket in JIRA with everything ready to implement as it is in this toolkit.\n\n**One ticket by main region** – Global Digital team to open a child ticket by each region, including an excel file with a detailed implementation guide including copies, translations, etc. <span class="inline-new-badge">NEW</span>',
  1
),
(
  '2. Regions',
  E'**Review & Confirm** – Validate details (location, dates, activation level).\n\n<div class="highlight-text">**Approve Assets** – Check copy & translations. Defaults apply if unchanged.</div>\n\n**Support** – Open DCCR ticket for design/translation help.\n\n**Handover** – Reassign to **Surekha Matte** (Content Team).',
  2
),
(
  '3. Content Implementation',
  'Once approved and assigned, the Content Team takes over to make it real! Final assets are deployed across all channels.',
  3
)
ON CONFLICT DO NOTHING;

-- Seed wow_timeline table (best practice tips)
INSERT INTO wow_timeline (phase, date_text, sort_order) VALUES
('Always define activation level first', '', 1),
('Include start and end dates', '', 2),
('Attach final visuals and translations', '', 3),
('Avoid changes once tickets are approved', '', 4)
ON CONFLICT DO NOTHING;

-- Note: The wow_timeline table is being used for best practice tips
-- rather than timeline phases. This matches the current usage in the codebase.
