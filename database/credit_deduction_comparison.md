# 🏦 积分扣除逻辑对比分析

## 📊 **三种功能的积分扣除模式对比**

### **1. AI Baby Generator (前扣除模式)**

#### **扣除时机**: 生成开始时立即扣除
- **API路由**: `src/app/api/baby/generate/route.ts`
- **数据库函数**: `deduct_credits(p_user_id, p_credits_to_deduct)`
- **积分计算**: 固定3积分
- **扣除逻辑**: 
  ```sql
  -- 在创建记录时立即扣除积分
  INSERT INTO baby_generations (..., credits_used) VALUES (..., 3);
  UPDATE user_profiles SET credits = credits - 3 WHERE user_id = p_user_id;
  ```

#### **优势**:
- ✅ 简单直接，无需复杂计算
- ✅ 避免生成失败后的积分处理问题
- ✅ 用户明确知道消耗成本

#### **劣势**:
- ❌ 无法根据实际生成内容调整
- ❌ 固定积分可能不够灵活

---

### **2. AI Baby Podcast (后扣除模式)**

#### **扣除时机**: 视频生成完成后按实际时长扣除
- **API路由**: `src/app/api/submit-podcast-idea/route.ts`
- **Webhook**: `src/app/api/webhook/n8n-video-ready/route.ts`
- **数据库函数**: `deduct_credits_by_duration(p_job_id, p_duration_ms)`
- **积分计算**: `Math.ceil(duration_ms / 1000) * resolution_multiplier`
- **扣除逻辑**:
  ```sql
  -- 创建时不扣除积分
  INSERT INTO projects (..., credits_used) VALUES (..., 0);
  
  -- 完成后按实际时长扣除
  UPDATE user_profiles SET credits = credits - calculated_credits;
  UPDATE projects SET credits_used = calculated_credits;
  ```

#### **优势**:
- ✅ 用户只为实际生成的内容付费
- ✅ 支持不同分辨率差异化定价
- ✅ 公平透明的计费方式

#### **劣势**:
- ❌ 需要处理生成失败的情况
- ❌ 用户无法预先知道确切消耗

---

### **3. Lipsync Generator (前扣除模式 - 新优化)**

#### **扣除时机**: 生成开始时按估算时长前扣除，完成后多退少补
- **API路由**: `src/app/api/lipsync/generate/route.ts`
- **Webhook**: `src/app/api/webhook/lipsync-ready/route.ts`
- **数据库函数**: 
  - `create_lipsync_project_with_credit_deduction()` - 前扣除
  - `adjust_lipsync_credits_by_actual_duration()` - 后调整
- **积分计算**: `estimated_duration_seconds * resolution_multiplier`
- **扣除逻辑**:
  ```sql
  -- 1. 创建时按估算时长前扣除积分
  v_credits_to_deduct := p_estimated_duration_seconds * v_resolution_multiplier;
  UPDATE user_profiles SET credits = credits - v_credits_to_deduct;
  INSERT INTO lipsync_generations (..., credits_used) VALUES (..., v_credits_to_deduct);
  
  -- 2. 完成后按实际时长调整积分（多退少补）
  v_credit_adjustment := v_actual_credits_needed - v_credits_already_deducted;
  UPDATE user_profiles SET credits = credits - v_credit_adjustment;
  UPDATE lipsync_generations SET credits_used = v_actual_credits_needed;
  ```

#### **优势**:
- ✅ 用户可以预先知道大概消耗
- ✅ 支持不同分辨率差异化定价
- ✅ 最终按实际内容付费（多退少补）
- ✅ 避免积分不足的生成失败

#### **劣势**:
- ❌ 实现逻辑相对复杂
- ❌ 需要处理两次积分操作

---

## 🎯 **积分计算公式对比**

| 功能 | 计算公式 | 示例 |
|------|----------|------|
| **AI Baby Generator** | 固定3积分 | 任何生成 = 3积分 |
| **AI Baby Podcast** | `ceil(duration_ms/1000) * resolution_multiplier` | 10秒720p = 10×2 = 20积分 |
| **Lipsync Generator** | `estimated_duration * resolution_multiplier` | 估算8秒720p = 8×2 = 16积分 |

## 🔄 **分辨率倍数设置**

| 分辨率 | AI Baby Podcast | Lipsync Generator |
|--------|-----------------|-------------------|
| **540p** | 1倍积分 | 1倍积分 |
| **720p** | 2倍积分 | 2倍积分 |

## 📈 **前端积分检查逻辑**

### **AI Baby Generator**
```typescript
// 简单固定检查
const canGenerate = validCredits >= 3;
```

### **AI Baby Podcast**
```typescript
// 基于最低要求检查
const REQUIRED_CREDITS_PER_PROJECT = 1;
const canGenerate = validCredits > REQUIRED_CREDITS_PER_PROJECT;
```

### **Lipsync Generator**
```typescript
// 基于估算消耗检查
const getRequiredCredits = () => {
  const estimatedDuration = calculateDuration();
  const resolutionMultiplier = videoResolution === '720p' ? 2 : 1;
  return Math.max(estimatedDuration * resolutionMultiplier, 3);
};
const canGenerate = validCredits >= getRequiredCredits();
```

## 🎨 **用户体验对比**

| 方面 | AI Baby Generator | AI Baby Podcast | Lipsync Generator |
|------|-------------------|-----------------|-------------------|
| **预知消耗** | ✅ 明确3积分 | ❌ 无法预知 | ✅ 显示估算消耗 |
| **公平计费** | ❌ 固定收费 | ✅ 按实际时长 | ✅ 按实际时长 |
| **生成保障** | ✅ 前扣除保障 | ❌ 可能中途失败 | ✅ 前扣除保障 |
| **积分退还** | ❌ 无退还 | ❌ 无退还 | ✅ 多退少补 |

## 🚀 **推荐使用场景**

### **前扣除模式** (AI Baby Generator, Lipsync Generator)
- ✅ 适合生成时间较短的功能
- ✅ 适合需要保障生成成功的场景
- ✅ 适合用户希望预知消耗的功能

### **后扣除模式** (AI Baby Podcast)
- ✅ 适合生成时间较长的功能
- ✅ 适合时长差异很大的内容
- ✅ 适合追求绝对公平计费的场景

## 📝 **总结**

Lipsync Generator采用的**前扣除+后调整**模式结合了两种方式的优势：
1. **用户体验**: 预先知道大概消耗，避免生成中断
2. **公平计费**: 最终按实际时长付费，多退少补
3. **系统稳定**: 避免积分不足导致的生成失败

这种混合模式为用户提供了最佳的使用体验和最公平的计费方式。
