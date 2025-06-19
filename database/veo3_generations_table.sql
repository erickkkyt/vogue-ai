-- Veo 3 Generator 数据库表结构
-- 创建 veo3_generations 表用于存储视频生成记录

CREATE TABLE IF NOT EXISTS veo3_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID UNIQUE NOT NULL,
  
  -- 输入参数
  generation_mode VARCHAR(50) NOT NULL,
  selected_model VARCHAR(50) NOT NULL,
  text_prompt TEXT,
  image_url TEXT,
  image_prompt TEXT,
  
  -- 输出结果
  video_url TEXT,

  -- 状态管理
  status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  credits_used INTEGER DEFAULT 40,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_veo3_generations_user_id ON veo3_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_veo3_generations_job_id ON veo3_generations(job_id);
CREATE INDEX IF NOT EXISTS idx_veo3_generations_status ON veo3_generations(status);
CREATE INDEX IF NOT EXISTS idx_veo3_generations_created_at ON veo3_generations(created_at);

-- 启用行级安全策略 (RLS)
ALTER TABLE veo3_generations ENABLE ROW LEVEL SECURITY;

-- RLS策略：用户只能查看自己的视频生成记录
CREATE POLICY "Users can view own veo3 generations" ON veo3_generations
  FOR SELECT USING (auth.uid() = user_id);

-- RLS策略：用户可以插入自己的视频生成记录
CREATE POLICY "Users can insert own veo3 generations" ON veo3_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS策略：服务端可以管理所有记录（用于webhook更新）
CREATE POLICY "Service role can manage veo3 generations" ON veo3_generations
  FOR ALL USING (auth.role() = 'service_role');

-- 添加注释
COMMENT ON TABLE veo3_generations IS 'Veo 3 Generator - 存储视频生成请求和结果';
COMMENT ON COLUMN veo3_generations.id IS '主键，自动生成的UUID';
COMMENT ON COLUMN veo3_generations.user_id IS '用户ID，关联到auth.users表';
COMMENT ON COLUMN veo3_generations.job_id IS '任务ID，用于N8N工作流跟踪';
COMMENT ON COLUMN veo3_generations.generation_mode IS '生成模式：text-to-video或image-to-video';
COMMENT ON COLUMN veo3_generations.selected_model IS '选择的模型：veo3或veo3_fast';
COMMENT ON COLUMN veo3_generations.text_prompt IS '文本提示词（文本转视频模式）';
COMMENT ON COLUMN veo3_generations.image_url IS '输入图片URL（图片转视频模式）';
COMMENT ON COLUMN veo3_generations.image_prompt IS '图片动画提示词（图片转视频模式）';
COMMENT ON COLUMN veo3_generations.video_url IS '生成的视频URL（由N8N提供）';
COMMENT ON COLUMN veo3_generations.status IS '生成状态：processing, completed, failed';
COMMENT ON COLUMN veo3_generations.credits_used IS '本次生成使用的积分数量';
COMMENT ON COLUMN veo3_generations.created_at IS '记录创建时间';
COMMENT ON COLUMN veo3_generations.completed_at IS '生成完成时间';
