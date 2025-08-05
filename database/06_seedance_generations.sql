-- Seedance AI Generator 数据库表结构
-- 创建 seedance_generations 表用于存储舞蹈视频生成记录

-- ============================================
-- 创建 seedance_generations 表
-- ============================================

CREATE TABLE IF NOT EXISTS seedance_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID UNIQUE NOT NULL,
  external_task_id TEXT, -- 火山引擎任务ID
  generation_mode VARCHAR(20) NOT NULL CHECK (generation_mode IN ('text-to-video', 'image-to-video')),
  selected_model VARCHAR(50) NOT NULL CHECK (selected_model IN ('doubao-seedance-1-0-pro-250528', 'doubao-seedance-1-0-lite-t2v-250428', 'doubao-seedance-1-0-lite-i2v-250428')),
  aspect_ratio VARCHAR(10) NOT NULL CHECK (aspect_ratio IN ('16:9', '9:16', '1:1')),
  resolution VARCHAR(10) NOT NULL CHECK (resolution IN ('720p', '1080p')),
  duration VARCHAR(5) NOT NULL CHECK (duration IN ('5', '10')),
  text_prompt TEXT,
  image_url TEXT,
  image_prompt TEXT,
  video_url TEXT,
  status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  credits_used INTEGER NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_seedance_generations_user_id ON seedance_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_seedance_generations_job_id ON seedance_generations(job_id);
CREATE INDEX IF NOT EXISTS idx_seedance_generations_status ON seedance_generations(status);
CREATE INDEX IF NOT EXISTS idx_seedance_generations_created_at ON seedance_generations(created_at DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE seedance_generations ENABLE ROW LEVEL SECURITY;

-- 安全地创建RLS策略（先删除再创建）
DO $$
BEGIN
  -- 删除现有策略（如果存在）
  DROP POLICY IF EXISTS "Users can view own seedance projects" ON seedance_generations;
  DROP POLICY IF EXISTS "Service role can manage seedance projects" ON seedance_generations;

  -- 创建新策略
  CREATE POLICY "Users can view own seedance projects" ON seedance_generations
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Service role can manage seedance projects" ON seedance_generations
    FOR ALL USING (auth.role() = 'service_role');
END $$;

-- ============================================
-- seedance_generations 相关RPC函数
-- ============================================

-- 创建初始项目并扣除积分的函数
CREATE OR REPLACE FUNCTION create_seedance_project(
  p_user_id UUID,
  p_job_id UUID,
  p_generation_mode TEXT,
  p_selected_model TEXT,
  p_aspect_ratio TEXT,
  p_resolution TEXT,
  p_duration TEXT,
  p_text_prompt TEXT DEFAULT NULL,
  p_image_url TEXT DEFAULT NULL,
  p_image_prompt TEXT DEFAULT NULL,
  p_credits_required INTEGER DEFAULT NULL
) RETURNS TABLE(
  job_id UUID,
  status TEXT,
  credits_deducted INTEGER
) AS $$
DECLARE
  v_current_credits INTEGER;
  v_required_credits INTEGER;
BEGIN
  -- 使用传入的积分要求或根据模型和时长计算
  IF p_credits_required IS NOT NULL THEN
    v_required_credits := p_credits_required;
  ELSE
    v_required_credits := CASE
      WHEN p_selected_model = 'doubao-seedance-1-0-pro-250528' THEN 30
      WHEN p_selected_model = 'doubao-seedance-1-0-lite-t2v-250428' THEN 10
      WHEN p_selected_model = 'doubao-seedance-1-0-lite-i2v-250428' THEN 10
      ELSE 30
    END;

    -- 10秒视频需要双倍积分
    IF p_duration = '10' THEN
      v_required_credits := v_required_credits * 2;
    END IF;
  END IF;
  
  -- 检查用户积分
  SELECT credits INTO v_current_credits 
  FROM user_profiles 
  WHERE user_id = p_user_id;
  
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
    SELECT 1 FROM seedance_generations sg
    WHERE sg.user_id = p_user_id AND sg.status = 'processing'
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
  INSERT INTO seedance_generations (
    user_id, job_id, generation_mode, selected_model, aspect_ratio, resolution, duration,
    text_prompt, image_url, image_prompt, credits_used, status
  ) VALUES (
    p_user_id, p_job_id, p_generation_mode, p_selected_model, p_aspect_ratio, p_resolution, p_duration,
    p_text_prompt, p_image_url, p_image_prompt, v_required_credits, 'processing'
  );
  
  RETURN QUERY SELECT p_job_id, 'processing'::TEXT, v_required_credits;
  
EXCEPTION
  WHEN OTHERS THEN
    -- 记录详细错误信息
    RAISE LOG 'create_seedance_project error for job %: % %', p_job_id, SQLERRM, SQLSTATE;
    -- 发生错误时回滚并返回错误状态
    RETURN QUERY SELECT p_job_id, ('database_error: ' || SQLERRM)::TEXT, 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户的Seedance生成历史记录
CREATE OR REPLACE FUNCTION get_user_seedance_generations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE(
  id UUID,
  job_id UUID,
  generation_mode TEXT,
  selected_model TEXT,
  text_prompt TEXT,
  image_url TEXT,
  image_prompt TEXT,
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
    sg.id,
    sg.job_id,
    sg.generation_mode,
    sg.selected_model,
    sg.text_prompt,
    sg.image_url,
    sg.image_prompt,
    sg.video_url,
    sg.status,
    sg.credits_used,
    sg.error_message,
    sg.created_at,
    sg.completed_at
  FROM seedance_generations sg
  WHERE sg.user_id = p_user_id
  ORDER BY sg.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 根据job_id获取项目状态
CREATE OR REPLACE FUNCTION get_seedance_generation_status(p_job_id UUID)
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
    sg.id,
    sg.user_id,
    sg.status,
    sg.video_url,
    sg.error_message,
    sg.created_at,
    sg.completed_at
  FROM seedance_generations sg
  WHERE sg.job_id = p_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户统计信息
CREATE OR REPLACE FUNCTION get_user_seedance_stats(p_user_id UUID)
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
    COUNT(CASE WHEN sg.status = 'completed' THEN 1 END)::INTEGER as completed_generations,
    COUNT(CASE WHEN sg.status = 'failed' THEN 1 END)::INTEGER as failed_generations,
    COUNT(CASE WHEN sg.status = 'processing' THEN 1 END)::INTEGER as processing_generations,
    COALESCE(SUM(sg.credits_used), 0)::INTEGER as total_credits_used
  FROM seedance_generations sg
  WHERE sg.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 添加函数注释
COMMENT ON FUNCTION create_seedance_project IS 'Seedance AI Generator - 创建舞蹈视频生成项目并扣除用户积分';
COMMENT ON FUNCTION get_user_seedance_generations IS '获取用户的Seedance生成历史记录';
COMMENT ON FUNCTION get_seedance_generation_status IS '根据job_id获取Seedance生成状态';
COMMENT ON FUNCTION get_user_seedance_stats IS '获取用户的Seedance生成统计信息';

-- 添加表注释
COMMENT ON TABLE seedance_generations IS 'Seedance AI Generator - 舞蹈视频生成记录表';
COMMENT ON COLUMN seedance_generations.generation_mode IS '生成模式: text-to-video 或 image-to-video';
COMMENT ON COLUMN seedance_generations.selected_model IS '选择的模型: seedance 或 seedance_fast';
COMMENT ON COLUMN seedance_generations.text_prompt IS '文本提示词（text-to-video模式）';
COMMENT ON COLUMN seedance_generations.image_url IS '图片URL（image-to-video模式）';
COMMENT ON COLUMN seedance_generations.image_prompt IS '图片描述（image-to-video模式）';
COMMENT ON COLUMN seedance_generations.video_url IS '生成的视频URL';
COMMENT ON COLUMN seedance_generations.credits_used IS '消耗的积分数量';
