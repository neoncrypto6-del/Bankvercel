import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kptgqurpbpjplpmrbnpy.supabase.co';
const supabaseAnonKey = 'sb_publishable_v9wlF0UB9EertgMdCa1yYA_OFyU9oc3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);