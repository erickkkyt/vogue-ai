# 🎭 Seedance API调用与轮询示例

## 📊 **Pro模式图生视频完整示例**

### **1. 创建任务请求**

#### **HTTP请求**
```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 52fb5041-1103-416d-b38d-65337de56167" \
  -d '{
    "model": "doubao-seedance-1-0-pro-250528",
    "content": [
      {
        "type": "image_url",
        "image_url": {
          "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        }
      },
      {
        "type": "text",
        "text": "让画面中的人物开始优雅地跳舞，动作流畅自然，充满艺术感 --rt 16:9 --rs 1080p --dur 10"
      }
    ]
  }'
```

#### **预期响应**
```json
{
  "id": "task_abc123def456789",
  "status": "pending",
  "created_at": "2024-01-20T10:30:00Z"
}
```

### **2. 轮询查询任务状态**

#### **查询请求 (每20秒执行一次)**
```bash
curl -X GET https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/task_abc123def456789 \
  -H "Authorization: Bearer 52fb5041-1103-416d-b38d-65337de56167"
```

#### **状态变化示例**

##### **第1次查询 (0秒) - pending**
```json
{
  "id": "task_abc123def456789",
  "status": "pending",
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:30:00Z"
}
```

##### **第2次查询 (20秒) - running**
```json
{
  "id": "task_abc123def456789",
  "status": "running",
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:30:20Z"
}
```

##### **第3次查询 (40秒) - running**
```json
{
  "id": "task_abc123def456789",
  "status": "running",
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:30:40Z"
}
```

##### **第N次查询 (成功) - succeed**
```json
{
  "id": "task_abc123def456789",
  "status": "succeed",
  "result": {
    "video_url": "https://example-cdn.volcengine.com/videos/generated_video_abc123.mp4"
  },
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:32:15Z"
}
```

##### **失败情况 - failed**
```json
{
  "id": "task_abc123def456789",
  "status": "failed",
  "result": {
    "error_message": "Image processing failed: Invalid image format"
  },
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:31:45Z"
}
```

## 🔄 **轮询机制配置**

### **轮询参数**
```bash
# 轮询间隔: 20秒
SEEDANCE_POLL_INTERVAL=20000

# 最大尝试次数: 90次 (30分钟总时长)
SEEDANCE_MAX_POLL_ATTEMPTS=90
```

### **轮询逻辑**
```typescript
// 轮询配置
const maxAttempts = 90;        // 90次
const intervalMs = 20000;      // 20秒
const maxWaitTime = 30 * 60;   // 30分钟

// 轮询流程
for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const status = await getTaskStatus(taskId);
  
  if (status.status === 'succeed') {
    // 成功: 记录video_url
    console.log('Video URL:', status.result.video_url);
    updateDatabase('completed', status.result.video_url);
    break;
  }
  
  if (status.status === 'failed') {
    // 失败: 记录错误信息
    console.error('Task failed:', status.result.error_message);
    updateDatabase('failed', null, status.result.error_message);
    break;
  }
  
  // 继续等待
  if (attempt < maxAttempts) {
    await sleep(20000); // 等待20秒
  }
}
```

## 📊 **所有模型的请求体格式**

### **1. Pro模式 - 文本生视频**
```json
{
  "model": "doubao-seedance-1-0-pro-250528",
  "content": [
    {
      "type": "text",
      "text": "夜晚，一只萨摩耶犬和一只金毛犬在充满未来感的霓虹城市中嬉戏玩耍 --rt 16:9 --rs 1080p --dur 10"
    }
  ]
}
```

### **2. Pro模式 - 图片生视频**
```json
{
  "model": "doubao-seedance-1-0-pro-250528",
  "content": [
    {
      "type": "image_url",
      "image_url": {
        "url": "data:image/jpeg;base64,..."
      }
    },
    {
      "type": "text",
      "text": "让画面中的人物开始优雅地跳舞 --rt 16:9 --rs 1080p --dur 10"
    }
  ]
}
```

### **3. Lite模式 - 文本生视频**
```json
{
  "model": "doubao-seedance-1-0-lite-t2v-250428",
  "content": [
    {
      "type": "text",
      "text": "一个机器人在未来城市中跳街舞 --rt 1:1 --rs 720p --dur 5"
    }
  ]
}
```

### **4. Lite模式 - 图片生视频**
```json
{
  "model": "doubao-seedance-1-0-lite-i2v-250428",
  "content": [
    {
      "type": "image_url",
      "image_url": {
        "url": "data:image/jpeg;base64,..."
      }
    },
    {
      "type": "text",
      "text": "让这个人优雅地跳舞 --rt 9:16 --rs 720p --dur 5"
    }
  ]
}
```

## 🎯 **状态处理逻辑**

### **成功处理**
```typescript
if (status.status === 'succeed' && status.result?.video_url) {
  // 1. 记录视频URL
  console.log('Video generated successfully:', status.result.video_url);
  
  // 2. 更新数据库
  await updateDatabase({
    status: 'completed',
    video_url: status.result.video_url,
    completed_at: new Date().toISOString()
  });
  
  // 3. 通知用户 (可选)
  // await notifyUser(jobId, 'success', status.result.video_url);
}
```

### **失败处理**
```typescript
if (status.status === 'failed') {
  // 1. 记录错误信息
  const errorMessage = status.result?.error_message || 'Unknown error';
  console.error('Video generation failed:', errorMessage);
  
  // 2. 更新数据库
  await updateDatabase({
    status: 'failed',
    error_message: errorMessage,
    completed_at: new Date().toISOString()
  });
  
  // 3. 通知用户 (可选)
  // await notifyUser(jobId, 'failed', null, errorMessage);
}
```

### **超时处理**
```typescript
if (attempt >= maxAttempts) {
  // 1. 记录超时
  console.error('Polling timeout after 30 minutes');
  
  // 2. 更新数据库
  await updateDatabase({
    status: 'failed',
    error_message: 'Task polling timeout after 30 minutes',
    completed_at: new Date().toISOString()
  });
}
```

## 📈 **性能监控**

### **关键指标**
- **平均生成时间**: 通常2-5分钟
- **成功率**: 目标 >95%
- **超时率**: 目标 <5%
- **轮询效率**: 20秒间隔平衡性能与资源消耗

### **日志记录**
```typescript
// 每次轮询记录
console.log(`Poll attempt ${attempt}/${maxAttempts} (${elapsedTime}s), status: ${status.status}`);

// 成功记录
console.log(`Task completed in ${elapsedTime}s, video URL: ${video_url}`);

// 失败记录
console.error(`Task failed after ${elapsedTime}s: ${error_message}`);
```

---

## 🎯 **总结**

现在Seedance使用**20秒轮询间隔**，最多等待**30分钟**：
- ✅ **创建任务**: 立即返回task_id
- ✅ **轮询查询**: 每20秒查询状态
- ✅ **成功处理**: 记录video_url到数据库
- ✅ **失败处理**: 记录error_message到数据库
- ✅ **超时保护**: 30分钟后自动标记失败

所有请求格式都已验证，轮询机制已优化！
