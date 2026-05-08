import { createClient } from "@supabase/supabase-js";
//#endregion
//#region src/lib/supabase.ts
var supabase = createClient("https://tgvhfebpnhuhsmgiobrs.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndmhmZWJwbmh1aHNtZ2lvYnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTc1OTAsImV4cCI6MjA5MzczMzU5MH0.I6BYMS-9c0fDjPB1K_4wEzZU5qksmgJ8vKcTCbB4XCQ");
//#endregion
export { supabase as t };
