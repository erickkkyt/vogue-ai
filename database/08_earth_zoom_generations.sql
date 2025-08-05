-- Earth Zoom Effect Generator 数据库表结构
-- 创建 earth_zoom_generations 表用于存储地球缩放效果视频生成记录

-- ============================================
-- 创建 earth_zoom_generations 表
-- ============================================

CREATE TABLE IF NOT EXISTS earth_zoom_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID UNIQUE NOT NULL,
  
  -- 输入参数
  image_url TEXT NOT NULL,
  custom_prompt TEXT,
  zoom_speed VARCHAR(20) DEFAULT 'medium' CHECK (zoom_speed IN ('slow', 'medium', 'fast')),
  output_format VARCHAR(10) DEFAULT '16:9' CHECK (output_format IN ('16:9', '9:16', '1:1')),
  effect_type VARCHAR(30) DEFAULT 'earth-zoom' CHECK (effect_type IN ('earth-zoom', 'space-zoom', 'satellite-zoom')),
  
  -- 输出结果
  generated_video_url TEXT,
  
  -- 状态管理
  status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  credits_used INTEGER NOT NULL DEFAULT 15,
  error_message TEXT,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_earth_zoom_user_id ON earth_zoom_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_earth_zoom_job_id ON earth_zoom_generations(job_id);
CREATE INDEX IF NOT EXISTS idx_earth_zoom_status ON earth_zoom_generations(status);
CREATE INDEX IF NOT EXISTS idx_earth_zoom_created_at ON earth_zoom_generations(created_at);

-- 启用行级安全策略
ALTER TABLE earth_zoom_generations ENABLE ROW LEVEL SECURITY;

-- 安全地创建RLS策略（先删除再创建）
DO $$
BEGIN
  -- 删除现有策略（如果存在）
  DROP POLICY IF EXISTS "Users can view own earth zoom projects" ON earth_zoom_generations;
  DROP POLICY IF EXISTS "Service role can manage earth zoom projects" ON earth_zoom_generations;

  -- 创建新策略
  CREATE POLICY "Users can view own earth zoom projects" ON earth_zoom_generations
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Service role can manage earth zoom projects" ON earth_zoom_generations
    FOR ALL USING (auth.role() = 'service_role');
END $$;

-- ============================================
-- earth_zoom_generations 相关RPC函数
-- ============================================

-- 创建Earth Zoom项目并扣除积分的函数
CREATE OR REPLACE FUNCTION create_earth_zoom_project(
  p_user_id UUID,
  p_job_id UUID,
  p_image_url TEXT,
  p_custom_prompt TEXT DEFAULT NULL,
  p_zoom_speed VARCHAR(20) DEFAULT 'medium',
  p_output_format VARCHAR(10) DEFAULT '16:9',
  p_effect_type VARCHAR(30) DEFAULT 'earth-zoom'
) RETURNS TABLE(
  job_id UUID,
  status TEXT,
  credits_deducted INTEGER
) AS $$
DECLARE
  v_current_credits INTEGER;
  v_required_credits INTEGER := 15; -- Earth Zoom 固定消耗15积分
BEGIN
  -- 验证输入参数
  IF p_zoom_speed NOT IN ('slow', 'medium', 'fast') THEN
    RETURN QUERY SELECT p_job_id, 'invalid_zoom_speed'::TEXT, 0;
    RETURN;
  END IF;
  
  IF p_output_format NOT IN ('16:9', '9:16', '1:1') THEN
    RETURN QUERY SELECT p_job_id, 'invalid_output_format'::TEXT, 0;
    RETURN;
  END IF;
  
  IF p_effect_type NOT IN ('earth-zoom', 'space-zoom', 'satellite-zoom') THEN
    RETURN QUERY SELECT p_job_id, 'invalid_effect_type'::TEXT, 0;
    RETURN;
  END IF;
  
  -- 获取用户当前积分
  SELECT credits INTO v_current_credits
  FROM user_profiles
  WHERE user_id = p_user_id;
  
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
    SELECT 1 FROM earth_zoom_generations ezg
    WHERE ezg.user_id = p_user_id AND ezg.status = 'processing'
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
  INSERT INTO earth_zoom_generations (
    user_id, job_id, image_url, custom_prompt, zoom_speed,
    output_format, effect_type, credits_used, status
  ) VALUES (
    p_user_id, p_job_id, p_image_url, p_custom_prompt, p_zoom_speed,
    p_output_format, p_effect_type, v_required_credits, 'processing'
  );
  
  RETURN QUERY SELECT p_job_id, 'processing'::TEXT, v_required_credits;
  
EXCEPTION
  WHEN OTHERS THEN
    -- 记录详细错误信息
    RAISE LOG 'create_earth_zoom_project error for job %: % %', p_job_id, SQLERRM, SQLSTATE;
    -- 发生错误时回滚并返回错误状态
    RETURN QUERY SELECT p_job_id, ('database_error: ' || SQLERRM)::TEXT, 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户的Earth Zoom生成历史记录
CREATE OR REPLACE FUNCTION get_user_earth_zoom_generations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE(
  id UUID,
  job_id UUID,
  image_url TEXT,
  custom_prompt TEXT,
  zoom_speed VARCHAR,
  output_format VARCHAR,
  effect_type VARCHAR,
  generated_video_url TEXT,
  status VARCHAR,
  credits_used INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ezg.id,
    ezg.job_id,
    ezg.image_url,
    ezg.custom_prompt,
    ezg.zoom_speed,
    ezg.output_format,
    ezg.effect_type,
    ezg.generated_video_url,
    ezg.status,
    ezg.credits_used,
    ezg.error_message,
    ezg.created_at,
    ezg.completed_at
  FROM earth_zoom_generations ezg
  WHERE ezg.user_id = p_user_id
  ORDER BY ezg.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 根据job_id获取项目状态
CREATE OR REPLACE FUNCTION get_earth_zoom_generation_status(p_job_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  status VARCHAR,
  generated_video_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ezg.id,
    ezg.user_id,
    ezg.status,
    ezg.generated_video_url,
    ezg.error_message,
    ezg.created_at,
    ezg.completed_at
  FROM earth_zoom_generations ezg
  WHERE ezg.job_id = p_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户统计信息
CREATE OR REPLACE FUNCTION get_user_earth_zoom_stats(p_user_id UUID)
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
    COUNT(CASE WHEN ezg.status = 'completed' THEN 1 END)::INTEGER as completed_generations,
    COUNT(CASE WHEN ezg.status = 'failed' THEN 1 END)::INTEGER as failed_generations,
    COUNT(CASE WHEN ezg.status = 'processing' THEN 1 END)::INTEGER as processing_generations,
    COALESCE(SUM(ezg.credits_used), 0)::INTEGER as total_credits_used
  FROM earth_zoom_generations ezg
  WHERE ezg.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 添加函数注释
COMMENT ON FUNCTION create_earth_zoom_project IS 'Earth Zoom Effect Generator - 创建地球缩放效果视频生成项目并扣除用户积分';
COMMENT ON FUNCTION get_user_earth_zoom_generations IS '获取用户的Earth Zoom生成历史记录';
COMMENT ON FUNCTION get_earth_zoom_generation_status IS '根据job_id获取Earth Zoom生成状态';
COMMENT ON FUNCTION get_user_earth_zoom_stats IS '获取用户的Earth Zoom生成统计信息';

-- 添加表注释
COMMENT ON TABLE earth_zoom_generations IS 'Earth Zoom Effect Generator - 地球缩放效果视频生成记录表';
COMMENT ON COLUMN earth_zoom_generations.image_url IS '输入图片URL';
COMMENT ON COLUMN earth_zoom_generations.custom_prompt IS '自定义提示词';
COMMENT ON COLUMN earth_zoom_generations.zoom_speed IS '缩放速度: slow, medium, fast';
COMMENT ON COLUMN earth_zoom_generations.output_format IS '输出格式: 16:9, 9:16, 1:1';
COMMENT ON COLUMN earth_zoom_generations.effect_type IS '效果类型: earth-zoom, space-zoom, satellite-zoom';
COMMENT ON COLUMN earth_zoom_generations.generated_video_url IS '生成的视频URL';
COMMENT ON COLUMN earth_zoom_generations.credits_used IS '消耗的积分数量';
