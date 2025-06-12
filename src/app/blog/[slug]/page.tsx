import { getPostBySlug, type BlogPost, blogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';

// 定义 params 的具体形状
interface BlogPostPageParams {
  slug: string;
}

// PageProps 接口，params 现在是一个 Promise，解析后得到 BlogPostPageParams
interface PageProps {
  params: Promise<BlogPostPageParams>; // 修改类型为 Promise<BlogPostPageParams>
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // 对应修改 searchParams 如果使用
}

// Function to generate metadata dynamically
export async function generateMetadata(
  { params: paramsProp }: PageProps, // 接收 paramsProp
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await paramsProp; // 首先 await paramsProp，它是一个 Promise
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found - AI Baby Generator Blog',
    };
  }

  return {
    title: `${post.title} - AI Baby Generator Blog`,
    description: post.summary,
    alternates: {
      canonical: `https://www.babypodcast.pro/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://www.babypodcast.pro/blog/${post.slug}`,
      type: 'article',
      // Ensure post.date is in a format that new Date() can parse, e.g., YYYY-MM-DD or full ISO string
      // For "July 31, 2024", it might be safer to parse it manually or store it as YYYY-MM-DD
      // For simplicity here, we assume it can be parsed. Adjust if errors occur.
      publishedTime: new Date(post.date).toISOString(), 
      authors: [post.author],
      // images: [ /* Add a specific image for this blog post if available */ ]
    },
  };
}


export default async function BlogPostPage({ params: paramsProp }: PageProps) { // 接收 paramsProp
  const params = await paramsProp; // 首先 await paramsProp，它是一个 Promise
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound(); // Redirect to 404 if post doesn't exist
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <article className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-10 border border-gray-200">
        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {post.title}
          </h1>
          <div className="text-md text-gray-500">
            <span>By {post.author}</span> | <span>Published on {post.date}</span>
          </div>
        </header>

        {/* Apply Tailwind classes directly to the content elements if not using typography plugin */}
        <div className="text-gray-800 leading-relaxed space-y-6">
          {post.content}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="mr-2 h-5 w-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}

// Generate static paths for each blog post
export async function generateStaticParams() {
  // blogPosts ಇಲ್ಲಿ ನೇರವಾಗಿ ಲಭ್ಯವಿರಬೇಕು કારણ ನಾವು ಅದನ್ನು ಮೇಲೆ ಆಮದು ಮಾಡಿಕೊಂಡಿದ್ದೇವೆ
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
} 