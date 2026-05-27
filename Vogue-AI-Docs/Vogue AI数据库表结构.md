# Vogue AI 数据库表结构

> **当前项目状态**: 本文记录 Vogue AI 当前 Drizzle/Postgres schema。真实结构以 `src/db/schema.ts` 和 `src/db/migrations/**` 为准。

## 当前项目状态

### 1. 数据库入口

核心文件：

- `src/db/schema.ts`
- `src/db/index.ts`
- `src/db/migrations/0000_misty_jackpot.sql`
- `src/db/migrations/0001_useful_randall.sql`
- `src/db/migrations/0002_black_wrecker.sql`

当前本地 migration 状态：

- `0002_black_wrecker.sql` 已生成，用于把 Vogue AI 的 Drizzle/Postgres 结构对齐本地 `gptimg` 项目。
- 本次只生成 migration，尚未执行 `db:migrate` / `db:push` 到远端数据库。

命令：

```bash
npm run db:generate
npm run db:migrate
npm run db:push
```

当前数据库依赖：

```bash
DATABASE_URL=
```

### 2. Auth 相关表

BetterAuth 使用以下表：

- `user`
- `session`
- `account`
- `verification`

`user` 额外扩展字段：

- `normalized_email`: BetterAuth 归一化邮箱唯一字段
- `customer_id`: Stripe customer id
- `subscription_state`: 当前订阅 price id 或 `free`
- `role`、`banned`、`ban_reason`、`ban_expires`: admin plugin 相关字段

维护原则：

- 不再使用 Supabase Auth 表。
- 不再保留旧 Google One Tap 用户逻辑。
- 用户创建后由 BetterAuth hook 发放注册赠送积分。

### 3. Payment 表

表名：

- `payment`

用途：

- 记录 Stripe Checkout session
- 记录 Stripe invoice
- 关联 user、customer、subscription、price
- 支持订阅和一次性 credit pack

关键字段：

- `price_id`
- `type`
- `scene`
- `interval`
- `user_id`
- `customer_id`
- `subscription_id`
- `session_id`
- `invoice_id`
- `status`
- `paid`
- `period_start`
- `period_end`
- `cancel_at_period_end`
- `trial_start`
- `trial_end`
- `credits_anchor_at`
- `next_price_id`
- `last_plan_change_at`

唯一约束：

- `session_id`
- `invoice_id`

### 4. Credit ledger 表

#### `user_credit`

用途：

- 存每个用户当前积分余额。

关键字段：

- `user_id`
- `current_credits`
- `last_refresh_at`: deprecated，对齐 gptimg 历史字段

约束：

- 每个用户一行，`user_id` 唯一。

#### `credit_transaction`

用途：

- 存积分流水。
- 支持注册赠送、购买、订阅发放、生成预扣、消费确认、释放和退款。

当前交易类型：

- `register_gift`
- `purchase`
- `subscription`
- `reserve`
- `consume`
- `released`
- `refund`

关键字段：

- `type`
- `amount`
- `remaining_amount`
- `plan_id`
- `price_id`
- `subscription_id`
- `grant_month`
- `reference_type`
- `reference_id`
- `expiration_date`
- `expiration_date_processed_at`

当前 reference 类型：

- `register`
- `session`
- `invoice`
- `generation`
- `manual`

索引：

- `type`
- `plan_id`
- `grant_month`
- `reference_type + reference_id`

#### `daily_check_in`

用途：

- 记录每日签到/奖励领取状态。
- 对齐 gptimg 的奖励活动结构。

关键字段：

- `user_id`
- `campaign_key`
- `day_index`
- `credits_granted`
- `checked_in_at`

唯一约束：

- `user_id + campaign_key + day_index`

### 5. Effects 与生成表

#### `effect`

用途：

- 记录模型能力、provider、基础积分和 schema。

关键字段：

- `id`
- `name`
- `type`
- `model`
- `version`
- `credit`
- `link_name`
- `platform`
- `api`
- `provider`
- `input_schema`
- `pricing_schema`

当前静态兜底 effect：

- 16: GPT Image 2
- 15: GPT Image 1.5
- 4: Nano Banana 2
- 5: Nano Banana
- 6: Nano Banana Pro

说明：

- `getEffectById` 会优先查数据库，查不到时回退静态配置。
- `ensureEffectRow` 可把静态 effect 写入数据库。

#### `generation_history`

用途：

- 记录每次生成任务。

关键字段：

- `user_id`
- `effect_id`
- `status`
- `provider_task_id`
- `lifecycle_phase`
- `last_provider_sync_at`
- `input`
- `output`
- `error`
- `credits_used`
- `created_at`

维护原则：

- 用户只能查询自己的 generation。
- provider task id 用于 status 同步。
- `generation_history.updated_at` 已移除，对齐 gptimg 当前结构。
- `lifecycle_phase` 和 `last_provider_sync_at` 用于任务运行态与后台同步查询。
- output 当前可以直接存 provider 返回的 JSON。

### 6. Asset 表

#### `user_asset`

用途：

- 用户资产持久化。
- 用于 R2/对象存储里的参考图、生成结果。

关键字段：

- `type`
- `source`
- `bucket`
- `object_key`
- `public_url`
- `mime_type`
- `size_bytes`
- `sha256`
- `metadata`

#### `generation_asset_link`

用途：

- 关联 generation 与 asset。

关键字段：

- `generation_id`
- `asset_id`
- `role`

当前状态：

- 表结构已存在。
- `/app` 参考图上传和 provider 输出图片会尽量写入 `user_asset`。
- `generation_asset_link` 通过 `input` / `output` role 关联 generation 与资产。
- 如果对象存储未配置或复制失败，生成输出仍会在 `generation_history.output` 保留 provider URL 作为降级。

### 7. 权限与 RLS

`0002_black_wrecker.sql` 同步了 gptimg 的 DB 权限收紧策略：

- revoke `anon` / `authenticated` 对核心私有表的直接访问。
- revoke 后续默认 table/sequence 权限。
- 对 `verification`、`account`、`session`、`user_credit`、`generation_asset_link`、`user_asset`、`user`、`effect`、`credit_transaction`、`payment`、`generation_history` 启用 Row Level Security。

说明：

- 应用仍通过服务端 DB 连接访问这些表。
- `daily_check_in` 按 gptimg 当前迁移顺序新增，不在 RLS 启用列表里；默认权限已被收紧。

### 8. 数据库上线注意事项

- 生产 `DATABASE_URL` 必须指向新 Vogue AI 数据库，不要复用旧 Supabase auth/payment 结构。
- 迁移前先确认当前数据库为空或已有备份。
- `db:migrate` 跑通后再接 Stripe webhook 和真实 provider。
- 如果 Stripe webhook 已经在线，数据库迁移必须避免重复发放订阅或 credit pack 积分。
- effect 表可以用静态 fallback 启动，但上线前最好写入数据库，便于后续运营后台管理。
