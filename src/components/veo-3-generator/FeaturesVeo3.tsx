'use client';

export default function FeaturesVeo3() {

  return (
    <section id="pricing" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cheapest Veo 3 Access - No Monthly Limits
          </h2>
          <div className="text-xl text-gray-300 max-w-5xl mx-auto">
            <p className="mb-2 whitespace-nowrap">
              Compare our unbeatable pricing with competitors. No need for $249.99 - start your Veo 3 journey for just <span className="text-green-400 font-semibold">$1.00</span> (free trial provided)!
            </p>
            <p>
              <span className="text-green-400 font-semibold">No monthly restrictions</span> like Google's official platform -
              <span className="text-green-400 font-semibold"> generate with credits only</span>.
            </p>
          </div>
        </div>



        {/* Price Comparison Table */}
        <div className="mt-20">


          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-900/90 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-fixed" suppressHydrationWarning>
                  <colgroup>
                    <col className="w-[14.28%]" />
                    <col className="w-[14.28%]" />
                    <col className="w-[14.28%]" />
                    <col className="w-[14.28%]" />
                    <col className="w-[14.28%]" />
                    <col className="w-[14.28%]" />
                    <col className="w-[14.28%]" />
                  </colgroup>
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-gradient-to-r from-green-900/50 to-teal-900/50 border-b border-gray-700">
                      <th className="text-center py-4 px-2 text-white font-bold text-sm">price per second</th>
                      <th className="text-center py-4 px-2 text-white font-bold text-sm">Vogue Starter Plan</th>
                      <th className="text-center py-4 px-2 text-white font-bold text-sm">Vogue Pro Plan</th>
                      <th className="text-center py-4 px-2 text-white font-bold text-sm">Vogue Creator Plan</th>
                      <th className="text-center py-4 px-2 text-white font-bold text-sm">official price</th>
                      <th className="text-center py-4 px-2 text-white font-bold text-sm">fal.ai</th>
                      <th className="text-center py-4 px-2 text-white font-bold text-sm">replicate</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    <tr className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-2 text-center text-gray-300 font-medium">price per second</td>
                      <td className="py-4 px-2 text-center">
                        <div className="bg-green-900/40 border border-green-600 rounded-lg p-2">
                          <div className="text-green-400 font-bold text-lg">$0.373</div>
                          <div className="text-green-300 text-xs mt-1">Best Value</div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="bg-green-900/40 border border-green-600 rounded-lg p-2">
                          <div className="text-green-400 font-bold text-lg">$0.340</div>
                          <div className="text-green-300 text-xs mt-1">Popular</div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="bg-green-900/40 border border-green-600 rounded-lg p-2">
                          <div className="text-green-400 font-bold text-lg">$0.312</div>
                          <div className="text-green-300 text-xs mt-1">Pro Choice</div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="text-red-400 font-bold text-lg">$0.500</div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="text-red-400 font-bold text-lg">$0.500</div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="text-red-400 font-bold text-lg">$0.750</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Price Highlight */}
              <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 border-t border-gray-700 p-4">
                <div className="text-center">
                  <p className="text-green-400 font-semibold text-sm">
                    🚀 Same quality, better price
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 border border-green-700 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-md">
              <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">
                🚀 Start Your Veo 3 Journey Today
              </h4>
              <p className="text-lg text-gray-300 mb-6">
                No need for <span className="text-red-400 font-bold line-through">$249.99</span> -
                Start generating professional Veo 3 videos for just <span className="text-green-400 font-bold text-xl">$1.00</span> (free trial provided)!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/pricing"
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started for $1.00
                </a>
                <div className="text-gray-400 text-sm">
                  ✅ No monthly limits • ✅ Credit-based • ✅ Instant access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
