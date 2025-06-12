'use client';

import StarBorder from './StarBorder';

export default function ComingSoon() {
  return (
    <section className="py-12 bg-yellow-50 border-y border-yellow-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-100 rounded-full text-yellow-800 font-medium mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Coming Soon
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            This Feature is Under Development
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            We're working hard to bring you the most advanced face transformation technology. 
            Stay tuned for updates and be the first to try it when it launches!
          </p>
          
          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <StarBorder
                as="button"
                color="rgba(34, 197, 94, 0.8)"
                speed="5s"
                className="font-medium whitespace-nowrap"
              >
                Notify Me
              </StarBorder>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We'll only send you updates about Face-to-Many-Kontext. No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
