'use client';

export default function SeedanceFAQ() {
  const faqs = [
    {
      question: 'What is Seedance AI?',
      answer: 'Seedance AI is a powerful AI video generation platform that offers both text-to-video and image-to-video generation capabilities. Our technology enables creators to easily produce high-quality dance video content from text descriptions or static images using advanced motion synthesis and temporal coherence.',
    },
    {
      question: 'How do I use Seedance AI?',
      answer: 'Using Seedance AI is straightforward. For text-to-video, simply enter your text description of the desired dance video. For image-to-video, upload your image(s) and specify your preferences. Our intuitive interface will guide you through the process step by step.',
    },
    {
      question: 'How long does video generation take?',
      answer: 'Video generation typically takes 3-5 minutes, depending on your prompt complexity, input images, and the selected generation mode. The processing time may vary to ensure optimal quality for each unique request.',
    },
    {
      question: 'Can I use Seedance AI for commercial projects?',
      answer: 'Yes, Seedance AI can be used for commercial purposes. The videos generated through our platform can be used in your business projects, marketing campaigns, and commercial content creation.',
    },
    {
      question: 'How do I manage my Seedance AI subscription?',
      answer: 'Your Seedance AI subscription will automatically renew by default. You can manage your subscription by visiting your account dashboard where you can view your current plan, cancel or upgrade your subscription at any time.',
    },
    {
      question: 'How are credits calculated and consumed?',
      answer: 'Different models and features consume varying amounts of credits. SeeAI Dance Pro consumes 30 credits per video, while SeeAI Dance Fast consumes 10 credits per video. You can check specific credit consumption details on the feature details page.',
    },
    {
      question: 'Can I use the generated videos commercially?',
      answer: 'Yes! All videos generated with our platform can be used for commercial purposes. You retain full rights to your created content and can use it for social media, marketing, entertainment, or any other commercial application.',
    },
    {
      question: 'How does the credit system work?',
      answer: 'Our credit-based system is simple and transparent: SeeAI Dance costs 30 credits per video, SeeAI Dance Fast costs 10 credits per video. Credits never expire and you only pay for what you use. No monthly subscriptions or hidden fees.',
    },
    {
      question: 'What makes Vogue AI different from other dance generators?',
      answer: 'We offer the most affordable credit-based pricing with no monthly limits, support for multiple input types (text and image), various dance styles, and professional-quality output. Our AI is specifically trained for dance generation, ensuring natural and fluid movements.',
    },
    {
      question: 'Can I edit or customize the generated videos?',
      answer: 'Currently, our platform generates complete dance videos based on your input. For customization, we recommend being specific in your text prompts about the style, mood, and movements you want. Future updates will include more editing capabilities.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! New users receive free credits to try our dance generation service. You can test both models and see the quality of our AI-generated dance videos before purchasing additional credits.',
    },
    {
      question: 'What if I\'m not satisfied with the generated video?',
      answer: 'We strive for the best results, but if you\'re not satisfied, you can try adjusting your prompt for better results. Our AI learns from feedback, and we continuously improve the models. For technical issues, our support team is always ready to help.',
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about Seedance AI Generator
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-green-500/50 transition-colors"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
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
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/50 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Our support team is here to help you get the most out of Seedance AI Generator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#dashboard"
                className="inline-flex items-center bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Seedance AI Now
              </a>
              <a
                href="mailto:support@vogueai.net"
                className="inline-flex items-center border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:bg-gray-800/50"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
