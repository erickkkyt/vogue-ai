import React from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: React.ReactNode;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-create-ai-baby-videos',
    title: 'How to Create AI Baby Generator Videos',
    author: 'AI Baby Team',
    date: 'May 29, 2025',
    summary: 'A step-by-step guide to creating your own engaging AI baby videos using the AI Baby Generator dashboard.',
    content: (
      <>
        <p className="mb-6 text-gray-700 leading-relaxed">
          Creating viral AI baby videos is easier than you think with the AI Baby Generator platform! Our intuitive dashboard guides you through each step. Let&apos;s walk through the process of bringing your unique AI baby video idea to life.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Step 1: Access Your Dashboard</h3>
        <p className="mb-4 text-gray-700 leading-relaxed">
          First, make sure you&apos;re logged into your AI Baby Generator account. Once logged in, navigate to your dashboard. This is your creative hub for managing and creating new projects.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Step 2: Define Your Baby&apos;s Appearance</h3>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Next, you&apos;ll decide how your AI baby will look. Our platform offers flexible options:
        </p>
        <ul className="list-disc list-inside mb-4 pl-4 text-gray-700 leading-relaxed space-y-2">
          <li>
            <strong>Generate with Features:</strong> Specify characteristics like ethnicity and hair style, and our AI will generate a unique baby image for you.
          </li>
          <li>
            <strong>Upload Custom Baby Photo:</strong> Have the perfect baby picture already? Upload it directly, and we&apos;ll use that as the foundation for your video.
          </li>
          <li>
            <strong>Convert Portrait to Baby (if available):</strong> Some of our advanced tools may allow you to upload a regular portrait photo, which our AI will then transform into an adorable baby version. Check the dashboard for this option!
          </li>
        </ul>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Choose the mode that best suits your vision in the &quot;Baby&apos;s Appearance&quot; section of the creation form.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Step 3: Craft Your Podcast Content</h3>
        <p className="mb-4 text-gray-700 leading-relaxed">
          With your baby&apos;s look decided, it&apos;s time to give them a voice! Select how you want to generate the script for your AI baby video:
        </p>
        <ul className="list-disc list-inside mb-4 pl-4 text-gray-700 leading-relaxed space-y-2">
          <li>
            <strong>Generate from Topic:</strong> Simply provide a topic (e.g., &quot;Baby&apos;s first words,&quot; &quot;A tiny financial advisor&quot;), and our AI will craft an engaging script.
          </li>
          <li>
            <strong>Upload Your Audio Script:</strong> If you&apos;ve already recorded the audio for your podcast, you can upload the audio file directly.
          </li>
          <li>
            <strong>Directly Input Text Script:</strong> Prefer to write or paste your own script? Select this option and use the provided text area.
          </li>
        </ul>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Make your selection in the &quot;Content&quot; section on the dashboard.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Step 4: Choose Video Output Settings</h3>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Customize the final look of your video by selecting the desired output settings:
        </p>
        <ul className="list-disc list-inside mb-4 pl-4 text-gray-700 leading-relaxed space-y-2">
          <li>
            <strong>Video Resolution:</strong> Choose from options like 540p (standard) or 720p (HD). Note that higher resolutions might consume more credits.
          </li>
          <li>
            <strong>Aspect Ratio:</strong> Select the best fit for your target platform, such as 9:16 (for TikTok/Shorts), 1:1 (for Instagram posts), or 16:9 (for wider formats).
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Step 5: Submit and Generate!</h3>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Once you&apos;ve configured all your options, give everything a final review. When you&apos;re ready, hit the &quot;Submit&quot; or &quot;Create&quot; button.
        </p>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Our AI engine will get to work, and your video will start processing. You can typically check the status of your projects in the &quot;My Projects&quot; section of your dashboard. Processing times can vary but are generally quick.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">You&apos;re All Set!</h3>
        <p className="text-gray-700 leading-relaxed">
          That&apos;s it! You&apos;ve successfully submitted your request to create an AI baby video. We can&apos;t wait to see the amazing and engaging content you&apos;ll produce with AI Baby Generator. Happy creating!
        </p>
      </>
    ),
  },
  // 您可以在这里添加更多博文对象
];

// Helper function to get a post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return blogPosts.find(post => post.slug === slug);
}