'use client';

import { AI_BABY_PODCAST_MEDIA } from '../config/media';
import { GifLink } from './MediaLink';

export default function HowTo() {
  const steps = [
    {
      title: 'Generate Baby Avatar Images',
      description: 'Create high-quality baby avatar images using AI tools like Midjourney. Customize your BabyPodcast characters with headphones, microphones, and podcast studio backgrounds.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      mediaPlaceholder: 'avatar-generation-demo'
    },
    {
      title: 'Craft Engaging Scripts',
      description: "Develop scripts that balance humor, relevance, and engagement. Focus on either parodying existing podcasts, discussing trends, or creating fictional scenarios.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      mediaPlaceholder: 'script-writing-demo'
    },
    {
      title: 'Generate AI Voices',
      description: 'Use AI voice tools like ElevenLabs to produce audio that balances childlike qualities with clarity. Find the right voice modulation that fits your BabyPodcast style.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      mediaPlaceholder: 'voice-generation-demo'
    },
    {
      title: 'Animate & Edit Your Video',
      description: 'Use animation tools like Hedra to create synchronized lip movements and facial expressions that match your audio track. Edit with tools like CapCut, adding subtitles and effects.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      mediaPlaceholder: 'animation-editing-demo'
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How To Create AI Baby Podcast Content
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Follow these steps to create engaging AI Baby Podcast videos that go viral
          </p>
        </div>

        <div className="relative">
          {/* Animated Connection line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500 -translate-x-1/2 rounded-full"></div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className={`lg:flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Media Section */}
                  <div className="hidden lg:flex lg:w-1/2 justify-center mb-8 lg:mb-0">
                    <div className="relative">
                      {/* Step Demo Media */}
                      <div className="w-80 h-48 rounded-2xl shadow-xl overflow-hidden border-4 border-gray-700">
                        <GifLink
                          src={
                            step.mediaPlaceholder === 'avatar-generation-demo' ? AI_BABY_PODCAST_MEDIA.process.avatarGeneration :
                            step.mediaPlaceholder === 'script-writing-demo' ? AI_BABY_PODCAST_MEDIA.process.scriptWriting :
                            step.mediaPlaceholder === 'voice-generation-demo' ? AI_BABY_PODCAST_MEDIA.process.voiceGeneration :
                            AI_BABY_PODCAST_MEDIA.process.animationEditing
                          }
                          alt={
                            step.mediaPlaceholder === 'avatar-generation-demo' ? 'Avatar Generation Demo' :
                            step.mediaPlaceholder === 'script-writing-demo' ? 'Script Writing Demo' :
                            step.mediaPlaceholder === 'voice-generation-demo' ? 'Voice Generation Demo' :
                            'Animation & Editing Demo'
                          }
                          title={
                            step.mediaPlaceholder === 'avatar-generation-demo' ? 'Avatar Generation' :
                            step.mediaPlaceholder === 'script-writing-demo' ? 'Script Writing' :
                            step.mediaPlaceholder === 'voice-generation-demo' ? 'Voice Generation' :
                            'Animation & Editing'
                          }
                          width={320}
                          height={192}
                          className="w-full h-full"
                        />
                      </div>

                      {/* Step number badge */}
                      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse border border-blue-400">
                        {index + 1}
                      </div>

                      {/* Floating elements */}
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-cyan-500/50 rounded-full animate-bounce"></div>
                      <div className="absolute -top-2 left-1/4 w-6 h-6 bg-blue-500/50 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`lg:w-1/2 p-8 bg-gray-900/80 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl hover:border-gray-600 transition-all duration-300 ${index % 2 === 0 ? 'lg:ml-8' : 'lg:mr-8'}`}>
                    {/* Mobile step display */}
                    <div className="flex items-center mb-6 lg:hidden">
                      <div className="flex-shrink-0 relative mr-4">
                        <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 border border-blue-800">
                          {step.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm border border-blue-400">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>

                    {/* Desktop title */}
                    <h3 className="hidden lg:block text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">{step.description}</p>

                    {/* Step-specific features */}
                    <div className="space-y-3">
                      {index === 0 && (
                        <div className="flex items-center space-x-3 text-sm text-blue-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>AI-powered avatar customization</span>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="flex items-center space-x-3 text-sm text-blue-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Viral content templates included</span>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="flex items-center space-x-3 text-sm text-blue-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Multiple voice styles available</span>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="flex items-center space-x-3 text-sm text-blue-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Professional editing tools integrated</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gray-900/80 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Create Your First Viral Baby Podcast?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of creators who are already making millions of views with our platform.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-500">
              Start Creating Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 