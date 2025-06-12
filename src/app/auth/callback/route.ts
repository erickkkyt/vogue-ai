import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server' // 确保这是正确的服务器端 Supabase 客户端导入

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // 默认重定向到 /ai-baby-podcast，如果 'next' 参数存在且有效，则优先使用 'next'
  const next = requestUrl.searchParams.get('next') ?? '/ai-baby-podcast'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 成功交换 code 并建立会话后，重定向到 'next' 指定的路径
      const redirectUrl = new URL(next, requestUrl.origin);
      console.log(`[Auth Callback] Successfully exchanged code. Redirecting to: ${redirectUrl.toString()}`);
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