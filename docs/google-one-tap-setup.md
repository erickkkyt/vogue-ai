# Google One-Tap 登录配置指南

## 1. Google Cloud Console 配置

### 步骤 1: 创建 Google Cloud 项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目

### 步骤 2: 启用 Google Identity API
1. 在左侧菜单中，选择 "APIs & Services" > "Library"
2. 搜索 "Google Identity"
3. 启用 "Google Identity API"

### 步骤 3: 配置 OAuth 同意屏幕
1. 在左侧菜单中，选择 "APIs & Services" > "OAuth consent screen"
2. 选择 "External" 用户类型
3. 填写应用信息：
   - 应用名称: "VOGUE AI"
   - 用户支持邮箱: 您的邮箱
   - 开发者联系信息: 您的邮箱
4. 添加授权域名（如果有的话）
5. 添加范围：
   - `email`
   - `profile`
   - `openid`

### 步骤 4: 创建 OAuth 2.0 客户端 ID
1. 在左侧菜单中，选择 "APIs & Services" > "Credentials"
2. 点击 "Create Credentials" > "OAuth 2.0 Client IDs"
3. 选择应用类型: "Web application"
4. 设置名称: "VOGUE AI Web Client"
5. 添加授权的 JavaScript 来源:
   - `http://localhost:3000` (开发环境)
   - `https://yourdomain.com` (生产环境)
6. 添加授权的重定向 URI:
   - `http://localhost:3000/auth/callback` (开发环境)
   - `https://yourdomain.com/auth/callback` (生产环境)
7. 点击 "Create"
8. 复制生成的客户端 ID

## 2. Supabase 配置

### 步骤 1: 启用 Google OAuth
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 在左侧菜单中，选择 "Authentication" > "Providers"
4. 找到 "Google" 并点击启用
5. 填写配置：
   - **Client ID**: 从 Google Cloud Console 复制的客户端 ID
   - **Client Secret**: 从 Google Cloud Console 复制的客户端密钥
6. 点击 "Save"

### 步骤 2: 配置重定向 URL
确保在 Supabase 的 "Authentication" > "URL Configuration" 中设置了正确的重定向 URL：
- Site URL: `http://localhost:3000` (开发) / `https://yourdomain.com` (生产)
- Redirect URLs: 添加您的域名

## 3. 环境变量配置

在 `.env.local` 文件中更新以下变量：

```env
# Google One-Tap 登录配置
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-actual-client-id.apps.googleusercontent.com"
NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED="true"
```

## 4. 测试配置

1. 重启开发服务器: `npm run dev`
2. 访问登录页面: `http://localhost:3000/login`
3. 应该会看到 Google One-Tap 弹窗（如果您之前登录过 Google）
4. 点击您的 Google 账户进行登录

## 5. 故障排除

### 常见问题：

1. **One-Tap 不显示**
   - 检查 Google Client ID 是否正确
   - 确保域名在 Google Cloud Console 中已授权
   - 检查浏览器控制台是否有错误

2. **登录失败**
   - 检查 Supabase Google OAuth 配置
   - 确保重定向 URL 正确
   - 检查网络请求是否成功

3. **开发环境问题**
   - 确保使用 `http://localhost:3000` 而不是 `127.0.0.1`
   - 清除浏览器缓存和 cookies

### 调试步骤：

1. 打开浏览器开发者工具
2. 查看 Console 标签页的错误信息
3. 查看 Network 标签页的网络请求
4. 检查 Application 标签页的 Local Storage 和 Cookies

## 6. 生产环境部署

部署到生产环境时，请确保：

1. 更新 Google Cloud Console 中的授权域名
2. 更新 Supabase 中的重定向 URL
3. 更新环境变量中的域名
4. 测试 One-Tap 功能是否正常工作

## 7. 安全注意事项

1. 不要在客户端代码中暴露 Google Client Secret
2. 定期轮换 API 密钥
3. 监控异常登录活动
4. 确保 HTTPS 在生产环境中启用
