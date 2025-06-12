import Link from 'next/link';
import { blogPosts, type BlogPost } from '@/lib/blog-data';

export default function BlogListPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          AI Baby Generator Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Latest news, updates, and articles from the AI Baby Generator team.
        </p>
      </header>

      {blogPosts.length === 0 ? (
        <p className="text-center text-gray-500">No blog posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-10 max-w-3xl mx-auto">
          {blogPosts.map((post: BlogPost) => (
            <article key={post.slug} className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                <Link href={`/blog/${post.slug}`} className="block">
                  {post.title}
                </Link>
              </h2>
              <div className="text-sm text-gray-500 mb-3">
                <span>By {post.author}</span> | <span>{post.date}</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {post.summary}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Read more
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
} 