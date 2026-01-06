
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

// Simple .env parser
function loadEnv() {
    try {
        const envPath = path.join(projectRoot, '.env')
        if (fs.existsSync(envPath)) {
            const envFile = fs.readFileSync(envPath, 'utf8')
            const env = {}
            envFile.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/)
                if (match) {
                    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
                }
            })
            return env
        }
        return process.env
    } catch (e) {
        console.warn("Could not read .env file", e)
        return process.env
    }
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const dataPath = path.join(projectRoot, 'src', 'data', 'sample-data.json')
const rawData = fs.readFileSync(dataPath, 'utf8')
const data = JSON.parse(rawData)

async function seed() {
    console.log('Starting seed process...')

    // 1. Campaigns
    if (data.campaign) {
        console.log('Seeding campaigns...')
        const { error } = await supabase
            .from('campaigns')
            .upsert({
                id: data.campaign.id,
                name: data.campaign.name,
                subtitle: data.campaign.subtitle,
                year: data.campaign.year,
                scope: data.campaign.scope,
                activation_dates: data.campaign.activationDates,
                overview: data.campaign.overview
            })
        if (error) console.error('Error seeding campaigns:', error)
    }

    // 2. Platforms
    if (data.platforms) {
        console.log('Seeding platforms...')
        // Assuming name is unique or we just append? The schema allows dups but usually we want to avoid. I didn't set unique constraint on name. 
        // Actually, standard sql upsert needs a constraint. I'll just insert and ignore error or delete first?
        // For safety, let's delete all first? No, maybe dangerous.
        // Let's just insert. If I run this multiple times it might duplicate.
        // I'll assume empty DB for now or use upsert if I have IDs. Platforms in json don't have IDs.

        // To be safe, let's clean the table first? 
        // const { error: delError } = await supabase.from('platforms').delete().neq('id', 0)
        // For now I will just insert. 
        // Update: user asked to "create... configure".
        const { error } = await supabase.from('platforms').insert(data.platforms.map(p => ({
            name: p.name,
            type: p.type,
            is_new: p.isNew
        })))
        if (error) console.error('Error seeding platforms:', error)
    }

    // 3. Touchpoints
    if (data.touchpoints) {
        console.log('Seeding touchpoints...')
        const { error } = await supabase
            .from('touchpoints')
            .upsert(data.touchpoints.map(t => ({
                // id: parseInt(t.id), // Exclude ID to allow UUID generation if table uses UUID
                title: t.title,
                platform: t.platform,
                description: t.description,
                is_new: t.is_new,
                is_optional: t.is_optional,
                tier_premium: t.tier_premium,
                tier_executive: t.tier_executive,
                sort_order: t.sort_order
            })))
        if (error) console.error('Error seeding touchpoints:', error)
    }

    // 4. Calendar Tiers
    if (data.calendarTiers) {
        console.log('Seeding calendar_tiers...')
        const { error } = await supabase
            .from('calendar_tiers')
            .upsert(data.calendarTiers.map(t => ({
                name: t.name,
                color: t.color
            })), { onConflict: 'name' })
        if (error) console.error('Error seeding calendar_tiers:', error)
    }

    // 5. Calendar Events
    if (data.calendarEvents) {
        console.log('Seeding calendar_events...')
        const { error } = await supabase
            .from('calendar_events')
            .upsert(data.calendarEvents.map(e => ({
                id: parseInt(e.id),
                title: e.title,
                start_date: e.startDate,
                end_date: e.endDate,
                tier: e.tier,
                color: e.color
            })))
        if (error) console.error('Error seeding calendar_events:', error)
    }

    // 6. Resources
    if (data.resources) {
        console.log('Seeding resources...')
        const { error } = await supabase
            .from('resources')
            .upsert(data.resources.map(r => ({
                id: parseInt(r.id),
                title: r.title,
                description: r.description,
                category: r.category
            })))
        if (error) console.error('Error seeding resources:', error)
    }

    // 7. Ways of Working - Process
    if (data.waysOfWorking && data.waysOfWorking.process) {
        console.log('Seeding wow_process...')
        const { error } = await supabase
            .from('wow_process')
            .upsert(data.waysOfWorking.process.map((p, index) => ({
                id: parseInt(p.id),
                title: p.title,
                description: p.description,
                sort_order: index + 1
            })))
        if (error) console.error('Error seeding wow_process:', error)
    }

    // 8. Ways of Working - Timeline
    if (data.waysOfWorking && data.waysOfWorking.timeline) {
        console.log('Seeding wow_timeline...')
        // JSON doesn't have IDs for timeline, so we insert
        const { error } = await supabase
            .from('wow_timeline')
            .insert(data.waysOfWorking.timeline.map((t, index) => ({
                phase: t.phase,
                date_text: t.date,
                sort_order: index + 1
            })))
        if (error) console.error('Error seeding wow_timeline:', error)
    }

    // 9. Omnichannel
    console.log('Seeding omnichannel...')
    // Use the comprehensive list from the UI design instead of the limited sample-data.json
    const omnichannelData = [
        { id: 1, channel: 'Web', description: 'Enhancing campaign visibility on Reserve & Collect to captivate passengers early on.', content: '' },
        { id: 2, channel: 'App', description: 'Celebrating the joy of summer with our members before, during and after their trips.', content: '' },
        { id: 3, channel: 'Email', description: 'Crafting personalized communications to strengthen engagement.', content: '' },
        { id: 4, channel: 'Social', description: "Amplifying the activation's reach and resonance on our social channels.", content: '' },
        { id: 5, channel: 'Paid Social', description: "Elevating the activation's influence through our paid social channels.", content: '' },
        { id: 6, channel: 'Loyalty', description: 'Offering exclusive benefits & events crafted for our members.', content: '' },
        { id: 7, channel: 'In-store', description: 'Featuring masterclasses, event branding, and memorable interactive experiences.', content: '' }
    ];

    const { error: omniError } = await supabase
        .from('omnichannel')
        .upsert(omnichannelData.map(o => ({
            id: o.id,
            channel: o.channel,
            description: o.description,
            content: o.content
        })))
    if (omniError) console.error('Error seeding omnichannel:', omniError)

    console.log('Seed process completed.')
}


seed()

