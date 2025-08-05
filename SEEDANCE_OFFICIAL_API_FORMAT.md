# 🎭 Seedance 官方API格式优化

## 📊 **基于官方示例的格式更新**

根据你提供的官方示例，我已经优化了所有相关代码。

## 🔄 **轮询查询请求格式 (官方)**

### **HTTP请求**
```bash
curl -X GET "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/cgt-2025****" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ARK_API_KEY"
```

### **请求详情**
| 项目 | 值 |
|------|---|
| **方法** | `GET` |
| **URL** | `https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/{id}` |
| **Headers** | `Content-Type: application/json`<br>`Authorization: Bearer {ARK_API_KEY}` |

## 📋 **官方响应格式**

### **成功响应示例**
```json
{
  "id": "cgt-2025******-****",
  "model": "doubao-seedance-1-0-pro-250528",
  "status": "succeeded",
  "content": {
    "video_url": "https://ark-content-generation-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-1-0-pro/****.mp4?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=AKLTY****%2Fcn-beijing%2Ftos%2Frequest&X-Tos-Date=20250331T095113Z&X-Tos-Expires=86400&X-Tos-Signature=***&X-Tos-SignedHeaders=host"
  },
  "seed": 10,
  "resolution": "720p",
  "duration": 5,
  "ratio": "16:9",
  "framespersecond": 24,
  "usage": {
    "completion_tokens": 108900,
    "total_tokens": 108900
  },
  "created_at": 1743414619,
  "updated_at": 1743414673
}
```

## 🔧 **关键差异与修正**

### **1. 成功状态名称**
- ❌ **之前**: `succeed`
- ✅ **正确**: `succeeded`

### **2. 视频URL位置**
- ❌ **之前**: `result.video_url`
- ✅ **正确**: `content.video_url`

### **3. 错误信息位置**
- ❌ **之前**: `result.error_message`
- ✅ **正确**: `error.message`

### **4. 请求头**
- ❌ **之前**: 只有 `Authorization`
- ✅ **正确**: 添加 `Content-Type: application/json`

### **5. 时间戳格式**
- ❌ **之前**: ISO字符串
- ✅ **正确**: Unix时间戳 (数字)

## 📊 **更新后的接口定义**

### **TypeScript接口**
```typescript
export interface SeedanceTaskResponse {
  id: string;
  model: string;
  status: 'pending' | 'running' | 'succeeded' | 'failed';
  content?: {
    video_url?: string;
  };
  error?: {
    message?: string;
  };
  seed?: number;
  resolution?: string;
  duration?: number;
  ratio?: string;
  framespersecond?: number;
  usage?: {
    completion_tokens: number;
    total_tokens: number;
  };
  created_at: number; // Unix timestamp
  updated_at: number; // Unix timestamp
}
```

## 🔄 **状态处理逻辑更新**

### **成功处理**
```typescript
if (status.status === 'succeeded' && status.content?.video_url) {
  console.log('Video URL:', status.content.video_url);
  console.log('Task details:', {
    model: status.model,
    resolution: status.resolution,
    duration: status.duration,
    ratio: status.ratio,
    framespersecond: status.framespersecond,
    usage: status.usage
  });
  
  // 更新数据库
  await updateDatabase({
    status: 'completed',
    video_url: status.content.video_url,
    completed_at: new Date().toISOString()
  });
}
```

### **失败处理**
```typescript
if (status.status === 'failed') {
  const errorMessage = status.error?.message || 'Unknown error';
  console.error('Task failed:', errorMessage);
  
  // 更新数据库
  await updateDatabase({
    status: 'failed',
    error_message: errorMessage,
    completed_at: new Date().toISOString()
  });
}
```

## 📈 **响应字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 任务唯一标识符 |
| `model` | string | 使用的模型名称 |
| `status` | string | 任务状态: pending/running/succeeded/failed |
| `content.video_url` | string | 生成的视频URL (成功时) |
| `error.message` | string | 错误信息 (失败时) |
| `seed` | number | 随机种子 |
| `resolution` | string | 分辨率 (720p/1080p) |
| `duration` | number | 视频时长 (秒) |
| `ratio` | string | 宽高比 (16:9/9:16/1:1) |
| `framespersecond` | number | 帧率 (通常24) |
| `usage.completion_tokens` | number | 消耗的token数 |
| `usage.total_tokens` | number | 总token数 |
| `created_at` | number | 创建时间 (Unix时间戳) |
| `updated_at` | number | 更新时间 (Unix时间戳) |

## 🎯 **轮询时间线示例 (官方格式)**

### **成功案例**
```
00:00 - 创建任务
返回: {"id": "cgt-2025123456", "status": "pending"}

00:20 - 第1次查询
{
  "id": "cgt-2025123456",
  "status": "pending",
  "created_at": 1743414619
}

00:40 - 第2次查询
{
  "id": "cgt-2025123456", 
  "status": "running",
  "updated_at": 1743414639
}

01:40 - 第5次查询 (成功)
{
  "id": "cgt-2025123456",
  "model": "doubao-seedance-1-0-pro-250528",
  "status": "succeeded",
  "content": {
    "video_url": "https://ark-content-generation-cn-beijing.tos-cn-beijing.volces.com/..."
  },
  "resolution": "720p",
  "duration": 5,
  "ratio": "16:9",
  "framespersecond": 24,
  "usage": {
    "completion_tokens": 108900,
    "total_tokens": 108900
  },
  "created_at": 1743414619,
  "updated_at": 1743414673
}
```

## ✅ **已完成的代码更新**

1. **火山引擎客户端** (`src/lib/volcengine-client.ts`)
   - ✅ 更新接口定义匹配官方格式
   - ✅ 添加 `Content-Type` 请求头
   - ✅ 修正状态检查: `succeeded` 和 `content.video_url`

2. **API路由** (`src/app/api/seedance/generate/route.ts`)
   - ✅ 更新轮询逻辑处理官方响应格式
   - ✅ 记录详细的任务信息

3. **状态查询API** (`src/app/api/seedance/status/[jobId]/route.ts`)
   - ✅ 返回正确的字段名称

## 🚀 **测试验证**

现在可以使用以下命令测试：

```bash
# 创建任务
curl -X POST https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 52fb5041-1103-416d-b38d-65337de56167" \
  -d '{"model": "doubao-seedance-1-0-pro-250528", "content": [{"type": "text", "text": "测试视频 --rt 16:9 --rs 720p --dur 5"}]}'

# 查询状态 (使用返回的id)
curl -X GET "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/{id}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 52fb5041-1103-416d-b38d-65337de56167"
```

---

## 🎯 **总结**

现在所有代码都已按照官方API格式优化：
- ✅ **正确状态**: `succeeded` (不是 `succeed`)
- ✅ **正确路径**: `content.video_url` (不是 `result.video_url`)
- ✅ **完整请求头**: 包含 `Content-Type: application/json`
- ✅ **官方响应格式**: 完全匹配官方示例

系统现在完全符合火山引擎官方API规范！
