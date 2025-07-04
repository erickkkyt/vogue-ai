-- ============================================
-- hailuo_generations 表 - Hailuo项目管理 (CREATE OR UPDATE)
-- ============================================

-- 创建或更新Hailuo项目表
CREATE TABLE IF NOT EXISTS hailuo_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 安全地添加新字段（如果不存在）
DO $$
BEGIN
  -- 添加 prompt 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'hailuo_generations' AND column_name = 'prompt') THEN
    ALTER TABLE hailuo_generations ADD COLUMN prompt TEXT;
  END IF;

  -- 添加 duration 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'hailuo_generations' AND column_name = 'duration') THEN
    ALTER TABLE hailuo_generations ADD COLUMN duration INTEGER;
  END IF;

  -- 添加 credits_used 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'hailuo_generations' AND column_name = 'credits_used') THEN
    ALTER TABLE hailuo_generations ADD COLUMN credits_used INTEGER;
  END IF;

  -- 添加 status 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'hailuo_generations' AND column_name = 'status') THEN
    ALTER TABLE hailuo_generations ADD COLUMN status VARCHAR DEFAULT 'processing';
  END IF;

  -- 添加 video_url 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'hailuo_generations' AND column_name = 'video_url') THEN
    ALTER TABLE hailuo_generations ADD COLUMN video_url TEXT;
  END IF;

  -- 添加 error_message 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'hailuo_generations' AND column_name = 'error_message') THEN
    ALTER TABLE hailuo_generations ADD COLUMN error_message TEXT;
  END IF;

  -- 添加 completed_at 字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'hailuo_generations' AND column_name = 'completed_at') THEN
    ALTER TABLE hailuo_generations ADD COLUMN completed_at TIMESTAMPTZ;
  END IF;
END $$;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_hailuo_user_id ON hailuo_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_hailuo_job_id ON hailuo_generations(job_id);
CREATE INDEX IF NOT EXISTS idx_hailuo_status ON hailuo_generations(status);
CREATE INDEX IF NOT EXISTS idx_hailuo_created_at ON hailuo_generations(created_at);

-- 启用RLS安全策略
ALTER TABLE hailuo_generations ENABLE ROW LEVEL SECURITY;

-- 安全地创建RLS策略（先删除再创建）
DO $$
BEGIN
  -- 删除现有策略（如果存在）
  DROP POLICY IF EXISTS "Users can view own hailuo projects" ON hailuo_generations;
  DROP POLICY IF EXISTS "Service role can manage hailuo projects" ON hailuo_generations;

  -- 创建新策略
  CREATE POLICY "Users can view own hailuo projects" ON hailuo_generations
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Service role can manage hailuo projects" ON hailuo_generations
    FOR ALL USING (auth.role() = 'service_role');
END $$;

-- ============================================
-- hailuo_generations 相关RPC函数
-- ============================================

-- 创建Hailuo项目并扣除积分 (6秒=10积分，10秒=15积分)
CREATE OR REPLACE FUNCTION create_hailuo_project(
  p_user_id UUID,
  p_job_id UUID,
  p_prompt TEXT,
  p_duration INTEGER
) RETURNS TABLE(
  job_id UUID,
  status TEXT,
  credits_deducted INTEGER
) AS $$
DECLARE
  v_current_credits INTEGER;
  v_required_credits INTEGER;
BEGIN
  -- 根据时长确定所需积分（6秒=10积分，10秒=15积分）
  IF p_duration = 6 THEN
    v_required_credits := 10;
  ELSIF p_duration = 10 THEN
    v_required_credits := 15;
  ELSE
    -- 如果是其他时长，返回错误
    RETURN QUERY SELECT p_job_id, 'invalid_duration'::TEXT, 0;
    RETURN;
  END IF;
  
  -- 检查用户积分
  SELECT up.credits INTO v_current_credits
  FROM user_profiles up
  WHERE up.user_id = p_user_id;
  
  -- 如果用户不存在或积分不足
  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT p_job_id, 'user_not_found'::TEXT, 0;
    RETURN;
  END IF;
  
  IF v_current_credits < v_required_credits THEN
    RETURN QUERY SELECT p_job_id, 'insufficient_credits'::TEXT, 0;
    RETURN;
  END IF;
  
  -- 检查是否有正在处理的项目
  IF EXISTS (
    SELECT 1 FROM hailuo_generations hailuo
    WHERE hailuo.user_id = p_user_id AND hailuo.status = 'processing'
  ) THEN
    RETURN QUERY SELECT p_job_id, 'concurrent_generation_exists'::TEXT, 0;
    RETURN;
  END IF;
  
  -- 扣除积分
  UPDATE user_profiles up
  SET credits = up.credits - v_required_credits,
      total_videos_generated = total_videos_generated + 1,
      updated_at = NOW()
  WHERE up.user_id = p_user_id;
  
  -- 创建项目记录
  INSERT INTO hailuo_generations (
    user_id, job_id, prompt, duration, credits_used, status
  ) VALUES (
    p_user_id, p_job_id, p_prompt, p_duration, v_required_credits, 'processing'
  );
  
  RETURN QUERY SELECT p_job_id, 'processing'::TEXT, v_required_credits;
  
EXCEPTION
  WHEN OTHERS THEN
    -- 记录详细错误信息
    RAISE LOG 'create_hailuo_project error for job %: % %', p_job_id, SQLERRM, SQLSTATE;
    -- 发生错误时回滚并返回错误状态
    RETURN QUERY SELECT p_job_id, ('database_error: ' || SQLERRM)::TEXT, 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 更新项目状态 (N8N回调时使用)
CREATE OR REPLACE FUNCTION update_hailuo_project_status(
  p_job_id UUID,
  p_status TEXT,
  p_video_url TEXT DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE hailuo_generations
  SET 
    status = p_status,
    video_url = COALESCE(p_video_url, video_url),
    error_message = p_error_message,
    completed_at = CASE WHEN p_status IN ('completed', 'failed') THEN NOW() ELSE completed_at END
  WHERE job_id = p_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户的Hailuo生成历史记录
CREATE OR REPLACE FUNCTION get_user_hailuo_generations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE(
  id UUID,
  job_id UUID,
  prompt TEXT,
  duration INTEGER,
  video_url TEXT,
  status VARCHAR,
  credits_used INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hailuo.id,
    hailuo.job_id,
    hailuo.prompt,
    hailuo.duration,
    hailuo.video_url,
    hailuo.status,
    hailuo.credits_used,
    hailuo.error_message,
    hailuo.created_at,
    hailuo.completed_at
  FROM hailuo_generations hailuo
  WHERE hailuo.user_id = p_user_id
  ORDER BY hailuo.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 根据job_id获取项目状态
CREATE OR REPLACE FUNCTION get_hailuo_generation_status(p_job_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  status VARCHAR,
  video_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hailuo.id,
    hailuo.user_id,
    hailuo.status,
    hailuo.video_url,
    hailuo.error_message,
    hailuo.created_at,
    hailuo.completed_at
  FROM hailuo_generations hailuo
  WHERE hailuo.job_id = p_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户统计信息
CREATE OR REPLACE FUNCTION get_user_hailuo_stats(p_user_id UUID)
RETURNS TABLE(
  total_generations INTEGER,
  completed_generations INTEGER,
  failed_generations INTEGER,
  processing_generations INTEGER,
  total_credits_used INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_generations,
    COUNT(CASE WHEN hailuo.status = 'completed' THEN 1 END)::INTEGER as completed_generations,
    COUNT(CASE WHEN hailuo.status = 'failed' THEN 1 END)::INTEGER as failed_generations,
    COUNT(CASE WHEN hailuo.status = 'processing' THEN 1 END)::INTEGER as processing_generations,
    COALESCE(SUM(hailuo.credits_used), 0)::INTEGER as total_credits_used
  FROM hailuo_generations hailuo
  WHERE hailuo.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
