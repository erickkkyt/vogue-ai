import type { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog-data'; // 导入博客数据

const BASE_URL = 'https://www.babypodcast.pro'; // 确保这是您的生产域名

export default function sitemap(): MetadataRoute.Sitemap {
  // 基础页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(), // 可以设置为页面实际最后修改日期
      changeFrequency: 'monthly' as const, // 使用 as const
      priority: 1, // 页面相对重要性 (0.0 to 1.0)
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // 使用 as const
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const, // 使用 as const
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const, // 使用 as const
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`, // 博客列表页
      lastModified: new Date(),
      changeFrequency: 'weekly' as const, // 使用 as const
      priority: 0.7,
    },
  ];

  // 动态生成的博客文章页面
  const blogPostEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date), // 使用博文的日期作为 lastModified
    changeFrequency: 'monthly' as const, // 此处已正确使用 as const
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...blogPostEntries,
  ];
} 