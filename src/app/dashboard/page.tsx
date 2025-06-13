import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // 重定向到首页，让用户选择工具
  return redirect('/');
}