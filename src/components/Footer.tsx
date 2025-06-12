'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#FFF9E5] text-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              <span className="text-xl font-bold text-gray-800">VOGUE AI</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Create viral videos featuring baby hosts who talk like adults, transforming ordinary content into engaging social media sensations.
            </p>

            <div className="flex space-x-4">
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/ai-baby-generator" className="text-gray-400 hover:text-white transition-colors">AI Baby Generator</Link>
              </li>
              <li>
                <Link href="/ai-baby-podcast" className="text-gray-400 hover:text-white transition-colors">AI Baby Podcast Generator</Link>
              </li>
              <li>
                <Link href="/face-to-many-kontext" className="text-gray-400 hover:text-white transition-colors">Face-to-Many-Kontext</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
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
            <h3 className="text-lg font-semibold mb-6">About</h3>
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
        
        <div className="mt-12 pt-8 border-t border-[#f5eecb] flex flex-col md:flex-row justify-start items-center">
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
    </footer>
  );
}