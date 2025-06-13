'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server' // 导入我们更新后的服务器端客户端

export async function login(formData: FormData) {
  const supabase = await createClient() // 使用 await

  // 从表单数据获取邮箱、密码和重定向目标
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = formData.get('next') as string || '/'

  // 输入验证 (基本)
  if (!email || !password) {
    // 返回错误对象
    return { success: false, message: 'Email and password cannot be empty.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('[Server Action - Login] Error:', error)
     // 返回错误对象
    return { success: false, message: `Sign-in failed: ${error.message}` }
  }

  revalidatePath('/', 'layout') // 重新验证缓存，确保layout获取最新状态
  // 登录成功重定向到指定页面或首页
  redirect(next) // 登录成功，重定向到指定页面
}

// 修改 signup 函数使其返回 Promise<{ success: boolean; message: string }>
export async function signup(formData: FormData): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient() // 使用 await

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 输入验证 (基本)
  if (!email || !password) {
    // 返回错误对象
    return { success: false, message: 'Email and password cannot be empty.' }
  }
  if (password.length < 6) {
    // 返回错误对象
    return { success: false, message: 'Password must be at least 6 characters long.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // 可选：如果您的应用需要，可以在这里传递 email_redirect_to
      // emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('[Server Action - Signup] Error:', error)
    // 返回错误对象
    return { success: false, message: `Sign-up failed: ${error.message}` }
  }

  // 根据 Supabase 项目设置决定是直接重定向还是显示确认消息
  // 如果开启了邮件确认，这里应该重定向到一个提示用户检查邮箱的页面
  // 如果未开启邮件确认，用户已注册并登录，可以重定向到仪表盘
  revalidatePath('/', 'layout')
  // 注册成功，返回成功消息对象
  return { success: true, message: 'Sign-up request sent. Please check your email to confirm your account.' }
  // 如果未开启，则 redirect('/dashboard')
} 