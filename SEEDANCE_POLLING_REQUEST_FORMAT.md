# 🎭 Seedance 轮询查询请求格式

## 📊 **确认：使用 `id` 参数，不是 `task_id`**

根据火山引擎API规范，创建任务返回的是 `id` 字段，查询时也使用这个 `id`。

## 🔄 **轮询查询请求格式**

### **HTTP请求模板**
```bash
curl -X GET https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/{id} \
  -H "Authorization: Bearer 52fb5041-1103-416d-b38d-65337de56167"
```

### **具体示例**
```bash
# 假设创建任务返回: {"id": "abc123def456789", "status": "pending"}
curl -X GET https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/abc123def456789 \
  -H "Authorization: Bearer 52fb5041-1103-416d-b38d-65337de56167"
```

## 📋 **请求详情**

| 项目 | 值 |
|------|---|
| **方法** | `GET` |
| **URL** | `https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/{id}` |
| **Headers** | `Authorization: Bearer {ARK_API_KEY}` |
| **路径参数** | `{id}`: 创建任务时返回的任务ID |
| **查询参数** | 无 |
| **请求体** | 无 (GET请求) |

## 📊 **响应格式示例**

### **1. 任务排队中 (pending)**
```json
{
  "id": "abc123def456789",
  "status": "pending",
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:30:00Z"
}
```

### **2. 任务处理中 (running)**
```json
{
  "id": "abc123def456789",
  "status": "running",
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:30:20Z"
}
```

### **3. 任务成功完成 (succeed)**
```json
{
  "id": "abc123def456789",
  "status": "succeed",
  "result": {
    "video_url": "https://example-cdn.volcengine.com/videos/generated_video_abc123.mp4"
  },
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:32:15Z"
}
```

### **4. 任务失败 (failed)**
```json
{
  "id": "abc123def456789",
  "status": "failed",
  "result": {
    "error_message": "Image processing failed: Invalid image format or unsupported resolution"
  },
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:31:45Z"
}
```

## ⏰ **轮询时间线示例**

### **成功案例时间线**
```
00:00 - 创建任务 → 返回 {"id": "abc123", "status": "pending"}
00:20 - 第1次查询 → {"status": "pending"}
00:40 - 第2次查询 → {"status": "running"}
01:00 - 第3次查询 → {"status": "running"}
01:20 - 第4次查询 → {"status": "running"}
01:40 - 第5次查询 → {"status": "succeed", "result": {"video_url": "..."}}
✅ 完成 - 总耗时: 1分40秒
```

### **失败案例时间线**
```
00:00 - 创建任务 → 返回 {"id": "def456", "status": "pending"}
00:20 - 第1次查询 → {"status": "pending"}
00:40 - 第2次查询 → {"status": "running"}
01:00 - 第3次查询 → {"status": "failed", "result": {"error_message": "..."}}
❌ 失败 - 总耗时: 1分钟
```

## 🔧 **代码实现示例**

### **JavaScript/TypeScript**
```typescript
async function pollTaskStatus(id: string): Promise<any> {
  const maxAttempts = 90;  // 90次 * 20秒 = 30分钟
  const interval = 20000;  // 20秒
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/${id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.ARK_API_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      console.log(`Poll ${attempt}/${maxAttempts}: ${data.status}`);
      
      // 成功完成
      if (data.status === 'succeed') {
        console.log('Video URL:', data.result.video_url);
        return data;
      }
      
      // 失败
      if (data.status === 'failed') {
        console.error('Task failed:', data.result.error_message);
        throw new Error(data.result.error_message);
      }
      
      // 继续等待
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
      
    } catch (error) {
      console.error(`Poll attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  throw new Error('Polling timeout after 30 minutes');
}
```

### **cURL脚本示例**
```bash
#!/bin/bash

ID="abc123def456789"
API_KEY="52fb5041-1103-416d-b38d-65337de56167"
MAX_ATTEMPTS=90
INTERVAL=20

for i in $(seq 1 $MAX_ATTEMPTS); do
  echo "Poll attempt $i/$MAX_ATTEMPTS..."
  
  RESPONSE=$(curl -s -X GET \
    "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/$ID" \
    -H "Authorization: Bearer $API_KEY")
  
  STATUS=$(echo $RESPONSE | jq -r '.status')
  echo "Status: $STATUS"
  
  if [ "$STATUS" = "succeed" ]; then
    VIDEO_URL=$(echo $RESPONSE | jq -r '.result.video_url')
    echo "✅ Success! Video URL: $VIDEO_URL"
    break
  elif [ "$STATUS" = "failed" ]; then
    ERROR_MSG=$(echo $RESPONSE | jq -r '.result.error_message')
    echo "❌ Failed: $ERROR_MSG"
    break
  else
    echo "⏳ Still processing... waiting ${INTERVAL}s"
    sleep $INTERVAL
  fi
done
```

## 📈 **轮询配置参数**

### **环境变量**
```bash
# 轮询间隔 (毫秒)
SEEDANCE_POLL_INTERVAL=20000

# 最大尝试次数
SEEDANCE_MAX_POLL_ATTEMPTS=90
```

### **计算公式**
```
总等待时间 = POLL_INTERVAL × MAX_ATTEMPTS
20000ms × 90 = 1,800,000ms = 30分钟
```

## ⚠️ **注意事项**

### **1. 参数名称**
- ✅ **正确**: 使用 `id` 参数
- ❌ **错误**: 使用 `task_id` 参数

### **2. 状态值**
- ✅ **成功**: `succeed` (不是 `success`)
- ✅ **失败**: `failed`
- ✅ **处理中**: `pending`, `running`

### **3. 轮询频率**
- ✅ **推荐**: 20秒间隔
- ❌ **过频**: <10秒可能被限流
- ❌ **过慢**: >60秒用户体验差

### **4. 超时处理**
- ✅ **合理**: 30分钟最大等待
- ✅ **记录**: 详细的轮询日志
- ✅ **容错**: 网络错误重试机制

---

## 🎯 **总结**

现在轮询查询使用正确的格式：
- **URL**: `/api/v3/contents/generations/tasks/{id}`
- **参数**: 使用 `id` (不是 `task_id`)
- **间隔**: 20秒轮询
- **状态**: 正确处理 `succeed`/`failed`
- **超时**: 30分钟最大等待时间

所有代码已更新为使用正确的 `id` 参数！
