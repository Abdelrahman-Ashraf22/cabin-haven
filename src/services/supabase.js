import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://qmqqeqlumsjazjithlbm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtcXFlcWx1bXNqYXpqaXRobGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NjAxMTEsImV4cCI6MjA0OTIzNjExMX0.zqT0lbANd6LZYDUXPOagpoFQaFU33tvOlTNxjG3iB4Q";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
