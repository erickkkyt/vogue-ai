# Veo 3 Generator 集成完整指南

## 🎯 **您需要进行的操作**

### 立即操作清单：

1. **Supabase 数据库配置**
   - [ ] 在 Supabase SQL Editor 中执行 `database/veo3_generations_table.sql`
   - [ ] 在 Supabase SQL Editor 中执行 `database/veo3_rpc_functions.sql`
   - [ ] 验证表和函数创建成功

2. **环境变量配置**
   - [ ] 确认现有的 `N8N_API_KEY` 和 R2 配置正确
   - [ ] N8N Webhook URL 已硬编码为生产环境地址

3. **N8N 工作流创建**
   - [ ] 创建新的 N8N 工作流
   - [ ] 配置 Webhook 触发器（路径：`/webhook/veo3-generator`）
   - [ ] 添加 Veo 3 视频生成逻辑
   - [ ] 配置回调通知到 `/api/webhook/veo3-ready`

4. **测试验证**
   - [ ] 前端功能测试（文本转视频、图片转视频）
   - [ ] API 接口测试
   - [ ] N8N 工作流测试
   - [ ] 端到端集成测试

---

## 📋 **完整集成流程**

### 阶段一：数据库设置

#### 1.1 创建 veo3_generations 表

**文件位置**: `database/veo3_generations_table.sql`

**表结构特点**:
- 支持两种生成模式：`text-to-video` 和 `image-to-video`
- 支持两种模型：`veo3` (40积分) 和 `veo3_fast` (15积分)
- 完整的状态管理：`processing` → `completed`/`failed`
- RLS 安全策略保护用户数据

**关键字段**:
```sql
generation_mode VARCHAR(20) -- 'text-to-video' | 'image-to-video'
selected_model VARCHAR(20)  -- 'veo3' | 'veo3_fast'
text_prompt TEXT           -- 文本提示词
image_url TEXT            -- 图片URL（R2存储）
image_prompt TEXT         -- 图片动画提示词
video_url TEXT           -- 生成的视频URL
credits_used INTEGER     -- 使用的积分数量
```

#### 1.2 创建 RPC 函数

**文件位置**: `database/veo3_rpc_functions.sql`

**函数功能**: `create_veo3_project`
- 根据模型自动计算所需积分
- 检查用户积分余额
- 防止并发生成（检查现有处理中项目）
- 原子性操作：扣除积分 + 创建记录

**积分规则**:
- veo3: 40 积分
- veo3_fast: 15 积分
- 图片转视频模式仅支持 veo3

### 阶段二：后端 API 开发

#### 2.1 生成请求 API

**文件位置**: `src/app/api/veo3/generate/route.ts`

**处理流程**:
1. **用户认证**: 验证登录状态
2. **数据验证**: 检查必填字段和模式兼容性
3. **文件上传**: 图片转视频模式下上传图片到 R2
4. **积分扣除**: 调用 RPC 函数创建项目并扣除积分
5. **N8N 调用**: 发送请求到 N8N 工作流
6. **响应返回**: 返回任务状态和积分扣除信息

**关键验证逻辑**:
```typescript
// 图片转视频模式下，veo3_fast 不支持
if (generationMode === 'image-to-video' && selectedModel === 'veo3_fast') {
  return NextResponse.json({ message: 'veo3_fast model only supports text-to-video mode' }, { status: 400 });
}
```

**N8N 请求体结构**:
```typescript
interface N8nVeo3RequestBody {
  jobId: string;
  userId: string;
  generationMode: 'text-to-video' | 'image-to-video';
  selectedModel: 'veo3' | 'veo3_fast';
  textPrompt?: string;
  imageUrl?: string;    // R2 存储的图片URL
  imagePrompt?: string;
}
```

#### 2.2 Webhook 回调 API

**文件位置**: `src/app/api/webhook/veo3-ready/route.ts`

**安全机制**:
- Bearer Token 认证（使用 N8N_API_KEY）
- 幂等性处理（避免重复更新）
- 管理员权限（绕过 RLS）

**处理逻辑**:
- **成功状态**: 更新 video_url、completed_at
- **失败状态**: 更新 completed_at
- **数据验证**: 成功状态必须包含 videoUrl

### 阶段三：前端集成

#### 3.1 组件更新

**文件位置**: `src/components/veo-3-generator/Veo3GeneratorClient.tsx`

**更新内容**:
- 实现真实的 API 调用逻辑
- 完善错误处理和用户反馈
- 积分检查和状态管理
- 成功后跳转到项目页面

**API 调用流程**:
```typescript
const formData = new FormData();
formData.append('generationMode', generationMode);
formData.append('selectedModel', selectedModel);

if (generationMode === 'text-to-video') {
  formData.append('textPrompt', textPrompt);
} else {
  formData.append('imagePrompt', imagePrompt);
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }
}

const response = await fetch('/api/veo3/generate', {
  method: 'POST',
  body: formData
});
```

#### 3.2 类型定义

**文件位置**: `src/types/project.ts`

**新增类型**: `Veo3Generation`
- 完整的字段定义
- 与数据库表结构一致
- 支持 TypeScript 类型检查

#### 3.3 项目列表集成

**组件结构**:
```
src/components/
└── shared/
    ├── DashboardSection.tsx  # 多页面使用的dashboard区域
    ├── DashboardSiderbar.tsx # 多页面使用的侧边栏（已更新描述）
    └── ProjectsClient.tsx    # 需要添加 veo3_generations 支持
```

**更新要点**:
- 在 `src/app/projects/page.tsx` 中查询 `veo3_generations` 表
- 在 `ProjectsClient.tsx` 中添加 Veo 3 项目的渲染逻辑
- 统一的项目状态显示和操作

### 阶段四：N8N 工作流配置

#### 4.1 Webhook 触发器配置

**设置要求**:
- HTTP 方法: POST
- 路径: `/webhook/veo3-generator`
- 认证: Bearer Token (使用 N8N_API_KEY)
- 内容类型: application/json

#### 4.2 业务逻辑分支

**条件分支**:
1. **文本转视频分支**:
   - 输入: `textPrompt`
   - 模型选择: `veo3` 或 `veo3_fast`
   - 处理逻辑: 直接调用 Veo 3 API

2. **图片转视频分支**:
   - 输入: `imageUrl` + `imagePrompt`
   - 模型限制: 仅支持 `veo3`
   - 处理逻辑: 下载图片 → 调用 Veo 3 API

#### 4.3 回调通知配置

**HTTP Request 节点**:
- URL: `https://your-domain.com/api/webhook/veo3-ready`
- 方法: POST
- 认证: Bearer Token (N8N_API_KEY)

**回调数据结构**:
```json
{
  "jobId": "{{$node.Webhook.json.jobId}}",
  "status": "completed" | "failed",
  "videoUrl": "生成的视频URL（成功时）"
}
```

### 阶段五：测试验证

#### 5.1 单元测试

**API 测试**:
```bash
# 文本转视频测试
curl -X POST http://localhost:3000/api/veo3/generate \
  -H "Authorization: Bearer USER_TOKEN" \
  -F "generationMode=text-to-video" \
  -F "selectedModel=veo3" \
  -F "textPrompt=A cat playing piano"

# 图片转视频测试
curl -X POST http://localhost:3000/api/veo3/generate \
  -H "Authorization: Bearer USER_TOKEN" \
  -F "generationMode=image-to-video" \
  -F "selectedModel=veo3" \
  -F "imagePrompt=Make the cat dance" \
  -F "imageFile=@cat.jpg"
```

**Webhook 测试**:
```bash
curl -X POST http://localhost:3000/api/webhook/veo3-ready \
  -H "Authorization: Bearer N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "test-job-id",
    "status": "completed",
    "videoUrl": "https://example.com/video.mp4"
  }'
```

#### 5.2 集成测试

**完整流程验证**:
1. 前端提交生成请求
2. 后端处理并调用 N8N
3. N8N 执行视频生成
4. N8N 回调更新状态
5. 前端显示生成结果

#### 5.3 错误场景测试

**测试用例**:
- 积分不足
- 并发生成限制
- 文件上传失败
- N8N 工作流失败
- 网络超时处理

### 阶段六：部署和监控

#### 6.1 环境变量检查

**生产环境配置**:
```bash
# 必需的环境变量
# N8N Webhook URL 已硬编码为: https://n8n-avskrukq.us-east-1.clawcloudrun.com/webhook/cefb223c-d58f-4be7-8d4a-001f367cdb73
N8N_API_KEY=n8n_sk_7gHkLpWqS2mXvY3bZ8cJfR9aDeN1oP
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 6.2 监控指标

**关键指标**:
- API 响应时间
- 成功/失败率
- 积分扣除准确性
- N8N 工作流执行时间
- 用户满意度

#### 6.3 日志记录

**日志级别**:
- INFO: 正常操作流程
- WARN: 可恢复的错误
- ERROR: 需要人工干预的错误

---

## 🔧 **技术架构总结**

### 数据流向
```
前端表单 → API路由 → Supabase RPC → N8N工作流 → Webhook回调 → 数据库更新 → 前端显示
```

### 安全机制
- RLS 策略保护用户数据
- Bearer Token 认证 N8N 通信
- 文件上传大小限制
- 积分扣除原子性操作

### 扩展性设计
- 模块化的 API 路由结构
- 可配置的模型和积分规则
- 统一的错误处理机制
- 标准化的 N8N 集成模式

这个集成方案为未来添加更多 AI 工具提供了标准化的模板和最佳实践。
