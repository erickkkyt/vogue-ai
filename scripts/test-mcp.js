#!/usr/bin/env node

/**
 * Vogue AI - Supabase MCP 测试脚本
 * 用于验证 MCP 配置是否正确
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Vogue AI - Supabase MCP 测试脚本');
console.log('=====================================\n');

// 检查 Node.js 版本
console.log('📋 检查环境...');
console.log(`Node.js 版本: ${process.version}`);

// 检查环境变量
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('\n🔍 检查环境变量...');
let envOk = true;
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: 已设置`);
  } else {
    console.log(`❌ ${envVar}: 未设置`);
    envOk = false;
  }
});

if (!envOk) {
  console.log('\n❌ 请先设置必需的环境变量');
  process.exit(1);
}

// 检查 MCP 访问令牌
const mcpToken = process.env.SUPABASE_ACCESS_TOKEN;
if (mcpToken) {
  console.log('✅ SUPABASE_ACCESS_TOKEN: 已设置');
} else {
  console.log('⚠️  SUPABASE_ACCESS_TOKEN: 未设置（MCP 功能需要）');
  console.log('   请访问 https://supabase.com/dashboard/account/tokens 创建个人访问令牌');
}

console.log('\n🧪 测试 Supabase MCP 服务器...');

// 测试 MCP 服务器
const mcpArgs = [
  '-y',
  '@supabase/mcp-server-supabase@latest',
  '--read-only',
  '--project-ref=basyzhsafnqdzxfguwxp',
  '--features=database,docs,development,debug',
  '--help'
];

console.log('执行命令: npx', mcpArgs.join(' '));

const mcpProcess = spawn('npx', mcpArgs, {
  stdio: 'pipe',
  env: {
    ...process.env,
    SUPABASE_ACCESS_TOKEN: mcpToken || 'test-token'
  }
});

let output = '';
let errorOutput = '';

mcpProcess.stdout.on('data', (data) => {
  output += data.toString();
});

mcpProcess.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

mcpProcess.on('close', (code) => {
  console.log('\n📊 测试结果:');
  
  if (code === 0) {
    console.log('✅ MCP 服务器可以正常启动');
    console.log('\n📖 帮助信息:');
    console.log(output);
  } else {
    console.log('❌ MCP 服务器启动失败');
    console.log('\n🔍 错误信息:');
    console.log(errorOutput);
  }
  
  console.log('\n🎯 下一步:');
  console.log('1. 如果测试成功，请将 mcp-config.json 配置添加到你的 MCP 客户端');
  console.log('2. 如果测试失败，请检查网络连接和 Node.js 环境');
  console.log('3. 确保已创建 Supabase 个人访问令牌');
  console.log('\n📚 详细说明请查看: SUPABASE_MCP_SETUP.md');
});

mcpProcess.on('error', (error) => {
  console.log('❌ 无法启动 MCP 服务器:', error.message);
  console.log('\n🔍 可能的原因:');
  console.log('- Node.js 未正确安装');
  console.log('- npm/npx 不可用');
  console.log('- 网络连接问题');
});
