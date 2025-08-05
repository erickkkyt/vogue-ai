# 🎭 Seedance 模型名称映射配置

## 📊 **模型映射关系**

### **前端显示 → 后端实际模型名称**

| 前端显示名称 | 生成模式 | 后端模型名称 | 积分消耗 |
|-------------|----------|-------------|----------|
| **Seedance Pro** | text-to-video | `doubao-seedance-1-0-pro-250528` | 30 (基础) |
| **Seedance Pro** | image-to-video | `doubao-seedance-1-0-pro-250528` | 30 (基础) |
| **Seedance Lite** | text-to-video | `doubao-seedance-1-0-lite-t2v-250428` | 10 (基础) |
| **Seedance Lite** | image-to-video | `doubao-seedance-1-0-lite-i2v-250428` | 10 (基础) |

### **积分计算规则**
- **基础积分**: Pro模型30分，Lite模型10分
- **时长倍数**: 10秒视频 = 基础积分 × 2
- **最终积分**: 基础积分 × 时长倍数

## 🔧 **前端实现**

### **模型选择状态**
```typescript
// 前端状态类型
type ModelType = 'seedance-pro' | 'seedance-lite';

// 默认选择Pro模型
const [selectedModel, setSelectedModel] = useState<ModelType>('seedance-pro');
```

### **模型名称映射函数**
```typescript
const getBackendModelName = () => {
  if (selectedModel === 'seedance-pro') {
    return 'doubao-seedance-1-0-pro-250528';
  } else {
    // seedance-lite
    if (generationMode === 'text-to-video') {
      return 'doubao-seedance-1-0-lite-t2v-250428';
    } else {
      return 'doubao-seedance-1-0-lite-i2v-250428';
    }
  }
};
```

### **积分计算函数**
```typescript
const getRequiredCredits = () => {
  const baseCredits = selectedModel === 'seedance-pro' ? 30 : 10;
  const durationMultiplier = duration === '10' ? 2 : 1;
  return baseCredits * durationMultiplier;
};
```

## 🗄️ **后端实现**

### **API参数验证**
```typescript
// 验证模型名称
const validModels = [
  'doubao-seedance-1-0-pro-250528',
  'doubao-seedance-1-0-lite-t2v-250428',
  'doubao-seedance-1-0-lite-i2v-250428'
];

if (!validModels.includes(selectedModel)) {
  return NextResponse.json({ message: 'Invalid model selection' }, { status: 400 });
}
```

### **分辨率限制**
```typescript
// 1080p只能用于Pro模型
if (resolution === '1080p' && selectedModel !== 'doubao-seedance-1-0-pro-250528') {
  return NextResponse.json({ 
    message: '1080p resolution is only available for Seedance Pro model' 
  }, { status: 400 });
}
```

### **积分计算**
```typescript
const baseCredits = selectedModel === 'doubao-seedance-1-0-pro-250528' ? 30 : 10;
const durationMultiplier = duration === '10' ? 2 : 1;
const creditsRequired = baseCredits * durationMultiplier;
```

## 🗃️ **数据库配置**

### **表结构约束**
```sql
CREATE TABLE seedance_generations (
  -- ...其他字段
  selected_model VARCHAR(50) NOT NULL CHECK (
    selected_model IN (
      'doubao-seedance-1-0-pro-250528',
      'doubao-seedance-1-0-lite-t2v-250428', 
      'doubao-seedance-1-0-lite-i2v-250428'
    )
  ),
  -- ...其他字段
);
```

### **RPC函数积分计算**
```sql
v_required_credits := CASE
  WHEN p_selected_model = 'doubao-seedance-1-0-pro-250528' THEN 30
  WHEN p_selected_model = 'doubao-seedance-1-0-lite-t2v-250428' THEN 10
  WHEN p_selected_model = 'doubao-seedance-1-0-lite-i2v-250428' THEN 10
  ELSE 30
END;
```

## 🔄 **N8N集成**

### **发送给N8N的数据**
```json
{
  "jobId": "uuid",
  "userId": "uuid",
  "generationMode": "text-to-video" | "image-to-video",
  "selectedModel": "doubao-seedance-1-0-pro-250528", // 实际模型名称
  "aspectRatio": "16:9" | "9:16" | "1:1",
  "resolution": "480p" | "720p" | "1080p",
  "duration": "5" | "10",
  "textPrompt": "string (optional)",
  "imageBase64": "data:image/jpeg;base64,... (optional)",
  "imagePrompt": "string (optional)"
}
```

### **N8N工作流配置**
N8N需要根据接收到的实际模型名称来调用对应的API：

```javascript
// N8N节点中的逻辑
const modelName = $json.selectedModel;

if (modelName === 'doubao-seedance-1-0-pro-250528') {
  // 调用Pro版本API
} else if (modelName.includes('lite-t2v')) {
  // 调用Lite文本生视频API
} else if (modelName.includes('lite-i2v')) {
  // 调用Lite图片生视频API
}
```

## 🎯 **用户界面**

### **模型选择UI**
```jsx
{/* Pro模型 */}
<label>
  <input 
    type="radio" 
    value="seedance-pro"
    checked={selectedModel === 'seedance-pro'}
  />
  <span>Seedance Pro (30 credits)</span>
</label>

{/* Lite模型 */}
<label>
  <input 
    type="radio" 
    value="seedance-lite"
    checked={selectedModel === 'seedance-lite'}
  />
  <span>Seedance Lite (10 credits)</span>
</label>
```

### **分辨率选择UI**
```jsx
<select value={resolution} onChange={...}>
  <option value="480p">480p (Standard)</option>
  <option value="720p">720p (HD)</option>
  {/* 1080p只对Pro模型显示 */}
  {selectedModel === 'seedance-pro' && (
    <option value="1080p">1080p (Full HD - Pro only)</option>
  )}
</select>
```

## 📝 **数据流示例**

### **用户选择Pro模型，文本生视频**
1. **前端**: 用户选择 "Seedance Pro" + "text-to-video"
2. **映射**: `getBackendModelName()` 返回 `doubao-seedance-1-0-pro-250528`
3. **发送**: API接收实际模型名称
4. **存储**: 数据库存储实际模型名称
5. **N8N**: 接收实际模型名称进行处理

### **用户选择Lite模型，图片生视频**
1. **前端**: 用户选择 "Seedance Lite" + "image-to-video"
2. **映射**: `getBackendModelName()` 返回 `doubao-seedance-1-0-lite-i2v-250428`
3. **发送**: API接收实际模型名称
4. **存储**: 数据库存储实际模型名称
5. **N8N**: 接收实际模型名称进行处理

## ✅ **更新清单**

### **已完成的修改**
- ✅ 前端模型选择UI更新
- ✅ 前端模型名称映射函数
- ✅ 后端API参数验证更新
- ✅ 后端积分计算逻辑更新
- ✅ 数据库表约束更新
- ✅ RPC函数积分计算更新
- ✅ N8N请求体接口更新

### **需要配置的部分**
- ⚠️ N8N工作流需要更新以处理新的模型名称
- ⚠️ 确保N8N能正确识别和调用对应的API

---

## 🎯 **总结**

现在Seedance的模型选择已经完全更新：
- **前端**: 显示友好的名称 (Seedance Pro/Lite)
- **后端**: 使用实际的模型名称进行处理和存储
- **映射**: 根据生成模式自动选择正确的模型变体
- **验证**: 完整的参数验证和约束检查

这样的设计既保证了用户界面的友好性，又确保了后端处理的准确性。
