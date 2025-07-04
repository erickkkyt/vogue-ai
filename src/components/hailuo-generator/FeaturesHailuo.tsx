'use client';

export default function FeaturesHailuo() {

  return (
    <section id="pricing" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How to Use Hailuo AI on VogueAI
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Follow these simple steps to create stunning AI videos with Hailuo technology on our platform
          </p>
        </div>

        {/* How-to Steps */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-4 mt-4">
                Select the Hailuo AI Model
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Go to the Hailuo AI video generator and choose the Hailuo AI model. Our platform provides the most affordable access to this cutting-edge technology.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-4 mt-4">
                Input Your Image and Prompt
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Upload your image, enter your text prompt, and customize other options. Describe your vision in detail for the best results.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-4 mt-4">
                Create The Video
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Click Create to start the video generation process. Your professional-quality Hailuo AI video will be ready in minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
