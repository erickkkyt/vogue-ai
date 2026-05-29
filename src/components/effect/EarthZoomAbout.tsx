'use client';

export default function EarthZoomAbout() {
  return (
    <section id="about" className="bg-[#fffaf7]/80 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white px-6 py-3">
            <span className="text-lg font-semibold text-slate-600">Complete Guide</span>
          </div>
          <h2 className="mb-4 text-3xl font-semibold text-slate-950 md:text-4xl">
            Everything About Earth Zoom AI
          </h2>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-slate-600">
            Discover the revolutionary technology that transforms any location photo into a breathtaking 
            cinematic journey from Earth to space, powered by advanced AI and satellite imagery.
          </p>
        </div>

        <div className="mx-auto max-w-7xl space-y-16">
          {/* What is Earth Zoom AI */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white px-4 py-2">
                <span className="font-medium text-slate-600">Revolutionary Technology</span>
              </div>
              <h3 className="text-3xl font-semibold text-slate-950 md:text-4xl">
                What is Earth Zoom AI?
              </h3>
              <div className="space-y-4 text-lg leading-relaxed text-slate-600">
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
              <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-8 shadow-[0_18px_46px_rgba(72,55,44,0.06)]">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <span className="font-medium text-slate-700">AI Processing Active</span>
                  </div>
                  <div className="space-y-2">
                    <div className="font-semibold text-slate-950">Location: Paris, France</div>
                    <div className="text-slate-600">Coordinates: 48.8566° N, 2.3522° E</div>
                    <div className="text-slate-600">Altitude: Ground → 400km orbit</div>
                    <div className="text-slate-600">Processing: 47 frames/second</div>
                  </div>
                  <div className="mt-4 rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] p-3">
                    <div className="text-sm text-slate-500">Generation Progress</div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-3/4 rounded-full bg-slate-950"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How Does It Work */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="mb-4 text-3xl font-semibold text-slate-950 md:text-4xl">
                How Does Earth Zoom AI Work?
              </h3>
              <p className="mx-auto max-w-5xl text-lg text-slate-600">
                Our proprietary AI pipeline combines multiple cutting-edge technologies to create seamless Earth zoom effects
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="relative overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6">
                <div className="mb-4 text-4xl font-semibold text-slate-300">01</div>
                <h4 className="mb-3 text-xl font-semibold text-slate-950">Image Analysis</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  AI analyzes your photo to identify landmarks, geographical features, and exact GPS coordinates using computer vision and satellite data matching.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6">
                <div className="mb-4 text-4xl font-semibold text-slate-300">02</div>
                <h4 className="mb-3 text-xl font-semibold text-slate-950">3D Mapping</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Creates detailed 3D terrain models using elevation data, satellite imagery, and neural depth estimation for accurate spatial reconstruction.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6">
                <div className="mb-4 text-4xl font-semibold text-slate-300">03</div>
                <h4 className="mb-3 text-xl font-semibold text-slate-950">Motion Synthesis</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Generates smooth camera trajectories and motion paths, simulating realistic zoom-out sequences with proper atmospheric effects and curvature.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6">
                <div className="mb-4 text-4xl font-semibold text-slate-300">04</div>
                <h4 className="mb-3 text-xl font-semibold text-slate-950">Video Rendering</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Composites all elements into a high-quality video sequence with proper lighting, atmospheric scattering, and cinematic color grading.
                </p>
              </div>
            </div>
          </div>

          {/* Why Earth Zoom Out Videos Work */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-8 shadow-[0_18px_46px_rgba(72,55,44,0.06)]">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                      <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">Ultra-Fast Processing</div>
                      <div className="text-slate-500 text-sm">30-60 seconds generation time</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                      <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">Professional Quality</div>
                      <div className="text-slate-500 text-sm">4K resolution, cinema-grade output</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                      <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">Global Coverage</div>
                      <div className="text-slate-500 text-sm">Works with any location worldwide</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white px-4 py-2">
                <span className="font-medium text-slate-600">Competitive Advantage</span>
              </div>
              <h3 className="text-3xl font-semibold text-slate-950 md:text-4xl">
                Why Earth Zoom Out Videos Work
              </h3>
              <div className="space-y-4 text-lg leading-relaxed text-slate-600">
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
              <h3 className="mb-4 text-3xl font-semibold text-slate-950 md:text-4xl">
                Technical Specifications
              </h3>
              <p className="mx-auto max-w-3xl text-lg text-slate-600">
                Built on cutting-edge AI infrastructure for maximum performance and reliability
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                    <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="mb-2 text-xl font-semibold text-slate-950">Output Quality</h4>
                  <div className="space-y-2 text-slate-600">
                    <div>• 4K Ultra HD Resolution</div>
                    <div>• 60fps Smooth Motion</div>
                    <div>• HDR Color Grading</div>
                    <div>• Professional Codecs</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                    <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="mb-2 text-xl font-semibold text-slate-950">Performance</h4>
                  <div className="space-y-2 text-slate-600">
                    <div>• 30-60 Second Generation</div>
                    <div>• 99.9% Uptime</div>
                    <div>• GPU-Accelerated</div>
                    <div>• Cloud Scalability</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                    <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0121 12a11.955 11.955 0 01-2.382 7.016l-2.828-2.828A8.954 8.954 0 0018 12a8.954 8.954 0 00-2.21-5.188l2.828-2.828z" />
                    </svg>
                  </div>
                  <h4 className="mb-2 text-xl font-semibold text-slate-950">AI Models</h4>
                  <div className="space-y-2 text-slate-600">
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
              <h3 className="mb-4 text-3xl font-semibold text-slate-950 md:text-4xl">
                Perfect for Every Creator
              </h3>
              <p className="mx-auto max-w-5xl text-lg text-slate-600">
                From social media influencers to professional filmmakers, Earth Zoom AI serves diverse creative needs
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                  <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1h2a2 2 0 012 2v2M7 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-slate-950">Social Media</h4>
                <p className="text-sm text-slate-600">Eye-catching content for TikTok, Instagram, and YouTube</p>
              </div>

              <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                  <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-slate-950">Real Estate</h4>
                <p className="text-sm text-slate-600">Stunning property showcases and location highlights</p>
              </div>

              <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                  <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-slate-950">Travel & Tourism</h4>
                <p className="text-sm text-slate-600">Breathtaking destination reveals and travel documentaries</p>
              </div>

              <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                  <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-slate-950">Film & Production</h4>
                <p className="text-sm text-slate-600">Professional establishing shots and cinematic sequences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
