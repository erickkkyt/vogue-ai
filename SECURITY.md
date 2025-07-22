# 🔒 安全配置指南

## 环境变量配置

在部署此项目之前，请确保设置以下环境变量。创建一个 `.env.local` 文件并添加以下配置：

### 必需的环境变量

```bash
# 数据库配置 (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# 支付配置 (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# 文件存储配置 (Cloudflare R2)
R2_ACCOUNT_ID=your_r2_account_id_here
R2_ACCESS_KEY_ID=your_r2_access_key_id_here
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key_here

# n8n 工作流配置
N8N_WEBHOOK_URL=your_n8n_webhook_url_here
N8N_API_KEY=your_n8n_api_key_here
N8N_WEBHOOK_URL_VEO3=your_veo3_n8n_webhook_url_here
```

### 可选的环境变量

这些变量是可选的。如果不设置，相应的功能将不会加载：

```bash
# Google Analytics (可选)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google AdSense (可选)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX

# Microsoft Clarity (可选)
NEXT_PUBLIC_CLARITY_ID=your_clarity_id_here
```

## 开源安全注意事项

### ✅ 已安全处理的内容

- 所有API密钥和敏感信息都通过环境变量处理
- `.gitignore` 正确忽略了所有环境变量文件
- 数据库连接信息完全通过环境变量配置
- 支付相关密钥安全存储

### ⚠️ 公开的标识符

以下标识符在代码中是公开的，这是正常的，因为它们本身就是公开标识符：

- Google Analytics ID (如果设置)
- Google AdSense 发布商ID (如果设置)
- Microsoft Clarity ID (如果设置)
- Cloudflare R2 公开域名
- Stripe 价格ID (这些是公开的产品标识符)

### 🛡️ 部署建议

1. **生产环境**：确保所有环境变量都设置为生产值
2. **开发环境**：使用测试密钥和沙盒环境
3. **CI/CD**：在部署流水线中安全地注入环境变量
4. **监控**：定期检查和轮换API密钥

## 贡献者注意事项

如果你要为此项目贡献代码：

1. **永远不要**提交包含真实API密钥的代码
2. **使用**环境变量来处理所有敏感配置
3. **测试**确保你的更改不会暴露敏感信息
4. **更新**此文档如果你添加了新的环境变量

## 报告安全问题

如果你发现了安全漏洞，请通过私人渠道联系项目维护者，不要公开披露。 