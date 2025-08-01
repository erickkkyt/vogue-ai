'use client';

export default function FeaturesSeedance() {
  return (
    <section id="pricing" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Affordable Seedance AI Access - No Monthly Limits
          </h2>
          <div className="text-xl text-gray-300 max-w-5xl mx-auto">
            <p className="mb-2 whitespace-nowrap">
              Compare our unbeatable pricing with competitors. No need for expensive subscriptions - start your dance journey for just <span className="text-green-400 font-semibold">$1.00</span> (free trial provided)!
            </p>
            <p>
              <span className="text-green-400 font-semibold">No monthly restrictions</span> like other platforms -
              <span className="text-green-400 font-semibold"> generate with credits only</span>.
            </p>
          </div>
        </div>

        {/* Pricing Comparison Table */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-white font-bold">Platform</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Monthly Cost</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Video Limit</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Per Video Cost</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-500/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 w-3 h-3 rounded-full mr-3"></div>
                        <span className="text-white font-bold">Vogue AI Seedance</span>
                        <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">BEST VALUE</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-green-400 font-bold">$0 - $99.9</td>
                    <td className="px-6 py-4 text-center text-green-400 font-bold">Unlimited</td>
                    <td className="px-6 py-4 text-center text-green-400 font-bold">$0.30 - $1.00</td>
                    <td className="px-6 py-4 text-center text-green-400 font-bold">HD+</td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-300">Competitor A</td>
                    <td className="px-6 py-4 text-center text-red-400">$29.99</td>
                    <td className="px-6 py-4 text-center text-gray-400">50 videos</td>
                    <td className="px-6 py-4 text-center text-red-400">$0.60</td>
                    <td className="px-6 py-4 text-center text-gray-400">HD</td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-300">Competitor B</td>
                    <td className="px-6 py-4 text-center text-red-400">$49.99</td>
                    <td className="px-6 py-4 text-center text-gray-400">100 videos</td>
                    <td className="px-6 py-4 text-center text-red-400">$0.50</td>
                    <td className="px-6 py-4 text-center text-gray-400">HD</td>
                  </tr>
                  <tr className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-300">Competitor C</td>
                    <td className="px-6 py-4 text-center text-red-400">$99.99</td>
                    <td className="px-6 py-4 text-center text-gray-400">Unlimited</td>
                    <td className="px-6 py-4 text-center text-red-400">$3.33/day</td>
                    <td className="px-6 py-4 text-center text-gray-400">HD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center hover:border-green-500/50 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pay Per Use</h3>
            <p className="text-gray-400">Only pay for what you create. No wasted monthly fees for unused features.</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Access</h3>
            <p className="text-gray-400">Start creating immediately. No waiting periods or approval processes.</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Quality</h3>
            <p className="text-gray-400">High-definition dance videos with professional-grade AI technology.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/50 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Creating Dance Videos?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of creators who chose the most affordable and flexible dance video generation platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#dashboard"
                className="inline-flex items-center bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Creating Now
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:bg-gray-800/50"
              >
                View All Plans
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
