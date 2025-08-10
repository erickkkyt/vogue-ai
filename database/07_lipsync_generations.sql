-- LipSync Generator 数据库表结构
-- 创建 lipsync_generations 表用于存储唇形同步视频生成记录

-- ============================================
-- 创建 lipsync_generations 表
-- ============================================

CREATE TABLE IF NOT EXISTS lipsync_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID UNIQUE NOT NULL,
  audio_input_mode VARCHAR(10) NOT NULL CHECK (audio_input_mode IN ('upload', 'record', 'text')),
  voice_id VARCHAR(20) DEFAULT 'en-US-ken',
  estimated_duration_seconds INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  uploaded_audio_url TEXT,    -- 用户上传的音频文件URL
  recorded_audio_url TEXT,    -- 用户录音的音频文件URL
  audio_content TEXT,         -- 用户输入的文本内容
  video_resolution TEXT DEFAULT '540p' CHECK (video_resolution IN ('540p', '720p')),
  aspect_ratio TEXT DEFAULT '9:16' CHECK (aspect_ratio IN ('1:1', '16:9', '9:16')),
  generated_video_url TEXT,
  status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  credits_used INTEGER NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  -- 确保至少有一种音频输入
  CONSTRAINT check_audio_input CHECK (uploaded_audio_url IS NOT NULL OR recorded_audio_url IS NOT NULL OR audio_content IS NOT NULL)
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

-- 创建初始项目并前扣除积分（基于估算时长）
CREATE OR REPLACE FUNCTION create_lipsync_project_with_credit_deduction(
  p_user_id UUID,
  p_job_id UUID,
  p_audio_input_mode TEXT,
  p_voice_id TEXT DEFAULT 'en-US-ken',
  p_estimated_duration_seconds INTEGER,
  p_image_url TEXT DEFAULT NULL,
  p_uploaded_audio_url TEXT DEFAULT NULL,
  p_recorded_audio_url TEXT DEFAULT NULL,
  p_audio_content TEXT DEFAULT NULL,
  p_video_resolution TEXT DEFAULT '540p',
  p_aspect_ratio TEXT DEFAULT '9:16'
) RETURNS TABLE(
  job_id UUID,
  status TEXT,
  credits_deducted INTEGER
) AS $$
DECLARE
  v_current_credits INTEGER;
  v_credits_to_deduct INTEGER;
  v_resolution_multiplier INTEGER;
BEGIN
  -- 计算分辨率倍数（与AI Baby Podcast一致）
  v_resolution_multiplier := CASE
    WHEN p_video_resolution = '720p' THEN 2
    ELSE 1
  END;

  -- 计算要扣除的积分：估算时长 * 分辨率倍数
  v_credits_to_deduct := p_estimated_duration_seconds * v_resolution_multiplier;

  -- 检查用户积分
  SELECT credits INTO v_current_credits
  FROM user_profiles
  WHERE user_id = p_user_id;

  -- 如果用户不存在
  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT p_job_id, 'user_not_found'::TEXT, 0;
    RETURN;
  END IF;

  -- 检查积分是否足够
  IF v_current_credits < v_credits_to_deduct THEN
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
  UPDATE user_profiles
  SET credits = credits - v_credits_to_deduct,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- 创建项目记录（已扣除积分）
  INSERT INTO lipsync_generations (
    user_id, job_id, audio_input_mode, voice_id, estimated_duration_seconds,
    image_url, uploaded_audio_url, recorded_audio_url, audio_content,
    video_resolution, aspect_ratio, credits_used, status
  ) VALUES (
    p_user_id, p_job_id, p_audio_input_mode, p_voice_id, p_estimated_duration_seconds,
    p_image_url, p_uploaded_audio_url, p_recorded_audio_url, p_audio_content,
    p_video_resolution, p_aspect_ratio, v_credits_to_deduct, 'processing'
  );

  RETURN QUERY SELECT p_job_id, 'processing'::TEXT, v_credits_to_deduct;

EXCEPTION
  WHEN OTHERS THEN
    -- 记录详细错误信息
    RAISE LOG 'create_lipsync_project_with_credit_deduction error for job %: % %', p_job_id, SQLERRM, SQLSTATE;
    -- 发生错误时回滚并返回错误状态
    RETURN QUERY SELECT p_job_id, ('database_error: ' || SQLERRM)::TEXT, 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 根据实际视频时长调整积分（视频生成完成后调用）
-- 如果实际消耗与预扣除不同，进行多退少补
CREATE OR REPLACE FUNCTION adjust_lipsync_credits_by_actual_duration(
  p_job_id UUID,
  p_duration_ms INTEGER
) RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_video_resolution TEXT;
  v_credits_already_deducted INTEGER;
  v_actual_credits_needed INTEGER;
  v_credit_adjustment INTEGER;
  v_new_credits INTEGER;
  v_base_credits_calculated INTEGER;
BEGIN
  -- 1. 获取项目信息
  SELECT user_id, video_resolution, credits_used
  INTO v_user_id, v_video_resolution, v_credits_already_deducted
  FROM lipsync_generations
  WHERE job_id = p_job_id;

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'LipSync project not found for job_id: ' || p_job_id::TEXT);
  END IF;

  IF v_video_resolution IS NULL THEN
    v_video_resolution := '540p';
    RAISE WARNING 'Video resolution for job_id % was NULL, defaulted to 540p for credit adjustment.', p_job_id::TEXT;
  END IF;

  -- 2. 计算实际需要的积分（按秒向上取整）
  IF p_duration_ms IS NULL OR p_duration_ms <= 0 THEN
    v_base_credits_calculated := 0;
  ELSE
    v_base_credits_calculated := ceil(p_duration_ms / 1000.0);
  END IF;

  -- 3. 根据分辨率计算实际需要的积分
  IF v_video_resolution = '720p' THEN
    v_actual_credits_needed := v_base_credits_calculated * 2;
  ELSE
    v_actual_credits_needed := v_base_credits_calculated;
  END IF;

  -- 4. 计算积分调整量（正数=需要额外扣除，负数=需要退还）
  v_credit_adjustment := v_actual_credits_needed - v_credits_already_deducted;

  -- 开始事务块，确保积分调整和项目更新的原子性
  BEGIN
    IF v_credit_adjustment != 0 THEN
      -- 5. 调整用户积分（正数扣除，负数退还）
      UPDATE user_profiles
      SET credits = credits - v_credit_adjustment,
          updated_at = NOW()
      WHERE user_id = v_user_id
      RETURNING credits INTO v_new_credits;

      IF NOT FOUND THEN
        RAISE WARNING 'User profile not found for user_id % during credit adjustment, though project existed.', v_user_id::TEXT;
        RETURN json_build_object('success', false, 'message', 'User profile not found for credit adjustment for job_id: ' || p_job_id::TEXT);
      END IF;
    ELSE
      -- 无需调整，获取当前积分
      SELECT credits INTO v_new_credits FROM user_profiles WHERE user_id = v_user_id;
      IF NOT FOUND THEN
        RAISE WARNING 'User profile not found for user_id % when fetching credits (no adjustment needed).', v_user_id::TEXT;
        RETURN json_build_object('success', false, 'message', 'User profile not found for job_id: ' || p_job_id::TEXT);
      END IF;
    END IF;

    -- 6. 更新项目记录中的实际积分消耗
    UPDATE lipsync_generations
    SET credits_used = v_actual_credits_needed,
        updated_at = NOW()
    WHERE job_id = p_job_id;

    IF NOT FOUND THEN
      RAISE WARNING 'LipSync project with job_id % not found during credits_used update, though it was found initially.', p_job_id::TEXT;
    END IF;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Error during transactional block in adjust_lipsync_credits_by_actual_duration for job_id %: %', p_job_id::TEXT, SQLERRM;
      RETURN json_build_object('success', false, 'message', 'Transactional error adjusting credits or updating project: ' || SQLERRM);
  END;

  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'credits_already_deducted', v_credits_already_deducted,
    'actual_credits_needed', v_actual_credits_needed,
    'credit_adjustment', v_credit_adjustment,
    'new_credit_balance', v_new_credits,
    'message', CASE
      WHEN v_credit_adjustment > 0 THEN 'Additional credits deducted for job_id: ' || p_job_id::TEXT
      WHEN v_credit_adjustment < 0 THEN 'Credits refunded for job_id: ' || p_job_id::TEXT
      ELSE 'No credit adjustment needed for job_id: ' || p_job_id::TEXT
    END,
    'resolution_applied', v_video_resolution,
    'base_credits_calculated', v_base_credits_calculated
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Outer error in adjust_lipsync_credits_by_actual_duration for job_id %: %', p_job_id::TEXT, SQLERRM;
    RETURN json_build_object('success', false, 'message', 'Outer error adjusting credits: ' || SQLERRM);
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
  audio_input_mode VARCHAR,
  voice_id VARCHAR,
  estimated_duration_seconds INTEGER,
  image_url TEXT,
  uploaded_audio_url TEXT,
  recorded_audio_url TEXT,
  audio_content TEXT,
  video_resolution TEXT,
  aspect_ratio TEXT,
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
    lg.audio_input_mode,
    lg.voice_id,
    lg.estimated_duration_seconds,
    lg.image_url,
    lg.uploaded_audio_url,
    lg.recorded_audio_url,
    lg.audio_content,
    lg.video_resolution,
    lg.aspect_ratio,
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
COMMENT ON FUNCTION create_lipsync_project_with_credit_deduction IS 'LipSync Generator - 创建唇形同步视频生成项目并预扣除积分';
COMMENT ON FUNCTION adjust_lipsync_credits_by_actual_duration IS 'LipSync Generator - 根据实际视频时长调整积分（多退少补）';
COMMENT ON FUNCTION get_user_lipsync_generations IS '获取用户的LipSync生成历史记录';
COMMENT ON FUNCTION get_lipsync_generation_status IS '根据job_id获取LipSync生成状态';
COMMENT ON FUNCTION get_user_lipsync_stats IS '获取用户的LipSync生成统计信息';

-- 添加表注释
COMMENT ON TABLE lipsync_generations IS 'LipSync Generator - 唇形同步视频生成记录表';
COMMENT ON COLUMN lipsync_generations.audio_input_mode IS '音频输入模式: upload, record, text';
COMMENT ON COLUMN lipsync_generations.voice_id IS '选择的语音ID: en-US-ken, en-US-natalie, en-US-terrell, en-US-ariana';
COMMENT ON COLUMN lipsync_generations.estimated_duration_seconds IS '估算的视频时长（秒）';
COMMENT ON COLUMN lipsync_generations.image_url IS '输入图片URL';
COMMENT ON COLUMN lipsync_generations.uploaded_audio_url IS '用户上传的音频文件URL';
COMMENT ON COLUMN lipsync_generations.recorded_audio_url IS '用户录音的音频文件URL';
COMMENT ON COLUMN lipsync_generations.audio_content IS '用户输入的文本内容';
COMMENT ON COLUMN lipsync_generations.video_resolution IS '视频分辨率: 540p 或 720p';
COMMENT ON COLUMN lipsync_generations.aspect_ratio IS '视频宽高比: 1:1, 16:9, 9:16';
COMMENT ON COLUMN lipsync_generations.generated_video_url IS '生成的唇形同步视频URL';
COMMENT ON COLUMN lipsync_generations.status IS '处理状态: processing, completed, failed';
COMMENT ON COLUMN lipsync_generations.credits_used IS '消耗的积分数量';
