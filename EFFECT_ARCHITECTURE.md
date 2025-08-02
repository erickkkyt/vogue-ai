# Effect表驱动架构设计文档

## 📋 概述

Effect表驱动架构是一个强大的数据库驱动的AI功能管理系统，允许通过数据库配置快速创建和管理无限数量的AI功能页面，而无需编写重复的代码。

## 🏗️ 架构设计

### 核心理念
- **数据驱动功能**：通过数据库配置控制AI模型参数，而非硬编码
- **高度复用**：一套代码架构服务多个AI功能页面
- **配置分离**：业务逻辑与配置参数完全分离
- **无限扩展**：新增功能只需添加数据库记录

### 架构层次
页面组件 (Page)
↓
WorkerWrapper (服务端组件) - 配置获取层
↓
Worker (客户端组件) - 用户交互层
↓
后端API - 业务处理层
↓
AI服务适配器 - 第三方服务层

## 🗄️ 数据库设计

### Effect表结构
```sql
CREATE TABLE effect (
  id INTEGER PRIMARY KEY,           -- 模型ID
  name VARCHAR(255),               -- 模型名称
  type INTEGER,                    -- 类型 (1=文生视频, 2=图生图, 3=文生图)
  model VARCHAR(255),              -- AI模型名
  version VARCHAR(255),            -- 模型版本
  credit INTEGER,                  -- 所需积分
  link_name VARCHAR(255),          -- API标识
  pre_prompt TEXT,                 -- 预设提示词
  des TEXT,                        -- 功能描述
  platform VARCHAR(255),          -- 平台
  api VARCHAR(255),                -- API地址
  is_open INTEGER,                 -- 是否开放 (0=关闭, 1=开放)
  created_at TIMESTAMP,            -- 创建时间
  provider VARCHAR(50)             -- AI服务提供商
);

# 示例数据

-- 主页视频生成
INSERT INTO effect VALUES (
  1, '主页视频生成', 1, 'doubao-seedance-1-0-pro-250528', 'v1.0', 10, 
  'homepage-video-generation', 'Create a cinematic video of', 
  '主页视频生成功能', 'volcano', 'https://api.volcano.com', 1, NOW(), 'volcano'
);

-- VEO3视频生成
INSERT INTO effect VALUES (
  12, 'Google VEO3', 1, 'replicate/veo-3', 'v1.0', 15, 
  'veo3-generation', 'Create a high-quality video showing', 
  'Google最新VEO3模型', 'veo3', 'https://apicore.com', 1, NOW(), 'veo3'
);

-- 图片转卡通
INSERT INTO effect VALUES (
  2, '照片转卡通', 2, 'cartoon-style-v2', 'v2.1', 5, 
  'photo-to-cartoon', '', '将真实照片转换为卡通风格', 
  'replicate', 'https://api.replicate.com', 1, NOW(), 'replicate'
);

## 🔧 组件架构

### WorkerWrapper (配置获取层)
**职责**：服务端配置桥梁
- 🔍 从数据库查询Effect配置
- 📊 将配置传递给Worker组件
- 🎨 提供统一的UI容器
- 🛡️ 处理配置不存在的情况

```typescript
// src/components/replicate/img-to-video/worker-wraper.tsx
export default async function WorkerWraper(params: { 
  effectId: string,
  promotion: string,
  defaultMode: string,
  showMode: boolean,
  lang: string 
}) {
  // 查询数据库获取配置
  const effect: Effect | null = await getEffectById(Number(params.effectId));
  
  if (!effect) return null;
  
  return (
    <div className="unified-container">
      <Worker
        model={effect?.model}
        credit={effect?.credit}
        version={effect?.version}
        effect_link_name={effect?.link_name}
        prompt={effect?.pre_prompt}
        {...params}
      />
    </div>
  );
}

# Worker (用户交互层)
    职责：用户界面和业务逻辑

    🎛️ 处理用户交互和表单输入
    🔐 验证用户权限和积分
    🚀 调用后端API
    🔄 管理生成状态和结果显示

// src/components/replicate/img-to-video/worker.tsx
export default function Worker(props: {
  model: string,           // 来自Effect表
  credit: number,          // 来自Effect表
  version: string,         // 来自Effect表
  effect_link_name: string, // 来自Effect表
  // ... 其他props
}) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  
  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("model", props.model);
    formData.append("credit", props.credit.toString());
    formData.append("effect_link_name", props.effect_link_name);
    
    const response = await fetch("/api/predictions/img_to_video", {
      method: "POST",
      body: formData,
    });
    // 处理响应...
  };
  
  return (
    <div>
      {/* 用户界面 */}
    </div>
  );
}

🚀 快速创建新页面

步骤1：添加Effect配置

INSERT INTO effect VALUES (
  13, 'Luma Dream Machine', 1, 'luma-ai/dream-machine', 'v2.0', 20,
  'luma-generation', 'Generate a dreamy video of', 'Luma AI视频生成',
  'luma', 'https://api.luma.ai', 1, NOW(), 'luma'
);

步骤2：创建页面文件 (~50行)

// src/app/[locale]/(free)/luma-video/page.tsx
export default function LumaVideoPage() {
  return (
    <main>
      <TopHero multiLanguage="Luma" />
      <WorkerWrapper 
        effectId="13"  // 🎯 关键：对应数据库ID
        promotion="https://example.com/luma-demo.mp4"
        defaultMode="single"
        showMode={false}
        lang="Luma.generator"
      />
      <FeatureHero multiLanguage="Luma" />
    </main>
  );
}

步骤3：添加国际化文本

// messages/en.json
{
  "Luma": {
    "generator": "Luma Dream Machine Video Generator"
  }
}

## 🔄 后端API适配

### 统一API接口
所有AI服务通过统一的API接口调用：


### 自动服务识别
后端根据Effect配置自动选择对应的AI服务：

```typescript
// src/app/api/predictions/img_to_video/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const effectLinkName = formData.get("effect_link_name");
  
  // 根据effect_link_name查询配置
  const effect = await getEffectByLinkName(effectLinkName);
  const provider = effect?.provider || "volcano";
  
  if (provider === "veo3") {
    const veo3Client = new VEO3Client();
    prediction = await veo3Client.createGeneration(prompt);
  } else if (provider === "volcano") {
    const volcanoClient = new VolcanoClient();
    prediction = await volcanoClient.createGeneration(request);
  } else if (provider === "luma") {
    const lumaClient = new LumaClient();
    prediction = await lumaClient.createGeneration(prompt);
  }
  // ... 其他服务
}

AI服务适配器
每个AI服务都有对应的适配器，将不同的API格式转换为统一格式：

// src/lib/veo3-client.ts
export class VEO3Client {
  async createGeneration(prompt: string) {
    const response = await fetch("https://apicore.com/replicate/v1/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "replicate/veo-3",
        input: { prompt }
      })
    });
    return this.convertToReplicateFormat(await response.json());
  }
  
  convertToReplicateFormat(veo3Response: any) {
    return {
      id: veo3Response.task_id,
      status: this.mapStatus(veo3Response.data?.status),
      output: veo3Response.data?.video_url,
      error: veo3Response.code !== 10000 ? veo3Response.message : null
    };
  }
  
  private mapStatus(veo3Status: string) {
    const statusMap = {
      "done": "succeeded",
      "processing": "processing", 
      "failed": "failed"
    };
    return statusMap[veo3Status] || "starting";
  }
}

🎛️ 运营管理
动态配置管理
运营人员可以通过数据库实时调整：

-- 🎯 调整积分消耗
UPDATE effect SET credit = 10 WHERE id = 12;  -- VEO3降价

-- 🔧 切换AI模型
UPDATE effect SET model = 'replicate/veo-4' WHERE id = 12;  -- 升级到VEO4

-- 🚫 临时关闭功能
UPDATE effect SET is_open = 0 WHERE id = 12;  -- 关闭VEO3

-- 🔄 切换AI服务商
UPDATE effect SET provider = 'openai', model = 'sora-v1' WHERE id = 12;  -- 换成Sora

A/B测试支持
-- 创建同功能的不同配置进行测试
INSERT INTO effect VALUES (14, 'VEO3-测试版', 1, 'replicate/veo-3-beta', 'v1.1', 12, 'veo3-test', ...);

📊 架构优势
代码量对比
方式	   添加1个页面	                添加10个页面	      维护成本
硬编码	    900行代码	                 9000行代码	           极高
Effect表   1条数据库记录 + 50行页面	  10条记录 + 500行页面	    极低
扩展能力
🚀 新页面：1条数据库记录 + 50行代码
🎛️ 动态配置：无需重新部署
🔄 高度复用：所有页面共享核心逻辑
💰 低维护成本：统一架构易于管理

## 🔍 故障排除

### 常见问题

#### 1. "relation 'effect' does not exist"
**原因**：数据库中没有effect表
**解决**：运行数据库迁移创建effect表

#### 2. 页面显示空白
**原因**：effectId对应的记录不存在
**解决**：检查数据库中是否有对应的effect记录

#### 3. API调用失败
**原因**：provider配置错误或适配器缺失
**解决**：检查effect表中的provider字段，确保有对应的适配器

## 🎯 最佳实践

### 1. 命名规范
- **effectId**：使用递增数字，预留空间
- **link_name**：使用kebab-case，描述性命名
- **provider**：使用小写，与适配器类名对应

### 2. 配置管理
- 新功能先设置 `is_open = 0` 进行内测
- 积分设置要考虑成本和用户接受度
- pre_prompt要经过测试优化

### 3. 扩展建议
- 新AI服务先创建适配器
- 复杂功能可以扩展Worker组件
- 保持向后兼容性

## 🚀 未来扩展

### 支持的AI服务类型
- 🎥 **视频生成**：VEO3, Luma, Runway, Kling, Pika, Sora
- 🎨 **图片生成**：DALL-E, Midjourney, Stable Diffusion
- 🎵 **音频生成**：Suno, Udio, MusicGen
- 📝 **文本生成**：GPT, Claude, Gemini

### 组合功能支持
```sql
-- 视频+音频组合
INSERT INTO effect VALUES (20, '视频配音', 3, 'combo-video-audio', 'v1.0', 30, 'video-audio-combo', 'combo', 1);

-- 图片+视频组合  
INSERT INTO effect VALUES (21, '图片动画', 4, 'image-animation', 'v1.0', 25, 'image-animation', 'combo', 1);

数据流转示例

用户访问 /veo3-video
    ↓
WorkerWrapper 查询 effectId="12"
    ↓
获取配置: {provider: "veo3", model: "replicate/veo-3", credit: 15}
    ↓
Worker 渲染界面，用户输入prompt
    ↓
调用 /api/predictions/img_to_video
    ↓
后端识别 provider="veo3"，调用VEO3Client
    ↓
VEO3Client 转换格式，返回统一响应
    ↓
前端显示生成结果

📝 总结
Effect表驱动架构通过数据库配置实现了AI功能的无限扩展能力，将传统的"每个功能900行代码"模式转变为"每个功能1条数据库记录"模式，极大提升了开发效率和维护性。

核心价值
🎯 快速上线：新功能30分钟内上线
🔧 灵活配置：运营可实时调整参数
💰 成本控制：统一架构降低维护成本
🚀 无限扩展：支持任意数量的AI服务
架构演进路径
第一阶段：创建Effect表和基础架构
第二阶段：迁移现有硬编码页面
第三阶段：添加新AI服务和适配器
第四阶段：支持组合功能和高级特性
这是现代AI平台的标准架构模式，值得长期投入和完善！

文档版本：v1.0
最后更新：2025年6月19日
维护者：开发团队
审核者：技术负责人