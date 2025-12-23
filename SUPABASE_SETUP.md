# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and create

## 2. Create the Database Table

Go to the SQL Editor in your Supabase dashboard and run this SQL:

```sql
-- Create touchpoints table
CREATE TABLE touchpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT,
  platform TEXT NOT NULL,
  description TEXT,
  tier_premium BOOLEAN DEFAULT false,
  tier_executive BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_optional BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE touchpoints ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
-- IMPORTANT: Update this for production with proper auth!
CREATE POLICY "Allow all operations" ON touchpoints
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_touchpoints_platform ON touchpoints(platform);
CREATE INDEX idx_touchpoints_sort ON touchpoints(sort_order);
```

## 3. Get Your API Keys

1. Go to Project Settings > API
2. Copy your **Project URL**
3. Copy your **anon/public key**

## 4. Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Import Existing Data (Optional)

If you want to import your existing sample data:

1. Go to `/admin` in your app
2. Click "Upload CSV"
3. Select the `touchpoint_components.csv` file

## 6. Update TouchpointsPage to use Supabase

Replace the static import with dynamic data fetching:

```jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TouchpointsPage() {
  const [touchpointsData, setTouchpointsData] = useState([]);

  useEffect(() => {
    fetchTouchpoints();
  }, []);

  const fetchTouchpoints = async () => {
    const { data } = await supabase
      .from('touchpoints')
      .select('*')
      .order('sort_order');

    if (data) {
      setTouchpointsData(data);
    }
  };

  // Rest of component...
}
```

## CSV Format

Your CSV should have these columns:

- `title` - Touchpoint name (required)
- `slug` - URL-friendly identifier
- `platform` - Platform name (required)
- `description` - Full description
- `tier_1` - "Premium" or empty
- `tier_2` - "Executive" or empty
- `is_new` - TRUE or FALSE
- `is_optional` - TRUE or FALSE
- `sortOrder` - Number for ordering

## Admin Panel Features

Access the admin panel at `/admin`:

- **Add Touchpoint** - Manually create new touchpoints
- **Edit** - Update existing touchpoints
- **Delete** - Remove touchpoints
- **Upload CSV** - Bulk import from CSV file

## Security Note

The current setup uses a permissive policy for development. For production:

1. Set up Supabase Auth
2. Update RLS policies to check user authentication
3. Add proper user roles and permissions
