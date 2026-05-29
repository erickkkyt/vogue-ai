'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';

export default function EarthZoomFAQ() {

  const faqs = [
    {
      question: 'What is an Earth Zoom Out video effect?',
      answer: 'An Earth Zoom Out effect is a cinematic transition that starts from a close-up image or location and pulls the camera back to reveal the surrounding area, city, continent, and full Earth view. It is used for social clips, travel videos, real estate location reveals, educational explainers, and dramatic video intros.',
    },
    {
      question: 'How do I create an Earth Zoom Out video from a photo?',
      answer: 'Upload a clear starting image, describe the zoom-out movement in the prompt, choose the aspect ratio and duration, then generate the video. The strongest prompts usually mention the starting subject, the camera pull-back path, clouds or atmosphere, and the final orbital Earth reveal.',
    },
    {
      question: 'What photos work best for Earth Zoom AI?',
      answer: 'Use a sharp, well-lit image with visible context around the subject. Landmarks, streets, buildings, homes, beaches, mountains, stadiums, and city views work better than blank studio backgrounds because the model has more visual detail to connect into the zoom-out sequence.',
    },
    {
      question: 'Do I need video editing skills?',
      answer: 'No. The page is designed as an image-to-video workflow: upload a starting frame, set the motion direction, and generate. You can still refine the result later in CapCut, Premiere, or another editor if you want to add sound design, captions, or brand overlays.',
    },
    {
      question: 'Can I make videos for TikTok, Instagram Reels, or YouTube Shorts?',
      answer: 'Yes. Choose a vertical 9:16 aspect ratio for TikTok, Reels, and Shorts. Landscape 16:9 works better for YouTube intros, presentations, and website videos, while 1:1 is useful for feed posts and compact ads.',
    },
    {
      question: 'What is the difference between Earth Zoom Out and Earth Zoom In?',
      answer: 'Earth Zoom Out starts near the subject and pulls back toward space, which is useful for dramatic reveals and scale. Earth Zoom In starts from a planet or satellite view and dives toward a location, which works well for map-style intros, travel openings, and destination highlights.',
    },
    {
      question: 'Can I use Earth Zoom Out videos for real estate or travel marketing?',
      answer: 'Yes. Real estate teams can use the effect to show a property in its neighborhood and city context. Travel creators can use it to introduce a destination, landmark, coastline, mountain, or route before moving into the rest of the story.',
    },
    {
      question: 'How can I avoid distorted or low-quality zoom-out results?',
      answer: 'Start with a high-resolution image, avoid heavy blur, keep the main subject visible, and include enough background detail. In the prompt, ask for smooth camera motion, realistic atmospheric layers, stable geography, and a clean orbital reveal instead of using only a short generic phrase.',
    },
    {
      question: 'Can Earth Zoom AI work with any location worldwide?',
      answer: 'Earth Zoom workflows are intended for global locations, including famous landmarks, local neighborhoods, natural landscapes, and commercial properties. Recognizable visual context usually improves the match between the starting photo and the generated zoom-out path.',
    },
    {
      question: 'Can I use generated Earth Zoom videos commercially?',
      answer: 'Earth Zoom videos are suitable for creator posts, ads, real estate showcases, tourism campaigns, education, and business presentations. For commercial work, make sure you have the rights to the uploaded image, logos, people, property footage, and any additional audio or branding you add.',
    },
  ];

  return (
    <section id="faq" className="bg-white/90 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] px-4 py-2">
            <span className="text-sm font-semibold text-slate-600">Common Questions</span>
          </div>
          <h2 className="mb-4 text-3xl font-semibold text-slate-950 md:text-4xl">
            Everything About Earth Zoom AI
          </h2>
          <p className="mx-auto max-w-4xl text-xl text-slate-600">
            Detailed answers to your questions about our Earth zoom-out effect generator and AI technology
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group overflow-hidden rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-white shadow-[0_12px_34px_rgba(72,55,44,0.05)] transition duration-300 hover:border-[rgba(72,55,44,0.2)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 transition-colors hover:bg-[#fffaf7]">
                  <h3 className="pr-4 text-lg font-semibold text-slate-950">
                    {faq.question}
                  </h3>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] text-slate-600">
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                  </div>
                </summary>
                <div className="border-t border-[rgba(72,55,44,0.1)] px-6 pb-6">
                  <p className="pt-4 leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-3xl rounded-[8px] border border-[rgba(72,55,44,0.12)] bg-[#fffaf7] p-8 shadow-[0_18px_46px_rgba(72,55,44,0.06)]">
            <h3 className="mb-4 text-2xl font-semibold text-slate-950">
              Still Have Questions?
            </h3>
            <p className="mb-6 text-slate-600">
              Ready to see Earth Zoom AI in action? Try it now and experience the magic of transforming your photos into stunning space-to-Earth transitions.
            </p>
            <a
              href="#tool"
              className="inline-flex items-center rounded-[8px] bg-slate-950 px-6 py-3 font-medium text-white shadow-[0_14px_32px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(15,23,42,0.12)]"
            >
              Try Earth Zoom AI Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
