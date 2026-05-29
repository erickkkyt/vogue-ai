'use client';

import { useState } from 'react';

export default function EarthZoomShowcase() {
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const copyPrompt = async (prompt: string, videoId: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(videoId);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const showcaseVideos = [
    {
      id: 'landmark1',
      title: 'Landmark Zoom Out',
      prompt: 'Zoom out from the Eiffel Tower to show Paris from space, cinematic smooth transition with satellite view',
      description: 'Famous landmark to satellite view transition'
    },
    {
      id: 'city1',
      title: 'City Overview',
      prompt: 'Smooth zoom out from street level to orbital view of New York City, cinematic Earth zoom effect',
      description: 'Urban landscape to orbital perspective'
    },
    {
      id: 'nature1',
      title: 'Natural Wonder',
      prompt: 'Zoom out from mountain peak to show entire mountain range from space, dramatic Earth zoom sequence',
      description: 'Natural landscapes from space view'
    },
    {
      id: 'beach1',
      title: 'Coastal Zoom',
      prompt: 'Beach coastline zoom out to orbital view showing entire coastline, smooth Earth zoom transition',
      description: 'Coastal areas to satellite perspective'
    }
  ];

  return (
    <section id="showcase" className="bg-white/80 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] px-4 py-2">
            <span className="text-sm font-semibold text-slate-600">Showcase</span>
          </div>
          <h2 className="mb-4 text-3xl font-semibold text-slate-950 md:text-4xl">
            See It In Action
          </h2>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-slate-600">
            Check out these amazing transformations created with our Earth Zoom AI technology.
            From landmarks to natural wonders, see what's possible.
          </p>
        </div>

        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {showcaseVideos.map((video, index) => (
            <div
              key={video.id}
              className="group relative"
            >
              {/* Video Card */}
              <div className="relative overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white shadow-[0_16px_42px_rgba(72,55,44,0.07)] transition duration-300 group-hover:border-[rgba(72,55,44,0.22)]">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div
                    className={[
                      'h-full w-full transition-transform duration-700 group-hover:scale-[1.015]',
                      index % 4 === 0
                        ? 'bg-[radial-gradient(circle_at_52%_78%,#8ca394_0%,#627a85_30%,#172233_76%)]'
                        : index % 4 === 1
                          ? 'bg-[radial-gradient(circle_at_48%_76%,#a8b8c2_0%,#647487_32%,#161f2f_78%)]'
                          : index % 4 === 2
                            ? 'bg-[radial-gradient(circle_at_52%_78%,#a1a977_0%,#66706a_34%,#171f2e_78%)]'
                            : 'bg-[radial-gradient(circle_at_50%_78%,#86a8a1_0%,#5c7284_34%,#151f2f_78%)]',
                    ].join(' ')}
                  >
                    <div className="absolute inset-x-[13%] bottom-[-42%] aspect-square rounded-full border border-white/30 bg-[radial-gradient(circle_at_38%_28%,rgba(255,255,255,0.78),rgba(180,198,185,0.38)_16%,rgba(85,112,112,0.68)_36%,rgba(22,35,50,0.94)_74%)] shadow-[0_26px_62px_rgba(15,23,42,0.2)]" />
                    <div className="absolute left-[18%] top-[24%] h-px w-[64%] rotate-[-11deg] bg-white/34" />
                    <div className="absolute left-[25%] top-[37%] h-px w-[50%] rotate-[-11deg] bg-white/18" />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/92 via-white/18 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-slate-950 font-bold text-lg mb-1">{video.title}</h3>
                      <p className="text-slate-600 text-sm">{video.description}</p>
                    </div>
                  </div>
                </div>

                {/* Prompt Box */}
                <div className="p-6">
                  <div className="rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-600">Prompt</span>
                      </div>
                      <button
                        onClick={() => copyPrompt(video.prompt, video.id)}
                        className="group/btn rounded-[8px] bg-white p-1.5 text-slate-500 transition-colors duration-200 hover:bg-slate-950 hover:text-white"
                        title="Copy prompt"
                      >
                        {copiedPrompt === video.id ? (
                          <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {video.prompt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-4xl rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] p-8 shadow-[0_18px_46px_rgba(72,55,44,0.06)]">
            <h3 className="mb-4 text-2xl font-semibold text-slate-950 md:text-3xl">
              🌍 Create Your Own Earth Zoom Effects
            </h3>
            <p className="mb-6 text-lg text-slate-600">
              Join thousands of creators using our platform to generate stunning Earth zoom sequences.
              Transform your photos into viral-worthy content today!
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#tool"
                className="rounded-[8px] bg-slate-950 px-8 py-3 font-semibold text-white shadow-[0_14px_32px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Start Creating Now
              </a>
              <div className="text-sm text-slate-500">
                Upload image • Tune prompt • Preview the zoom-out result
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
