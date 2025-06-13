-- AI Baby Generator 数据库表结构
-- 创建 baby_generations 表用于存储婴儿生成记录

CREATE TABLE IF NOT EXISTS baby_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID UNIQUE NOT NULL,
  father_image_url TEXT NOT NULL,
  mother_image_url TEXT NOT NULL,
  baby_gender VARCHAR(10) NOT NULL CHECK (baby_gender IN ('boy', 'girl')),
  status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  generated_baby_url TEXT,
  credits_used INTEGER DEFAULT 3,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_baby_generations_user_id ON baby_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_baby_generations_job_id ON baby_generations(job_id);
CREATE INDEX IF NOT EXISTS idx_baby_generations_status ON baby_generations(status);
CREATE INDEX IF NOT EXISTS idx_baby_generations_created_at ON baby_generations(created_at);

-- 启用行级安全策略 (RLS)
ALTER TABLE baby_generations ENABLE ROW LEVEL SECURITY;

-- RLS策略：用户只能查看自己的婴儿生成记录
CREATE POLICY "Users can view own baby generations" ON baby_generations
  FOR SELECT USING (auth.uid() = user_id);

-- RLS策略：用户可以插入自己的婴儿生成记录
CREATE POLICY "Users can insert own baby generations" ON baby_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS策略：服务端可以管理所有记录（用于webhook更新）
CREATE POLICY "Service role can manage baby generations" ON baby_generations
  FOR ALL USING (auth.role() = 'service_role');

-- 添加注释
COMMENT ON TABLE baby_generations IS 'AI Baby Generator - 存储婴儿生成请求和结果';
COMMENT ON COLUMN baby_generations.id IS '主键，自动生成的UUID';
COMMENT ON COLUMN baby_generations.user_id IS '用户ID，关联到auth.users表';
COMMENT ON COLUMN baby_generations.job_id IS '任务ID，用于N8N工作流跟踪';
COMMENT ON COLUMN baby_generations.father_image_url IS '父亲照片在R2存储的URL';
COMMENT ON COLUMN baby_generations.mother_image_url IS '母亲照片在R2存储的URL';
COMMENT ON COLUMN baby_generations.baby_gender IS '婴儿性别：boy或girl';
COMMENT ON COLUMN baby_generations.status IS '生成状态：processing, completed, failed';
COMMENT ON COLUMN baby_generations.generated_baby_url IS '生成的婴儿图片URL（由N8N提供）';
COMMENT ON COLUMN baby_generations.credits_used IS '本次生成使用的积分数量';
COMMENT ON COLUMN baby_generations.error_message IS '错误信息（如果生成失败）';
COMMENT ON COLUMN baby_generations.created_at IS '记录创建时间';
COMMENT ON COLUMN baby_generations.completed_at IS '生成完成时间';
