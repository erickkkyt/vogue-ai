'use client';

import { useState, useEffect } from 'react';
import type { ProjectItem } from '@/types/project';
import { Video, Download, AlertTriangle, Loader2, Clock, Baby, User } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale'; // For English date formatting

interface ProjectsClientProps {
  projects: ProjectItem[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-600 rounded-2xl min-h-[250px] mt-6 bg-gray-800/80 backdrop-blur-md">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-3" />
        <h2 className="text-lg font-semibold mb-1 text-white">Loading Projects...</h2>
        <p className="text-sm text-gray-300">Please wait while we load your projects.</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-600 rounded-2xl min-h-[250px] mt-6 bg-gray-800/80 backdrop-blur-md">
        <AlertTriangle className="w-12 h-12 text-yellow-400 mb-3" />
        <h2 className="text-lg font-semibold mb-1 text-white">No Projects Yet</h2>
        <p className="text-sm text-gray-300">
          You haven&apos;t created any projects yet. <br />
          Go to the Dashboard to start your first AI-generated content!
        </p>
      </div>
    );
  }

  const getStatusClasses = (status: ProjectItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/50 text-green-300 border border-green-700';
      case 'processing':
        return 'bg-blue-900/50 text-blue-300 border border-blue-700';
      case 'failed':
        return 'bg-red-900/50 text-red-300 border border-red-700';
      default:
        return 'bg-gray-700/50 text-gray-300 border border-gray-600';
    }
  };

  // Helper function to calculate credits based on project type
  const calculateCreditsUsed = (project: ProjectItem): number | null => {
    // For baby generations, use the stored credits_used value
    if (project.type === 'baby_generation') {
      return project.credits_used || 3; // Default to 3 if not set
    }

    // For Veo3 generations, use the stored credits_used value or calculate based on model
    if (project.type === 'veo3_generation') {
      // If credits_used is available, use it directly
      if (project.credits_used) {
        return project.credits_used;
      }

      // Otherwise, calculate based on selected model
      if (project.selected_model === 'veo3_fast') {
        return 15;
      } else if (project.selected_model === 'veo3') {
        return 40;
      }

      // Default to veo3 pricing if model is not specified
      return 40;
    }

    // For video projects, calculate based on duration and resolution
    if (project.type === 'project') {
      if (project.status !== 'completed' || typeof project.duration !== 'number' || project.duration <= 0) {
        return null;
      }

      const baseCredits = Math.ceil(project.duration / 1000.0);
      // Note: video_resolution is not available in ProjectItem, would need to add it
      return baseCredits;
    }

    return null;
  };

  return (
    <>
      {/* Global warning for video link expiration */}
      <div className="mb-5 p-3 bg-yellow-900/30 border border-yellow-700 rounded-xl shadow-lg backdrop-blur-md">
        <p className="text-xs text-yellow-200 flex items-center justify-center">
          <Clock className="inline h-4 w-4 mr-2 flex-shrink-0" />
          <span className="leading-tight">Processing usually takes about 3 minutes. Please wait for the task to complete.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Responsive grid */}
        {projects.map((project) => {
          // Add safety checks for project data
          if (!project || !project.id) {
            console.warn('Invalid project data:', project);
            return null;
          }

          const creditsUsed = calculateCreditsUsed(project); // Calculate credits

          return (
            <div
              key={project.id}
              className="bg-gray-800/90 border border-gray-600 rounded-2xl text-white flex flex-col shadow-lg hover:shadow-xl hover:border-gray-500 transition-all duration-300 overflow-hidden backdrop-blur-md"
            >
              {/* Header */}
              <div className="p-3 border-b border-gray-600 bg-gray-700/50">
                <div className="flex items-center space-x-2 mb-1">
                  {project.type === 'baby_generation' ? (
                    <Baby className="w-4 h-4 text-pink-400" />
                  ) : project.type === 'veo3_generation' ? (
                    <Video className="w-4 h-4 text-purple-400" />
                  ) : project.type === 'hailuo_generation' ? (
                    <Video className="w-4 h-4 text-orange-400" />
                  ) : (
                    <Video className="w-4 h-4 text-blue-400" />
                  )}
                  <h3 className="truncate text-sm font-medium text-white">
                    {project.type === 'baby_generation'
                      ? `AI Baby (${project.baby_gender === 'boy' ? 'Boy' : project.baby_gender === 'girl' ? 'Girl' : 'Unknown'})`
                      : project.type === 'veo3_generation'
                      ? `Veo3 (${project.generation_mode === 'text-to-video' ? 'Text→Video' : 'Image→Video'})`
                      : project.type === 'hailuo_generation'
                      ? `Hailuo (${project.duration}s)`
                      : `Topic: ${project.topic || 'N/A'}`
                    }
                  </h3>
                </div>
                <p className="text-[0.7rem] text-gray-400 pt-0.5">
                  Created: {(() => {
                    try {
                      const date = new Date(project.created_at);
                      if (isNaN(date.getTime())) {
                        return 'Invalid Date';
                      }
                      return format(date, 'MMM d, yyyy p', { locale: enUS });
                    } catch (error) {
                      console.error('Date formatting error:', error, 'for date:', project.created_at);
                      return 'Date Error';
                    }
                  })()}
                </p>
              </div>

              {/* Content */}
              <div className="p-3 flex-grow text-xs bg-gray-800/60">
                <div className="mb-2.5">
                  <span
                    className={`capitalize px-2 py-0.5 text-[0.65rem] font-semibold rounded-full inline-flex items-center leading-normal ${getStatusClasses(project.status)}`}
                  >
                    {project.status === 'processing' && <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" />}
                    {project.status}
                  </span>
                  {/* Display calculated credits if available */}
                  {creditsUsed !== null && (
                    <p className="text-[0.65rem] text-gray-400 mt-1">
                      Credits Used: {creditsUsed}
                    </p>
                  )}
                </div>

                {/* Content based on project type */}
                {project.type === 'baby_generation' ? (
                  // Baby Generation Content
                  project.status === 'completed' && project.generated_baby_url ? (
                    <div className="aspect-square bg-gray-700 rounded-md overflow-hidden mb-2.5 shadow-inner border border-gray-600">
                      <img
                        src={project.generated_baby_url}
                        alt="Generated baby"
                        className="w-full h-full object-cover"
                        suppressHydrationWarning={true}
                      />
                    </div>
                  ) : project.status === 'processing' ? (
                    <div className="aspect-square bg-yellow-900/30 border border-yellow-700 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                      <Loader2 className="h-6 w-6 text-yellow-400 animate-spin mb-1.5" />
                      <p className="text-[0.7rem] text-yellow-200">Generating Baby...</p>
                      <p className="text-[0.65rem] text-yellow-300">This usually takes 2-3 minutes.</p>
                    </div>
                  ) : project.status === 'failed' ? (
                    <div className="aspect-square bg-red-900/30 border border-red-700 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                      <AlertTriangle className="w-6 h-6 text-red-400 mb-1.5" />
                      <p className="text-[0.7rem] font-medium text-red-300">Generation Failed</p>
                      <p className="text-[0.65rem] text-red-400 mt-0.5">Sorry, an error occurred.</p>
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-700/60 border border-gray-600 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                       <Baby className="w-6 h-6 text-gray-400 mb-1.5" />
                       <p className="text-[0.7rem] text-gray-300">Baby Not Available</p>
                    </div>
                  )
                ) : project.type === 'veo3_generation' ? (
                  // Veo3 Generation Content
                  project.status === 'completed' && project.video_url ? (
                    <div className="aspect-video bg-gray-700 rounded-md overflow-hidden mb-2.5 shadow-inner border border-gray-600">
                      <video
                        controls
                        src={project.video_url}
                        className="w-full h-full object-contain"
                        suppressHydrationWarning={true}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : project.status === 'processing' ? (
                    <div className="aspect-video bg-purple-900/30 border border-purple-700 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                      <Loader2 className="h-6 w-6 text-purple-400 animate-spin mb-1.5" />
                      <p className="text-[0.7rem] text-purple-200">Generating Video...</p>
                      <p className="text-[0.65rem] text-purple-300">This usually takes 3-5 minutes.</p>
                    </div>
                  ) : project.status === 'failed' ? (
                    <div className="aspect-video bg-red-900/30 border border-red-700 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                      <AlertTriangle className="w-6 h-6 text-red-400 mb-1.5" />
                      <p className="text-[0.7rem] font-medium text-red-300">Generation Failed</p>
                      <p className="text-[0.65rem] text-red-400 mt-0.5">Sorry, an error occurred.</p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-700/60 border border-gray-600 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                       <Video className="w-6 h-6 text-gray-400 mb-1.5" />
                       <p className="text-[0.7rem] text-gray-300">Video Not Available</p>
                    </div>
                  )
                ) : project.type === 'hailuo_generation' ? (
                  // Hailuo Generation Content
                  project.status === 'completed' && project.video_url ? (
                    <div className="aspect-video bg-gray-700 rounded-md overflow-hidden mb-2.5 shadow-inner border border-gray-600">
                      <video
                        controls
                        src={project.video_url}
                        className="w-full h-full object-contain"
                        suppressHydrationWarning={true}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : project.status === 'processing' ? (
                    <div className="aspect-video bg-orange-900/30 border border-orange-700 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                      <Loader2 className="h-6 w-6 text-orange-400 animate-spin mb-1.5" />
                      <p className="text-[0.7rem] text-orange-200">Generating Hailuo Video...</p>
                      <p className="text-[0.65rem] text-orange-300">This usually takes 2-3 minutes.</p>
                    </div>
                  ) : project.status === 'failed' ? (
                    <div className="aspect-video bg-red-900/30 border border-red-700 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                      <AlertTriangle className="w-6 h-6 text-red-400 mb-1.5" />
                      <p className="text-[0.7rem] font-medium text-red-300">Generation Failed</p>
                      <p className="text-[0.65rem] text-red-400 mt-0.5">Sorry, an error occurred.</p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-700/60 border border-gray-600 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                       <Video className="w-6 h-6 text-gray-400 mb-1.5" />
                       <p className="text-[0.7rem] text-gray-300">Video Not Available</p>
                    </div>
                  )
                ) : (
                  // AI Baby Podcast Content
                  project.status === 'completed' && project.video_url ? (
                    <div className="aspect-video bg-gray-700 rounded-md overflow-hidden mb-2.5 shadow-inner border border-gray-600">
                      <video
                        controls
                        src={project.video_url}
                        className="w-full h-full object-contain"
                        suppressHydrationWarning={true}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : project.status === 'processing' ? (
                    <div className="aspect-video bg-yellow-900/30 border border-yellow-700 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                      <Loader2 className="h-6 w-6 text-yellow-400 animate-spin mb-1.5" />
                      <p className="text-[0.7rem] text-yellow-200">Video Processing...</p>
                      <p className="text-[0.65rem] text-yellow-300">This usually takes about 3 minutes.</p>
                    </div>
                  ) : project.status === 'failed' ? (
                    <div className="aspect-video bg-red-900/30 border border-red-700 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                      <AlertTriangle className="w-6 h-6 text-red-400 mb-1.5" />
                      <p className="text-[0.7rem] font-medium text-red-300">Video Failed</p>
                      <p className="text-[0.65rem] text-red-400 mt-0.5">Sorry, an error occurred.</p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-700/60 border border-gray-600 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                       <Video className="w-6 h-6 text-gray-400 mb-1.5" />
                       <p className="text-[0.7rem] text-gray-300">Video Not Available</p>
                    </div>
                  )
                )}
              
                <div className="space-y-0.5 text-[0.7rem]"> {/* Smaller text for details */}
                  {project.type === 'baby_generation' ? (
                    // Baby Generation Details
                    <>
                      <p className="text-gray-400">Gender: <span className="font-normal text-gray-200">{project.baby_gender === 'boy' ? 'Boy' : project.baby_gender === 'girl' ? 'Girl' : 'Unknown'}</span></p>
                      <p className="text-gray-400">Type: <span className="font-normal text-pink-300">AI Baby Generator</span></p>
                    </>
                  ) : project.type === 'veo3_generation' ? (
                    // Veo3 Generation Details
                    <>
                      <p className="text-gray-400">Mode: <span className="font-normal text-gray-200">{project.generation_mode === 'text-to-video' ? 'Text to Video' : 'Image to Video'}</span></p>
                      <p className="text-gray-400">Model: <span className="font-normal text-gray-200">{project.selected_model || 'N/A'}</span></p>
                      <p className="text-gray-400">Type: <span className="font-normal text-purple-300">Veo 3 Generator</span></p>
                    </>
                  ) : project.type === 'hailuo_generation' ? (
                    // Hailuo Generation Details
                    <>
                      <p className="text-gray-400">Duration: <span className="font-normal text-gray-200">{project.duration}s</span></p>
                      <p className="text-gray-400">Prompt: <span className="font-normal text-gray-200 truncate block">{project.prompt || 'N/A'}</span></p>
                      <p className="text-gray-400">Type: <span className="font-normal text-orange-300">Hailuo AI Generator</span></p>
                    </>
                  ) : (
                    // AI Baby Podcast Details
                    <>
                      <p className="text-gray-400">Ethnicity: <span className="font-normal text-gray-200">{project.ethnicity || 'N/A'}</span></p>
                      <p className="text-gray-400">Hair: <span className="font-normal text-gray-200">{project.hair || 'N/A'}</span></p>
                      <p className="text-gray-400">Type: <span className="font-normal text-blue-300">AI Baby Podcast</span></p>
                    </>
                  )}
                </div>
              </div>

              {/* Footer (Download Button) */}
              <div className="p-2.5 border-t border-gray-600 mt-auto bg-gray-700/50">
                {project.type === 'baby_generation' ? (
                  // Baby Generation Download
                  project.status === 'completed' && project.generated_baby_url ? (
                    <div className="w-full">
                      <a
                        href={`/api/download?url=${encodeURIComponent(project.generated_baby_url)}&filename=ai-baby-${project.id}.jpg`}
                        className="w-full text-[0.7rem] inline-flex items-center justify-center bg-pink-600 hover:bg-pink-500 text-white font-medium py-1 px-2.5 rounded-md transition-colors duration-150 shadow-lg border border-pink-500"
                      >
                        <Download className="mr-1 h-3 w-3" /> Download Image
                      </a>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full text-[0.7rem] inline-flex items-center justify-center font-medium py-1 px-2.5 rounded-md bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500"
                    >
                      <Download className="mr-1 h-3 w-3" /> Download Unavailable
                    </button>
                  )
                ) : project.type === 'veo3_generation' ? (
                  // Veo3 Generation Download
                  project.status === 'completed' && project.video_url ? (
                    <div className="w-full">
                      <a
                        href={`/api/download?url=${encodeURIComponent(project.video_url)}&filename=veo3-video-${project.id}.mp4`}
                        className="w-full text-[0.7rem] inline-flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white font-medium py-1 px-2.5 rounded-md transition-colors duration-150 shadow-lg border border-purple-500"
                      >
                        <Download className="mr-1 h-3 w-3" /> Download Video
                      </a>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full text-[0.7rem] inline-flex items-center justify-center font-medium py-1 px-2.5 rounded-md bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500"
                    >
                      <Download className="mr-1 h-3 w-3" /> Download Unavailable
                    </button>
                  )
                ) : project.type === 'hailuo_generation' ? (
                  // Hailuo Generation Download
                  project.status === 'completed' && project.video_url ? (
                    <div className="w-full">
                      <a
                        href={`/api/download?url=${encodeURIComponent(project.video_url)}&filename=hailuo-video-${project.id}.mp4`}
                        className="w-full text-[0.7rem] inline-flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white font-medium py-1 px-2.5 rounded-md transition-colors duration-150 shadow-lg border border-orange-500"
                      >
                        <Download className="mr-1 h-3 w-3" /> Download Video
                      </a>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full text-[0.7rem] inline-flex items-center justify-center font-medium py-1 px-2.5 rounded-md bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500"
                    >
                      <Download className="mr-1 h-3 w-3" /> Download Unavailable
                    </button>
                  )
                ) : (
                  // AI Baby Podcast Download
                  project.status === 'completed' && project.video_url ? (
                    <div className="w-full">
                      <a
                        href={`/api/download?url=${encodeURIComponent(project.video_url)}&filename=ai-baby-podcast-${project.id}.mp4`}
                        className="w-full text-[0.7rem] inline-flex items-center justify-center bg-green-600 hover:bg-green-500 text-white font-medium py-1 px-2.5 rounded-md transition-colors duration-150 shadow-lg border border-green-500"
                      >
                        <Download className="mr-1 h-3 w-3" /> Download Video
                      </a>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full text-[0.7rem] inline-flex items-center justify-center font-medium py-1 px-2.5 rounded-md bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500"
                    >
                      <Download className="mr-1 h-3 w-3" /> Download Unavailable
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}