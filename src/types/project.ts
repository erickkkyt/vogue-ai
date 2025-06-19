export interface Project {
  id: string;
  created_at: string; // Or Date, depending on how you handle it
  updated_at: string; // Added, as it's good practice and likely in your DB
  user_id: string;
  topic: string | null;
  ethnicity: string | null;
  hair: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | string; // Allow other statuses as string
  video_url?: string | null;
  job_id: string; // The ID from n8n
  duration?: number | null; // Duration of the video in milliseconds
  error_message?: string | null; // To store any error messages from n8n
  creation_type: 'features' | 'custom_image' | string; // Added
  image_url: string | null;                         // Added
  video_resolution: '540p' | '720p' | string | null;   // Added
  aspect_ratio: '1:1' | '16:9' | '9:16' | string | null; // Added
  credits_used: number | null;                        // Changed from credits_deducted and made nullable
}

// You might also want a type for when creating a project,
// which might not have all fields yet (e.g., id, created_at are auto-generated)
export interface ProjectCreationData {
  user_id: string;
  topic: string;
  ethnicity: string;
  hair: string;
  job_id: string;
  credits_to_deduct: number; // This might be outdated now given the new RPC logic
}

// Baby Generation type for AI Baby Generator
export interface BabyGeneration {
  id: string;
  user_id: string;
  job_id: string;
  father_image_url: string;
  mother_image_url: string;
  baby_gender: 'boy' | 'girl';
  status: 'processing' | 'completed' | 'failed';
  generated_baby_url?: string | null;
  credits_used: number;
  error_message?: string | null;
  created_at: string;
  completed_at?: string | null;
}

// Combined type for displaying both projects and baby generations
export interface ProjectItem {
  id: string;
  type: 'project' | 'baby_generation' | 'veo3_generation';
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | string;
  credits_used?: number | null;

  // Project-specific fields
  topic?: string | null;
  ethnicity?: string | null;
  hair?: string | null;
  video_url?: string | null;
  duration?: number | null;

  // Baby generation-specific fields
  baby_gender?: 'boy' | 'girl';
  generated_baby_url?: string | null;
  father_image_url?: string;
  mother_image_url?: string;

  // Veo3 generation-specific fields
  generation_mode?: 'text-to-video' | 'image-to-video';
  selected_model?: 'veo3' | 'veo3_fast';
  text_prompt?: string | null;
  image_prompt?: string | null;
}

// Veo 3 Generator type
export interface Veo3Generation {
  id: string;
  user_id: string;
  job_id: string;
  generation_mode: 'text-to-video' | 'image-to-video';
  selected_model: 'veo3' | 'veo3_fast';
  text_prompt?: string | null;
  image_url?: string | null;
  image_prompt?: string | null;
  video_url?: string | null;
  status: 'processing' | 'completed' | 'failed';
  credits_used: number;
  created_at: string;
  completed_at?: string | null;
}

// If you have user profile information linked to projects, you might define that here too
// For example, if projects list shows user's email or name from a join
// export interface UserProfile {
//   id: string;
//   email?: string;
//   // ... other profile fields
// }