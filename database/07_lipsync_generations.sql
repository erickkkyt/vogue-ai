-- LipSync Generator 数据库表结构
-- 创建 lipsync_generations 表用于存储唇形同步视频生成记录

-- ============================================
-- 创建 lipsync_generations 表
-- ============================================

CREATE TABLE IF NOT EXISTS lipsync_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID UNIQUE NOT NULL,
  generation_mode VARCHAR(20) NOT NULL CHECK (generation_mode IN ('image-audio', 'video-audio')),
  selected_model VARCHAR(20) NOT NULL CHECK (selected_model IN ('lipsync', 'lipsync_fast')),
  image_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  audio_prompt TEXT,
  generated_video_url TEXT,
  status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  credits_used INTEGER NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_lipsync_generations_user_id ON lipsync_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_lipsync_generations_job_id ON lipsync_generations(job_id);
CREATE INDEX IF NOT EXISTS idx_lipsync_generations_status ON lipsync_generations(status);
CREATE INDEX IF NOT EXISTS idx_lipsync_generations_created_at ON lipsync_generations(created_at DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE lipsync_generations ENABLE ROW LEVEL SECURITY;

-- 安全地创建RLS策略（先删除再创建）
DO $$
BEGIN
  -- 删除现有策略（如果存在）
  DROP POLICY IF EXISTS "Users can view own lipsync projects" ON lipsync_generations;
  DROP POLICY IF EXISTS "Service role can manage lipsync projects" ON lipsync_generations;

  -- 创建新策略
  CREATE POLICY "Users can view own lipsync projects" ON lipsync_generations
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Service role can manage lipsync projects" ON lipsync_generations
    FOR ALL USING (auth.role() = 'service_role');
END $$;

-- ============================================
-- lipsync_generations 相关RPC函数
-- ============================================

-- 创建初始项目并扣除积分的函数
CREATE OR REPLACE FUNCTION create_lipsync_project(
  p_user_id UUID,
  p_job_id UUID,
  p_generation_mode TEXT,
  p_selected_model TEXT,
  p_image_url TEXT DEFAULT NULL,
  p_video_url TEXT DEFAULT NULL,
  p_audio_url TEXT DEFAULT NULL,
  p_audio_prompt TEXT DEFAULT NULL
) RETURNS TABLE(
  job_id UUID,
  status TEXT,
  credits_deducted INTEGER
) AS $$
DECLARE
  v_current_credits INTEGER;
  v_required_credits INTEGER;
BEGIN
  -- 根据模型确定所需积分
  v_required_credits := CASE
    WHEN p_selected_model = 'lipsync' THEN 25
    WHEN p_selected_model = 'lipsync_fast' THEN 15
    ELSE 25
  END;
  
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
    SELECT 1 FROM lipsync_generations lg
    WHERE lg.user_id = p_user_id AND lg.status = 'processing'
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
  INSERT INTO lipsync_generations (
    user_id, job_id, generation_mode, selected_model,
    image_url, video_url, audio_url, audio_prompt, credits_used, status
  ) VALUES (
    p_user_id, p_job_id, p_generation_mode, p_selected_model,
    p_image_url, p_video_url, p_audio_url, p_audio_prompt, v_required_credits, 'processing'
  );
  
  RETURN QUERY SELECT p_job_id, 'processing'::TEXT, v_required_credits;
  
EXCEPTION
  WHEN OTHERS THEN
    -- 记录详细错误信息
    RAISE LOG 'create_lipsync_project error for job %: % %', p_job_id, SQLERRM, SQLSTATE;
    -- 发生错误时回滚并返回错误状态
    RETURN QUERY SELECT p_job_id, ('database_error: ' || SQLERRM)::TEXT, 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户的LipSync生成历史记录
CREATE OR REPLACE FUNCTION get_user_lipsync_generations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE(
  id UUID,
  job_id UUID,
  generation_mode TEXT,
  selected_model TEXT,
  image_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  audio_prompt TEXT,
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
    lg.id,
    lg.job_id,
    lg.generation_mode,
    lg.selected_model,
    lg.image_url,
    lg.video_url,
    lg.audio_url,
    lg.audio_prompt,
    lg.generated_video_url,
    lg.status,
    lg.credits_used,
    lg.error_message,
    lg.created_at,
    lg.completed_at
  FROM lipsync_generations lg
  WHERE lg.user_id = p_user_id
  ORDER BY lg.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 根据job_id获取项目状态
CREATE OR REPLACE FUNCTION get_lipsync_generation_status(p_job_id UUID)
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
    lg.id,
    lg.user_id,
    lg.status,
    lg.generated_video_url,
    lg.error_message,
    lg.created_at,
    lg.completed_at
  FROM lipsync_generations lg
  WHERE lg.job_id = p_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户统计信息
CREATE OR REPLACE FUNCTION get_user_lipsync_stats(p_user_id UUID)
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
    COUNT(CASE WHEN lg.status = 'completed' THEN 1 END)::INTEGER as completed_generations,
    COUNT(CASE WHEN lg.status = 'failed' THEN 1 END)::INTEGER as failed_generations,
    COUNT(CASE WHEN lg.status = 'processing' THEN 1 END)::INTEGER as processing_generations,
    COALESCE(SUM(lg.credits_used), 0)::INTEGER as total_credits_used
  FROM lipsync_generations lg
  WHERE lg.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 添加函数注释
COMMENT ON FUNCTION create_lipsync_project IS 'LipSync Generator - 创建唇形同步视频生成项目并扣除用户积分';
COMMENT ON FUNCTION get_user_lipsync_generations IS '获取用户的LipSync生成历史记录';
COMMENT ON FUNCTION get_lipsync_generation_status IS '根据job_id获取LipSync生成状态';
COMMENT ON FUNCTION get_user_lipsync_stats IS '获取用户的LipSync生成统计信息';

-- 添加表注释
COMMENT ON TABLE lipsync_generations IS 'LipSync Generator - 唇形同步视频生成记录表';
COMMENT ON COLUMN lipsync_generations.generation_mode IS '生成模式: image-audio 或 video-audio';
COMMENT ON COLUMN lipsync_generations.selected_model IS '选择的模型: lipsync 或 lipsync_fast';
COMMENT ON COLUMN lipsync_generations.image_url IS '输入图片URL（image-audio模式）';
COMMENT ON COLUMN lipsync_generations.video_url IS '输入视频URL（video-audio模式）';
COMMENT ON COLUMN lipsync_generations.audio_url IS '音频文件URL';
COMMENT ON COLUMN lipsync_generations.audio_prompt IS '文本转语音内容';
COMMENT ON COLUMN lipsync_generations.generated_video_url IS '生成的唇形同步视频URL';
COMMENT ON COLUMN lipsync_generations.credits_used IS '消耗的积分数量';
