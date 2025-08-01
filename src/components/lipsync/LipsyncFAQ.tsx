'use client';

export default function LipsyncFAQ() {
  const faqs = [
    {
      question: 'What is AI Lip Sync?',
      answer: 'AI Lip Sync is a technology that uses artificial intelligence to automatically align the mouth movements of characters in a video with the audio or speech, making it appear as if they are speaking the words.',
    },
    {
      question: 'What video formats are supported for AI lip sync?',
      answer: 'We support common video formats such as MP4, MOV, etc. If you have a specific format, please contact our support team.',
    },
    {
      question: 'How do I upload a video and use the lip sync feature?',
      answer: 'Simply select your video file on our upload page, choose the audio track you want to sync to, hit the Generate button, and our system will automatically take care of the lip sync for you.',
    },
    {
      question: 'How accurate is the AI lip sync?',
      answer: 'Our AI technology provides highly accurate lip syncing, ensuring that the character\'s mouth movements match the audio content naturally and seamlessly.',
    },
    {
      question: 'How long does it take to process the video?',
      answer: 'Processing time depends on the length and complexity of the video. Most videos are processed within a few minutes to half an hour.',
    },
    {
      question: 'Can I download the synced video?',
      answer: 'Yes, once the lip sync process is complete, you can download the processed video directly from the platform.',
    },
    {
      question: 'Can I make changes or cancel after uploading the video?',
      answer: 'Once the video processing begins, changes or cancellations are not possible. Please make sure your video and audio files are accurate before uploading.',
    },
    {
      question: 'How can I get help if I encounter technical issues?',
      answer: 'If you experience any issues, you can submit a support request through our contact page or email us directly. Our customer service team will assist you promptly.',
    },
    {
      question: 'Is the AI lip sync service really free?',
      answer: 'Yes! Our basic AI lip sync service is completely free to use. Whether you\'re a creator, educator, or marketer, you can start making talking photo videos for free, with no subscription required.',
    },
    {
      question: 'How accurate is the lip synchronization?',
      answer: 'Our AI achieves industry-leading accuracy in lip synchronization. The system analyzes audio at the phoneme level and generates corresponding mouth shapes with precise timing. The result is natural-looking speech that closely matches the audio input.',
    },
    {
      question: 'Can I edit the generated videos?',
      answer: 'The platform generates complete lip-sync videos based on your inputs. For best results, ensure your source image/video has clear facial features and good lighting. Future updates will include more customization options for fine-tuning the results.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! New users receive free credits to test our lip-sync technology. You can try both LipSync Pro and LipSync Fast models to see the quality and choose the option that best fits your needs before purchasing additional credits.',
    },
    {
      question: 'What if the lip-sync doesn\'t look right?',
      answer: 'If you\'re not satisfied with the results, try using a higher-quality source image/video with clear facial features and good lighting. Our AI works best with front-facing portraits. For technical issues, our support team is available to help optimize your results.',
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
            Everything you need to know about LipSync Generator
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
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
              Our support team is here to help you get the most out of LipSync Generator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#dashboard"
                className="inline-flex items-center bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try LipSync Now
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
