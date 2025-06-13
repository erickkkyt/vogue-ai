import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server' // 确保这是正确的服务器端 Supabase 客户端导入

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // 默认重定向到首页，如果 'next' 参数存在且有效，则优先使用 'next'
  let next = requestUrl.searchParams.get('next') ?? '/'

  // 验证next参数是否为有效的内部路径
  const validPaths = ['/ai-baby-generator', '/ai-baby-podcast', '/face-to-many-kontext', '/'];
  if (!validPaths.includes(next)) {
    console.log('[OAuth Debug] Invalid next parameter, defaulting to home:', next);
    next = '/';
  }

  console.log('[OAuth Debug] Full URL:', requestUrl.toString());
  console.log('[OAuth Debug] Code:', code);
  console.log('[OAuth Debug] Next parameter (validated):', next);

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 成功交换 code 并建立会话后，重定向到 'next' 指定的路径
      const redirectUrl = new URL(next, requestUrl.origin);
      console.log(`[Auth Callback] Successfully exchanged code. Redirecting to: ${redirectUrl.toString()}`);

      // 添加一个特殊标记来帮助调试
      redirectUrl.searchParams.set('auth_success', 'true');

      return NextResponse.redirect(redirectUrl.toString())
    }
    console.error('[Auth Callback] Error exchanging code for session:', error.message)
  } else {
    console.error('[Auth Callback] No code found in request URL.');
  }

  // 如果没有 'code'，或者交换失败，则重定向到登录页并附带错误消息
  const errorRedirectUrl = new URL('/login', requestUrl.origin)
  errorRedirectUrl.searchParams.set('message', 'Authentication failed with Google. Please try again.')
  console.log(`[Auth Callback] Authentication failed or no code. Redirecting to: ${errorRedirectUrl.toString()}`);
  return NextResponse.redirect(errorRedirectUrl.toString())
} 