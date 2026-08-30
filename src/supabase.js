import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cngpropodyckitfixzji.supabase.co";

const supabaseKey = "sb_publishable_eOTXqXOYGc5rkWXiNQtfRQ_xDc3mJez";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);