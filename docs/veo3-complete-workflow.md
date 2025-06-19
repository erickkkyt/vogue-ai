# Veo 3 Generator 完整工作流程

## 🎯 **优化后的完整流程**

### **阶段一：用户点击生成按钮**

#### **1.1 前端状态检查**
- ✅ **组件加载时检查**：`useEffect` 自动检查是否有活跃项目
- ✅ **按钮状态管理**：根据 `hasActiveProject` 状态禁用按钮
- ✅ **实时状态显示**：显示"正在处理中"或"检查状态中"

#### **1.2 生成前验证**
```typescript
// 1. 用户认证检查
// 2. 积分余额检查
// 3. 活跃项目检查（双重保险）
const hasActive = await checkActiveProject();
if (hasActive) {
  alert('You have an active video generation task in progress. Please wait for it to complete before trying again.');
  return;
}
```

#### **1.3 表单数据准备**
- 生成模式：`text-to-video` 或 `image-to-video`
- 模型选择：`veo3` (40积分) 或 `veo3_fast` (15积分)
- 内容数据：文本提示词或图片+动画提示词

### **阶段二：API 处理 (`/api/veo3/generate`)**

#### **2.1 服务端验证**
```typescript
// 1. 用户认证
// 2. 文件上传处理（如果是图片模式）
// 3. 数据验证
```

#### **2.2 RPC 调用**
```sql
-- 调用 create_veo3_project RPC 函数
-- 1. 检查用户积分
-- 2. 检查活跃项目（数据库级别）
-- 3. 扣除积分
-- 4. 创建项目记录（status = 'processing'）
```

#### **2.3 N8N 触发**
```typescript
// 发送请求到 N8N Webhook
const n8nRequestBody = {
  jobId,
  userId: user.id,
  generationMode,
  selectedModel,
  textPrompt, // 或 imageUrl + imagePrompt
};
```

### **阶段三：N8N 处理**

#### **3.1 Webhook 接收**
- **URL**: `https://n8n-avskrukq.us-east-1.clawcloudrun.com/webhook/cefb223c-d58f-4be7-8d4a-001f367cdb73`
- **认证**: Bearer Token (N8N_API_KEY)
- **数据**: 生成参数

#### **3.2 业务逻辑分支**
```
文本转视频分支:
├── veo3 模型 (40积分)
├── veo3_fast 模型 (15积分)
└── 直接调用 Veo 3 API

图片转视频分支:
├── 仅支持 veo3 模型 (40积分)
├── 下载图片文件
└── 调用 Veo 3 API
```

#### **3.3 回调通知**
```typescript
// 成功时
{
  "jobId": "uuid",
  "status": "completed",
  "videoUrl": "生成的视频URL"
}

// 失败时
{
  "jobId": "uuid", 
  "status": "failed"
}
```

### **阶段四：Webhook 回调处理 (`/api/webhook/veo3-ready`)**

#### **4.1 安全验证**
- Bearer Token 认证
- 请求体验证
- 幂等性检查

#### **4.2 数据库更新**
```sql
-- 成功时
UPDATE veo3_generations SET 
  status = 'completed',
  video_url = '视频URL',
  completed_at = NOW()
WHERE job_id = 'uuid';

-- 失败时  
UPDATE veo3_generations SET
  status = 'failed',
  completed_at = NOW()
WHERE job_id = 'uuid';
```

### **阶段五：前端状态同步**

#### **5.1 轮询检查**
```typescript
// 每5秒检查一次状态
const pollInterval = setInterval(async () => {
  const status = await checkVideoStatus(jobId);
  
  if (status.status === 'completed') {
    // 显示视频预览
    // 重置活跃项目状态
    setHasActiveProject(false);
  } else if (status.status === 'failed') {
    // 显示错误信息
    // 重置活跃项目状态  
    setHasActiveProject(false);
  }
}, 5000);
```

#### **5.2 状态管理**
- ✅ **processing**: 按钮禁用，显示"视频处理中"
- ✅ **completed**: 显示视频预览，重置状态
- ✅ **failed**: 显示错误信息，重置状态

## 🔧 **关键优化点**

### **1. 并发控制**
- **数据库级别**：RPC 函数检查 `status = 'processing'`
- **前端级别**：`hasActiveProject` 状态管理
- **双重保险**：生成前再次检查活跃项目

### **2. 状态同步**
- **实时检查**：组件加载时检查活跃项目
- **轮询更新**：生成后每5秒检查状态
- **状态重置**：完成/失败时重置活跃状态

### **3. 用户体验**
- **按钮状态**：根据状态显示不同文本
- **状态提示**：显示当前处理状态信息
- **视频预览**：完成后立即显示预览

### **4. 错误处理**
- **积分不足**：提前检查并提示
- **活跃项目**：阻止重复提交
- **生成失败**：显示错误信息并重置状态

## 📊 **数据流图**

```
用户点击生成
    ↓
前端状态检查
    ↓
API 验证 + RPC 调用
    ↓
数据库更新 (status = 'processing')
    ↓
N8N Webhook 触发
    ↓
Veo 3 API 处理
    ↓
N8N 回调通知
    ↓
数据库状态更新
    ↓
前端轮询检查
    ↓
状态同步 + 预览显示
```

## 🚀 **部署检查清单**

- [ ] 数据库表和 RPC 函数已创建
- [ ] N8N Webhook URL 已硬编码为生产环境地址
- [ ] N8N 工作流已部署
- [ ] Webhook 回调 URL 已配置
- [ ] 前端组件已更新
- [ ] 状态管理逻辑已测试
