'use client';

import { cn } from "@/lib/utils";

export default function WhyGenerator() {
  const reasons = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Advanced AI Technology",
      description: "Our cutting-edge AI analyzes over 70 facial features to create the most realistic baby predictions possible."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Privacy Protected",
      description: "Your photos are processed securely and automatically deleted after generation. Your privacy is our top priority."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Get your AI baby photos in seconds, not minutes. Our optimized processing delivers instant results."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Trusted by Thousands",
      description: "Join over 3,000 happy families who have already discovered their future babies with our AI technology."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "High Quality Results",
      description: "Download your generated baby photos in high definition. Perfect for sharing with family and friends."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Free to Try",
      description: "Start with our free tier and see the magic for yourself. No hidden costs or surprise charges."
    }
  ];

  const Feature = ({
    title,
    description,
    icon,
    index,
    totalFeatures,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
    totalFeatures: number;
  }) => {
    const isThreeColumns = totalFeatures === 6;
    const columnsLg = isThreeColumns ? 3 : 4;
    const topRowCount = isThreeColumns ? 3 : 4;

    return (
      <div
        className={cn(
          "flex flex-col p-8 relative group/feature transition-all duration-300",
          // Border logic - matching the official design
          "border-gray-700/30",
          // Right border for all except last column
          (index % columnsLg !== (columnsLg - 1)) && "lg:border-r",
          // Right border for all except last column in md
          (index % 2 !== 1) && "md:border-r lg:border-r-0",
          // Bottom border for top row
          index < topRowCount && "lg:border-b",
          // Bottom border for first row in md
          index < 2 && "md:border-b lg:border-b-0",
          // Bottom border for all except last row in mobile
          index < (totalFeatures - 1) && "border-b md:border-b-0 lg:border-b-0",
          // Re-add bottom border for specific items in lg
          index < topRowCount && "lg:border-b"
        )}
      >
        {/* Hover background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Icon */}
        <div className="mb-6 text-gray-400 group-hover/feature:text-purple-400 transition-colors duration-300 relative z-10">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-3 group-hover/feature:text-purple-400 transition-colors duration-300 relative z-10">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed group-hover/feature:text-gray-300 transition-colors duration-300 relative z-10">
          {description}
        </p>
      </div>
    );
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Our AI Baby Generator?
          </h2>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto whitespace-nowrap">
            Discover what makes our AI baby generator the most trusted and advanced solution for predicting your future baby.
          </p>
        </div>

        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 relative z-10 max-w-7xl mx-auto mt-8 border border-gray-700/30 rounded-lg overflow-hidden bg-gray-800/20 backdrop-blur-sm",
          "lg:grid-cols-3"
        )}>
          {reasons.map((reason, index) => (
            <Feature key={reason.title} {...reason} index={index} totalFeatures={reasons.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
