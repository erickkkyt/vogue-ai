'use client';

export default function FeaturesEarthZoom() {
  return (
    <section id="features" className="bg-white/90 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] px-4 py-2">
            <span className="text-sm font-semibold text-slate-600">Advanced Features</span>
          </div>
          <h2 className="mb-4 text-3xl font-semibold text-slate-950 md:text-4xl">
            How to Use Earth Zoom AI
          </h2>
          <p className="mx-auto max-w-4xl text-xl text-slate-600">
            Follow these simple steps to create stunning Earth zoom-out effects with our AI-powered technology
          </p>
        </div>

        {/* How-to Steps */}
        <div className="mx-auto mb-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-8 shadow-[0_16px_42px_rgba(72,55,44,0.07)]">
              <div className="mb-6 inline-flex h-10 min-w-10 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] px-3 text-sm font-semibold text-slate-600">
                01
              </div>
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                  <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-4 mt-4 text-xl font-semibold text-slate-950">
                Upload Your Photo
              </h3>
              <p className="leading-relaxed text-slate-600">
                Upload any photo of a landmark, building, or location. Our AI works best with clear, well-lit images that show distinct geographical features.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-8 shadow-[0_16px_42px_rgba(72,55,44,0.07)]">
              <div className="mb-6 inline-flex h-10 min-w-10 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] px-3 text-sm font-semibold text-slate-600">
                02
              </div>
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                  <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-4 mt-4 text-xl font-semibold text-slate-950">
                Customize Settings
              </h3>
              <p className="leading-relaxed text-slate-600">
                Adjust zoom speed, transition style, and final orbital altitude. Choose from various atmospheric effects and camera movement patterns for your unique vision.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-8 shadow-[0_16px_42px_rgba(72,55,44,0.07)]">
              <div className="mb-6 inline-flex h-10 min-w-10 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] px-3 text-sm font-semibold text-slate-600">
                03
              </div>
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                  <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-4 mt-4 text-xl font-semibold text-slate-950">
                Generate & Download
              </h3>
              <p className="leading-relaxed text-slate-600">
                Click Generate to create your Earth zoom-out video. Processing takes 30-60 seconds. Download in HD quality for all your social media platforms.
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Features Grid */}
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-2xl font-semibold text-slate-950 md:text-3xl">
              Professional Earth Zoom Features
            </h3>
            <p className="text-lg text-slate-600">
              Advanced capabilities that make our Earth Zoom AI the ultimate choice for content creators
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6 transition duration-300 hover:border-[rgba(72,55,44,0.22)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-slate-950">Satellite Integration</h4>
              <p className="text-sm text-slate-500">Real satellite imagery blending for ultra-realistic transitions</p>
            </div>

            <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6 transition duration-300 hover:border-[rgba(72,55,44,0.22)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-slate-950">Real-Time Processing</h4>
              <p className="text-sm text-slate-500">Generate videos in under 60 seconds with professional quality</p>
            </div>

            <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6 transition duration-300 hover:border-[rgba(72,55,44,0.22)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-slate-950">Customizable Effects</h4>
              <p className="text-sm text-slate-500">Control zoom speed, atmospheric effects, and camera movements</p>
            </div>

            <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white p-6 transition duration-300 hover:border-[rgba(72,55,44,0.22)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7]">
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-slate-950">Multi-Platform Export</h4>
              <p className="text-sm text-slate-500">Optimized formats for TikTok, Instagram, YouTube, and more</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
