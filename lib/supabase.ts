import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bronmhtuzjcguycybvmt.supabase.co";

const supabaseAnonKey =
  "sb_publishable_MXquifdPKfA-eFnzRqq2Sw_jUqgYLjB";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);