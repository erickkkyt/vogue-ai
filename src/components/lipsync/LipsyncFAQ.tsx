'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle, MessageCircle, Mail } from 'lucide-react';

export default function LipsyncFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    {
      question: 'What is AI Lip Sync?',
      answer: 'AI Lip Sync is a technology that uses artificial intelligence to automatically align the mouth movements of characters in a video with the audio or speech, making it appear as if they are speaking the words naturally and seamlessly.',
      category: 'basics'
    },
    {
      question: 'Why choose our AI Lip Sync over competitors?',
      answer: 'Our platform offers 99.9% accuracy, supports 50+ languages, processes videos in under 2 minutes, and is completely free to start. No expensive subscriptions or technical skills required.',
      category: 'benefits'
    },
    {
      question: 'How do I create a lip-sync video?',
      answer: 'Simply upload your video and audio files, select your quality preference (Pro or Fast), click Generate, and download your perfectly synced video in minutes. The entire process is automated.',
      category: 'usage'
    },
    {
      question: 'What video and audio formats are supported?',
      answer: 'We support MP4, MOV, AVI, WebM for videos and MP3, WAV, AAC, M4A for audio. Maximum file size is 100MB for free users, with higher limits for premium users.',
      category: 'technical'
    },
    {
      question: 'How accurate is the lip synchronization?',
      answer: 'Our AI achieves industry-leading 99.9% accuracy by analyzing audio at the phoneme level and generating corresponding mouth shapes with precise timing for natural-looking speech.',
      category: 'quality'
    },
    {
      question: 'How long does processing take?',
      answer: 'Most videos are processed within 1-3 minutes. Processing time depends on video length and selected quality. Our optimized AI models ensure fast turnaround times.',
      category: 'technical'
    },
    {
      question: 'Is the service really free?',
      answer: 'Yes! Start completely free with no credit card required. Free users get credits to test both LipSync Pro and Fast models. Additional credits available for purchase.',
      category: 'pricing'
    },
    {
      question: 'What languages are supported?',
      answer: 'Our AI supports 50+ languages including English, Spanish, French, German, Chinese, Japanese, Korean, and more. The AI automatically detects language and optimizes accordingly.',
      category: 'features'
    },
    {
      question: 'What if the results don\'t look right?',
      answer: 'For best results, use high-quality source videos with clear facial features and good lighting. Our AI works best with front-facing portraits. Contact support for optimization help.',
      category: 'troubleshooting'
    },
    {
      question: 'How can I get support?',
      answer: 'Email us at support@vogueai.net for any questions or technical issues. Our support team responds within 24 hours and provides comprehensive assistance.',
      category: 'support'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      basics: 'from-blue-500 to-cyan-500',
      pricing: 'from-green-500 to-emerald-500',
      technical: 'from-purple-500 to-pink-500',
      usage: 'from-orange-500 to-red-500',
      quality: 'from-yellow-500 to-orange-500',
      troubleshooting: 'from-red-500 to-pink-500',
      support: 'from-indigo-500 to-purple-500',
      features: 'from-teal-500 to-blue-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-violet-950 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,69,219,0.1),transparent_40%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <HelpCircle className="w-4 h-4 mr-3 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium tracking-wide">FAQ</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Common
            <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent"> Questions</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Everything you need to know about AI LipSync technology.
            Get instant answers to help you create amazing videos.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-slate-900/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:bg-slate-900/60"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-purple-500/30 rounded-2xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 bg-gradient-to-r ${getCategoryColor(faq.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <HelpCircle className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                    {openIndex === index ? (
                      <Minus className="w-3 h-3 text-white" />
                    ) : (
                      <Plus className="w-3 h-3 text-white" />
                    )}
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <div className="pl-10">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}
