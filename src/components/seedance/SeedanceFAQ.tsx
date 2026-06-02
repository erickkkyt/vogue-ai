'use client';

import { ChevronDown } from 'lucide-react';

export default function SeedanceFAQ() {
  const faqs = [
    {
      question: 'What is Seedance AI?',
      answer: 'Seedance is ByteDance\'s revolutionary AI video generation model that supports multi-shot video creation from both text and images. It achieves breakthroughs in semantic understanding and prompt following, creating 1080p videos with smooth motion, rich details, and cinematic aesthetics.',
    },
    {
      question: 'How does Seedance work?',
      answer: 'Seedance uses advanced AI technology to generate videos from text descriptions or static images. It features native multi-shot storytelling capabilities, maintaining consistency in visual style and atmosphere across shot transitions while providing precise control over complex action sequences.',
    },
    {
      question: 'What makes Seedance unique?',
      answer: 'Seedance offers smooth & stable motion with wide dynamic range, native multi-shot storytelling, diverse stylistic expression from photorealism to illustration, and precise prompt following for multi-agent interactions and complex camera movements.',
    },
    {
      question: 'How long does video generation take?',
      answer: 'Video generation typically takes 3-5 minutes, depending on your prompt complexity, input images, and the selected generation mode. The processing time may vary to ensure optimal quality for each unique request.',
    },
    {
      question: 'What video quality can I expect?',
      answer: 'Seedance generates high-definition videos up to 1080p with smooth motion, rich details, and cinematic aesthetics. The model maintains high stability and physical realism across different scene types and movement scales.',
    },
    {
      question: 'Can I use Seedance for commercial projects?',
      answer: 'Yes! All videos generated with Seedance can be used for commercial purposes. You retain full rights to your created content and can use it for social media, marketing, entertainment, or any other commercial application.',
    },
    {
      question: 'How does the credit system work?',
      answer: 'Our credit-based system is simple and transparent: Seedance Pro costs 30 credits per video, Seedance Lite costs 10 credits per video. Credits never expire and you only pay for what you use. No monthly subscriptions or hidden fees.',
    },
    {
      question: 'What input formats are supported?',
      answer: 'Seedance supports both text-to-video and image-to-video generation. For images, we accept JPEG, PNG, WebP, BMP, TIFF, and GIF formats up to 10MB. Text prompts should be in English for optimal results.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! New users receive free credits to try our Seedance generation service. You can test both Pro and Lite models to experience the quality of AI-generated videos before purchasing additional credits.',
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[var(--vogue-page)] to-[var(--vogue-page)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-950 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to know about Seedance AI Generator
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white/86 border border-slate-200 rounded-2xl overflow-hidden hover:bg-white hover:border-slate-300 transition-all duration-300"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-100 transition-colors">
                  <h3 className="text-lg font-semibold text-slate-950 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-hover:text-slate-700" />
                </summary>
                <div className="px-6 pb-6 border-t border-slate-200">
                  <p className="text-slate-600 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/86 border border-slate-200 rounded-3xl p-10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-950 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-slate-600 mb-8">
              Our support team is here to help you get the most out of Seedance AI Generator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#dashboard"
                className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_12px_30px_rgba(72,92,130,0.1)]"
              >
                Try Seedance AI Now
              </a>
              <a
                href="mailto:support@vogueai.net"
                className="inline-flex items-center border-2 border-slate-300 hover:border-slate-400 text-slate-600 hover:text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 hover:bg-slate-100"
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
