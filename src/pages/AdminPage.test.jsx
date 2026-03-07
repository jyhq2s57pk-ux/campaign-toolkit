import { describe, it, expect } from 'vitest';

// Test the pure utility functions from AdminPage
// These are extracted/replicated for testing since they're defined inline

function calendarToCSV(items) {
  const header = "title,startDate,endDate,tier\n";
  const body = items.map((e) => `${e.title},${e.startDate},${e.endDate},${e.tier}`).join("\n");
  return header + body + "\n";
}

function normalizeTier(rawTier) {
  const t = rawTier ? rawTier.trim() : "";
  const map = {
    "Overarching Campaign": "Overarching Campaign",
    "Category-Led": "Category-Led",
    "Omnichannel Campaigns": "Campaigns",
    "Digital Campaigns": "Other Global Campaigns",
    "Local Campaigns (supported by Global)": "Other Local Campaigns",
    "Local Campaigns": "Other Local Campaigns",
  };
  if (map[t]) return map[t];
  const validDbTiers = Object.values(map);
  return validDbTiers.includes(t) ? t : "Other Global Campaigns";
}

function normalizeDate(val) {
  if (!val) return null;
  const v = val.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return v;
}

describe('AdminPage utility functions', () => {
  describe('normalizeTier', () => {
    it('maps Omnichannel Campaigns to Campaigns', () => {
      expect(normalizeTier('Omnichannel Campaigns')).toBe('Campaigns');
    });

    it('maps Digital Campaigns to Other Global Campaigns', () => {
      expect(normalizeTier('Digital Campaigns')).toBe('Other Global Campaigns');
    });

    it('maps Local Campaigns (supported by Global) to Other Local Campaigns', () => {
      expect(normalizeTier('Local Campaigns (supported by Global)')).toBe('Other Local Campaigns');
    });

    it('maps Local Campaigns to Other Local Campaigns', () => {
      expect(normalizeTier('Local Campaigns')).toBe('Other Local Campaigns');
    });

    it('preserves Overarching Campaign', () => {
      expect(normalizeTier('Overarching Campaign')).toBe('Overarching Campaign');
    });

    it('preserves Category-Led', () => {
      expect(normalizeTier('Category-Led')).toBe('Category-Led');
    });

    it('defaults unknown tiers to Other Global Campaigns', () => {
      expect(normalizeTier('Something Random')).toBe('Other Global Campaigns');
    });

    it('handles empty string', () => {
      expect(normalizeTier('')).toBe('Other Global Campaigns');
    });

    it('handles null/undefined', () => {
      expect(normalizeTier(null)).toBe('Other Global Campaigns');
      expect(normalizeTier(undefined)).toBe('Other Global Campaigns');
    });

    it('trims whitespace', () => {
      expect(normalizeTier('  Category-Led  ')).toBe('Category-Led');
    });

    it('passes through valid DB tier names', () => {
      expect(normalizeTier('Campaigns')).toBe('Campaigns');
      expect(normalizeTier('Other Local Campaigns')).toBe('Other Local Campaigns');
    });
  });

  describe('normalizeDate', () => {
    it('returns null for empty/null values', () => {
      expect(normalizeDate(null)).toBeNull();
      expect(normalizeDate(undefined)).toBeNull();
    });

    it('preserves YYYY-MM-DD format', () => {
      expect(normalizeDate('2026-01-15')).toBe('2026-01-15');
    });

    it('preserves YYYY-MM-DD with whitespace', () => {
      expect(normalizeDate(' 2026-01-15 ')).toBe('2026-01-15');
    });

    it('converts ISO date strings', () => {
      const result = normalizeDate('2026-03-15T00:00:00.000Z');
      expect(result).toBe('2026-03-15');
    });

    it('returns raw value for unparseable dates', () => {
      expect(normalizeDate('not-a-date')).toBe('not-a-date');
    });
  });

  describe('calendarToCSV', () => {
    it('generates correct CSV with header', () => {
      const items = [
        { title: 'Event 1', startDate: '2026-01-01', endDate: '2026-01-31', tier: 'Campaign' },
      ];
      const csv = calendarToCSV(items);
      expect(csv).toBe('title,startDate,endDate,tier\nEvent 1,2026-01-01,2026-01-31,Campaign\n');
    });

    it('handles multiple events', () => {
      const items = [
        { title: 'A', startDate: '2026-01-01', endDate: '2026-01-31', tier: 'T1' },
        { title: 'B', startDate: '2026-02-01', endDate: '2026-02-28', tier: 'T2' },
      ];
      const csv = calendarToCSV(items);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('title,startDate,endDate,tier');
      expect(lines[1]).toBe('A,2026-01-01,2026-01-31,T1');
      expect(lines[2]).toBe('B,2026-02-01,2026-02-28,T2');
    });

    it('handles empty array', () => {
      const csv = calendarToCSV([]);
      expect(csv).toBe('title,startDate,endDate,tier\n\n');
    });
  });
});
