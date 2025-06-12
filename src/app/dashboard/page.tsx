import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // 重定向到 AI Baby Podcast 页面（默认工具）
  return redirect('/ai-baby-podcast');
}