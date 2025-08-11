'use client';

export default function EarthZoomAbout() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full px-6 py-3 mb-6">
            <span className="text-blue-400 font-semibold text-lg">Complete Guide</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything About Earth Zoom AI
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover the revolutionary technology that transforms any location photo into a breathtaking 
            cinematic journey from Earth to space, powered by advanced AI and satellite imagery.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-16">
          {/* What is Earth Zoom AI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl px-4 py-2">
                <span className="text-blue-400 font-medium">Revolutionary Technology</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                What is Earth Zoom AI?
              </h3>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  Earth Zoom AI is the world's first artificial intelligence system that creates stunning 
                  cinematic zoom-out sequences from any location on Earth. By analyzing your photo, our 
                  AI identifies the geographical location and seamlessly transitions from your ground-level 
                  image to a spectacular orbital view of Earth from space.
                </p>
                <p>
                  Unlike traditional video effects, our technology combines real satellite imagery, 
                  advanced 3D mapping, and AI-powered motion tracking to create ultra-realistic 
                  transitions that would typically require expensive drone footage or CGI studios.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600/20 to-green-600/20 rounded-2xl p-8 backdrop-blur-md border border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">AI Processing Active</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-white font-semibold">Location: Paris, France</div>
                    <div className="text-gray-300">Coordinates: 48.8566° N, 2.3522° E</div>
                    <div className="text-gray-300">Altitude: Ground → 400km orbit</div>
                    <div className="text-gray-300">Processing: 47 frames/second</div>
                  </div>
                  <div className="mt-4 bg-gray-800/60 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Generation Progress</div>
                    <div className="mt-2 bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How Does It Work */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How Does Earth Zoom AI Work?
              </h3>
              <p className="text-lg text-gray-300 max-w-5xl mx-auto">
                Our proprietary AI pipeline combines multiple cutting-edge technologies to create seamless Earth zoom effects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="text-4xl font-bold text-blue-400 mb-4">01</div>
                <h4 className="text-xl font-bold text-white mb-3">Image Analysis</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  AI analyzes your photo to identify landmarks, geographical features, and exact GPS coordinates using computer vision and satellite data matching.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
                <div className="text-4xl font-bold text-green-400 mb-4">02</div>
                <h4 className="text-xl font-bold text-white mb-3">3D Mapping</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Creates detailed 3D terrain models using elevation data, satellite imagery, and neural depth estimation for accurate spatial reconstruction.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="text-4xl font-bold text-purple-400 mb-4">03</div>
                <h4 className="text-xl font-bold text-white mb-3">Motion Synthesis</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Generates smooth camera trajectories and motion paths, simulating realistic zoom-out sequences with proper atmospheric effects and curvature.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                <div className="text-4xl font-bold text-yellow-400 mb-4">04</div>
                <h4 className="text-xl font-bold text-white mb-3">Video Rendering</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Composites all elements into a high-quality video sequence with proper lighting, atmospheric scattering, and cinematic color grading.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Earth Zoom AI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-green-600/10 to-blue-600/10 rounded-2xl p-8 border border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Ultra-Fast Processing</div>
                      <div className="text-gray-400 text-sm">30-60 seconds generation time</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Professional Quality</div>
                      <div className="text-gray-400 text-sm">4K resolution, cinema-grade output</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Global Coverage</div>
                      <div className="text-gray-400 text-sm">Works with any location worldwide</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-block bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl px-4 py-2">
                <span className="text-green-400 font-medium">Competitive Advantage</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Why Choose Earth Zoom AI?
              </h3>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  Traditional zoom-out effects require expensive equipment, complex post-production, 
                  or costly CGI studios. Earth Zoom AI democratizes this cinematic technique, 
                  making it accessible to content creators, marketers, and filmmakers worldwide.
                </p>
                <p>
                  Our AI-powered approach delivers results that match professional studio quality 
                  in minutes, not days. Perfect for social media content, documentaries, real estate 
                  presentations, and travel videos.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Technical Specifications
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Built on cutting-edge AI infrastructure for maximum performance and reliability
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Output Quality</h4>
                  <div className="space-y-2 text-gray-300">
                    <div>• 4K Ultra HD Resolution</div>
                    <div>• 60fps Smooth Motion</div>
                    <div>• HDR Color Grading</div>
                    <div>• Professional Codecs</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Performance</h4>
                  <div className="space-y-2 text-gray-300">
                    <div>• 30-60 Second Generation</div>
                    <div>• 99.9% Uptime</div>
                    <div>• GPU-Accelerated</div>
                    <div>• Cloud Scalability</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0121 12a11.955 11.955 0 01-2.382 7.016l-2.828-2.828A8.954 8.954 0 0018 12a8.954 8.954 0 00-2.21-5.188l2.828-2.828z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">AI Models</h4>
                  <div className="space-y-2 text-gray-300">
                    <div>• Computer Vision AI</div>
                    <div>• Geospatial Analysis</div>
                    <div>• Neural Rendering</div>
                    <div>• Motion Synthesis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Perfect for Every Creator
              </h3>
              <p className="text-lg text-gray-300 max-w-5xl mx-auto">
                From social media influencers to professional filmmakers, Earth Zoom AI serves diverse creative needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-gray-700 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1h2a2 2 0 012 2v2M7 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Social Media</h4>
                <p className="text-gray-300 text-sm">Eye-catching content for TikTok, Instagram, and YouTube</p>
              </div>

              <div className="bg-gradient-to-br from-green-600/10 to-teal-600/10 rounded-xl p-6 border border-gray-700 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Real Estate</h4>
                <p className="text-gray-300 text-sm">Stunning property showcases and location highlights</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 rounded-xl p-6 border border-gray-700 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Travel & Tourism</h4>
                <p className="text-gray-300 text-sm">Breathtaking destination reveals and travel documentaries</p>
              </div>

              <div className="bg-gradient-to-br from-red-600/10 to-pink-600/10 rounded-xl p-6 border border-gray-700 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Film & Production</h4>
                <p className="text-gray-300 text-sm">Professional establishing shots and cinematic sequences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 