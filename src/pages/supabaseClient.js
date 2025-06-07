import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://emzcdxpagwnxesvnsfje.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtemNkeHBhZ3dueGVzdm5zZmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDI1MzMsImV4cCI6MjA2NDcxODUzM30._bio527GlUa910ZGaUjiCLmkli8dgE67p9A7TxO0ui0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
