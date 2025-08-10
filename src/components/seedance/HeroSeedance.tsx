'use client';

import Link from 'next/link';

export default function HeroSeedance() {
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
        >
          <source src="https://pub-c5fea35e995e446ca70cb289c0801a46.r2.dev/0806v1.webm" type="video/webm" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[600px]">
          {/* Centered Content */}
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Seedance
              </span>
              <br />
              <span className="text-white">AI Video Generator</span>
            </h1>

            {/* Simple Description */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Transform text and images into dynamic dance videos with AI
            </p>

            {/* CTA Button */}
            <div className="flex justify-center">
              <a
                href="#dashboard"
                className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                Start Creating Now
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
