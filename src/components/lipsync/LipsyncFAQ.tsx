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
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <HelpCircle className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">FAQ</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> Questions</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about our AI LipSync Generator.
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-2xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 bg-gradient-to-r ${getCategoryColor(faq.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <HelpCircle className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <div className="pl-12">
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

        {/* Support Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-3xl p-8 max-w-6xl mx-auto backdrop-blur-md">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Still Have Questions?
                </h3>
                <p className="text-gray-300 mb-6">
                  Our support team is here to help you get the most out of LipSync Generator.
                  We respond to all inquiries within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#dashboard"
                    className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <HelpCircle className="mr-2" size={16} />
                    Try LipSync Now
                  </a>
                  <a
                    href="mailto:support@vogueai.net"
                    className="inline-flex items-center border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:bg-gray-800/50"
                  >
                    <Mail className="mr-2" size={16} />
                    Contact Support
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span>24/7 Customer Support</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span>Email: support@vogueai.net</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <span>Comprehensive Documentation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
