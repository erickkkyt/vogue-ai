# n8n 认证方式指南

本文档整理了 Vogue AI 项目中与 n8n 服务交互时使用的认证方式，包括向 n8n 发送请求和接收 n8n 回调的认证机制。

## 1. 向 n8n 发送请求的认证方式

在 Vogue AI 项目中，向 n8n 发送请求时采用了以下认证方式：

### 1.1 自定义请求头认证

```typescript
// 准备请求头 - 使用自定义头部认证
const headersForN8n: HeadersInit = { 'Content-Type': 'application/json' };
if (n8nApiKey) {
    headersForN8n['N8N_API_KEY'] = n8nApiKey;  // 使用自定义头而不是 Bearer Token
}

// 发送请求
const n8nResponse = await fetch(n8nWebhookUrl, {
    method: 'POST',
    headers: headersForN8n,
    body: JSON.stringify(n8nRequestBody)
});
```

### 1.2 认证密钥来源

- 使用环境变量 `N8N_API_KEY` 作为共享密钥
- 在不同的生成器中保持一致的认证方式

### 1.3 请求体结构

每个工具都有特定的请求体结构，但通常包含以下基本字段：

```typescript
// Veo3 生成器示例
interface N8nVeo3RequestBody {
  jobId: string;          // 唯一任务ID
  userId: string;         // 用户ID
  generationMode: 'text-to-video' | 'image-to-video';
  selectedModel: 'veo3' | 'veo3-fast';
  textPrompt?: string;    // 文本提示（文本转视频模式）
  imageUrl?: string;      // 图片URL（图片转视频模式）
  imagePrompt?: string;   // 图片提示（图片转视频模式）
}

// Hailuo 生成器示例
interface N8nHailuoRequestBody {
  jobId: string;          // 唯一任务ID
  userId: string;         // 用户ID
  prompt: string;         // 提示文本
  duration: number;       // 视频时长
}
```

## 2. 接收 n8n 回调的认证方式

当 n8n 完成处理后，向 Vogue AI 发送回调请求时，采用以下认证方式：

### 2.1 Bearer Token 认证（主要方式）

```typescript
// 验证 webhook 密钥
const expectedSecret = process.env.N8N_API_KEY;
if (!expectedSecret) {
  console.error('[Webhook] N8N_API_KEY is not defined in environment variables.');
  return NextResponse.json({ message: 'Server configuration error: Callback secret missing.' }, { status: 500 });
}

let receivedSecret: string | null = null;
const authHeader = request.headers.get('Authorization');
if (authHeader && authHeader.startsWith('Bearer ')) {
  receivedSecret = authHeader.substring(7);
}
```

### 2.2 自定义请求头认证（备用方式）

```typescript
else {
  receivedSecret = request.headers.get('X-Webhook-Secret'); // Fallback to custom header
}

if (!receivedSecret) {
  console.warn('[Webhook] Missing secret in callback request headers.');
  return NextResponse.json({ message: 'Unauthorized: Missing secret.' }, { status: 401 });
}
if (receivedSecret !== expectedSecret) {
  console.warn('[Webhook] Invalid secret provided in callback request.');
  return NextResponse.json({ message: 'Unauthorized: Invalid secret.' }, { status: 403 });
}
```

### 2.3 回调请求体结构

```typescript
// 通用回调结构
interface N8nCallbackBody {
  jobId: string;           // 唯一任务ID（与请求时相同）
  videoUrl?: string;       // 生成的视频URL（成功时）
  status: 'completed' | 'failed';  // 处理状态
  errorMessage?: string;   // 错误信息（失败时）
  duration?: number;       // 视频时长（秒）
}
```

## 3. 安全最佳实践

1. **环境变量存储密钥**：所有密钥都存储在环境变量中，不硬编码在代码中
2. **双向认证**：客户端和服务器端都进行认证验证
3. **错误处理**：详细的错误日志和适当的错误响应
4. **回调验证**：严格验证回调请求的合法性，防止伪造请求
5. **幂等性处理**：回调处理具有幂等性，避免重复处理同一请求

## 4. n8n 工作流配置要点

### 4.1 Webhook 接收节点配置

- 设置 HTTP 方法为 POST
- 配置认证头验证（Bearer Token）
- 解析 JSON 请求体

### 4.2 回调通知配置

- 处理完成后调用相应的回调 API 端点（如 `/api/webhook/veo3-ready`）
- 包含必要的状态信息和结果 URL
- 使用相同的 API Key 进行认证，格式为 `Authorization: Bearer YOUR_N8N_API_KEY`