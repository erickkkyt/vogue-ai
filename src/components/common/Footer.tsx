'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="w-full px-4 sm:px-6 lg:px-24 py-16">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/logo/logo-white.png"
                alt="Vogue AI Logo"
                width={120}
                height={36}
                className="h-9 w-auto mr-3"
                priority
                suppressHydrationWarning
              />
              <span className="text-xl font-bold text-white">VOGUE AI</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Generate stunning AI baby images and videos capturing every potential expression of your future child. Perfect for creating a timeless family memory and your next social media sensation.
            </p>

            {/* External Links Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Featured In</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs" suppressHydrationWarning>
                <a href="https://fazier.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  Fazier
                </a>
                <a href="https://buzzmatic.net/ai-tools-die-ultimative-liste/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  Buzzmatic
                </a>
                <a href="https://dang.ai/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  Dang.ai
                </a>
                <a href="https://startupfa.me/s/vogue-ai?utm_source=www.vogueai.net" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  Startup Fame
                </a>
                <a href="https://www.toolpilot.ai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  ToolPilot
                </a>
                <a href="https://aistage.net" title="AIStage" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  AIStage
                </a>
                <a href="https://aijustworks.com" title="AI Just Works" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  AI Just Works
                </a>
                <a href="https://www.linktoai.top/" title="LinkToAI" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  LinkToAI
                </a>
                <a href="https://mossai.org" title="MossAI Tools Directory" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  MossAI Tools Directory
                </a>
                <a href="https://magicbox.tools/" title="MagicBox.Tools - AI Tools Directory" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  MagicBox.Tools - AI Tools Directory
                </a>
                <a href="https://kontext-ai.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  Kontext AI
                </a>
                <a href="https://www.siteswebdirectory.com/Health_Medical/Dentistry/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  Dentists Marketing
                </a>
                <a href="https://AIToolly.com/" title="AIToolly AI Tools Directory" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  AIToolly
                </a>
                <a href="https://game-sprunki.com/" title="Game Sprunki" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  Game Sprunki
                </a>
                <a href="https://yo.directory/" title="yo.directory" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  yo.directory
                </a>
                <a href="https://www.dogolympics.net/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  Dog Olympics
                </a>
                <a href="https://www.seewhatnewai.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  seewhatnewai
                </a>
                <a href="https://www.deepbluedirectory.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  Deep Blue Directory.com
                </a>
                <a href="https://SeekAIs.com/" title="SeekAIs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  SeekAIs - AI Tools Directory
                </a>
                <a href="https://similarlabs.com/?ref=embed" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors underline">
                  SimilarLabs
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/veo-3-generator" className="text-gray-400 hover:text-white transition-colors">Veo 3 Generator</Link>
              </li>
              <li>
                <Link href="/ai-baby-generator" className="text-gray-400 hover:text-white transition-colors">AI Baby Generator</Link>
              </li>
              <li>
                <Link href="/ai-baby-podcast" className="text-gray-400 hover:text-white transition-colors">AI Baby Podcast Generator</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">About</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-start items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Vogue AI. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 md:ml-200">
              <a href="mailto:support@vogueai.net" className="text-xs text-gray-400 hover:text-white transition-colors">
                Email: support@vogueai.net
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}