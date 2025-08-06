import { cn } from "@/lib/utils";
import {
  IconVideo,
  IconMicrophone,
  IconPhoto,
  IconBrandTiktok,
  IconSparkles,
  IconRocket,
  IconUsers,
  IconHeart,
} from "@tabler/icons-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeaturesSectionDemoProps {
  features?: Feature[];
}

export function FeaturesSectionDemo({ features: propFeatures }: FeaturesSectionDemoProps = {}) {
  const defaultFeatures = [
    {
      title: "AI Video Generation",
      description:
        "Create stunning videos with Google's Veo 3 technology. Professional quality at unbeatable prices.",
      icon: <IconVideo className="w-6 h-6" />,
    },
    {
      title: "Perfect Lip Sync",
      description:
        "Advanced AI synchronizes lips with any audio for natural, professional results.",
      icon: <IconMicrophone className="w-6 h-6" />,
    },
    {
      title: "AI Baby Podcast",
      description:
        "Generate viral baby podcast content with 4-AI engine technology for social media.",
      icon: <IconBrandTiktok className="w-6 h-6" />,
    },
    {
      title: "Image Enhancement",
      description: "Transform and enhance images with cutting-edge AI algorithms.",
      icon: <IconPhoto className="w-6 h-6" />,
    },
    {
      title: "Lightning Fast",
      description: "Process videos and images in minutes, not hours. Optimized for speed.",
      icon: <IconRocket className="w-6 h-6" />,
    },
    {
      title: "Creator Community",
      description:
        "Join 5000+ creators making viral content with our AI tools.",
      icon: <IconUsers className="w-6 h-6" />,
    },
    {
      title: "AI-Powered Magic",
      description:
        "Experience the magic of AI with neural networks and advanced algorithms.",
      icon: <IconSparkles className="w-6 h-6" />,
    },
    {
      title: "Made with Love",
      description: "Crafted with passion for creators who want to make amazing content.",
      icon: <IconHeart className="w-6 h-6" />,
    },
  ];

  const features = propFeatures || defaultFeatures;
  const isThreeColumns = features.length === 6;

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 relative z-10 max-w-7xl mx-auto mt-8 border border-gray-700/30 rounded-lg overflow-hidden bg-gray-800/20 backdrop-blur-sm",
      isThreeColumns ? "lg:grid-cols-3" : "lg:grid-cols-4"
    )}>
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} totalFeatures={features.length} />
      ))}
    </div>
  );
}

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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Icon */}
      <div className="mb-6 text-gray-400 group-hover/feature:text-blue-400 transition-colors duration-300 relative z-10">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-3 group-hover/feature:text-blue-400 transition-colors duration-300 relative z-10">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed group-hover/feature:text-gray-300 transition-colors duration-300 relative z-10">
        {description}
      </p>
    </div>
  );
};
