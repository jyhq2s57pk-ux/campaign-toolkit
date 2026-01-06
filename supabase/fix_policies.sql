
-- Calendar Tiers
CREATE POLICY "Public update access for calendar_tiers" ON calendar_tiers FOR UPDATE USING (true);
CREATE POLICY "Public delete access for calendar_tiers" ON calendar_tiers FOR DELETE USING (true);

-- Calendar Events
CREATE POLICY "Public update access for calendar_events" ON calendar_events FOR UPDATE USING (true);
CREATE POLICY "Public delete access for calendar_events" ON calendar_events FOR DELETE USING (true);

-- Resources
CREATE POLICY "Public update access for resources" ON resources FOR UPDATE USING (true);
CREATE POLICY "Public delete access for resources" ON resources FOR DELETE USING (true);

-- Ways of Working
CREATE POLICY "Public update access for wow_process" ON wow_process FOR UPDATE USING (true);
CREATE POLICY "Public delete access for wow_process" ON wow_process FOR DELETE USING (true);

CREATE POLICY "Public update access for wow_timeline" ON wow_timeline FOR UPDATE USING (true);
CREATE POLICY "Public delete access for wow_timeline" ON wow_timeline FOR DELETE USING (true);

-- Omnichannel (Critical for the current fix)
CREATE POLICY "Public update access for omnichannel" ON omnichannel FOR UPDATE USING (true);
CREATE POLICY "Public delete access for omnichannel" ON omnichannel FOR DELETE USING (true);
