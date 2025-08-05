# 🧪 Seedance 本地测试配置

## ✅ **硬编码配置完成**

所有Seedance相关的配置已经硬编码到代码中，不需要在`.env.local`文件中配置。

## 🔧 **硬编码配置详情**

### **1. 火山引擎API配置**
```typescript
// src/lib/volcengine-client.ts
export class VolcengineClient {
  private apiKey = '52fb5041-1103-416d-b38d-65337de56167'; // 🎯 硬编码API Key
  private baseUrl = 'https://ark.cn-beijing.volces.com/api/v3'; // 🎯 硬编码URL
  
  // 🎯 硬编码轮询配置
  private readonly POLL_INTERVAL = 20000; // 20秒
  private readonly MAX_POLL_ATTEMPTS = 90; // 90次 = 30分钟
}
```

### **2. 前端轮询配置**
```typescript
// src/components/seedance/SeedanceGeneratorClient.tsx
const FRONTEND_POLL_INTERVAL = 10000; // 前端每10秒查询一次
const FRONTEND_POLL_TIMEOUT = 300000; // 5分钟超时
```

### **3. 后端轮询配置**
```typescript
// src/app/api/seedance/generate/route.ts
// 使用volcengineClient的硬编码配置 (20秒间隔，90次最大尝试)
const result = await volcengineClient.pollTaskUntilComplete(id);
```

## 🧪 **本地测试准备**

### **1. 环境要求**
```bash
# 必需的环境变量 (其他功能需要)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 🎯 Seedance不需要额外环境变量 (已硬编码)
```

### **2. 数据库准备**
```sql
-- 确保以下表存在:
-- 1. user_profiles (包含credits字段)
-- 2. seedance_generations (完整表结构)
-- 3. create_seedance_project RPC函数

-- 检查命令:
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('user_profiles', 'seedance_generations');

SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'create_seedance_project';
```

### **3. 用户积分设置**
```sql
-- 为测试用户添加积分
UPDATE user_profiles SET credits = 100 WHERE user_id = 'your-test-user-id';

-- 或创建测试用户配置
INSERT INTO user_profiles (user_id, credits) 
VALUES ('your-test-user-id', 100);
```

## 🚀 **启动本地测试**

### **1. 启动开发服务器**
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### **2. 访问测试页面**
```bash
# Seedance生成页面
http://localhost:3000/seedance

# Projects页面 (查看历史)
http://localhost:3000/projects
```

### **3. 测试流程**
```
1. 访问 /seedance 页面
2. 登录用户账户
3. 选择生成模式和参数
4. 输入提示词: "一只可爱的小猫在花园里跳舞"
5. 点击 "Generate Video" 按钮
6. 观察控制台日志和前端状态
7. 等待2-5分钟查看结果
8. 访问 /projects 页面查看历史记录
```

## 📊 **测试验证点**

### **1. 前端验证**
- ✅ 登录检测正常
- ✅ 积分检测正常 (按钮禁用/启用)
- ✅ 生成请求发送成功
- ✅ 轮询状态更新正常
- ✅ 视频预览显示正常

### **2. 后端验证**
- ✅ 用户身份验证
- ✅ 积分扣除成功
- ✅ 数据库记录创建
- ✅ 火山引擎API调用成功
- ✅ 后台轮询正常运行

### **3. 数据库验证**
```sql
-- 检查生成记录
SELECT * FROM seedance_generations 
WHERE user_id = 'your-test-user-id' 
ORDER BY created_at DESC;

-- 检查积分变化
SELECT credits FROM user_profiles 
WHERE user_id = 'your-test-user-id';
```

### **4. 控制台日志验证**
```bash
# 前端控制台应显示:
[Frontend Polling] Starting poll for job xxx, interval: 10000ms
[Frontend Polling] Task xxx status: processing

# 后端控制台应显示:
[Volcengine Client] Initialized with hardcoded config
[Volcengine Client] Poll interval: 20000 ms
[Volcengine Client] Max attempts: 90
[Seedance Polling] Using hardcoded config: 90 attempts, 20000ms interval
```

## 🔍 **故障排除**

### **1. 常见问题**
```bash
# 问题1: 积分不足
# 解决: UPDATE user_profiles SET credits = 100 WHERE user_id = 'xxx';

# 问题2: 数据库表不存在
# 解决: 执行 database/06_seedance_generations.sql

# 问题3: RPC函数不存在
# 解决: 检查并重新创建 create_seedance_project 函数

# 问题4: 火山引擎API错误
# 解决: 检查硬编码的API Key是否正确
```

### **2. 调试命令**
```bash
# 检查网络请求
curl -X POST http://localhost:3000/api/seedance/generate \
  -H "Content-Type: application/json" \
  -d '{"generationMode":"text-to-video","textPrompt":"test"}'

# 检查状态查询
curl http://localhost:3000/api/seedance/status/your-job-id
```

## 📈 **性能监控**

### **1. 轮询时间线**
```
00:00 - 用户点击生成
00:01 - 后端创建任务，开始后台轮询
00:20 - 后台第1次查询火山引擎
00:40 - 后台第2次查询火山引擎
...
02:00 - 后台第6次查询，任务完成
02:01 - 数据库更新video_url
02:10 - 前端轮询检测到完成状态
02:11 - 前端显示视频预览
```

### **2. 资源使用**
```bash
# 后台轮询: 每20秒一次HTTP请求
# 前端轮询: 每10秒一次API请求
# 总时长: 通常2-5分钟完成
# 超时: 后台30分钟，前端5分钟
```

## ✅ **测试清单**

- [ ] 开发服务器启动成功
- [ ] 数据库连接正常
- [ ] 用户登录功能正常
- [ ] 积分检测功能正常
- [ ] 视频生成请求成功
- [ ] 后台轮询正常运行
- [ ] 前端状态更新正常
- [ ] 视频预览显示正常
- [ ] Projects页面显示正常
- [ ] 下载功能正常

---

## 🎯 **总结**

✅ **所有配置已硬编码完成**  
✅ **不需要额外环境变量**  
✅ **可以直接启动本地测试**  
✅ **完整的测试验证流程**  

现在你可以直接运行 `npm run dev` 开始测试Seedance功能！
