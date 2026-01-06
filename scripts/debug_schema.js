
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
// We need to find the .env file. It's likely in the root.
// Assuming we are running this from scripts/ directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking DB schema/data...");

    // Try to insert a dummy event to see what error we get (or if it works)
    // and check the ID structure.
    const testId = `test-${Date.now()}`;

    // We'll just fetch one row to see the structure
    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching rows:", error);
    } else {
        console.log("Sample Data:", data);
    }

    // Check unique constraints by inspecting response? 
    // We can't query pg_catalog easily via supabase-js client unless we use rpc.

}

checkSchema();
