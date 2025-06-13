-- AI Baby Generator RPC 函数
-- 用于扣除用户积分的函数

-- 扣除用户积分函数
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_credits_to_deduct INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- 检查用户当前积分
  SELECT credits INTO current_credits
  FROM user_profiles
  WHERE user_id = p_user_id;

  -- 如果用户不存在，抛出异常
  IF current_credits IS NULL THEN
    RAISE EXCEPTION 'User profile not found for user_id: %', p_user_id;
  END IF;

  -- 检查积分是否足够
  IF current_credits < p_credits_to_deduct THEN
    RAISE EXCEPTION 'Insufficient credits. Current: %, Required: %', current_credits, p_credits_to_deduct;
  END IF;

  -- 扣除积分
  UPDATE user_profiles
  SET credits = credits - p_credits_to_deduct,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- 记录日志
  RAISE NOTICE 'Successfully deducted % credits from user %. Remaining credits: %', 
    p_credits_to_deduct, p_user_id, (current_credits - p_credits_to_deduct);
END;
$$;

-- 查询用户婴儿生成历史的函数
CREATE OR REPLACE FUNCTION get_user_baby_generations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  job_id UUID,
  baby_gender VARCHAR,
  status VARCHAR,
  generated_baby_url TEXT,
  credits_used INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bg.id,
    bg.job_id,
    bg.baby_gender,
    bg.status,
    bg.generated_baby_url,
    bg.credits_used,
    bg.error_message,
    bg.created_at,
    bg.completed_at
  FROM baby_generations bg
  WHERE bg.user_id = p_user_id
  ORDER BY bg.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- 获取用户婴儿生成统计信息的函数
CREATE OR REPLACE FUNCTION get_user_baby_generation_stats(
  p_user_id UUID
)
RETURNS TABLE (
  total_generations INTEGER,
  completed_generations INTEGER,
  failed_generations INTEGER,
  processing_generations INTEGER,
  total_credits_used INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_generations,
    COUNT(CASE WHEN status = 'completed' THEN 1 END)::INTEGER as completed_generations,
    COUNT(CASE WHEN status = 'failed' THEN 1 END)::INTEGER as failed_generations,
    COUNT(CASE WHEN status = 'processing' THEN 1 END)::INTEGER as processing_generations,
    COALESCE(SUM(credits_used), 0)::INTEGER as total_credits_used
  FROM baby_generations
  WHERE user_id = p_user_id;
END;
$$;

-- 根据job_id获取婴儿生成状态的函数
CREATE OR REPLACE FUNCTION get_baby_generation_status(
  p_job_id UUID
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  status VARCHAR,
  generated_baby_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bg.id,
    bg.user_id,
    bg.status,
    bg.generated_baby_url,
    bg.error_message,
    bg.created_at,
    bg.completed_at
  FROM baby_generations bg
  WHERE bg.job_id = p_job_id;
END;
$$;

-- 添加函数注释
COMMENT ON FUNCTION deduct_credits(UUID, INTEGER) IS '扣除用户积分，用于AI Baby Generator';
COMMENT ON FUNCTION get_user_baby_generations(UUID, INTEGER, INTEGER) IS '获取用户的婴儿生成历史记录';
COMMENT ON FUNCTION get_user_baby_generation_stats(UUID) IS '获取用户的婴儿生成统计信息';
COMMENT ON FUNCTION get_baby_generation_status(UUID) IS '根据job_id获取婴儿生成状态';
