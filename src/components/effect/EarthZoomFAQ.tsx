'use client';

export default function EarthZoomFAQ() {

  const faqs = [
    {
      question: 'How does Earth Zoom AI create the zoom-out effect?',
      answer: 'Earth Zoom AI uses advanced artificial intelligence to analyze your uploaded photo, identify geographical features and landmarks, then seamlessly blends it with real satellite imagery. Our AI creates smooth zoom-out transitions that maintain perfect continuity from ground level to orbital view, using state-of-the-art computer vision and mapping technologies.',
    },
    {
      question: 'What types of images work best with Earth Zoom AI?',
      answer: 'Earth Zoom AI works best with clear, well-lit photos that show distinct geographical features. Ideal images include landmarks, buildings, cityscapes, natural formations, or any location with recognizable features. The AI can identify and process photos from anywhere on Earth, from famous monuments to local neighborhoods.',
    },
    {
      question: 'What makes Earth Zoom AI different from other video effects tools?',
      answer: 'Earth Zoom AI specifically focuses on creating realistic Earth-to-space zoom transitions using real satellite data and advanced geographical mapping. Unlike generic video effects, our AI understands geographical context, atmospheric conditions, and orbital mechanics to create scientifically accurate and visually stunning zoom sequences.',
    },
    {
      question: 'How long does it take to generate an Earth zoom video?',
      answer: 'Most Earth zoom videos are generated within 30-60 seconds, depending on the complexity of the geographical analysis and the customization settings chosen. Our optimized AI pipeline ensures fast processing while maintaining professional-quality output suitable for all social media platforms.',
    },
    {
      question: 'Can I customize the zoom effect and camera movement?',
      answer: 'Yes! Earth Zoom AI offers extensive customization options including zoom speed, transition style, final orbital altitude, atmospheric effects, time of day lighting, cloud coverage, and camera trajectory. You can create unique effects that match your creative vision while maintaining realistic geographical accuracy.',
    },
    {
      question: 'What export formats and resolutions are available?',
      answer: 'Earth Zoom AI exports videos in HD quality with optimized formats for different platforms. You can choose from various aspect ratios including vertical (9:16) for TikTok and Instagram Reels, square (1:1) for Instagram posts, and landscape (16:9) for YouTube and general use. All exports maintain professional quality.',
    },
    {
      question: 'Is Earth Zoom AI suitable for commercial use?',
      answer: 'Yes, videos created with Earth Zoom AI can be used for commercial purposes including marketing campaigns, real estate showcases, travel content, and social media advertising. The satellite imagery integration and AI processing are designed to create content suitable for professional and commercial applications.',
    },
    {
      question: 'Does Earth Zoom AI work with locations worldwide?',
      answer: 'Absolutely! Earth Zoom AI has global coverage and can process photos from any location on Earth. Our AI is trained on worldwide geographical data and satellite imagery, allowing it to create accurate zoom effects for locations across all continents, from major cities to remote natural areas.',
    },
    {
      question: 'How accurate is the geographical positioning in the zoom effect?',
      answer: 'Earth Zoom AI uses advanced computer vision and geographical databases to ensure highly accurate positioning. The AI analyzes your photo to determine the exact location and viewing angle, then creates zoom transitions that maintain geographical accuracy throughout the sequence, from ground level to satellite perspective.',
    },
    {
      question: 'Can I use Earth Zoom AI for real estate and property marketing?',
      answer: 'Yes! Earth Zoom AI is perfect for real estate marketing. Upload a photo of a property, and the AI will create a stunning zoom-out effect showing the property\'s location within its neighborhood, city, and broader geographical context. This helps potential buyers understand location and proximity to landmarks and amenities.',
    },
  ];

  return (
    <section id="faq" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-blue-400 font-medium">Common Questions</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything About Earth Zoom AI
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Detailed answers to your questions about our Earth zoom-out effect generator and AI technology
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-750 hover:border-gray-600 transition-all duration-300"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-700 transition-colors">
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white transform group-open:rotate-45 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6 border-t border-gray-700">
                  <p className="text-gray-300 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-8 max-w-3xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Ready to see Earth Zoom AI in action? Try it now and experience the magic of transforming your photos into stunning space-to-Earth transitions.
            </p>
            <a
              href="#dashboard"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Try Earth Zoom AI Now
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 