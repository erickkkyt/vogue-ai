# Google One-Tap 故障排除指南

## 🔍 **常见错误分析**

### 1. **重复凭证请求错误**
```
Only one navigator.credentials.get request may be outstanding at one time
```

**原因**：
- 多个 Google One-Tap 实例同时运行
- 重复调用 `google.accounts.id.prompt()`
- 组件重复挂载导致多次初始化

**解决方案**：
- ✅ 添加全局状态控制 (`isOneTapInitialized`, `isOneTapPrompting`)
- ✅ 防止重复初始化和提示
- ✅ 移除登录页面中的重复组件

### 2. **WebSocket 连接错误**
```
WebSocket connection to 'ws://localhost:3001/' failed
```

**原因**：
- Next.js 开发服务器热重载问题
- 端口冲突

**解决方案**：
- 重启开发服务器：`npm run dev`
- 检查端口是否被占用
- 清除浏览器缓存

### 3. **服务器响应错误**
```
Failed to load resource: the server responded with a status of 403/502
```

**原因**：
- Google API 配置问题
- 域名未在 Google Cloud Console 中授权
- Supabase 配置错误

**解决方案**：
- 检查 Google Client ID 配置
- 验证域名授权
- 确认 Supabase OAuth 设置

## 🛠️ **已实施的修复**

### 1. **防重复机制**
```typescript
// 全局变量防止重复初始化
let isOneTapInitialized = false;
let isOneTapPrompting = false;

const oneTapLogin = async function () {
  // 防止重复调用
  if (isOneTapPrompting) {
    console.log("One-Tap already prompting, skipping...");
    return;
  }
  // ... 其他逻辑
};
```

### 2. **智能重试机制**
```typescript
// 减少重试频率，避免过度调用
const retryTimer = setTimeout(() => {
  if (!isOneTapInitialized) {
    oneTapLogin();
  }
}, 2000);

// 长间隔重试
const intervalId = setInterval(() => {
  if (!isOneTapPrompting) {
    oneTapLogin();
  }
}, 30000);
```

### 3. **组件优化**
- 移除登录页面中的重复 GoogleOneTap 组件
- 只在全局布局中保留一个实例
- 优化脚本加载策略

## 🧪 **测试步骤**

### 1. **基本功能测试**
1. 访问 `http://localhost:3000`
2. 打开浏览器开发者工具
3. 查看 Console 是否有 One-Tap 相关日志
4. 确认没有重复请求错误

### 2. **详细测试页面**
1. 访问 `http://localhost:3000/test-onetap`
2. 查看实时日志
3. 点击"手动触发 One-Tap"按钮
4. 观察 One-Tap 弹窗是否正常显示

### 3. **登录流程测试**
1. 确保已登出状态
2. 访问任意页面
3. 应该看到 Google One-Tap 弹窗
4. 点击 Google 账户进行登录

## 📋 **检查清单**

### **环境配置**
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 已正确设置
- [ ] `NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED="true"`
- [ ] Google Cloud Console 域名已授权
- [ ] Supabase Google OAuth 已配置

### **代码检查**
- [ ] 只有一个 GoogleOneTap 组件实例
- [ ] 没有重复的脚本加载
- [ ] 防重复机制正常工作
- [ ] 错误处理完善

### **浏览器检查**
- [ ] 控制台没有错误信息
- [ ] 网络请求正常
- [ ] One-Tap 弹窗能正常显示
- [ ] 登录流程完整

## 🚀 **性能优化**

### 1. **减少API调用**
- 使用全局状态避免重复初始化
- 智能重试，避免过度请求
- 用户已登录时跳过 One-Tap

### 2. **脚本加载优化**
- 在 layout 中预加载 Google Identity Services
- 使用 `afterInteractive` 策略
- 避免重复加载脚本

### 3. **用户体验优化**
- 显示加载状态
- 提供清晰的错误信息
- 智能显示控制

## 📞 **获取帮助**

如果问题仍然存在：

1. **检查浏览器控制台**
   - Console 标签页查看错误日志
   - Network 标签页检查网络请求
   - Application 标签页查看存储状态

2. **使用测试页面**
   - 访问 `/test-onetap` 查看详细日志
   - 手动触发测试各个功能
   - 观察实时状态变化

3. **验证配置**
   - 确认所有环境变量正确
   - 检查 Google Cloud Console 设置
   - 验证 Supabase 配置

通过这些修复，Google One-Tap 应该能够正常工作，在用户访问网站时自动显示登录提示。
