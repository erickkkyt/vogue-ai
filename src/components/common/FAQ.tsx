'use client';

import { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      question: 'What is AI Baby Generator?',
      answer: 'AI Baby Generator is a viral trend taking over TikTok and YouTube Shorts. These AI-generated videos feature baby avatars as hosts discussing various topics in entertaining and engaging ways. Combining advanced AI animation with creative scripting, AI Baby Generator creates realistic baby faces that sync perfectly with audio.',
    },
    {
      question: 'What equipment do I need to create AI Baby Generator content?',
      answer: 'You\'ll need a computer with decent processing power (8GB RAM minimum), access to AI tools like Hedra for animation and ElevenLabs for voice generation, and basic video editing software like CapCut. No physical recording equipment is required as all AI Baby Generator elements are generated digitally.',
    },
    {
      question: 'Is AI Baby Generator legal to monetize?',
      answer: 'Yes, when creating transformative content. Ensure your AI Baby Generator adds substantial creative elements beyond any source material. Most successful AI Baby Generator creators develop original scripts or transform existing content significantly to qualify as new creative works.',
    },
    {
      question: 'How much can I earn from creating AI Baby Generator content?',
      answer: 'Earnings vary based on view count and engagement. Successful AI Baby Generator creators report $3,000-$15,000 monthly from platform revenue sharing programs. Channels with consistent output of 3-5 AI Baby Generator videos daily and strong engagement typically see the best financial results.',
    },
    {
      question: 'How long should AI Baby Generator videos be?',
      answer: 'For TikTok and YouTube Shorts, the most successful AI Baby Generator videos are 15-60 seconds long, with 30 seconds being the sweet spot for maximizing view completion rates. For Instagram Reels, keeping AI Baby Generator under 30 seconds is often more effective. Consistent length helps establish your AI Baby Generator brand identity.',
    },
    {
      question: 'What topics work best for AI Baby Generator videos?',
      answer: 'Popular topics include simplified explanations of complex subjects (finance, technology, science), reactions to trending news, relationship advice, and humorous takes on everyday situations. The contrast between baby hosts and adult topics creates the engagement that drives virality.',
    },
    {
      question: 'How do I make my AI Baby Generator stand out?',
      answer: 'Develop a consistent baby character with recognizable traits (specific hairstyle, outfit, or background). Create a content niche rather than covering random topics. Focus on high-quality animation with realistic lip-syncing, and use professional audio recording techniques for clear sound quality.',
    },
    {
      question: 'Can I use copyrighted content in my AI Baby Generator videos?',
      answer: 'It\'s best to avoid directly copying protected content. Instead, create transformative content by significantly altering source material, providing commentary, or creating original scripts. Many successful AI Baby Generator creators use the format to discuss topics in their own words rather than copying existing content directly.',
    },
    {
      question: 'Do you offer templates to get started?',
      answer: 'Yes! Our platform provides starter templates for baby avatar designs, script formats that have proven successful, optimized export settings for different platforms, and tutorial guides to help you master the technical aspects of AI Baby Generator creation.',
    },
    {
      question: 'How frequently should I post new AI Baby Generator content?',
      answer: 'Consistency is key for algorithm performance. Most successful creators post 1-3 AI Baby Generator videos daily when starting out, then scale to 3-5 daily as their channel grows. The content volume helps with testing different approaches and builds a library that can continue generating views and revenue.',
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
            Everything you need to know about creating viral AI Baby Generator content for social media platforms.
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
          <p className="text-gray-300 mb-4">Ready to start creating viral AI Baby Podcast content?</p>
          <a
            href="#dashboard"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Get started now
            <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 