'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, Upload, Video, Image as ImageIcon, Mic, MicIcon, FileAudio, Type } from 'lucide-react';
import { useToast } from '../common/Toast';

interface LipsyncGeneratorClientProps {
  currentCredits?: number;
}

export default function LipsyncGeneratorClient({ currentCredits = 0 }: LipsyncGeneratorClientProps) {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // Ensure currentCredits is a valid number
  const validCredits = typeof currentCredits === 'number' && !isNaN(currentCredits) ? currentCredits : 0;

  // Audio input mode: 'record', 'upload', or 'text'
  const [audioInputMode, setAudioInputMode] = useState<'record' | 'upload' | 'text'>('upload');

  // Form states
  const [audioPrompt, setAudioPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioPromptError, setAudioPromptError] = useState('');

  // UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreditsUsed, setShowCreditsUsed] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('en-US-ken');

  // Voice options from Baby Podcast
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

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fixed required credits for LipSync
  const getRequiredCredits = () => {
    return 20; // Fixed credit cost for LipSync generation
  };

  // Calculate limits based on credits
  const getMaxRecordingDuration = () => validCredits; // seconds
  const getMaxAudioDuration = () => validCredits; // seconds
  const getMaxTextLength = () => validCredits * 15; // characters

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size cannot exceed 5MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle recording functionality
  const startRecording = async () => {
    try {
      const maxDuration = getMaxRecordingDuration();
      if (maxDuration <= 0) {
        showToast('Insufficient credits for recording', 'error');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingDuration(0);

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      showToast('Failed to access microphone', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  // Handle audio file selection
  const handleAudioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showToast('Audio file size cannot exceed 10MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.startsWith('audio/')) {
        showToast('Please select a valid audio file', 'error');
        return;
      }

      // Check audio duration
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDuration = getMaxAudioDuration();
        const duration = Math.ceil(audio.duration);

        if (audio.duration > maxDuration) {
          showToast(`Audio duration (${duration}s) exceeds limit (${maxDuration}s)`, 'error');
          if (event.target) {
            event.target.value = '';
          }
          return;
        }

        setAudioDuration(audio.duration);
        setAudioFile(file);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        showToast('Failed to load audio file', 'error');
      };

      audio.src = objectUrl;
    }
  };

  // Remove selected files
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeAudio = () => {
    setAudioFile(null);
    setRecordedAudio(null);
    setAudioDuration(0);
    setRecordingDuration(0);
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  // Handle text input change with character limit
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    const maxLength = getMaxTextLength();

    if (value.length > maxLength) {
      setAudioPromptError(`Exceeded ${maxLength} characters. Please shorten.`);
    } else {
      setAudioPromptError('');
    }

    setAudioPrompt(value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Check if user is logged in
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      showToast('Please login to use this feature', 'error');
      router.push('/login');
      return;
    }

    // Validate inputs
    if (!imageFile) {
      showToast('Please upload an image', 'error');
      return;
    }

    if (audioInputMode === 'upload' && !audioFile) {
      showToast('Please upload an audio file', 'error');
      return;
    }

    if (audioInputMode === 'record' && !recordedAudio) {
      showToast('Please record audio first', 'error');
      return;
    }

    if (audioInputMode === 'text' && !audioPrompt.trim()) {
      showToast('Please enter text for speech synthesis', 'error');
      return;
    }

    if (audioInputMode === 'text' && audioPrompt.length > getMaxTextLength()) {
      showToast(`Text exceeds maximum length of ${getMaxTextLength()} characters`, 'error');
      return;
    }

    // Check credits
    const requiredCredits = getRequiredCredits();
    if (validCredits < requiredCredits) {
      showToast(`Insufficient credits, need ${requiredCredits} credits`, 'error');
      return;
    }

    setIsGenerating(true);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('selectedModel', 'lipsync'); // Fixed model
      formData.append('audioInputMode', audioInputMode);
      formData.append('selectedVoice', selectedVoice);

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      if (audioInputMode === 'upload' && audioFile) {
        formData.append('audioFile', audioFile);
      }

      if (audioInputMode === 'record' && recordedAudio) {
        formData.append('recordedAudio', recordedAudio, 'recorded-audio.wav');
      }

      if (audioInputMode === 'text' && audioPrompt.trim()) {
        formData.append('audioPrompt', audioPrompt.trim());
      }

      // Show temporary message
      showToast('This feature is temporarily unavailable, stay tuned!', 'info');

      // TODO: Implement actual API call
      // const response = await fetch('/api/lipsync/generate', {
      //   method: 'POST',
      //   body: formData
      // });

    } catch (error) {
      console.error('Generation error:', error);
      showToast('Generation failed, please try again', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center bg-gray-900 text-white">
      <ToastContainer />
      <div className="w-full h-full px-6 py-2 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="mb-2">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">
              AI Lip Sync Generator
            </span>
          </nav>
        </div>

        {/* Full Screen Layout - SuperMaker.ai Style with spacing */}
        <div className="flex flex-1 gap-4">
            {/* Left Side: Control Panel */}
            <div className="w-[370px] bg-gray-800 flex flex-col rounded-xl border border-gray-700 min-h-0">
              {/* Header Section */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">AI Lip Sync Generator</h2>
              </div>

              {/* Control Panel Content */}
              <div className="flex-1 p-5 overflow-y-auto space-y-5">


                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Image <span className="text-red-500 ml-1">*</span>
                  </label>
                  {!imagePreview ? (
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300"
                    >
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300 text-sm">Click to upload image</p>
                      <p className="text-gray-500 text-xs">JPG, PNG • Max 5MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                {/* Audio Input Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Audio Input <span className="text-red-500 ml-1">*</span></label>

                  {/* Credits Info */}
                  <div className="text-sm text-blue-200 bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-4">
                    {validCredits > 0 ? (
                      <span>🎵 Available limits: <strong>{getMaxAudioDuration()}s</strong> audio, <strong>{getMaxTextLength()}</strong> characters text</span>
                    ) : (
                      <span className="text-red-400">⚠️ Insufficient credits for audio input.</span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      onClick={() => setAudioInputMode('record')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        audioInputMode === 'record'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                          : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <MicIcon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">Record</span>
                    </button>
                    <button
                      onClick={() => setAudioInputMode('upload')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        audioInputMode === 'upload'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                          : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <FileAudio className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">Upload</span>
                    </button>
                    <button
                      onClick={() => setAudioInputMode('text')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        audioInputMode === 'text'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                          : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <Type className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">Text</span>
                    </button>
                  </div>

                  {/* Audio Input Content */}
                  {audioInputMode === 'record' && (
                    <div className="space-y-3">
                      {!recordedAudio ? (
                        <div className="text-center">
                          <button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={validCredits <= 0}
                            className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
                              validCredits <= 0
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : isRecording
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-orange-600 hover:bg-orange-700 text-white'
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <MicIcon className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
                              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                            </div>
                          </button>
                          {isRecording && (
                            <div className="mt-3 text-center">
                              <div className="text-orange-400 text-lg font-bold">
                                {recordingDuration}s / {getMaxRecordingDuration()}s
                              </div>
                              <p className="text-gray-400 text-xs mt-1">Recording... Click to stop</p>
                            </div>
                          )}
                          {!isRecording && validCredits > 0 && (
                            <p className="text-gray-400 text-xs mt-2">Max recording time: {getMaxRecordingDuration()}s</p>
                          )}
                        </div>
                      ) : (
                        <div className="border-2 border-orange-500 bg-orange-500/10 rounded-lg p-4 text-center">
                          <MicIcon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                          <p className="text-white text-sm font-medium">✓ Audio Recorded</p>
                          <button
                            onClick={removeAudio}
                            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {audioInputMode === 'upload' && (
                    <div>
                      {!audioFile ? (
                        <div
                          onClick={() => audioInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300"
                        >
                          <FileAudio className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-300 text-sm">Click to upload audio</p>
                          <p className="text-gray-500 text-xs">MP3, WAV • Max 10MB</p>
                        </div>
                      ) : (
                        <div className="border-2 border-orange-500 bg-orange-500/10 rounded-lg p-4 text-center">
                          <FileAudio className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                          <p className="text-white text-sm font-medium">✓ {audioFile.name}</p>
                          <p className="text-gray-300 text-xs mt-1">Duration: {Math.ceil(audioDuration)}s</p>
                          <button
                            onClick={removeAudio}
                            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioSelect}
                        className="hidden"
                      />
                    </div>
                  )}

                  {audioInputMode === 'text' && (
                    <div>
                      <textarea
                        value={audioPrompt}
                        onChange={handleTextChange}
                        placeholder={`Enter text to convert to speech (max ${getMaxTextLength()} characters)...`}
                        className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-white placeholder-gray-400 text-sm ${
                          audioPromptError ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-800'
                        }`}
                        rows={4}
                        maxLength={getMaxTextLength() > 0 ? getMaxTextLength() : 1}
                        disabled={validCredits === 0}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${audioPromptError ? 'text-red-400' : 'text-gray-500'}`}>
                          {audioPrompt.length}/{getMaxTextLength()}
                        </span>
                        <span className="text-gray-500 text-xs">AI will generate speech from this text</span>
                      </div>
                      {audioPromptError && (
                        <p className="text-red-400 text-xs mt-1">{audioPromptError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Voice Selection - Only show for text mode */}
                {audioInputMode === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Voice Selection <span className="text-gray-400 text-xs">(Choose the AI voice and style)</span>
                    </label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white text-sm"
                    >
                      {voiceOptions.map(option => (
                        <option key={option.id} value={option.value} className="text-wrap">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Credits Display and Generate Button - Fixed at bottom of left panel */}
              <div className="p-5 border-t border-gray-700">
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-medium text-gray-300">Required Credits</span>
                  <span className="text-sm font-bold text-orange-400">{getRequiredCredits()}</span>
                </div>

                {/* Generate Button */}
                <div className="pt-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isGenerating ||
                      !imageFile ||
                      (audioInputMode === 'upload' && !audioFile) ||
                      (audioInputMode === 'record' && !recordedAudio) ||
                      (audioInputMode === 'text' && (!audioPrompt.trim() || !!audioPromptError)) ||
                      validCredits < getRequiredCredits()
                    }
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isGenerating ||
                      !imageFile ||
                      (audioInputMode === 'upload' && !audioFile) ||
                      (audioInputMode === 'record' && !recordedAudio) ||
                      (audioInputMode === 'text' && (!audioPrompt.trim() || !!audioPromptError)) ||
                      validCredits < getRequiredCredits()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Sparkles size={16} />
                        <span>Generate LipSync ({getRequiredCredits()} Credits)</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Preview Area */}
            <div className="flex-1 bg-gray-800 flex flex-col rounded-xl border border-gray-700 min-h-0">
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">LipSync Preview</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Credits: {validCredits}</span>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 p-6 flex items-center justify-center min-h-0">

                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-24 h-24 bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Generating LipSync Video...</h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">AI is processing your media and creating lip-synchronized video. This usually takes 1-3 minutes.</p>

                    {/* Processing animation */}
                    <div className="w-full max-w-xs mb-6">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Processing</span>
                        <span>Please wait...</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Ready to Generate</h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                      Upload your image and add audio to generate lip-synchronized video
                    </p>

                    {/* Progress indicator */}
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            imageFile ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {imageFile ? (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-white text-xs">1</span>
                            )}
                          </div>
                          <span className="text-gray-300 text-sm">Upload Image</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            (audioInputMode === 'upload' && audioFile) ||
                            (audioInputMode === 'record' && recordedAudio) ||
                            (audioInputMode === 'text' && audioPrompt.trim())
                              ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {(audioInputMode === 'upload' && audioFile) ||
                            (audioInputMode === 'record' && recordedAudio) ||
                            (audioInputMode === 'text' && audioPrompt.trim()) ? (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-white text-xs">2</span>
                            )}
                          </div>
                          <span className="text-gray-300 text-sm">
                            Add Audio ({audioInputMode === 'record' ? 'Record' : audioInputMode === 'upload' ? 'Upload' : 'Text'})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
