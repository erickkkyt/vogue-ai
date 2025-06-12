'use client';

import type { Project } from '@/types/project';
import { Video, Download, AlertTriangle, Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale'; // For English date formatting

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#f5eecb] rounded-2xl min-h-[250px] mt-6 bg-white/70">
        <AlertTriangle className="w-12 h-12 text-yellow-400 mb-3" />
        <h2 className="text-lg font-semibold mb-1 text-gray-700">No Projects Yet</h2>
        <p className="text-sm text-gray-500">
          You haven&apos;t created any podcast projects yet. <br />
          Go to the Dashboard to start your first AI-generated podcast!
        </p>
      </div>
    );
  }

  const getStatusClasses = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  // Helper function to calculate credits based on duration and resolution
  const calculateCreditsUsed = (project: Project): number | null => {
    if (project.status !== 'completed' || typeof project.duration !== 'number' || project.duration <= 0) {
      return null; // Or 0 if you prefer to show 0 for non-completed/invalid duration
    }

    const baseCredits = Math.ceil(project.duration / 1000.0);

    if (project.video_resolution === '720p') {
      return baseCredits * 2;
    }
    return baseCredits;
  };

  return (
    <>
      {/* Global warning for video link expiration */}
      <div className="mb-5 p-3 bg-yellow-100/70 border border-[#f5eecb] rounded-xl shadow shadow-yellow-100/40">
        <p className="text-xs text-yellow-700 flex items-center justify-center">
          <Clock className="inline h-4 w-4 mr-2 flex-shrink-0" />
          <span className="leading-tight">Processing usually takes about 3 minutes. Please wait for the task to complete.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Responsive grid */}
        {projects.map((project) => {
          const creditsUsed = calculateCreditsUsed(project); // Calculate credits

          return (
            <div 
              key={project.id} 
              className="bg-white/80 border border-[#f5eecb] rounded-2xl text-gray-800 flex flex-col shadow-lg hover:shadow-yellow-200/60 transition-shadow duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 border-b border-[#f5eecb] bg-white/60">
                <h3 className="truncate text-sm font-medium text-gray-800">Topic: {project.topic || 'N/A'}</h3>
                <p className="text-[0.7rem] text-gray-500 pt-0.5">
                  Created: {format(new Date(project.created_at), 'MMM d, yyyy p', { locale: enUS })}
                </p>
              </div>

              {/* Content */}
              <div className="p-3 flex-grow text-xs bg-white/40">
                <div className="mb-2.5">
                  <span
                    className={`capitalize px-2 py-0.5 text-[0.65rem] font-semibold rounded-full inline-flex items-center leading-normal ${getStatusClasses(project.status)}`}
                  >
                    {project.status === 'processing' && <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" />}
                    {project.status}
                  </span>
                  {/* Display calculated credits if available */}
                  {creditsUsed !== null && (
                    <p className="text-[0.65rem] text-gray-500 mt-1">
                      Credits Used: {creditsUsed}
                    </p>
                  )}
                </div>
                
                {project.status === 'completed' && project.video_url ? (
                  <div className="aspect-video bg-gray-200 rounded-md overflow-hidden mb-2.5 shadow-inner">
                    <video controls src={project.video_url} className="w-full h-full object-contain">
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : project.status === 'processing' ? (
                  <div className="aspect-video bg-yellow-100/60 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                    <Loader2 className="h-6 w-6 text-yellow-500 animate-spin mb-1.5" /> 
                    <p className="text-[0.7rem] text-yellow-700">Video Processing...</p>
                    <p className="text-[0.65rem] text-yellow-600">This usually takes about 3 minutes.</p>
                  </div>
                ) : project.status === 'failed' ? (
                  <div className="aspect-video bg-red-100/60 border border-red-200 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                    <AlertTriangle className="w-6 h-6 text-red-400 mb-1.5" />
                    <p className="text-[0.7rem] font-medium text-red-700">Video Failed</p>
                    <p className="text-[0.65rem] text-red-500 mt-0.5">Sorry, an error occurred.</p>
                  </div>
                ) : ( 
                  <div className="aspect-video bg-gray-100/60 rounded-md flex flex-col items-center justify-center mb-2.5 p-3 text-center min-h-[100px]">
                     <Video className="w-6 h-6 text-gray-400 mb-1.5" />
                     <p className="text-[0.7rem] text-gray-500">Video Not Available</p>
                  </div>
                )}
              
                <div className="space-y-0.5 text-[0.7rem]"> {/* Smaller text for details */}
                    <p className="text-gray-500">Ethnicity: <span className="font-normal text-gray-700">{project.ethnicity || 'N/A'}</span></p>
                    <p className="text-gray-500">Hair: <span className="font-normal text-gray-700">{project.hair || 'N/A'}</span></p>
                    {project.video_resolution && (
                      <p className="text-gray-500">Resolution: <span className="font-normal text-gray-700">{project.video_resolution}</span></p>
                    )}
                    {project.aspect_ratio && (
                      <p className="text-gray-500">Aspect Ratio: <span className="font-normal text-gray-700">{project.aspect_ratio}</span></p>
                    )}
                </div>
              </div>
            
              {/* Footer (Download Button) */}
              <div className="p-2.5 border-t border-[#f5eecb] mt-auto bg-white/60">
                {project.status === 'completed' && project.video_url ? (
                  <div className="w-full">
                    <a 
                      href={project.video_url} 
                      download 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full text-[0.7rem] inline-flex items-center justify-center bg-green-400 hover:bg-green-500 text-white font-medium py-1 px-2.5 rounded-md transition-colors duration-150 shadow shadow-green-100/40"
                    >
                      <Download className="mr-1 h-3 w-3" /> Download Video
                    </a>
                  </div>
                ) : (
                  <button 
                    disabled 
                    className="w-full text-[0.7rem] inline-flex items-center justify-center font-medium py-1 px-2.5 rounded-md bg-gray-200 text-gray-400 cursor-not-allowed"
                  >
                    <Download className="mr-1 h-3 w-3" /> Download Unavailable
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}