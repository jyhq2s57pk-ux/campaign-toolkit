import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted so variables are available when vi.mock factory runs (hoisted)
const { mockFrom, mockSupabase } = vi.hoisted(() => {
  const mockFrom = vi.fn();
  const mockSupabase = { from: mockFrom };
  return { mockFrom, mockSupabase };
});

vi.mock('./supabase', () => ({
  supabase: mockSupabase,
}));

// Helper to build chainable query mocks
function createQueryMock(resolvedValue) {
  const mock = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(resolvedValue),
    single: vi.fn().mockResolvedValue(resolvedValue),
    maybeSingle: vi.fn().mockResolvedValue(resolvedValue),
  };
  // Make eq/neq also resolve for terminal calls
  mock.eq.mockReturnValue(mock);
  mock.neq.mockReturnValue(mock);
  return mock;
}

import { api } from './api';

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCampaigns', () => {
    it('fetches visible campaigns by default', async () => {
      const campaigns = [{ id: '1', name: 'Test', is_visible: true }];
      const query = createQueryMock({ data: campaigns, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getCampaigns();

      expect(mockFrom).toHaveBeenCalledWith('campaigns');
      expect(query.select).toHaveBeenCalledWith('*');
      expect(query.neq).toHaveBeenCalledWith('is_visible', false);
      expect(result).toEqual(campaigns);
    });

    it('includes hidden campaigns when includeHidden is true', async () => {
      const campaigns = [{ id: '1', is_visible: false }];
      const query = createQueryMock({ data: campaigns, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getCampaigns({ includeHidden: true });

      expect(query.neq).not.toHaveBeenCalled();
      expect(result).toEqual(campaigns);
    });

    it('returns MOCK_CAMPAIGNS on error', async () => {
      const query = createQueryMock({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(query);

      const result = await api.getCampaigns();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('campaign-value-club-2026');
    });
  });

  describe('getCampaignById', () => {
    it('returns null for falsy id', async () => {
      const result = await api.getCampaignById(null);
      expect(result).toBeNull();
    });

    it('returns matching campaign', async () => {
      const campaigns = [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' },
      ];
      const query = createQueryMock({ data: campaigns, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getCampaignById('b');
      expect(result).toEqual({ id: 'b', name: 'B' });
    });

    it('returns null when no match', async () => {
      const query = createQueryMock({ data: [{ id: 'a' }], error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getCampaignById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getTouchpoints', () => {
    it('fetches all touchpoints when no campaignId', async () => {
      const touchpoints = [{ id: '1', title: 'TP1' }];
      const query = createQueryMock({ data: touchpoints, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getTouchpoints();

      expect(mockFrom).toHaveBeenCalledWith('touchpoints');
      expect(result).toEqual(touchpoints);
    });

    it('filters by campaignId when provided', async () => {
      const query = createQueryMock({ data: [], error: null });
      mockFrom.mockReturnValue(query);

      await api.getTouchpoints('camp-1');

      expect(query.eq).toHaveBeenCalledWith('campaign_id', 'camp-1');
    });

    it('returns empty array on error', async () => {
      const query = createQueryMock({ data: null, error: { message: 'fail' } });
      mockFrom.mockReturnValue(query);

      const result = await api.getTouchpoints();
      expect(result).toEqual([]);
    });
  });

  describe('getPlatforms', () => {
    it('fetches platforms ordered by sort_order', async () => {
      const platforms = [{ id: '1', name: 'Web' }];
      const query = createQueryMock({ data: platforms, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getPlatforms();

      expect(mockFrom).toHaveBeenCalledWith('platforms');
      expect(query.order).toHaveBeenCalledWith('sort_order', { ascending: true });
      expect(result).toEqual(platforms);
    });

    it('returns empty array on error', async () => {
      const query = createQueryMock({ data: null, error: { message: 'fail' } });
      mockFrom.mockReturnValue(query);

      const result = await api.getPlatforms();
      expect(result).toEqual([]);
    });
  });

  describe('getCalendarEvents', () => {
    it('returns events for a campaign', async () => {
      const events = [{ id: 1, title: 'Event 1' }];
      const query = createQueryMock({ data: events, error: null });
      // For getCalendarEvents, the chain ends at the mock returned by eq/select
      // since there's no order call. Let's handle this properly.
      const qMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: events, error: null }),
      };
      mockFrom.mockReturnValue(qMock);

      const result = await api.getCalendarEvents('camp-1');
      expect(result).toEqual(events);
    });

    it('returns empty array on error', async () => {
      const qMock = {
        select: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail', code: '500' } }),
      };
      mockFrom.mockReturnValue(qMock);

      const result = await api.getCalendarEvents();
      expect(result).toEqual([]);
    });
  });

  describe('getResources', () => {
    it('fetches active resources', async () => {
      const resources = [{ id: '1', title: 'Asset' }];
      const query = createQueryMock({ data: resources, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getResources();

      expect(query.eq).toHaveBeenCalledWith('active', true);
      expect(result).toEqual(resources);
    });

    it('filters by campaignId', async () => {
      const query = createQueryMock({ data: [], error: null });
      mockFrom.mockReturnValue(query);

      await api.getResources('camp-1');

      expect(query.eq).toHaveBeenCalledWith('campaign_id', 'camp-1');
    });
  });

  describe('getResourceById', () => {
    it('returns resource by id', async () => {
      const resource = { id: '1', title: 'Asset' };
      const query = createQueryMock({ data: resource, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getResourceById('1');
      expect(result).toEqual(resource);
    });

    it('returns null on error', async () => {
      const query = createQueryMock({ data: null, error: { message: 'not found' } });
      mockFrom.mockReturnValue(query);

      const result = await api.getResourceById('bad-id');
      expect(result).toBeNull();
    });
  });

  describe('getWaysOfWorking', () => {
    it('fetches both process and timeline', async () => {
      const processData = [{ id: '1', title: 'Step 1' }];
      const timelineData = [{ id: '2', phase: 'Phase 1' }];

      // First call returns process, second returns timeline
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return createQueryMock({ data: processData, error: null });
        }
        return createQueryMock({ data: timelineData, error: null });
      });

      const result = await api.getWaysOfWorking('camp-1');

      expect(result).toEqual({ process: processData, timeline: timelineData });
    });

    it('returns defaults on error', async () => {
      const query = createQueryMock({ data: null, error: { message: 'fail' } });
      mockFrom.mockReturnValue(query);

      const result = await api.getWaysOfWorking();
      expect(result).toEqual({ process: [], timeline: [] });
    });
  });

  describe('getInsightPage', () => {
    it('returns insight page for campaign', async () => {
      const page = { id: '1', blocks: [] };
      const query = createQueryMock({ data: page, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getInsightPage('camp-1');
      expect(result).toEqual(page);
    });

    it('returns null on error', async () => {
      const query = createQueryMock({ data: null, error: { message: 'fail' } });
      mockFrom.mockReturnValue(query);

      const result = await api.getInsightPage('bad-id');
      expect(result).toBeNull();
    });
  });

  describe('toggleCampaignVisibility', () => {
    it('updates is_visible field', async () => {
      const query = createQueryMock({ error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.toggleCampaignVisibility('camp-1', true);

      expect(mockFrom).toHaveBeenCalledWith('campaigns');
      expect(query.update).toHaveBeenCalledWith({ is_visible: true });
      expect(result).toEqual({ success: true });
    });

    it('returns error on failure', async () => {
      const query = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: { message: 'DB error' } }),
      };
      mockFrom.mockReturnValue(query);

      const result = await api.toggleCampaignVisibility('camp-1', false);
      expect(result).toEqual({ success: false, error: 'DB error' });
    });
  });

  describe('deleteCampaign', () => {
    it('returns error when campaignId is falsy', async () => {
      const result = await api.deleteCampaign(null);
      expect(result).toEqual({ success: false, error: 'No campaign ID provided' });
    });

    it('deletes from related tables then campaigns', async () => {
      const query = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      mockFrom.mockReturnValue(query);

      const result = await api.deleteCampaign('camp-1');

      // Should have called from() for 8 related tables + campaigns table
      expect(mockFrom).toHaveBeenCalledWith('insight_pages');
      expect(mockFrom).toHaveBeenCalledWith('omnichannel_ideas');
      expect(mockFrom).toHaveBeenCalledWith('resources');
      expect(mockFrom).toHaveBeenCalledWith('touchpoints');
      expect(mockFrom).toHaveBeenCalledWith('platforms');
      expect(mockFrom).toHaveBeenCalledWith('wow_process');
      expect(mockFrom).toHaveBeenCalledWith('wow_timeline');
      expect(mockFrom).toHaveBeenCalledWith('calendar_events');
      expect(mockFrom).toHaveBeenCalledWith('campaigns');
      expect(result.success).toBe(true);
    });

    it('ignores 42703 column-not-found errors', async () => {
      const query = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: { code: '42703', message: 'column not found' } }),
      };
      mockFrom.mockReturnValue(query);

      const result = await api.deleteCampaign('camp-1');
      // The campaigns table delete will also get this error, so it will be reported
      // But related table 42703 errors should be skipped
      expect(result.errors.length).toBeLessThanOrEqual(1);
    });

    it('reports errors from table deletion failures', async () => {
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        return {
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue(
            callCount === 1
              ? { error: { code: '500', message: 'server error' } }
              : { error: null }
          ),
        };
      });

      const result = await api.deleteCampaign('camp-1');
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('duplicateCampaignData', () => {
    it('copies data across all tables', async () => {
      // Mock: each table returns one row to duplicate
      mockFrom.mockImplementation((table) => {
        const selectQuery = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [{ id: '1', created_at: '2024-01-01', campaign_id: 'src', title: 'Test' }],
          }),
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
        // For insert calls
        selectQuery.insert = vi.fn().mockResolvedValue({ error: null });
        return selectQuery;
      });

      const result = await api.duplicateCampaignData('src', 'dest');

      expect(result.success).toBe(true);
      expect(result.copied.length).toBeGreaterThan(0);
      expect(result.errors).toEqual([]);
    });

    it('reports partial failures', async () => {
      let insertCallCount = 0;
      mockFrom.mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [{ id: '1', created_at: '2024-01-01', campaign_id: 'src', title: 'Test' }],
        }),
        insert: vi.fn().mockImplementation(() => {
          insertCallCount++;
          return Promise.resolve(
            insertCallCount === 1
              ? { error: { message: 'insert failed' } }
              : { error: null }
          );
        }),
      }));

      const result = await api.duplicateCampaignData('src', 'dest');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.copied.length).toBeGreaterThan(0);
    });
  });

  describe('getOmnichannelIdeas', () => {
    it('returns mock ideas when supabase returns empty data', async () => {
      // First call with campaignId returns empty, second without returns empty too
      const query = createQueryMock({ data: [], error: null });
      mockFrom.mockReturnValue(query);

      // When both calls return empty, it falls through to mock data
      // The function calls itself recursively without campaignId,
      // then if still empty, returns mock data
      const result = await api.getOmnichannelIdeas('nonexistent');

      // Should return mock data as fallback
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('idea-treasure-hunt');
    });

    it('returns DB data when available', async () => {
      const ideas = [{ id: '1', title: 'Test Idea', is_active: true }];
      const query = createQueryMock({ data: ideas, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getOmnichannelIdeas();
      expect(result).toEqual(ideas);
    });
  });

  describe('getCampaign', () => {
    it('returns the first campaign', async () => {
      const campaigns = [{ id: 'a', name: 'First' }, { id: 'b', name: 'Second' }];
      const query = createQueryMock({ data: campaigns, error: null });
      mockFrom.mockReturnValue(query);

      const result = await api.getCampaign();
      expect(result).toEqual({ id: 'a', name: 'First' });
    });
  });
});
