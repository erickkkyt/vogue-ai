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

-- ============================================
-- Seedance AI Generator Webhook 更新函数
-- ============================================

-- 更新Seedance生成状态的函数（用于webhook）
CREATE OR REPLACE FUNCTION update_seedance_generation_status(
  p_job_id UUID,
  p_status TEXT,
  p_video_url TEXT DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL
) RETURNS TABLE(
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_record_exists BOOLEAN;
  v_current_status TEXT;
BEGIN
  -- 检查记录是否存在
  SELECT EXISTS(
    SELECT 1 FROM seedance_generations
    WHERE job_id = p_job_id
  ), status INTO v_record_exists, v_current_status
  FROM seedance_generations
  WHERE job_id = p_job_id;

  IF NOT v_record_exists THEN
    RETURN QUERY SELECT FALSE, 'Generation record not found'::TEXT;
    RETURN;
  END IF;

  -- 检查当前状态是否为processing
  IF v_current_status != 'processing' THEN
    RETURN QUERY SELECT FALSE, ('Record already processed with status: ' || v_current_status)::TEXT;
    RETURN;
  END IF;

  -- 更新记录
  UPDATE seedance_generations
  SET
    status = p_status,
    video_url = CASE WHEN p_status = 'completed' THEN p_video_url ELSE video_url END,
    error_message = CASE WHEN p_status = 'failed' THEN p_error_message ELSE error_message END,
    completed_at = NOW()
  WHERE job_id = p_job_id;

  RETURN QUERY SELECT TRUE, 'Status updated successfully'::TEXT;

EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'update_seedance_generation_status error for job %: % %', p_job_id, SQLERRM, SQLSTATE;
    RETURN QUERY SELECT FALSE, ('Database error: ' || SQLERRM)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- LipSync Generator Webhook 更新函数
-- ============================================

-- 更新LipSync生成状态的函数（用于webhook）
CREATE OR REPLACE FUNCTION update_lipsync_generation_status(
  p_job_id UUID,
  p_status TEXT,
  p_video_url TEXT DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL
) RETURNS TABLE(
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_record_exists BOOLEAN;
  v_current_status TEXT;
BEGIN
  -- 检查记录是否存在
  SELECT EXISTS(
    SELECT 1 FROM lipsync_generations
    WHERE job_id = p_job_id
  ), status INTO v_record_exists, v_current_status
  FROM lipsync_generations
  WHERE job_id = p_job_id;

  IF NOT v_record_exists THEN
    RETURN QUERY SELECT FALSE, 'Generation record not found'::TEXT;
    RETURN;
  END IF;

  -- 检查当前状态是否为processing
  IF v_current_status != 'processing' THEN
    RETURN QUERY SELECT FALSE, ('Record already processed with status: ' || v_current_status)::TEXT;
    RETURN;
  END IF;

  -- 更新记录
  UPDATE lipsync_generations
  SET
    status = p_status,
    generated_video_url = CASE WHEN p_status = 'completed' THEN p_video_url ELSE generated_video_url END,
    error_message = CASE WHEN p_status = 'failed' THEN p_error_message ELSE error_message END,
    completed_at = NOW()
  WHERE job_id = p_job_id;

  RETURN QUERY SELECT TRUE, 'Status updated successfully'::TEXT;

EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'update_lipsync_generation_status error for job %: % %', p_job_id, SQLERRM, SQLSTATE;
    RETURN QUERY SELECT FALSE, ('Database error: ' || SQLERRM)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 更新Earth Zoom生成状态的函数（用于webhook）
CREATE OR REPLACE FUNCTION update_earth_zoom_generation_status(
  p_job_id UUID,
  p_status TEXT,
  p_video_url TEXT DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL
) RETURNS TABLE(
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_record_exists BOOLEAN;
  v_current_status TEXT;
BEGIN
  -- 检查记录是否存在
  SELECT EXISTS(
    SELECT 1 FROM earth_zoom_generations
    WHERE job_id = p_job_id
  ), status INTO v_record_exists, v_current_status
  FROM earth_zoom_generations
  WHERE job_id = p_job_id;

  IF NOT v_record_exists THEN
    RETURN QUERY SELECT FALSE, 'Generation record not found'::TEXT;
    RETURN;
  END IF;

  -- 检查状态是否已经是最终状态
  IF v_current_status IN ('completed', 'failed') THEN
    RETURN QUERY SELECT FALSE, 'Generation already in final state'::TEXT;
    RETURN;
  END IF;

  -- 更新记录
  IF p_status = 'completed' THEN
    UPDATE earth_zoom_generations
    SET
      status = p_status,
      generated_video_url = p_video_url,
      completed_at = NOW()
    WHERE job_id = p_job_id;
  ELSIF p_status = 'failed' THEN
    UPDATE earth_zoom_generations
    SET
      status = p_status,
      error_message = p_error_message,
      completed_at = NOW()
    WHERE job_id = p_job_id;
  ELSE
    UPDATE earth_zoom_generations
    SET status = p_status
    WHERE job_id = p_job_id;
  END IF;

  RETURN QUERY SELECT TRUE, 'Status updated successfully'::TEXT;

EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'update_earth_zoom_generation_status error for job %: % %', p_job_id, SQLERRM, SQLSTATE;
    RETURN QUERY SELECT FALSE, ('Database error: ' || SQLERRM)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 添加函数注释
COMMENT ON FUNCTION update_seedance_generation_status IS 'Seedance AI Generator - 更新生成状态（用于webhook）';
COMMENT ON FUNCTION update_lipsync_generation_status IS 'LipSync Generator - 更新生成状态（用于webhook）';
COMMENT ON FUNCTION update_earth_zoom_generation_status IS 'Earth Zoom Effect Generator - 更新生成状态（用于webhook）';