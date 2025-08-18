import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xeovqqnzqfnosqpluwpo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlb3ZxcW56cWZub3NxcGx1d3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NzI3MzAsImV4cCI6MjA2OTQ0ODczMH0.CKGXJar0h4STA7d9RfXZGqHoepn8n-BWfcU95B-G5Po";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
