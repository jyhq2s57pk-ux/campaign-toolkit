
import { supabase } from './supabase';

export const api = {
    async getCampaign() {
        if (!supabase) return {
            id: 'campaign-2026',
            name: 'The Magic of Joy Holiday Season',
            subtitle: 'A global celebration bringing joy to travelers worldwide',
            year: '2026',
            scope: 'Global',
            channels: 'Reserve & Collect (Web / APP) Emporium',
            activation_start_date: '2025-10-01',
            activation_end_date: '2025-12-31',
            activation_dates: 'October-December 2025 (Activation date may vary by location)'
        };

        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('id', 'campaign-2026')
            .single();

        if (error) {
            console.error('Error fetching campaign:', error);
            return {
                id: 'campaign-2026',
                name: 'The Magic of Joy Holiday Season',
                subtitle: 'A global celebration bringing joy to travelers worldwide',
                year: '2026',
                scope: 'Global',
                channels: 'Reserve & Collect (Web / APP) Emporium',
                activation_start_date: '2025-10-01',
                activation_end_date: '2025-12-31',
                activation_dates: 'October-December 2025 (Activation date may vary by location)'
            };
        }
        return data;
    },

    async getTouchpoints() {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('touchpoints')
            .select('*')
            .order('sort_order');

        if (error) {
            console.error('Error fetching touchpoints:', error);
            return [];
        }
        return data;
    },

    async getPlatforms() {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('platforms')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching platforms:', error);
            return [];
        }
        return data;
    },

    async getCalendarEvents() {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('calendar_events')
            .select('*');

        if (error) {
            console.error('Error fetching calendar events:', error);
            return [];
        }
        return data;
    },

    async getCalendarTiers() {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('calendar_tiers')
            .select('*');

        if (error) {
            console.error('Error fetching calendar tiers:', error);
            return [];
        }
        return data;
    },

    async getResources() {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('active', true)
            .order('sort_order');

        if (error) {
            console.error('Error fetching resources:', error);
            return [];
        }
        return data;
    },

    async getResourceById(id) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching resource ${id}:`, error);
            return null;
        }
        return data;
    },

    async getWaysOfWorking() {
        if (!supabase) return { process: [], timeline: [] };
        const { data: process, error: pError } = await supabase
            .from('wow_process')
            .select('*')
            .order('sort_order');

        const { data: timeline, error: tError } = await supabase
            .from('wow_timeline')
            .select('*')
            .order('sort_order');

        if (pError || tError) {
            console.error('Error fetching ways of working:', pError || tError);
            return { process: [], timeline: [] };
        }
        return { process, timeline };
    },

    async getOmnichannel() {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('omnichannel')
            .select('*');

        if (error) {
            console.error('Error fetching omnichannel:', error);
            return [];
        }
        return data;
    },

    async getOmnichannelIdeas() {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('omnichannel_ideas')
            .select('*')
            .eq('is_active', true)
            .order('sort_order');

        if (error) {
            console.error('Error fetching omnichannel ideas:', error);
            return [];
        }
        return data;
    },

    async getInsightPage(campaignId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('insight_pages')
            .select('*')
            .eq('campaign_id', campaignId)
            .maybeSingle();

        if (error) {
            console.error(`Error fetching insight page for ${campaignId}:`, error);
            return null;
        }
        return data;
    }
};
