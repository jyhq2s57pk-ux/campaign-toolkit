
import { supabase } from './supabase';

// Shared mock data — single source of truth for fallbacks
const MOCK_CAMPAIGNS = [
    {
        id: 'campaign-value-club-2026',
        name: 'Value Club',
        subtitle: 'Ecommerce Trading Toolkits',
        year: '2026',
        scope: 'Global',
        channels: 'Reserve & Collect (Web / APP) Emporium',
        activation_start_date: '2026-01-01',
        activation_end_date: '2026-03-31',
        activation_dates: 'Jan 1st to March 31st 2026',
        hero_image_url: '/campaigns/value_club_hero.png',
        primary_color: '#E94E55',
        features: [
            { label: 'Multi-Category' },
            { label: 'Multi-level activation', values: ['Premium: Full visibility', 'Executive: Medium visibility'] }
        ]
    },
    {
        id: 'campaign-summer-2026',
        name: 'Summer Vibes 2026',
        subtitle: 'Experience the warmth of summer with exclusive travel retail offers',
        year: '2026',
        scope: 'Global',
        channels: 'Airports, Cruise Lines, Borders',
        activation_start_date: '2026-06-01',
        activation_end_date: '2026-08-31',
        activation_dates: 'June-August 2026',
        hero_image_url: 'https://placehold.co/600x400/orange/white?text=Summer+Vibes'
    }
];

export const api = {
    async getCampaign() {
        // ... existing getCampaign implementation ...
        return this.getCampaigns().then(campaigns => campaigns[0]);
    },

    async getCampaigns({ includeHidden = false } = {}) {
        if (!supabase) return MOCK_CAMPAIGNS;

        let query = supabase
            .from('campaigns')
            .select('*');

        if (!includeHidden) {
            query = query.neq('is_visible', false);
        }

        const { data, error } = await query
            .order('activation_start_date', { ascending: false });

        if (error) {
            console.error('Error fetching campaigns:', error);
            return MOCK_CAMPAIGNS;
        }
        return data;
    },

    async toggleCampaignVisibility(campaignId, isVisible) {
        if (!supabase) return { success: false, error: 'No database connection' };

        const { error } = await supabase
            .from('campaigns')
            .update({ is_visible: isVisible })
            .eq('id', campaignId);

        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true };
    },

    async getCampaignById(id) {
        if (!id) return null;
        const campaigns = await this.getCampaigns({ includeHidden: true });
        return campaigns.find(c => c.id === id) || null;
    },

    async getTouchpoints(campaignId) {
        if (!supabase) return [];
        let query = supabase
            .from('touchpoints')
            .select('*');

        if (campaignId) {
            query = query.eq('campaign_id', campaignId);
        }

        const { data, error } = await query.order('sort_order');

        if (error) {
            console.error('Error fetching touchpoints:', error);
            return [];
        }
        return data;
    },

    async getPlatforms(campaignId) {
        if (!supabase) return [];
        let query = supabase
            .from('platforms')
            .select('*');

        if (campaignId) {
            query = query.eq('campaign_id', campaignId);
        }

        const { data, error } = await query.order('sort_order', { ascending: true });

        if (error) {
            console.error('Error fetching platforms:', error);
            return [];
        }
        return data;
    },

    async getCalendarEvents(campaignId) {
        if (!supabase) return [];
        let query = supabase.from('calendar_events').select('*');

        if (campaignId) {
            query = query.eq('campaign_id', campaignId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching calendar events:', error);
            // Retry without filter if campaign_id column doesn't exist
            if (campaignId && error.code === '42703') {
                return this.getCalendarEvents();
            }
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

    async getResources(campaignId) {
        if (!supabase) return [];
        let query = supabase
            .from('resources')
            .select('*')
            .eq('active', true);

        if (campaignId) {
            query = query.eq('campaign_id', campaignId);
        }

        const { data, error } = await query.order('sort_order');

        if (error) {
            console.error('Error fetching resources:', error);
            if (campaignId && error.code === '42703') {
                return this.getResources();
            }
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

    async getWaysOfWorking(campaignId) {
        if (!supabase) return { process: [], timeline: [] };

        let processQuery = supabase
            .from('wow_process')
            .select('*');
        if (campaignId) {
            processQuery = processQuery.eq('campaign_id', campaignId);
        }
        const { data: process, error: pError } = await processQuery.order('sort_order');

        let timelineQuery = supabase
            .from('wow_timeline')
            .select('*');
        if (campaignId) {
            timelineQuery = timelineQuery.eq('campaign_id', campaignId);
        }
        const { data: timeline, error: tError } = await timelineQuery.order('sort_order');

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

    async getOmnichannelIdeas(campaignId) {
        // Try Supabase first, fall back to mock data
        if (supabase) {
            let query = supabase
                .from('omnichannel_ideas')
                .select('*')
                .eq('is_active', true);

            if (campaignId) {
                query = query.eq('campaign_id', campaignId);
            }

            const { data, error } = await query.order('sort_order');

            if (!error && data && data.length > 0) return data;
            // If filtering by campaign returned no results, try without filter
            if (!error && campaignId && (!data || data.length === 0)) {
                return this.getOmnichannelIdeas();
            }
            if (error) console.error('Error fetching omnichannel ideas:', error);
        }

        // Mock data fallback
        const mockIdeas = [
            {
                id: 'idea-treasure-hunt',
                title: 'Treasure Hunt',
                headline: 'Treasure Hunt: Turn Every Store Visit into a Brand-led AR Adventure',
                sub_headline: 'Gamify the travel experience.',
                description: 'Coordinate with your Commercial and Entertainment teams to activate this in your stores. Create an immersive journey where customers grab a clue card and start their hunt. By scanning hidden posters using the Club Avolta app, they watch characters come to life with stunning AR animations. Finding number clues allows them to unlock hidden treasures, driving engagement and increasing dwell time across all categories.',
                image_url: '/src/assets/omni/gen/treasure_hunt_main.png',
                modal_images: [
                    '/src/assets/omni/gen/treasure_hunt_main.png',
                    '/src/assets/omni/gen/treasure_hunt_qrcode.png',
                    '/src/assets/omni/gen/treasure_hunt_ar.png'
                ],
                channels: ['App', 'Web', 'In-store'],
                how_it_works_title: 'How it works',
                how_it_works_steps: [
                    'Customers grab a clue card and start their hunt.',
                    'Scan hidden posters using the Club Avolta app.',
                    'Watch them come to life with stunning AR animations.',
                    'Find number clues and unlock hidden treasures.'
                ],
                sort_order: 0,
                is_active: true
            },
            {
                id: 'idea-1',
                title: 'The Magic Balloon',
                headline: 'Capture the Holiday Magic: An AR Scavenger Hunt Tailored for Travelers',
                sub_headline: 'Whimsical engagement for the whole family.',
                description: 'Transform the airport wait into a magical adventure. Engage families and travelers with a whimsical Augmented Reality experience where passengers scan QR codes throughout the store to find floating magic balloons. Each balloon reveals exclusive offers, digital collectibles, or instant prizes, driving footfall to specific store sections.',
                image_url: '/src/assets/omni/gen/balloon.png',
                channels: ['In-store', 'App'],
                how_it_works_title: 'The Journey',
                how_it_works_steps: [
                    'Travelers spot "Magic Balloon" markers at the store entrance.',
                    'They scan the QR code to launch the web-based AR camera.',
                    'As they explore, they collect virtual balloons floating in aisles.',
                    'Collecting all 5 unlocks a "Holiday Treat" voucher redeemable at checkout.'
                ],
                sort_order: 1,
                is_active: true
            },
            {
                id: 'idea-2',
                title: 'Virtual Try-On',
                headline: 'Reflect Your Holiday Style: Instant Beauty and Fashion Simulation',
                sub_headline: 'No mess, just magic. Zero-contact trial.',
                description: 'Revolutionize the beauty counter experience. Let customers try on the latest holiday makeup collections, sunglasses, or accessories instantly using our magic mirror displays. This zero-touch solution removes hygiene concerns and speeds up the decision-making process, allowing travelers to experiment with bold holiday looks in seconds.',
                image_url: '/src/assets/omni/gen/magic.png',
                channels: ['In-store', 'Web', 'Social'],
                how_it_works_title: 'Experience Flow',
                how_it_works_steps: [
                    'Customer approaches the "Magic Mirror" display or scans a QR code.',
                    'Selects a "Holiday Look" or specific product from the menu.',
                    'The AI instantly applies the makeup or accessory to their live video feed.',
                    'One-tap "Add to Cart" or "Share to Social" drives conversion.'
                ],
                sort_order: 2,
                is_active: true
            },
            {
                id: 'idea-3',
                title: 'Festive Tasting',
                headline: 'Savor the Season: Exclusive Tasting Events for High-Value Travelers',
                sub_headline: 'A sensory journey that drives conversion.',
                description: 'Elevate the retail experience with exclusivity. Invite Red and Platinum loyalty members to exclusive tasting sessions featuring limited-edition holiday spirits, artisanal chocolates, and festive treats. Hosted by brand ambassadors, these intimate events create a deeper connection with the products and significantly boost basket value.',
                image_url: '/src/assets/omni/gen/tasting.png',
                channels: ['In-store', 'Loyalty'],
                how_it_works_title: 'Event Mechanics',
                how_it_works_steps: [
                    'Eligible members receive a push notification invite via the app.',
                    'They reserve a 15-minute slot during their dwell time.',
                    'Upon arrival, they present their digital loyalty card.',
                    'They enjoy a guided tasting flight and receive a personalized gift with purchase.'
                ],
                sort_order: 3,
                is_active: true
            },
            {
                id: 'idea-4',
                title: 'Holiday Origami',
                headline: 'Craft Your Joy: Hands-on Personalization and Gifting Stations',
                sub_headline: 'A moment of mindfulness amidst the rush.',
                description: 'Offer travelers a peaceful pause and a unique gifting touch. At our "Craft Your Joy" stations, customers can learn to fold intricate holiday shapes using branded paper or have their purchases wrapped in custom origami-style packaging. This hands-on experience turns a simple transaction into a memorable craft workshop.',
                image_url: '/src/assets/omni/gen/origami.png',
                channels: ['In-store', 'Social'],
                how_it_works_title: 'Activity Steps',
                how_it_works_steps: [
                    'Shoppers visit the "Craft Station" after placing a purchase.',
                    'They choose from 3 festive designs (Star, Crane, Tree).',
                    'A digital screen or staff member guides them through the folding steps.',
                    'The finished origami serves as a unique gift topper or ornament.'
                ],
                sort_order: 4,
                is_active: true
            },
            {
                id: 'idea-5',
                title: 'Beauty AI',
                headline: 'Personalized Glow: AI-Driven Skincare and Makeup Recommendations',
                sub_headline: 'Science meets seasonality.',
                description: 'Take the guesswork out of holiday gifting and self-care. A quick facial scan analyzes skin needs—hydration, brightness, texture—and recommends the perfect "Holiday Survival Kit" of products. Personalized, scientific, and highly converting, this tool positions Avolta as a trusted beauty advisor.',
                image_url: '/src/assets/omni/gen/face.png',
                channels: ['App', 'In-store'],
                how_it_works_title: 'How it Works',
                how_it_works_steps: [
                    'User opens the "Beauty Consultant" feature in the app or kiosk.',
                    'They snap a selfie for analysis.',
                    'The AI generates a skin profile and recommends 3 key products.',
                    'User can "Click and Collect" to pick up the bundle at the gate.'
                ],
                sort_order: 5,
                is_active: true
            },
            {
                id: 'idea-6',
                title: 'Global Greetings',
                headline: 'Share the Joy: Digital and Physical Postcards from the World',
                sub_headline: 'Connecting travelers with loved ones.',
                description: 'Revive the romance of travel mail. Travelers can send a physical or digital postcard to loved ones directly from the airport. Using our digital kiosks, they can upload a travel selfie, add a custom holiday border, and type a message. We handle the printing and postage, or send it instantly as an animated e-card.',
                image_url: '/src/assets/omni/gen/postcard.png',
                channels: ['Web', 'Email', 'In-store'],
                how_it_works_title: 'Sending Process',
                how_it_works_steps: [
                    'Select a "Holiday Destination" frame on the kiosk.',
                    'Upload a photo or take one at the photo booth.',
                    'Write a personal message and enter the recipient address.',
                    'Avolta prints, stamps, and mails the card globally.'
                ],
                sort_order: 6,
                is_active: true
            },
            {
                id: 'idea-7',
                title: 'Social Buzz',
                headline: 'The Global Celebration: Live Feed of Holiday Moments',
                sub_headline: 'Amplifying the joy beyond the terminal.',
                description: 'Turn the store into a content studio. A large "Social Wall" displays a live feed of travelers sharing their holiday journeys and Avolta experiences. By using the branded campaign hashtag, travelers can see their photos appear on the big screen, creating immediate fame and encouraging widespread social sharing.',
                image_url: '/src/assets/omni/gen/buzz.png',
                channels: ['Social', 'Web'],
                how_it_works_title: 'Participation',
                how_it_works_steps: [
                    'Travelers take a photo with our festive installations.',
                    'They post to Instagram or TikTok with #AvoltaJoy.',
                    'Ideally, they tag their location.',
                    'The content is moderated and displayed on the in-store digital wall.'
                ],
                sort_order: 7,
                is_active: true
            },
            {
                id: 'idea-8',
                title: 'Tiered Rewards',
                headline: 'Unlock the Season: Gamified Loyalty Perks and Challenges',
                sub_headline: 'More than just points. It\'s an adventure.',
                description: 'Turn shopping into a game. Launch a "Holiday Mission" for loyalty members where completing specific actions—like improved dwell time, cross-category purchasing, or social sharing—unlocks tiered rewards. This gamification drives behavior change and encourages exploration of the entire commercial offer.',
                image_url: '/src/assets/omni/gen/balance.png',
                channels: ['Loyalty', 'App'],
                how_it_works_title: 'Mission Control',
                how_it_works_steps: [
                    'Members accept the "Holiday Challenge" in the app.',
                    'They track progress bars for different missions (e.g., "The Taster", "The Gifter").',
                    'Completing a mission instantly unlocks a reward (e.g., Lounge Access, 2x Points).',
                    'A leaderboard displays top travelers for competitive fun.'
                ],
                sort_order: 8,
                is_active: true
            }
        ];

        return mockIdeas;
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
    },

    async duplicateCampaignData(sourceCampaignId, newCampaignId) {
        if (!supabase) return { success: false, error: 'No database connection' };

        const results = { copied: [], errors: [] };

        // 1. Duplicate insight_pages
        const { data: insightPages } = await supabase
            .from('insight_pages')
            .select('*')
            .eq('campaign_id', sourceCampaignId);

        if (insightPages && insightPages.length > 0) {
            for (const page of insightPages) {
                const { id, created_at, updated_at, ...rest } = page;
                const { error } = await supabase
                    .from('insight_pages')
                    .insert({ ...rest, campaign_id: newCampaignId });
                if (error) results.errors.push(`insight_pages: ${error.message}`);
                else results.copied.push('insight_pages');
            }
        }

        // 2. Duplicate omnichannel_ideas
        const { data: ideas } = await supabase
            .from('omnichannel_ideas')
            .select('*')
            .eq('campaign_id', sourceCampaignId);

        if (ideas && ideas.length > 0) {
            for (const idea of ideas) {
                const { id, created_at, ...rest } = idea;
                const { error } = await supabase
                    .from('omnichannel_ideas')
                    .insert({ ...rest, campaign_id: newCampaignId });
                if (error) results.errors.push(`omnichannel_ideas: ${error.message}`);
                else results.copied.push('omnichannel_ideas');
            }
        }

        // 3. Duplicate resources
        const { data: resources } = await supabase
            .from('resources')
            .select('*')
            .eq('campaign_id', sourceCampaignId);

        if (resources && resources.length > 0) {
            for (const resource of resources) {
                const { id, created_at, ...rest } = resource;
                const { error } = await supabase
                    .from('resources')
                    .insert({ ...rest, campaign_id: newCampaignId });
                if (error) results.errors.push(`resources: ${error.message}`);
                else results.copied.push('resources');
            }
        }

        // 4. Duplicate touchpoints
        const { data: touchpoints } = await supabase
            .from('touchpoints')
            .select('*')
            .eq('campaign_id', sourceCampaignId);

        if (touchpoints && touchpoints.length > 0) {
            for (const tp of touchpoints) {
                const { id, created_at, updated_at, ...rest } = tp;
                const { error } = await supabase
                    .from('touchpoints')
                    .insert({ ...rest, campaign_id: newCampaignId });
                if (error) results.errors.push(`touchpoints: ${error.message}`);
                else results.copied.push('touchpoints');
            }
        }

        // 5. Duplicate wow_process (Ways of Working steps)
        const { data: wowProcess } = await supabase
            .from('wow_process')
            .select('*')
            .eq('campaign_id', sourceCampaignId);

        if (wowProcess && wowProcess.length > 0) {
            for (const step of wowProcess) {
                const { id, created_at, ...rest } = step;
                const { error } = await supabase
                    .from('wow_process')
                    .insert({ ...rest, campaign_id: newCampaignId });
                if (error) results.errors.push(`wow_process: ${error.message}`);
                else results.copied.push('wow_process');
            }
        }

        // 6. Duplicate wow_timeline (Best Practice Tips)
        const { data: wowTimeline } = await supabase
            .from('wow_timeline')
            .select('*')
            .eq('campaign_id', sourceCampaignId);

        if (wowTimeline && wowTimeline.length > 0) {
            for (const tip of wowTimeline) {
                const { id, created_at, ...rest } = tip;
                const { error } = await supabase
                    .from('wow_timeline')
                    .insert({ ...rest, campaign_id: newCampaignId });
                if (error) results.errors.push(`wow_timeline: ${error.message}`);
                else results.copied.push('wow_timeline');
            }
        }

        // 7. Duplicate platforms (pages in Customer Touchpoints)
        const { data: platforms } = await supabase
            .from('platforms')
            .select('*')
            .eq('campaign_id', sourceCampaignId);

        if (platforms && platforms.length > 0) {
            for (const platform of platforms) {
                const { id, created_at, ...rest } = platform;
                const { error } = await supabase
                    .from('platforms')
                    .insert({ ...rest, campaign_id: newCampaignId });
                if (error) results.errors.push(`platforms: ${error.message}`);
                else results.copied.push('platforms');
            }
        }

        return {
            success: results.errors.length === 0,
            copied: results.copied,
            errors: results.errors
        };
    },

    async deleteCampaign(campaignId) {
        if (!supabase) return { success: false, error: 'No database connection' };
        if (!campaignId) return { success: false, error: 'No campaign ID provided' };

        const errors = [];

        // Delete all related data first (respect foreign key order)
        const relatedTables = [
            'insight_pages',
            'omnichannel_ideas',
            'resources',
            'touchpoints',
            'platforms',
            'wow_process',
            'wow_timeline',
            'calendar_events',
        ];

        for (const table of relatedTables) {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('campaign_id', campaignId);

            if (error && error.code !== '42703') {
                // 42703 = column doesn't exist, safe to skip
                errors.push(`${table}: ${error.message}`);
            }
        }

        // Finally delete the campaign itself
        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', campaignId);

        if (error) {
            errors.push(`campaigns: ${error.message}`);
        }

        return {
            success: errors.length === 0,
            errors
        };
    }
};
