-- Supabase RPC函数：为用户添加积分
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_credits_to_add INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE user_profiles
  SET credits = credits + p_credits_to_add,
      updated_at = NOW() -- 可选：同时更新 updated_at 时间戳
  WHERE user_id = p_user_id;
END;
$$; 