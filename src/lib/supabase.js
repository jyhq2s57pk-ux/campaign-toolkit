import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema for touchpoints table:
// CREATE TABLE touchpoints (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   title TEXT NOT NULL,
//   slug TEXT,
//   platform TEXT NOT NULL,
//   description TEXT,
//   tier_premium BOOLEAN DEFAULT false,
//   tier_executive BOOLEAN DEFAULT false,
//   is_new BOOLEAN DEFAULT false,
//   is_optional BOOLEAN DEFAULT false,
//   sort_order INTEGER,
//   created_at TIMESTAMP DEFAULT NOW(),
//   updated_at TIMESTAMP DEFAULT NOW()
// );
