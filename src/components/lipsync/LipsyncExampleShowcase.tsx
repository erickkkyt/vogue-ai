'use client';

import { Play, ArrowRight, Video } from 'lucide-react';
import Link from 'next/link';

interface ExampleCase {
  id: string;
  title: string;
  description: string;
  originalImage: string;
  generatedImage: string;
  buttonText: string;
  buttonLink: string;
  category: string;
}

const exampleCases: ExampleCase[] = [
  {
    id: '1',
    title: 'Bring Cartoons to Life with AI Cartoon Lip Sync!',
    description: 'AI Baby Podcast technology uses a new generation of neural networks to synchronize baby lip animations with any audio to create stunning, shareable content. Instantly transform your podcast into a vivid and lifelike baby image to engage your audience and dominate social media headlines with irresistible charm.',
    originalImage: '/api/placeholder/300/300',
    generatedImage: '/api/placeholder/300/300',
    buttonText: 'AI Baby Podcast',
    buttonLink: '/ai-baby-podcast',
    category: 'Baby Podcast'
  },
  {
    id: '2',
    title: 'Turn Photos into Talking Videos with AI Talking Photo!',
    description: 'Just upload a photo and audio, no editing skills are required, and you can generate a natural opening video with one click. It supports multiple styles, sounds, expressions and background customization. It is widely used in scenarios such as birthday wishes, social sharing, product promotion, education and teaching, and you can easily unleash your creativity.',
    originalImage: '/api/placeholder/300/400',
    generatedImage: '/api/placeholder/300/400',
    buttonText: 'AI Talking Photo',
    buttonLink: '/lipsync',
    category: 'Talking Photo'
  },
  {
    id: '3',
    title: 'Create Professional Videos with AI Video Generator!',
    description: 'Transform your ideas into stunning videos using Google\'s most advanced Veo 3 technology. Generate high-quality content with synchronized audio, perfect for social media, marketing, and creative projects. Experience the future of video creation with our state-of-the-art AI engine.',
    originalImage: '/api/placeholder/300/350',
    generatedImage: '/api/placeholder/300/350',
    buttonText: 'AI Video Generator',
    buttonLink: '/veo-3-generator',
    category: 'Video Generation'
  }
];

export default function LipsyncExampleShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <Video className="w-4 h-4 mr-3 text-pink-400" />
            <span className="text-pink-400 text-sm font-medium tracking-wide">Live Examples</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Discover The Magic Power Of
            <span className="bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 bg-clip-text text-transparent"> LipSync</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience the future of AI-powered content creation with our cutting-edge lip synchronization technology.
            Transform your ideas into viral content that captivates audiences worldwide.
          </p>
        </div>

        {/* Example Cases */}
        <div className="space-y-16 max-w-7xl mx-auto">
          {exampleCases.map((example, index) => (
            <div
              key={example.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Content Side */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
                    <span className="text-blue-400 text-sm font-medium">{example.category}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {example.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {example.description}
                  </p>
                  
                  <Link
                    href={example.buttonLink}
                    className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {example.buttonText}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>

                {/* Visual Side */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="flex items-center justify-center space-x-6">
                    {/* Original Image */}
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                      <div className="relative bg-slate-900 rounded-2xl p-4 border border-slate-700">
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Original
                        </div>
                        <img
                          src={example.originalImage}
                          alt="Original"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                        <ArrowRight className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Generated Image */}
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                      <div className="relative bg-slate-900 rounded-2xl p-4 border border-slate-700">
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Generated
                        </div>
                        <img
                          src={example.generatedImage}
                          alt="Generated"
                          className="w-full h-auto rounded-lg"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/70 transition-all duration-300 cursor-pointer">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Create Your Own Magic?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of creators who are already using our AI tools to create viral content.
              Start your journey today and experience the power of AI-driven creativity.
            </p>
            <Link
              href="#dashboard"
              className="inline-flex items-center bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Video className="mr-2" size={18} />
              Start Creating Now
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
