import { createClient } from "@supabase/supabase-js";

const supabaseKey = import.meta.env.REACT_SUPABASE_API_KEY;
const supabaseUrl = import.meta.env.REACT_SUPABASE_URL_PROJECT;

if (!supabaseKey || !supabaseUrl) throw "Mismatch";

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

export { supabase }