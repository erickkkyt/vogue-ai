'use client';

const faqData = [
  {
    question: 'What is Vogue AI?',
    answer: 'Vogue AI is an all-in-one creative suite that provides a collection of powerful AI tools, including the AI Baby Generator, Veo 3 Video Generator, and AI Baby Podcast Generator. Our platform allows you to create unique and professional-quality images, videos, and audio content with ease.',
  },
  {
    question: 'How do the credits work?',
    answer: 'All tools on the Vogue AI platform share a unified credit system. You can purchase a credit package and use those credits across any of our tools. This provides a seamless and flexible experience, allowing you to explore all our creative tools with a single purchase.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a free trial that allows you to explore the basic features of our tools. The trial provides a limited number of credits so you can get a feel for how our platform works before committing to a paid plan.',
  },
  {
    question: 'What kind of content can I create?',
    answer: 'You can generate a wide variety of content, from ultra-realistic images of your future baby to professional-grade videos with synchronized audio using Google\'s Veo 3 technology. You can also create engaging podcast-style videos featuring AI baby avatars.',
  },
  {
    question: 'Are the generated images and videos high-quality?',
    answer: 'Absolutely. We use state-of-the-art AI models to ensure that all generated content is of the highest quality. Our tools are designed to produce professional, high-resolution images and videos suitable for social media, marketing, and personal keepsakes.',
  },
    {
    question: 'Do I need any technical skills to use Vogue AI?',
    answer: 'Not at all! Our tools are designed to be user-friendly and intuitive. You don\'t need any prior experience in video editing or AI technology to start creating amazing content. Our platform guides you through the process step-by-step.',
  },
];

export default function HomeFAQ() {
  return (
    <section id="faq" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about the Vogue AI platform and its tools.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 