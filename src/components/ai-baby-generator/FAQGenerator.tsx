'use client';

export default function FAQGenerator() {
  const faqs = [
    {
      question: 'How does the AI Baby Generator work?',
      answer: 'Our AI Baby Generator uses advanced facial recognition and machine learning algorithms to analyze photos of both parents. It identifies key facial features like eye shape, nose structure, skin tone, and facial proportions, then creates a realistic prediction of what your future baby might look like by blending these characteristics.',
    },
    {
      question: 'What photos should I upload for the best results?',
      answer: 'For optimal results, upload clear, high-quality photos where both parents are facing the camera directly. Avoid sunglasses, heavy makeup, or filters. Good lighting and a neutral expression work best. The AI performs better with recent photos that clearly show facial features.',
    },
    {
      question: 'Is my personal data and photos safe?',
      answer: 'Absolutely! We take privacy seriously. Your uploaded photos are processed securely and are not stored permanently on our servers. We use industry-standard encryption and do not share your images with third parties. You can delete your generated results at any time.',
    },
    {
      question: 'How accurate are the AI-generated baby predictions?',
      answer: 'While our AI uses sophisticated algorithms to create realistic predictions based on genetic patterns, it\'s important to remember that genetics is complex and unpredictable. Our generator provides a fun, educated guess based on facial features, but actual babies may look different due to various genetic factors.',
    },
    {
      question: 'Can I use the generated baby photos on social media?',
      answer: 'Yes! The generated baby images are yours to use. Many couples love sharing these adorable predictions on social media platforms like Instagram, Facebook, and TikTok. They make great content for pregnancy announcements, gender reveals, or just for fun with friends and family.',
    },
    {
      question: 'How long does it take to generate a baby photo?',
      answer: 'The AI processing typically takes 30-60 seconds to analyze the parent photos and generate your baby prediction. During peak times, it might take up to 2 minutes. You\'ll see a progress indicator while the AI works its magic.',
    },
    {
      question: 'Can I generate multiple baby variations?',
      answer: 'Yes! You can generate multiple variations to see different possible outcomes. Each generation might produce slightly different results as the AI explores various combinations of parental features. This gives you several adorable options to choose from.',
    },
    {
      question: 'What if I\'m not satisfied with the results?',
      answer: 'If you\'re not happy with the initial result, try uploading different photos of the parents or generate additional variations. Different angles and lighting in the source photos can lead to different outcomes. Our AI learns from each generation to improve results.',
    },
    {
      question: 'Do I need to create an account to use the generator?',
      answer: 'Yes, creating a free account helps us provide better service and allows you to save your generated baby photos. Your account also gives you access to your generation history and the ability to download high-quality versions of your results.',
    },
    {
      question: 'Can same-sex couples use the AI Baby Generator?',
      answer: 'Absolutely! Our AI Baby Generator works for all types of couples. For same-sex couples, the AI will blend the facial features of both partners to create a unique baby prediction, just as it does for opposite-sex couples.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about generating AI predictions of your future baby using parent photos.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/5"
            >
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-pink-300 transition-colors duration-300">
                {faq.question}
              </h3>
              <div className="h-px bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-transparent mb-4"></div>
              <p className="text-gray-300 leading-relaxed text-lg">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-4">Ready to see what your future baby might look like?</p>
          <a
            href="/ai-baby-generator#dashboard"
            className="inline-flex items-center text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200"
          >
            Generate Your Baby Now
            <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
