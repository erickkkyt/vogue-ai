-- 迁移脚本：移除 Creem 支付相关字段，只保留 Stripe
-- 执行前请备份数据库！

-- 1. 备份现有的 payments 表数据（如果有的话）
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN
        DROP TABLE IF EXISTS payments_backup;
        CREATE TABLE payments_backup AS SELECT * FROM payments;
        RAISE NOTICE 'payments 表已备份到 payments_backup';
    ELSE
        RAISE NOTICE 'payments 表不存在，跳过备份';
    END IF;
END $$;

-- 2. 备份现有的 subscriptions 表数据（如果有的话）
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subscriptions') THEN
        DROP TABLE IF EXISTS subscriptions_backup;
        CREATE TABLE subscriptions_backup AS SELECT * FROM subscriptions;
        RAISE NOTICE 'subscriptions 表已备份到 subscriptions_backup';
    ELSE
        RAISE NOTICE 'subscriptions 表不存在，跳过备份';
    END IF;
END $$;

-- 3. 删除现有的支付相关表（CASCADE 会自动删除相关索引和策略）
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- 4. 重新创建 payments 表（仅支持 Stripe）
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_checkout_id VARCHAR UNIQUE NOT NULL,
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  credits_added INTEGER NOT NULL,
  status VARCHAR DEFAULT 'completed',
  processed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. 重新创建 subscriptions 表（仅支持 Stripe）
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR UNIQUE NOT NULL,
  stripe_customer_id VARCHAR NOT NULL,
  stripe_price_id VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. 创建索引（使用 IF NOT EXISTS 避免重复创建错误）
-- 注意：payment_intents 表的索引只有在该表存在时才创建
DO $$
BEGIN
    -- 为 payment_intents 表创建索引（如果表存在）
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_intents') THEN
        CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON payment_intents(user_id);
        CREATE INDEX IF NOT EXISTS idx_payment_intents_request_id ON payment_intents(request_id);
        RAISE NOTICE 'payment_intents 表索引已创建';
    ELSE
        RAISE NOTICE 'payment_intents 表不存在，跳过索引创建';
    END IF;

    -- 为新的 payments 表创建索引
    CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_stripe_checkout_id ON payments(stripe_checkout_id);

    -- 为新的 subscriptions 表创建索引
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

    RAISE NOTICE '所有索引创建完成';
END $$;

-- 7. 启用 RLS 安全策略
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 8. 创建 RLS 策略（使用 DO 块处理可能的重复策略错误）
DO $$
BEGIN
    -- 为 payments 表创建策略
    BEGIN
        CREATE POLICY "Users can view own payments" ON payments
          FOR SELECT USING (auth.uid() = user_id);
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE '策略 "Users can view own payments" 已存在，跳过创建';
    END;

    BEGIN
        CREATE POLICY "Service role can manage payments" ON payments
          FOR ALL USING (auth.role() = 'service_role');
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE '策略 "Service role can manage payments" 已存在，跳过创建';
    END;

    -- 为 subscriptions 表创建策略
    BEGIN
        CREATE POLICY "Users can view own subscriptions" ON subscriptions
          FOR SELECT USING (auth.uid() = user_id);
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE '策略 "Users can view own subscriptions" 已存在，跳过创建';
    END;

    BEGIN
        CREATE POLICY "Service role can manage subscriptions" ON subscriptions
          FOR ALL USING (auth.role() = 'service_role');
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE '策略 "Service role can manage subscriptions" 已存在，跳过创建';
    END;

    RAISE NOTICE '所有 RLS 策略创建完成';
END $$;

-- 9. 添加表注释
COMMENT ON TABLE payments IS 'Stripe 支付记录表 - 记录所有通过 Stripe 完成的支付';
COMMENT ON TABLE subscriptions IS 'Stripe 订阅记录表 - 记录所有 Stripe 订阅套餐';

-- 10. 验证迁移结果
DO $$
BEGIN
    RAISE NOTICE '=== 迁移完成 ===';
    RAISE NOTICE '已创建表: payments, subscriptions';
    RAISE NOTICE '备份表: payments_backup, subscriptions_backup (如果原表存在)';
    RAISE NOTICE '注意: 如果需要恢复数据，请从备份表中手动迁移数据';
    RAISE NOTICE '因为表结构已更改，需要手动映射字段';
END $$;
