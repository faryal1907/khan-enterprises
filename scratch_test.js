const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, './apps/api/.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: false,
  }
});

const originalSetItem = supabase.auth.storage.setItem;
const originalGetItem = supabase.auth.storage.getItem;

supabase.auth.storage.setItem = (key, value) => {
  console.log(`SET: ${key} = ${value}`);
  return originalSetItem(key, value);
};

supabase.auth.storage.getItem = (key) => {
  const val = originalGetItem(key);
  console.log(`GET: ${key} = ${val}`);
  return val;
};

async function test() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:4000/api/auth/google/callback',
    }
  });
}

test();
