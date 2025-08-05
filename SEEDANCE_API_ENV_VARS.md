# 🎭 Seedance 直接API调用环境变量配置

## 📝 **需要在 .env.local 中添加的环境变量**

```bash
# 火山引擎 ARK API 配置
ARK_API_KEY=your-ark-api-key-here
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3

# 可选：轮询配置
SEEDANCE_POLL_INTERVAL=3000  # 轮询间隔(毫秒)，默认3秒
SEEDANCE_MAX_POLL_ATTEMPTS=100  # 最大轮询次数，默认100次(5分钟)
```

## 🔑 **获取 ARK_API_KEY**

1. 访问火山引擎控制台
2. 进入方舟大模型服务平台
3. 在API密钥管理中创建新的API密钥
4. 复制密钥并添加到 .env.local 文件中

## 🎯 **API端点说明**

- **创建任务**: `POST /api/v3/contents/generations/tasks`
- **查询任务**: `GET /api/v3/contents/generations/tasks/{task_id}`
- **基础URL**: `https://ark.cn-beijing.volces.com/api/v3`
