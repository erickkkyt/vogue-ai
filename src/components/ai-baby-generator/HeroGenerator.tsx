'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StarBorder from '../common/StarBorder';
import { AI_BABY_GENERATOR_MEDIA } from '../../config/media';
import { ImageLink } from '../common/MediaLink';

export default function HeroGenerator() {
  // 轮换画廊状态
  const [currentGroup, setCurrentGroup] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 四组示例数据 - 调整顺序：原第4组移到第1组，其他依次后移
  const exampleGroups = [
    {
      father: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family4,
      mother: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family4,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily4,
    },
    {
      father: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family1,
      mother: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family1,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily1,
    },
    {
      father: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family2,
      mother: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family2,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily2,
    },
    {
      father: AI_BABY_GENERATOR_MEDIA.examples.parents.parent1Family3,
      mother: AI_BABY_GENERATOR_MEDIA.examples.parents.parent2Family3,
      baby: AI_BABY_GENERATOR_MEDIA.examples.babies.babyFamily3,
    },
  ];

  // 自动轮换逻辑
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentGroup((prev) => (prev + 1) % exampleGroups.length);
    }, 15000); // 15秒切换

    return () => clearInterval(interval);
  }, [isPaused, exampleGroups.length]);

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-6">
              Free AI Baby Generator:<br />
              <span className="text-purple-400">See Your Future Baby In One Click</span>
            </h1>

            <div className="space-y-4 mb-8 text-gray-300">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <span className="font-medium">#1 Baby Generator powered by newly released AI</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xl">⚡️</span>
                <span>Ultra-realistic baby photos delivered almost instantly</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xl">👶</span>
                <span>12,000+ photos delivered to 3000+ families</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <StarBorder
                as={Link}
                href="/ai-baby-generator#dashboard"
                color="rgba(147, 51, 234, 0.8)"
                speed="4s"
                className="text-lg font-bold text-center no-underline"
              >
                Meet Your Baby Now
              </StarBorder>
            </div>

            <p className="text-gray-400">
              Already joined us? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Log in</Link>
            </p>
          </div>

          {/* Right Column: Rotating Gallery */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center">
            <div
              className="relative group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Main Gallery Container */}
              <div className="w-[480px] h-[480px] rounded-3xl shadow-2xl overflow-hidden relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                {/* Gallery Content */}
                <div className="w-full h-full p-8 flex flex-col justify-center items-center space-y-6">
                  {/* Parents Row */}
                  <div className="flex space-x-8 mb-6">
                    {/* Father */}
                    <div className="relative group/parent">
                      <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-lg transition-all duration-500 group-hover:scale-110">
                        <ImageLink
                          src={exampleGroups[currentGroup].father}
                          alt="Father"
                          title="Father"
                          width={144}
                          height={144}
                          className="w-full h-full object-cover object-[center_20%] transition-opacity duration-1000"
                        />
                      </div>

                    </div>

                    {/* Plus Icon */}
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>

                    {/* Mother */}
                    <div className="relative group/parent">
                      <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-pink-500/50 shadow-lg transition-all duration-500 group-hover:scale-110">
                        <ImageLink
                          src={exampleGroups[currentGroup].mother}
                          alt="Mother"
                          title="Mother"
                          width={144}
                          height={144}
                          className="w-full h-full object-cover object-[center_20%] transition-opacity duration-1000"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Arrow Down */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>

                  {/* AI Baby */}
                  <div className="relative group/baby">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-500 to-pink-500 shadow-2xl transition-all duration-500 group-hover:scale-110">
                      <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-1 rounded-full">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <ImageLink
                            src={exampleGroups[currentGroup].baby}
                            alt="AI Generated Baby"
                            title="AI Generated Baby"
                            width={192}
                            height={192}
                            className="w-full h-full object-cover object-[center_20%] transition-opacity duration-1000"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Gallery Indicators - 移到框外面 */}
              <div className="mt-6 flex justify-center space-x-2">
                {exampleGroups.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGroup(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentGroup
                        ? 'bg-purple-400 w-6'
                        : 'bg-gray-500 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Floating Animation Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/30 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-500/30 rounded-full animate-pulse"></div>
              <div className="absolute top-1/4 -left-6 w-6 h-6 bg-purple-400/30 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/4 -right-6 w-6 h-6 bg-pink-400/30 rounded-full animate-bounce delay-300"></div>

              {/* Floating Hearts */}
              <div className="absolute top-8 left-8 text-purple-400 animate-float">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div className="absolute bottom-8 right-8 text-pink-400 animate-float delay-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>

            {/* Success Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700">
                <div className="text-2xl font-bold text-purple-400">12K+</div>
                <div className="text-sm text-gray-400">Happy Families</div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700">
                <div className="text-2xl font-bold text-pink-400">98%</div>
                <div className="text-sm text-gray-400">Accuracy Rate</div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700">
                <div className="text-2xl font-bold text-purple-400">3s</div>
                <div className="text-sm text-gray-400">Generation Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
