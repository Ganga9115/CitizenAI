import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// Return client if credentials exist, otherwise null (triggers in-memory mock store)
export const supabase = (ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY)
  ? createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY)
  : null;
