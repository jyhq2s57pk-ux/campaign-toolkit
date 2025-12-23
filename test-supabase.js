import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zzbhflojierricqvswwq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6YmhmbG9qaWVycmljcXZzd3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODM3MzIsImV4cCI6MjA4MjA1OTczMn0.YAumwxbjYtX9WNHQMXDlBluo5UZcowrI2WbXEsBd1mA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing Supabase connection...');

// Test 1: Check if we can connect
const testConnection = async () => {
  console.log('\n1. Testing basic connection...');
  const { data, error } = await supabase
    .from('touchpoints')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Connection error:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Connection successful!');
    console.log('Data:', data);
  }
};

// Test 2: Try to insert a test record
const testInsert = async () => {
  console.log('\n2. Testing insert...');
  const { data, error } = await supabase
    .from('touchpoints')
    .insert([{
      title: 'Test Touchpoint',
      platform: 'Test Platform',
      description: 'This is a test',
      sort_order: 999
    }])
    .select();

  if (error) {
    console.error('❌ Insert error:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Insert successful!');
    console.log('Inserted data:', data);
  }
};

// Run tests
testConnection()
  .then(() => testInsert())
  .catch(err => console.error('Fatal error:', err));
