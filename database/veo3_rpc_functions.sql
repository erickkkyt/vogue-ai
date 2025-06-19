-- Veo 3 Generator RPC 函数
-- 创建初始项目并扣除积分的函数

CREATE OR REPLACE FUNCTION create_veo3_project(
  p_user_id UUID,
  p_job_id UUID,
  p_generation_mode TEXT,
  p_selected_model TEXT,
  p_text_prompt TEXT DEFAULT NULL,
  p_image_url TEXT DEFAULT NULL,
  p_image_prompt TEXT DEFAULT NULL
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
    WHEN p_selected_model = 'veo3' THEN 40
    WHEN p_selected_model = 'veo3_fast' THEN 15
    ELSE 40
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
    SELECT 1 FROM veo3_generations
    WHERE veo3_generations.user_id = p_user_id AND veo3_generations.status = 'processing'
  ) THEN
    RETURN QUERY SELECT p_job_id, 'active_project_exists'::TEXT, 0;
    RETURN;
  END IF;
  
  -- 扣除积分
  UPDATE user_profiles 
  SET credits = credits - v_required_credits,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- 创建项目记录
  INSERT INTO veo3_generations (
    user_id, job_id, generation_mode, selected_model,
    text_prompt, image_url, image_prompt, credits_used, status
  ) VALUES (
    p_user_id, p_job_id, p_generation_mode, p_selected_model,
    p_text_prompt, p_image_url, p_image_prompt, v_required_credits, 'processing'
  );
  
  RETURN QUERY SELECT p_job_id, 'processing'::TEXT, v_required_credits;
  
EXCEPTION
  WHEN OTHERS THEN
    -- 记录详细错误信息
    RAISE LOG 'create_veo3_project error for job %: % %', p_job_id, SQLERRM, SQLSTATE;
    -- 发生错误时回滚并返回错误状态
    RETURN QUERY SELECT p_job_id, ('database_error: ' || SQLERRM)::TEXT, 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 添加函数注释
COMMENT ON FUNCTION create_veo3_project IS 'Veo 3 Generator - 创建视频生成项目并扣除用户积分';
