'use client';

import { useState } from 'react';

export default function Veo3FAQ() {
  const faqs = [
    {
      question: 'What is Vogue Veo 3 Generator?',
      answer: 'Vogue Veo 3 Generator is the most affordable AI video creation platform powered by Google\'s revolutionary Veo 3 technology. Unlike Google\'s official platform with monthly limits, we offer credit-based generation with no monthly restrictions, making it the cheapest way to access professional Veo 3 video generation.',
    },
    {
      question: 'Why is this the cheapest Veo 3 video generator?',
      answer: 'We offer the most competitive pricing in the market for Veo 3 video generation. While Google\'s official platform has monthly limits and other platforms charge premium rates, our efficient infrastructure allows us to provide credit-based generation at a fraction of the cost.',
    },
    {
      question: 'What does "no monthly limits" mean?',
      answer: 'Unlike Google\'s official Veo 3 platform which restricts users to a certain number of videos per month, our platform only requires credits. As long as you have sufficient credits, you can generate as many videos as you want without waiting for monthly quotas to reset.',
    },
    {
      question: 'What types of videos can I create with Veo 3?',
      answer: 'Veo 3 supports both text-to-video and image-to-video generation. Create cinematic scenes, character animations, product demonstrations, educational content, social media videos, and more. The AI generates realistic physics, camera movements, and synchronized audio automatically.',
    },
    {
      question: 'How does the audio generation work?',
      answer: 'Veo 3 natively generates synchronized audio including sound effects, ambient noise, dialogue, and music that perfectly matches your video content. Unlike other generators that add audio separately, Veo 3 creates audio and video together for seamless synchronization.',
    },
    {
      question: 'What video quality and length can I expect?',
      answer: 'Veo 3 generates high-definition videos up to 8 seconds long with exceptional quality. The AI produces realistic physics, smooth motion, and professional-grade visuals suitable for commercial use, social media, and professional presentations.',
    },
    {
      question: 'How long does video generation take?',
      answer: 'Most Veo 3 videos are generated within 30-60 seconds, depending on complexity. Our optimized infrastructure ensures fast processing times while maintaining the highest quality output, making it perfect for rapid content creation workflows.',
    },
    {
      question: 'Can I use generated videos commercially?',
      answer: 'Yes! All videos generated with our Veo 3 platform can be used for commercial purposes, including marketing, advertising, social media content, and business presentations. You retain full rights to your generated content.',
    },
    {
      question: 'What makes Veo 3 better than other AI video generators?',
      answer: 'Veo 3 offers superior prompt understanding, realistic physics simulation, native audio generation, and consistent character rendering. Combined with our credit-based system (no monthly limits like Google\'s official platform) and cheapest pricing, it\'s the most cost-effective way to create professional AI videos.',
    },

  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about the cheapest Veo 3 access with no monthly limits.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="divide-y divide-gray-700">
            {faqs.map((faq, index) => (
              <div key={index} className="py-6">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full text-left focus:outline-none hover:bg-gray-700/30 p-4 rounded-lg transition-colors duration-200"
                >
                  <h3 className="text-lg font-medium text-white pr-8">{faq.question}</h3>
                  <span className={`flex-shrink-0 ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${openIndex === index ? 'transform rotate-180' : ''}`}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div className={`mt-2 transition-all duration-200 overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-300 px-4">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-4">Ready to start creating Veo 3 videos with no monthly limits at the cheapest price?</p>
          <a
            href="#dashboard"
            className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
          >
            Start generating videos now
            <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
