
import { supabase } from './supabase';

export const api = {
    async getCampaign() {
        // Fetches the first campaign found. In a real app, you might want a specific ID.
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching campaign:', error);
            return null;
        }
        return data;
    },

    async getTouchpoints() {
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
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('title');

        if (error) {
            console.error('Error fetching resources:', error);
            return [];
        }
        return data;
    },

    async getResourceById(id) {
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
        const { data, error } = await supabase
            .from('omnichannel')
            .select('*');

        if (error) {
            console.error('Error fetching omnichannel:', error);
            return [];
        }
        return data;
    }
};
