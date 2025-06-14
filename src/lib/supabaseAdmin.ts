import { createClient } from '@supabase/supabase-js';

// 注意：这里使用 service_role key，因为它将在后端（API路由、Server Actions）使用，需要权限绕过RLS来更新用户信息。
// 确保这个 key 绝对不会暴露到客户端。
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
); 