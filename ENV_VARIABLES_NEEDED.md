# 新增页面所需的环境变量

## Seedance AI Generator

需要在 `.env.local` 文件中添加以下环境变量：

```bash
# Seedance AI Generator N8N Webhook URL
N8N_SEEDANCE_WEBHOOK_URL="https://n8n-avskrukq.us-east-1.clawcloudrun.com/webhook/[SEEDANCE_WEBHOOK_ID]"
```

## LipSync Generator

需要在 `.env.local` 文件中添加以下环境变量：

```bash
# LipSync Generator N8N Webhook URL
N8N_LIPSYNC_WEBHOOK_URL="https://n8n-avskrukq.us-east-1.clawcloudrun.com/webhook/[LIPSYNC_WEBHOOK_ID]"
```

## 说明

1. **Seedance AI Generator** 参考了 Hailuo 页面的实现模式
2. **LipSync Generator** 参考了 AI Baby Podcast 页面的实现模式
3. 请将 `[SEEDANCE_WEBHOOK_ID]` 和 `[LIPSYNC_WEBHOOK_ID]` 替换为实际的 N8N webhook ID
4. 这些 webhook URL 将用于：
   - 发送生成请求到 N8N
   - 接收 N8N 的回调通知

## Webhook 回调端点

系统已创建以下回调端点：

- **Seedance Ready**: `/api/webhook/seedance-ready`
- **LipSync Ready**: `/api/webhook/lipsync-ready`

N8N 工作流完成后应该调用相应的回调端点来更新数据库状态。

## 数据库表

已创建以下数据库表：

- `seedance_generations` - 存储 Seedance AI 生成记录
- `lipsync_generations` - 存储 LipSync 生成记录

## API 端点

已创建以下 API 端点：

### Seedance AI Generator
- `POST /api/seedance/generate` - 开始生成
- `GET /api/seedance/check-pending` - 检查待处理任务

### LipSync Generator  
- `POST /api/lipsync/generate` - 开始生成
- `GET /api/lipsync/check-pending` - 检查待处理任务

## 积分消耗

### Seedance AI Generator
- `seedance` 模型: 30 积分
- `seedance_fast` 模型: 10 积分

### LipSync Generator
- `lipsync` 模型: 25 积分  
- `lipsync_fast` 模型: 15 积分

## 文件上传限制

### Seedance AI Generator
- 图片文件: 最大 5MB (JPG, PNG)

### LipSync Generator
- 图片文件: 最大 5MB (JPG, PNG)
- 视频文件: 最大 20MB (MP4, MOV)
- 音频文件: 最大 10MB (MP3, WAV)

## 生成模式

### Seedance AI Generator
- `text-to-video`: 文本生成舞蹈视频
- `image-to-video`: 图片生成舞蹈视频

### LipSync Generator
- `image-audio`: 图片 + 音频生成唇形同步视频
- `video-audio`: 视频 + 音频生成唇形同步视频

## 注意事项

1. `seedance_fast` 模型仅支持 `text-to-video` 模式
2. 所有文件都会上传到 R2 存储桶 `flux-original`
3. 用户同时只能有一个正在处理的生成任务
4. 生成失败时可以考虑退还积分（目前未实现）
5. 所有 API 都需要用户登录验证
