'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Settings2, Sparkles, Film, SearchCode, ChevronDown, X } from 'lucide-react'; // Film might be unused now
import { ConfirmationModal } from '../common/modals/ConfirmationModal';
import InsufficientCreditsModal from '../common/modals/InsufficientCreditsModal';
import { useRouter } from 'next/navigation'; // Import useRouter
import AudioTrimUpload from './audio-trim-upload';
import { createClient } from '@/utils/supabase/client';

interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  isImportant: boolean;
}

interface YouTubeVideo {
  id:string;
  videoId: string;
  title: string;
}

// Define a type for the profile to expect `credits`
// interface UserProfile {  // This seems to be commented out or unused, check if needed
//   credits: number;
// }

const MAX_TOPIC_LENGTH = 100;
const MAX_CUSTOM_FIELD_LENGTH = 50;
const MAX_TEXT_SCRIPT_LENGTH = 500; // Changed from 5000 to 500
const REQUIRED_CREDITS_PER_PROJECT = 0; 
const MAX_FILE_SIZE_MB = 3; // Changed from 5 to 3

export default function DashboardClient({ currentCredits = 0 }: { currentCredits?: number }) {
  const router = useRouter(); // Initialize useRouter
  const [allReceivedNotifications, setAllReceivedNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true); // This might need to be re-evaluated if My Projects is gone

  // Ensure currentCredits is a valid number
  const validCredits = typeof currentCredits === 'number' && !isNaN(currentCredits) ? currentCredits : 0;

  // Debug: Log currentCredits to console
  console.log('DashboardClient currentCredits:', currentCredits, 'validCredits:', validCredits, typeof currentCredits);

  // --- States for Module 1: Baby&apos;s Appearance --- 
  const [appearanceCreationMode, setAppearanceCreationMode] = useState<'features' | 'custom_image' | 'portrait_to_baby'>('features');
  
  // Option 1.1: Generate with Features
  const [selectedEthnicity, setSelectedEthnicity] = useState('');
  const [customEthnicity, setCustomEthnicity] = useState('');
  const [isEthnicityOther, setIsEthnicityOther] = useState(false);
  const [customEthnicityError, setCustomEthnicityError] = useState('');

  const [selectedHair, setSelectedHair] = useState('');
  const [customHair, setCustomHair] = useState('');
  const [isHairOther, setIsHairOther] = useState(false);
  const [customHairError, setCustomHairError] = useState('');

  // Option 1.2: Upload Custom Baby Image
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [customImageError, setCustomImageError] = useState<string>('');

  // Option 1.3: Portrait to Baby
  const [originalPortraitFile, setOriginalPortraitFile] = useState<File | null>(null);
  const [originalPortraitPreview, setOriginalPortraitPreview] = useState<string | null>(null);
  const [originalPortraitError, setOriginalPortraitError] = useState<string>('');

  // --- States for Module 2: Podcast Content ---
  const [contentCreationMode, setContentCreationMode] = useState<'generate_from_topic' | 'audio_script' | 'direct_text_input'>('generate_from_topic');
  
  // Option 2.1: Generate from Topic
  const [topicOfBabyPodcast, setTopicOfBabyPodcast] = useState('');
  const [topicError, setTopicError] = useState('');

  // Voice selection state with default value
  const [selectedVoiceId, setSelectedVoiceId] = useState('en-US-ken');

  // Voice options
  const voiceOptions = [
    { 
      id: 'ken',
      value: 'en-US-ken', 
      label: 'Ken (Default) - Supports: Conversational, Promo, Newscast, Storytelling, Calm, Furious, Angry, Sobbing, Sad, Wizard, Audiobook' 
    },
    {
      id: 'natalie',
      value: 'en-US-natalie',
      label: 'Natalie - Supports: Promo, Narration, Newscast Formal, Meditative, Sad, Angry, Conversational, Newscast Casual, Furious'
    },
    {
      id: 'terrell',
      value: 'en-US-terrell',
      label: 'Terrell - Supports: Inspirational, Narration, Calm, Promo, Conversational'
    },
    {
      id: 'ariana',
      value: 'en-US-ariana',
      label: 'Ariana - Supports: Conversational, Narration'
    }
  ];

  // Option 2.2: Upload Audio Script
  const [audioScriptFile, setAudioScriptFile] = useState<File | null>(null);
  const [audioScriptError, setAudioScriptError] = useState<string>('');

  // Option 2.3: Direct Text Input
  const [textScriptDirectInput, setTextScriptDirectInput] = useState('');
  const [textScriptDirectInputError, setTextScriptDirectInputError] = useState('');

  // Dynamic max character count = current credits * 15
  const maxTextScriptLength = validCredits * 15;

  // --- States for Video Output Settings ---
  const [videoResolution, setVideoResolution] = useState<'540p' | '720p'>('540p');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('9:16');

  // --- General Form States ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' | null }>({ message: '', type: null });

  // Constants for file uploads
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a']; // Example audio types

  const [audioScriptFileBlob, setAudioScriptFileBlob] = useState<Blob | null>(null);
  const [audioScriptFileName, setAudioScriptFileName] = useState<string>('');

  const handleRemoveCustomImage = () => {
    setCustomImageFile(null);
    setCustomImagePreview(null);
    setCustomImageError('');
    const fileInput = document.getElementById('custom-baby-image-input') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRemoveOriginalPortrait = () => {
    setOriginalPortraitFile(null);
    setOriginalPortraitPreview(null);
    setOriginalPortraitError('');
    const fileInput = document.getElementById('original-portrait-input') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const ethnicityOptions = [
    { value: 'asian', label: 'Asian' },
    { value: 'middle_eastern', label: 'Middle Eastern' },
    { value: 'black_african_american', label: 'Black or African American' },
    { value: 'white_caucasian', label: 'White or Caucasian' },
    { value: '_other_', label: 'Others' },
  ];

  const hairOptions = [
    { value: 'bald', label: 'Bald' },
    { value: 'curly', label: 'Curly' },
    { value: 'ponytail', label: 'Ponytail' },
    { value: 'crew_cut', label: 'Crew Cut' },
    { value: 'bob', label: 'Bob' },
    { value: 'bun', label: 'Bun' },
    { value: 'straight', label: 'Straight' },
    { value: '_other_', label: 'Others' },
  ];

  const handleEthnicityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedEthnicity(value);
    setSubmissionStatus({ message: '', type: null });
    if (value === '_other_') {
      setIsEthnicityOther(true);
      setCustomEthnicityError(''); 
    } else {
      setIsEthnicityOther(false);
      setCustomEthnicity(''); 
      setCustomEthnicityError(''); 
    }
  };

  const handleHairChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedHair(value);
    setSubmissionStatus({ message: '', type: null });
    if (value === '_other_') {
      setIsHairOther(true);
      setCustomHairError(''); 
    } else {
      setIsHairOther(false);
      setCustomHair('');
      setCustomHairError(''); 
    }
  };
  
  const handleCustomEthnicityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomEthnicity(value);
    setSubmissionStatus({ message: '', type: null });
    if (value.length > MAX_CUSTOM_FIELD_LENGTH) {
      setCustomEthnicityError(`Exceeded ${MAX_CUSTOM_FIELD_LENGTH} characters. Please shorten.`);
    } else {
      setCustomEthnicityError('');
    }
  };

  const handleCustomHairChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomHair(value);
    setSubmissionStatus({ message: '', type: null });
    if (value.length > MAX_CUSTOM_FIELD_LENGTH) {
      setCustomHairError(`Exceeded ${MAX_CUSTOM_FIELD_LENGTH} characters. Please shorten.`);
    } else {
      setCustomHairError('');
    }
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTopicOfBabyPodcast(value);
    setSubmissionStatus({ message: '', type: null });
    if (value.length > MAX_TOPIC_LENGTH) {
      setTopicError(`Exceeded ${MAX_TOPIC_LENGTH} characters. Please shorten.`);
    } else {
      setTopicError('');
    }
  };

  const handleTextScriptDirectInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTextScriptDirectInput(value);
    setSubmissionStatus({ message: '', type: null });
    if (value.length > maxTextScriptLength) {
      setTextScriptDirectInputError(`Exceeded ${maxTextScriptLength} characters. Please shorten.`);
    } else {
      setTextScriptDirectInputError('');
    }
  };

  const handleCustomEthnicityBlur = () => {
    if (!customEthnicity.trim() && isEthnicityOther) {
        setIsEthnicityOther(false); 
        setSelectedEthnicity(''); 
        setCustomEthnicityError('');
    }
  };

  const handleCustomHairBlur = () => {
    if (!customHair.trim() && isHairOther) {
        setIsHairOther(false);
        setSelectedHair('');
        setCustomHairError('');
    }
  };

  // Handler for creation mode change - RENAME to handleAppearanceModeChange
  const handleAppearanceModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as 'features' | 'custom_image' | 'portrait_to_baby';
    setAppearanceCreationMode(newMode);
    setSubmissionStatus({ message: '', type: null }); 

    // Reset fields from other appearance modes
    if (newMode !== 'features') {
      setSelectedEthnicity(''); 
      setCustomEthnicity('');
      setIsEthnicityOther(false);
      setCustomEthnicityError('');
      setSelectedHair('');
      setCustomHair('');
      setIsHairOther(false);
      setCustomHairError('');
    }
    if (newMode !== 'custom_image') {
      setCustomImageFile(null);
      setCustomImagePreview(null);
      setCustomImageError('');
    }
    if (newMode !== 'portrait_to_baby') {
      setOriginalPortraitFile(null);
      setOriginalPortraitPreview(null);
      setOriginalPortraitError('');
    }
  };

  const handleContentModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as 'generate_from_topic' | 'audio_script' | 'direct_text_input';
    setContentCreationMode(newMode);
    setSubmissionStatus({ message: '', type: null });

    // Reset fields from other content modes
    if (newMode !== 'generate_from_topic') {
      // Topic is now exclusively for 'generate_from_topic'
      // setTopicOfBabyPodcast(''); // Keep if it serves as a general title regardless of content mode
      // setTopicError('');
    }
    if (newMode !== 'audio_script') {
      setAudioScriptFile(null);
      setAudioScriptError('');
    }
    if (newMode !== 'direct_text_input') {
      setTextScriptDirectInput('');
      setTextScriptDirectInputError('');
    }
  };

  // Handler for custom image file change
  const handleCustomImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionStatus({ message: '', type: null });
    const file = event.target.files?.[0];

    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setCustomImageError(`Invalid file type. Please upload a JPEG, PNG, or WebP image.`);
        setCustomImageFile(null);
        setCustomImagePreview(null);
        event.target.value = ''; // Clear the input
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setCustomImageError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setCustomImageFile(null);
        setCustomImagePreview(null);
        event.target.value = ''; // Clear the input
        return;
      }

      setCustomImageFile(file);
      setCustomImageError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCustomImageFile(null);
      setCustomImagePreview(null);
      setCustomImageError('');
    }
  };

  const handleOriginalPortraitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionStatus({ message: '', type: null });
    const file = event.target.files?.[0];

    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setOriginalPortraitError(`Invalid file type. Please upload a JPEG, PNG, or WebP image.`);
        setOriginalPortraitFile(null);
        setOriginalPortraitPreview(null);
        event.target.value = ''; // Clear the input
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setOriginalPortraitError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setOriginalPortraitFile(null);
        setOriginalPortraitPreview(null);
        event.target.value = ''; // Clear the input
        return;
      }

      setOriginalPortraitFile(file);
      setOriginalPortraitError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalPortraitPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setOriginalPortraitFile(null);
      setOriginalPortraitPreview(null);
      setOriginalPortraitError('');
    }
  };

  const handleAudioTrimReady = (blob: Blob, filename: string) => {
    setAudioScriptFileBlob(blob);
    setAudioScriptFileName(filename);
    setAudioScriptError('');
  };

  const handleAudioScriptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionStatus({ message: '', type: null });
    const file = event.target.files?.[0];

    if (file) {
      if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
        setAudioScriptError(`Invalid file type. Allowed: ${ALLOWED_AUDIO_TYPES.join(', ')}.`);
        setAudioScriptFile(null);
        event.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setAudioScriptError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setAudioScriptFile(null);
        event.target.value = '';
        return;
      }

      // Check audio duration, maximum is current credits
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl); // Release immediately
        const maxDuration = validCredits;
        if (audio.duration > maxDuration) {
          const durationCeil = Math.ceil(audio.duration);
          setAudioScriptError(`Current audio duration: ${durationCeil}s. Audio duration cannot exceed ${maxDuration}s.`);
          setAudioScriptFile(null);
          if (event.target) {
            event.target.value = '';
          }
        } else {
          setAudioScriptFile(file);
          setAudioScriptError('');
        }
      };

      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setAudioScriptError('Failed to load audio metadata. Please try a different file.');
        setAudioScriptFile(null);
        if (event.target) {
            event.target.value = '';
        }
      };

      audio.src = objectUrl;

    } else {
      setAudioScriptFile(null);
      setAudioScriptError('');
    }
  };

  const handleVideoResolutionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoResolution(event.target.value as '540p' | '720p');
    setSubmissionStatus({ message: '', type: null });
  };

  const handleAspectRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAspectRatio(event.target.value as '1:1' | '16:9' | '9:16');
    setSubmissionStatus({ message: '', type: null });
  };

  const handleRemoveAudioScript = () => {
    setAudioScriptFile(null);
    setAudioScriptError('');
    const fileInput = document.getElementById('audio-script-input') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  };

  const executeSubmitLogic = async () => {
    setIsSubmitting(true);
    setSubmissionStatus({ message: '✨ Processing your request...', type: 'info' }); 

    const formData = new FormData();

    // Append mode selections
    formData.append('appearanceCreationMode', appearanceCreationMode);
    formData.append('contentCreationMode', contentCreationMode);

    // Append video settings
    formData.append('videoResolution', videoResolution);
    formData.append('aspectRatio', aspectRatio);

    // Append data based on Appearance Mode
    if (appearanceCreationMode === 'features') {
      formData.append('ethnicity', isEthnicityOther ? customEthnicity : selectedEthnicity);
      formData.append('hair', isHairOther ? customHair : selectedHair);
    } else if (appearanceCreationMode === 'custom_image' && customImageFile) {
      formData.append('customBabyImageFile', customImageFile);
    } else if (appearanceCreationMode === 'portrait_to_baby' && originalPortraitFile) {
      formData.append('originalPortraitFile', originalPortraitFile);
    }

    // Append data based on Content Mode
    if (contentCreationMode === 'generate_from_topic') {
      formData.append('topic', topicOfBabyPodcast);
    } else if (contentCreationMode === 'audio_script' && audioScriptFileBlob) {
      const file = new File([audioScriptFileBlob], audioScriptFileName || 'audio_clip.mp3', { type: 'audio/mpeg' });
      formData.append('audioScriptFile', file);
    } else if (contentCreationMode === 'direct_text_input') {
      formData.append('textScriptDirectInput', textScriptDirectInput);
    }
    
    // As per the latest request, topic is only primary for 'generate_from_topic'.
    // If it exists and is NOT 'generate_from_topic' mode, it might be sent as general metadata.
    // For RPC designed according to 5.28.md v2, p_topic is only used when p_content_creation_mode = 'generate_from_topic'.
    // So, we only *need* to send it then. However, sending it always if filled won't break that specific RPC.
    // Let's keep it simple: if topicOfBabyPodcast has a value, and the primary content source is not topic,
    // it is currently not being explicitly appended to FormData.
    // The `topic` field will only be populated in FormData if contentCreationMode === 'generate_from_topic'.

    // Add voice parameters (only in specific modes)
    if (contentCreationMode === 'generate_from_topic' || contentCreationMode === 'direct_text_input') {
      formData.append('voiceId', selectedVoiceId);
    }

    try {
      const response = await fetch('/api/submit-podcast-idea', { 
        method: 'POST',
        body: formData, 
      });
      const result = await response.json();
      
      if (response.ok) {
        setSubmissionStatus({ 
          message: `✅ Your AI baby podcast request has been submitted and is being processed. You can check "My Projects" later for updates. This usually takes about 3 minutes.`, 
          type: 'success' 
        });
        router.refresh(); 
        // Reset form fields
        setAppearanceCreationMode('features');
        setSelectedEthnicity('');
        setCustomEthnicity('');
        setIsEthnicityOther(false);
        setCustomEthnicityError('');
        setSelectedHair('');
        setCustomHair('');
        setIsHairOther(false);
        setCustomHairError('');
        setCustomImageFile(null);
        setCustomImagePreview(null);
        setCustomImageError('');
        setOriginalPortraitFile(null);
        setOriginalPortraitPreview(null);
        setOriginalPortraitError('');
        
        setContentCreationMode('generate_from_topic');
        setTopicOfBabyPodcast('');
        setTopicError('');
        setAudioScriptFile(null);
        setAudioScriptError('');
        setTextScriptDirectInput('');
        setTextScriptDirectInputError('');

        setVideoResolution('540p');
        setAspectRatio('9:16');
        
      } else {
        setSubmissionStatus({ 
          message: `⚠️ ${result.message || 'Unknown server error'}. ${result.details || ''}`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Failed to submit to API route:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setSubmissionStatus({ message: `❌ An unexpected error occurred while submitting: ${errorMessage}. Please try again.`, type: 'error' });
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleAICreatePress = async () => {
    setSubmissionStatus({ message: '', type: null });

    // 首先检查用户是否已登录
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      // 用户未登录，跳转到登录页面
      router.push('/login');
      return;
    }

    // 用户已登录，继续进行积分检查
    if (validCredits <= REQUIRED_CREDITS_PER_PROJECT) {
      setIsCreditsModalOpen(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const youtubeVideos: YouTubeVideo[] = [
    { id: '1', videoId: 'EuWy150zyp8', title: '' },
    { id: '2', videoId: 'Oj_2aW7p0qc', title: '' },
    { id: '3', videoId: 'XKEbMspIrfo', title: '' },
  ];

  useEffect(() => {
    // This isLoading was likely for the "My Projects" section. 
    // You might want to remove or adjust this if it's no longer relevant.
    // For now, I'll keep its basic structure.
    setIsLoading(true); 
    const timer = setTimeout(() => {
      setAllReceivedNotifications([]); // Example: clear notifications on load, or fetch them
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Optimized style classes - consistent with dark theme, enhanced box visibility
  const selectBaseClasses = "w-full px-4 py-3 pr-10 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-white text-sm transition-all duration-200 hover:border-gray-500 appearance-none cursor-pointer backdrop-blur-md";
  const inputBaseClasses = "w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400 text-white text-sm transition-all duration-200 hover:border-gray-500 backdrop-blur-md";
  const textareaBaseClasses = "w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400 text-white text-sm transition-all duration-200 hover:border-gray-500 resize-none backdrop-blur-md";
  const sectionTitleClasses = "text-xl font-bold text-white mb-4 flex items-center gap-3 pb-3 border-b border-gray-600";
  const cardClasses = "bg-gray-800/90 p-8 rounded-2xl shadow-xl border-2 border-gray-600 backdrop-blur-md hover:shadow-2xl hover:border-gray-500 transition-all duration-300";
  const labelClasses = "block text-sm font-semibold text-white mb-3";
  const hintClasses = "text-xs text-gray-300 font-normal ml-1";
  const errorTextClasses = "text-red-400 text-xs mt-2 font-medium";
  const charCountClasses = "text-xs text-gray-400 mt-2 text-right font-medium";
  const radioGroupClasses = "flex flex-wrap gap-4 mb-6";
  const radioLabelClasses = "flex items-center cursor-pointer group";
  const radioInputClasses = "w-4 h-4 text-blue-400 border-2 border-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 bg-transparent transition-all duration-200";
  const radioTextClasses = "ml-3 text-sm text-white group-hover:text-gray-300 transition-colors duration-200";
  const sectionDescriptionClasses = "text-sm text-gray-300 font-normal leading-relaxed mb-6";
  // New: Content box style classes for highlighting functional areas
  const contentBoxClasses = "bg-gray-800/60 p-6 rounded-lg border border-gray-500 shadow-md backdrop-blur-md hover:shadow-lg hover:border-gray-400 transition-all duration-300";

  const isSubmitButtonDisabled = 
    isSubmitting ||
    // Validation for Appearance Mode 'features'
    (appearanceCreationMode === 'features' && (
      !!customEthnicityError || 
      !!customHairError || 
      (isEthnicityOther && !customEthnicity.trim()) || 
      (isHairOther && !customHair.trim()) || 
      (!isEthnicityOther && !selectedEthnicity) || 
      (!isHairOther && !selectedHair)
    )) ||
    // Validation for Appearance Mode 'custom_image'
    (appearanceCreationMode === 'custom_image' && (!customImageFile || !!customImageError)) ||
    // Validation for Appearance Mode 'portrait_to_baby'
    (appearanceCreationMode === 'portrait_to_baby' && (!originalPortraitFile || !!originalPortraitError)) ||
    
    // Validation for Content Mode 'generate_from_topic'
    (contentCreationMode === 'generate_from_topic' && (!topicOfBabyPodcast.trim() || !!topicError)) ||
    // Validation for Content Mode 'audio_script'
    (contentCreationMode === 'audio_script' && (!audioScriptFileBlob || !!audioScriptError)) ||
    // Validation for Content Mode 'direct_text_input'
    (contentCreationMode === 'direct_text_input' && (!textScriptDirectInput.trim() || !!textScriptDirectInputError));

  // Voice Selector Component
  const VoiceSelector = ({ mode }: { mode: 'topic' | 'direct' }) => (
    <div className="space-y-3">
      <label htmlFor={`voiceSelect-${mode}`} className={labelClasses}>
        Select Voice <span className={hintClasses}>(Choose the AI baby&apos;s voice and style)</span>
      </label>
      <div className="relative">
        <select
          id={`voiceSelect-${mode}`}
          value={selectedVoiceId}
          onChange={(e) => setSelectedVoiceId(e.target.value)}
          className={selectBaseClasses}
        >
          {voiceOptions.map(option => (
            <option key={`${mode}-${option.id}`} value={option.value} className="text-wrap">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
      </div>
      <p className="text-xs text-blue-200 mt-2 bg-blue-900/30 p-2 rounded-lg border border-blue-700">
        💡 <strong>Note:</strong> Each voice supports different styles. The available styles are listed with each voice option.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-900">
      {/* Breadcrumb Navigation */}
      <div className="px-6 lg:px-8 pt-2">
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
          <a href="/" className="hover:text-white transition-colors duration-200">
            Home
          </a>
          <span className="text-gray-600">/</span>
          <span className="text-white font-medium">
            AI Baby Podcast Generator
          </span>
        </nav>
      </div>

      <section className="w-full h-full px-6 lg:px-8 pb-6 lg:pb-8">
        {/* 主要内容区域 - 添加背景但不限制宽度 */}
        <div className="w-full bg-gray-800/90 rounded-2xl shadow-xl border-2 border-gray-600 backdrop-blur-md p-6 lg:p-8">


          {/* 模块1和模块2的左右两列布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

          {/* --- MODULE 1: Baby&apos;s Appearance (左列) --- */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-xl p-7 border border-gray-500 shadow-lg backdrop-blur-sm h-full flex flex-col space-y-6 hover:shadow-xl transition-all duration-300">
            <h3 className={sectionTitleClasses}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              Baby&apos;s Appearance
            </h3>
            <p className={sectionDescriptionClasses}>Choose how to generate the baby&apos;s appearance for your AI podcast.</p>

            <div className={radioGroupClasses}>
              <label htmlFor="appearanceFeatures" className={radioLabelClasses}>
                <input
                  type="radio"
                  id="appearanceFeatures"
                  name="appearanceCreationModeOption"
                  value="features"
                  checked={appearanceCreationMode === 'features'}
                  onChange={handleAppearanceModeChange}
                  className={radioInputClasses}
                />
                <span className={radioTextClasses}>Generate with Features</span>
              </label>
              <label htmlFor="appearanceCustomImage" className={radioLabelClasses}>
                <input
                  type="radio"
                  id="appearanceCustomImage"
                  name="appearanceCreationModeOption"
                  value="custom_image"
                  checked={appearanceCreationMode === 'custom_image'}
                  onChange={handleAppearanceModeChange}
                  className={radioInputClasses}
                />
                <span className={radioTextClasses}>Upload Custom Baby Image</span>
              </label>
              <label htmlFor="appearancePortraitToBaby" className={radioLabelClasses}>
                <input
                  type="radio"
                  id="appearancePortraitToBaby"
                  name="appearanceCreationModeOption"
                  value="portrait_to_baby"
                  checked={appearanceCreationMode === 'portrait_to_baby'}
                  onChange={handleAppearanceModeChange}
                  className={radioInputClasses}
                />
                <span className={radioTextClasses}>Convert Portrait to Baby Image <span className="text-yellow-400 text-xs">(+1-2 min processing)</span></span>
              </label>
            </div>

          {/* Conditional Rendering based on appearanceCreationMode */}
          {appearanceCreationMode === 'features' && (
            <div className={contentBoxClasses}>
              <div className="space-y-3">
                <p className={labelClasses}>Select the baby&apos;s ethnicity and hair features for AI generation.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="babyEthnicity" className="block text-sm font-medium text-white mb-3">
                    Baby&apos;s Ethnicity
                  </label>
                  <div className="relative">
                    {isEthnicityOther ? (
                      <>
                        <input
                          id="customBabyEthnicity"
                          type="text"
                          value={customEthnicity}
                          onChange={handleCustomEthnicityChange}
                          onBlur={handleCustomEthnicityBlur}
                          placeholder="Enter custom ethnicity"
                          className={`${inputBaseClasses} ${customEthnicityError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                          maxLength={MAX_CUSTOM_FIELD_LENGTH + 1}
                        />
                        {customEthnicityError && <p className={errorTextClasses}>{customEthnicityError}</p>}
                        <p className={charCountClasses}>{customEthnicity.length}/{MAX_CUSTOM_FIELD_LENGTH}</p>
                      </>
                    ) : (
                      <div className="relative">
                        <select
                          id="babyEthnicity"
                          value={selectedEthnicity}
                          onChange={handleEthnicityChange}
                          className={selectBaseClasses}
                        >
                          <option value="" disabled>Select ethnicity...</option>
                          {ethnicityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label htmlFor="babyHair" className="block text-sm font-medium text-white mb-3">
                    Baby&apos;s Hair
                  </label>
                  <div className="relative">
                    {isHairOther ? (
                       <>
                        <input
                          id="customBabyHair"
                          type="text"
                          value={customHair}
                          onChange={handleCustomHairChange}
                          onBlur={handleCustomHairBlur}
                          placeholder="Enter custom hair type"
                          className={`${inputBaseClasses} ${customHairError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                          maxLength={MAX_CUSTOM_FIELD_LENGTH + 1}
                        />
                        {customHairError && <p className={errorTextClasses}>{customHairError}</p>}
                        <p className={charCountClasses}>{customHair.length}/{MAX_CUSTOM_FIELD_LENGTH}</p>
                      </>
                    ) : (
                      <div className="relative">
                        <select
                          id="babyHair"
                          value={selectedHair}
                          onChange={handleHairChange}
                          className={selectBaseClasses}
                        >
                          <option value="" disabled>Select hair type...</option>
                          {hairOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {appearanceCreationMode === 'custom_image' && (
            <div className={contentBoxClasses}>
              <div className="space-y-3">
                <label htmlFor="custom-baby-image-input" className={labelClasses}>
                  Upload Baby Image <span className={hintClasses}>(Upload your baby image. This image will be used directly.)</span>
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="custom-baby-image-input"
                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="custom-baby-image-input"
                    name="customBabyImageFile"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCustomImageChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-300 font-medium">
                    {customImageFile ? customImageFile.name : 'No file chosen'}
                  </span>
                </div>
                {customImageError && <p className={errorTextClasses}>{customImageError}</p>}
              </div>

              {customImagePreview && (
                <div className="space-y-3">
                  <p className={labelClasses}>Image Preview:</p>
                  <div className="flex items-start gap-4">
                    <div className="relative group">
                      <Image
                        src={customImagePreview}
                        alt="Custom baby preview"
                        width={192}
                        height={192}
                        className="rounded-lg border-2 border-gray-600 object-cover shadow-lg group-hover:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCustomImage}
                      className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-4 py-2 border border-red-500/50 hover:border-red-400 rounded-lg transition-all duration-200 hover:bg-red-500/10"
                      aria-label="Remove uploaded image"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {appearanceCreationMode === 'portrait_to_baby' && (
            <div className={contentBoxClasses}>
              <div className="space-y-3">
                <label htmlFor="original-portrait-input" className={labelClasses}>
                  Upload Your Portrait Photo <span className={hintClasses}>(Upload a portrait photo, and the AI will transform it into a baby image.)</span>
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="original-portrait-input"
                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="original-portrait-input"
                    name="originalPortraitFile"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleOriginalPortraitChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-300 font-medium">
                    {originalPortraitFile ? originalPortraitFile.name : 'No file chosen'}
                  </span>
                </div>
                {originalPortraitError && <p className={errorTextClasses}>{originalPortraitError}</p>}
              </div>

              {originalPortraitPreview && (
                <div className="space-y-3">
                  <p className={labelClasses}>Image Preview:</p>
                  <div className="flex items-start gap-4">
                    <div className="relative group">
                      <Image
                        src={originalPortraitPreview}
                        alt="Original portrait preview"
                        width={192}
                        height={192}
                        className="rounded-lg border-2 border-gray-600 object-cover shadow-lg group-hover:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveOriginalPortrait}
                      className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-4 py-2 border border-red-500/50 hover:border-red-400 rounded-lg transition-all duration-200 hover:bg-red-500/10"
                      aria-label="Remove uploaded image"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>

          {/* --- MODULE 2: Podcast Content (右列) --- */}
          <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-xl p-7 border border-gray-500 shadow-lg backdrop-blur-sm h-full flex flex-col space-y-6 hover:shadow-xl transition-all duration-300">
            <h3 className={sectionTitleClasses}>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              Podcast Content
            </h3>
            <p className={sectionDescriptionClasses}>Choose how to generate the podcast content for your AI baby.</p>

            <div className={radioGroupClasses}>
              <label htmlFor="contentGenerateTopic" className={radioLabelClasses}>
                <input
                  type="radio"
                  id="contentGenerateTopic"
                  name="contentCreationModeOption"
                  value="generate_from_topic"
                  checked={contentCreationMode === 'generate_from_topic'}
                  onChange={handleContentModeChange}
                  className={radioInputClasses}
                />
                <span className={radioTextClasses}>Generate with Topic</span>
              </label>
              <label htmlFor="contentDirectTextInput" className={radioLabelClasses}>
                <input
                  type="radio"
                  id="contentDirectTextInput"
                  name="contentCreationModeOption"
                  value="direct_text_input"
                  checked={contentCreationMode === 'direct_text_input'}
                  onChange={handleContentModeChange}
                  className={radioInputClasses}
                />
                <span className={radioTextClasses}>Direct Podcast Content Input</span>
              </label>
              <label htmlFor="contentAudioScript" className={radioLabelClasses}>
                <input
                  type="radio"
                  id="contentAudioScript"
                  name="contentCreationModeOption"
                  value="audio_script"
                  checked={contentCreationMode === 'audio_script'}
                  onChange={handleContentModeChange}
                  className={radioInputClasses}
                />
                <span className={radioTextClasses}>Upload Custom Audio Script</span>
              </label>
            </div>

            {/* Conditional Rendering based on contentCreationMode */}
            {contentCreationMode === 'generate_from_topic' && (
              <div className={contentBoxClasses}>
                <div className="space-y-3">
                  <label htmlFor="topicOfBabyPodcast" className={labelClasses}>
                    What is the podcast topic? <span className={hintClasses}>(Enter a topic, and the AI will generate a podcast script based on it.)</span>
                  </label>
                  <input
                    type="text"
                    id="topicOfBabyPodcast"
                    name="topicOfBabyPodcast"
                    placeholder="E.g. Politics, Economics, Trade, Global events..."
                    value={topicOfBabyPodcast}
                    onChange={handleTopicChange}
                    className={`${inputBaseClasses} ${topicError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    maxLength={MAX_TOPIC_LENGTH +1 }
                  />
                  <div className={charCountClasses}>
                    {topicOfBabyPodcast.length}/{MAX_TOPIC_LENGTH}
                  </div>
                  {topicError && <p className={errorTextClasses}>{topicError}</p>}
                </div>

                {/* Voice Selector Component */}
                <VoiceSelector mode="topic" />
              </div>
            )}

            {contentCreationMode === 'direct_text_input' && (
              <div className={contentBoxClasses}>
                <div className="space-y-3">
                  <label htmlFor="textScriptDirectInput" className={labelClasses}>
                    Type or paste your script here <span className={hintClasses}>(Directly type or paste your complete podcast script here.)</span>
                  </label>
                  <div className="text-sm text-blue-200 bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                    {validCredits > 0 ? (
                      <span>💡 You can input up to <strong>{maxTextScriptLength}</strong> characters, based on your current credits.</span>
                    ) : (
                      <span className="text-red-400">⚠️ Insufficient credits to input text.</span>
                    )}
                  </div>
                  <textarea
                    id="textScriptDirectInput"
                    name="textScriptDirectInput"
                    rows={8}
                    placeholder={`Enter your podcast script (max ${maxTextScriptLength} characters)...`}
                    value={textScriptDirectInput}
                    onChange={handleTextScriptDirectInputChange}
                    className={`${textareaBaseClasses} min-h-[200px] ${textScriptDirectInputError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    maxLength={maxTextScriptLength > 0 ? maxTextScriptLength : 1}
                    disabled={validCredits === 0}
                  />
                  <div className={charCountClasses}>
                    {textScriptDirectInput.length}/{maxTextScriptLength}
                  </div>
                  {textScriptDirectInputError && <p className={errorTextClasses}>{textScriptDirectInputError}</p>}
                </div>

                {/* Voice Selector Component */}
                <VoiceSelector mode="direct" />
              </div>
            )}

            {contentCreationMode === 'audio_script' && (
              <div className={contentBoxClasses}>
                <div className="space-y-3">
                  <label className={labelClasses}>
                    Upload Audio File <span className={hintClasses}>(Upload your pre-recorded audio script. The AI will process this audio.)</span>
                  </label>
                  <div className="text-sm text-blue-200 bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                    {validCredits > 0 ? (
                      <span>🎵 You can upload up to <strong>{validCredits}</strong> seconds of audio, based on your current credits.</span>
                    ) : (
                      <span className="text-red-400">⚠️ Insufficient credits to upload audio.</span>
                    )}
                  </div>
                  <AudioTrimUpload onAudioReady={handleAudioTrimReady} maxDuration={validCredits} />
                  {audioScriptError && <p className={errorTextClasses}>{audioScriptError}</p>}
                  {audioScriptFileBlob && (
                    <div className="text-green-400 text-sm mt-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      ✅ Audio segment ready for upload: <strong>{audioScriptFileName}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- MODULE 3: Video Output Settings --- */}
        <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-xl p-7 border border-gray-500 shadow-lg backdrop-blur-sm mt-10 space-y-6 hover:shadow-xl transition-all duration-300">
          <h3 className={sectionTitleClasses}>
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            Video Output Settings
          </h3>
          <div className={contentBoxClasses}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Video Resolution Selector */}
                 <div className="space-y-4">
                   <label className={labelClasses}>
                     Video Resolution
                   </label>
                   <div className="space-y-3">
                     <label htmlFor="resolution540p" className={radioLabelClasses}>
                       <input
                         type="radio"
                         id="resolution540p"
                         name="videoResolutionOption"
                         value="540p"
                         checked={videoResolution === '540p'}
                         onChange={handleVideoResolutionChange}
                         className={radioInputClasses}
                       />
                       <span className={radioTextClasses}>540p <span className="text-green-400 text-xs">(Standard)</span></span>
                     </label>
                     <label htmlFor="resolution720p" className={radioLabelClasses}>
                       <input
                         type="radio"
                         id="resolution720p"
                         name="videoResolutionOption"
                         value="720p"
                         checked={videoResolution === '720p'}
                         onChange={handleVideoResolutionChange}
                         className={radioInputClasses}
                       />
                       <span className={radioTextClasses}>720p <span className="text-yellow-400 text-xs">(2x credits)</span></span>
                     </label>
                   </div>
                 </div>

                 {/* Aspect Ratio Selector */}
                 <div className="space-y-4">
                   <label className={labelClasses}>
                     Aspect Ratio
                   </label>
                   <div className="space-y-3">
                     <label htmlFor="aspect9to16" className={radioLabelClasses}>
                       <input
                         type="radio"
                         id="aspect9to16"
                         name="aspectRatioOption"
                         value="9:16"
                         checked={aspectRatio === '9:16'}
                         onChange={handleAspectRatioChange}
                         className={radioInputClasses}
                       />
                       <span className={radioTextClasses}>9:16 <span className="text-blue-400 text-xs">(Vertical/Mobile)</span></span>
                     </label>
                     <label htmlFor="aspect1to1" className={radioLabelClasses}>
                       <input
                         type="radio"
                         id="aspect1to1"
                         name="aspectRatioOption"
                         value="1:1"
                         checked={aspectRatio === '1:1'}
                         onChange={handleAspectRatioChange}
                         className={radioInputClasses}
                       />
                       <span className={radioTextClasses}>1:1 <span className="text-purple-400 text-xs">(Square/Social)</span></span>
                     </label>
                     <label htmlFor="aspect16to9" className={radioLabelClasses}>
                       <input
                         type="radio"
                         id="aspect16to9"
                         name="aspectRatioOption"
                         value="16:9"
                         checked={aspectRatio === '16:9'}
                         onChange={handleAspectRatioChange}
                         className={radioInputClasses}
                       />
                       <span className={radioTextClasses}>16:9 <span className="text-orange-400 text-xs">(Widescreen)</span></span>
                     </label>
                   </div>
                 </div>
               </div>
            </div>
        </div>
        
        {submissionStatus.message && (
          <div
            className={`mt-6 p-4 rounded-lg text-sm font-medium border-l-4 ${
              submissionStatus.type === 'success' ? 'bg-green-500/10 text-green-300 border-green-500/30' :
              submissionStatus.type === 'error' ? 'bg-red-500/10 text-red-300 border-red-500/30' :
              'bg-blue-500/10 text-blue-300 border-blue-500/30'
            }`}
          >
            {submissionStatus.message}
          </div>
        )}

        <div className="mt-12 flex items-center justify-center">
          <button
            className={`flex items-center gap-3 px-12 py-5 rounded-2xl text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl ${
              isSubmitButtonDisabled
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-3xl'
            }`}
            onClick={handleAICreatePress}
            disabled={isSubmitButtonDisabled}
          >
              <Sparkles size={20} />
              <span>{isSubmitting ? 'Processing...' : 'AI Create'}</span>
          </button>
        </div>
        </div>
      </section>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          executeSubmitLogic(); 
        }}
        title="Confirm Podcast Creation"
        message="Are you sure you want to proceed with creating this AI Baby Podcast?"
        confirmText="Yes, Create Now"
        cancelText="Cancel"
      />

      <InsufficientCreditsModal
        isOpen={isCreditsModalOpen}
        onClose={() => setIsCreditsModalOpen(false)}
      />



      {/* "My Projects" section has been removed */}

      {/* Recent Notifications Section */}
      {allReceivedNotifications.length > 0 && !isLoading && (
        <section className="bg-gray-800/90 p-6 rounded-lg shadow-lg border border-gray-600">
          <h3 className="text-xl font-semibold mb-4 text-white">Recent Notifications</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allReceivedNotifications.map((notification) => (
              <div key={notification.id} className={`p-3 rounded-md ${notification.isImportant ? 'bg-purple-800/60 border border-purple-600' : 'bg-gray-700/60 border border-gray-600'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-white">{notification.title}</h4>
                    <p className="text-sm text-gray-300 mt-1">{notification.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Global Loading Overlay (might be for initial page load or other global loading states) */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <p className="text-white text-xl">Loading dashboard...</p>
        </div>
      )}
    </div>
  );
}