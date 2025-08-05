# 🎭 Seedance 模型验证与环境配置

## ✅ **模型列表验证结果**

根据火山引擎官方文档图片，我们的模型配置**完全正确**：

### **doubao-seedance-1.0-pro (版本 250528)**
- **模型ID**: `doubao-seedance-1-0-pro-250528` ✅
- **功能**: 文生视频 + 图生视频-基于首帧
- **分辨率**: 480p, 720p, 1080p
- **帧率**: 24 fps
- **时长**: 3~12秒
- **RPM**: 600

### **doubao-seedance-1.0-lite (版本 250428)**

#### **文生视频模型**
- **模型ID**: `doubao-seedance-1-0-lite-t2v-250428` ✅
- **功能**: 文生视频
- **分辨率**: 480p, 720p, 1080p
- **帧率**: 24 fps
- **时长**: 3~12秒
- **RPM**: 300

#### **图生视频模型**
- **模型ID**: `doubao-seedance-1-0-lite-i2v-250428` ✅
- **功能**: 图生视频-首帧 + 图生视频-首尾帧
- **分辨率**: 480p, 720p, 1080p
- **帧率**: 24 fps
- **时长**: 3~12秒
- **RPM**: 300

## 🔧 **环境变量配置完成**

已在 `.env.local` 文件中添加：

```bash
# ============= Seedance 火山引擎 ARK API 配置 =============
# 火山引擎 ARK API 密钥，从火山引擎控制台获取
ARK_API_KEY=your-ark-api-key-here

# Seedance 轮询配置 (可选，有默认值)
SEEDANCE_POLL_INTERVAL=3000
SEEDANCE_MAX_POLL_ATTEMPTS=100
```

## 🌐 **URL硬编码配置**

已在 `src/lib/volcengine-client.ts` 中硬编码：
```typescript
this.baseUrl = 'https://ark.cn-beijing.volces.com/api/v3';
```

## 📊 **模型映射关系**

| 前端显示 | 生成模式 | 后端模型ID | 积分消耗 | RPM限制 |
|---------|----------|-----------|----------|---------|
| **Seedance Pro** | text-to-video | `doubao-seedance-1-0-pro-250528` | 30 | 600 |
| **Seedance Pro** | image-to-video | `doubao-seedance-1-0-pro-250528` | 30 | 600 |
| **Seedance Lite** | text-to-video | `doubao-seedance-1-0-lite-t2v-250428` | 10 | 300 |
| **Seedance Lite** | image-to-video | `doubao-seedance-1-0-lite-i2v-250428` | 10 | 300 |

## 🎯 **分辨率支持情况**

根据官方文档，**所有模型都支持**：
- ✅ **480p** (Standard)
- ✅ **720p** (HD) 
- ✅ **1080p** (Full HD)

### **当前实现状态**
我们目前移除了480p选项，只保留720p和1080p。如果需要支持480p，可以：

1. **恢复480p选项** (如果用户需要)
2. **保持当前配置** (简化用户选择)

## ⏱️ **时长支持**

官方支持 **3~12秒**，我们当前支持：
- ✅ **5秒** (基础积分)
- ✅ **10秒** (双倍积分)

可以考虑扩展到3秒和12秒选项。

## 🔄 **API调用格式验证**

### **文本生视频示例**
```json
{
  "model": "doubao-seedance-1-0-pro-250528",
  "content": [
    {
      "type": "text",
      "text": "夜晚，一只萨摩耶犬和一只金毛犬在充满未来感的霓虹城市中嬉戏玩耍 --rt 16:9 --rs 720p --dur 5"
    }
  ]
}
```

### **图片生视频示例**
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
      "text": "Make this person dance gracefully --rt 9:16 --rs 720p --dur 10"
    }
  ]
}
```

## 🚀 **下一步操作**

1. **获取API密钥**: 
   - 访问火山引擎控制台
   - 创建ARK API密钥
   - 替换 `.env.local` 中的 `your-ark-api-key-here`

2. **测试验证**:
   ```bash
   npm run dev
   # 访问 http://localhost:3000/seedance
   # 测试文本生视频和图片生视频功能
   ```

3. **监控日志**:
   - 检查控制台输出
   - 验证API调用成功
   - 确认轮询机制工作正常

## ⚠️ **注意事项**

### **RPM限制**
- **Pro模型**: 600 RPM (每分钟600次请求)
- **Lite模型**: 300 RPM (每分钟300次请求)

### **时长与积分**
- **3~12秒**: 官方支持范围
- **当前**: 5秒(基础)、10秒(双倍)
- **建议**: 可以添加3秒和12秒选项

### **分辨率选择**
- **官方**: 480p, 720p, 1080p 全支持
- **当前**: 720p, 1080p (已移除480p)
- **建议**: 根据用户需求决定是否恢复480p

---

## 🎯 **总结**

✅ **模型配置完全正确**  
✅ **环境变量已配置**  
✅ **URL已硬编码**  
✅ **API格式验证通过**  

现在只需要：
1. 添加真实的ARK_API_KEY
2. 启动项目测试
3. 验证视频生成功能

所有技术实现都已就绪！
