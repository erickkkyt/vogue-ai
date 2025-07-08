'use client';

import Link from 'next/link';
import StarBorder from '../common/StarBorder';

export default function HeroEarthZoom() {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          suppressHydrationWarning
        >
          <source src="https://pub-dd9404e72d594f05acd661a8179747d2.r2.dev/earth-zoom.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-12 drop-shadow-2xl" suppressHydrationWarning>
              <span className="bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap drop-shadow-lg">EARTH ZOOM AI</span><br />
              <span className="text-gray-100 drop-shadow-lg text-2xl sm:text-3xl md:text-4xl">Transform Your Photos Into Stunning Cinematic Zoom-Out Sequences</span>
            </h1>

            <p className="text-xl text-gray-100 mb-10 max-w-4xl mx-auto drop-shadow-lg leading-relaxed">
              Transform your photos into stunning cinematic zoom-out sequences from Earth to space. Create viral-worthy content in seconds.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8 justify-center">
              <StarBorder
                as={Link}
                href="#dashboard"
                color="rgba(59, 130, 246, 0.8)"
                speed="4s"
                className="text-lg font-bold text-center no-underline"
              >
                Start Creating Now
              </StarBorder>
              <StarBorder
                as={Link}
                href="#showcase"
                color="rgba(34, 197, 94, 0.6)"
                speed="6s"
                className="text-center font-medium no-underline"
              >
                View Examples
              </StarBorder>
            </div>

            {/* 保持原有高度的占位空间 */}
            <div className="mb-8 h-48"></div>
          </div>
        </div>
      </div>
    </section>
  );
} 