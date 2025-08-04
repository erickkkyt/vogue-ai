'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, Upload, Video, Image as ImageIcon, Wand2, Mic, Play, Download, FileText } from 'lucide-react';
import { useToast } from '../common/Toast';

interface LipsyncGeneratorClientProps {
  currentCredits?: number;
}

export default function LipsyncGeneratorClient({ currentCredits = 0 }: LipsyncGeneratorClientProps) {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // Ensure currentCredits is a valid number
  const validCredits = typeof currentCredits === 'number' && !isNaN(currentCredits) ? currentCredits : 0;

  // Mode selection: 'image-audio' or 'video-audio'
  const [generationMode, setGenerationMode] = useState<'image-audio' | 'video-audio'>('image-audio');

  // Model selection: 'lipsync' or 'lipsync_fast'
  const [selectedModel, setSelectedModel] = useState<'lipsync' | 'lipsync_fast'>('lipsync');

  // Audio input mode: 'text', 'upload', 'record'
  const [audioInputMode, setAudioInputMode] = useState<'text' | 'upload' | 'record'>('text');

  // Form states
  const [audioPrompt, setAudioPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Calculate required credits based on model
  const getRequiredCredits = () => {
    return selectedModel === 'lipsync' ? 25 : 15;
  };

  // Handle form submission
  const handleSubmit = async () => {
    showToast('This feature is temporarily unavailable, stay tuned!', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer />

      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 overflow-hidden">
        <div className="relative w-full px-6 py-12">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <nav className="inline-flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">
                Home
              </Link>
              <span className="text-gray-600 mx-1">›</span>
              <span className="text-orange-400 font-medium">LipSync Generator</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
              <Video className="text-white" size={32} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
              AI Lip Sync Generator
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform your content with AI-powered lip synchronization. Upload your media and let our advanced AI create perfect lip-sync videos in minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1: Upload Avatar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 shadow-lg">
                      1
                    </div>
                    <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Upload Your Media
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Choose an image or video to bring to life
                  </p>
                </div>

                {/* Upload Area */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-600/50 rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto">
                      <ImageIcon className="text-gray-400" size={36} />
                    </div>
                    <p className="text-white font-semibold mb-2 text-lg">Click or drag image here</p>
                    <p className="text-gray-400 text-sm">Support Format: JPG, PNG, WebP • Max 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Audio Input */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 shadow-lg">
                      2
                    </div>
                    <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent flex-1"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Add Your Audio
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Enter text, upload audio, or record your voice
                  </p>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={audioPrompt}
                    onChange={(e) => setAudioPrompt(e.target.value)}
                    placeholder="Type what you want the avatar to say..."
                    className="w-full h-36 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none backdrop-blur-sm transition-all duration-300"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Generate */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 shadow-lg">
                      3
                    </div>
                    <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Generate
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Create your AI lip-sync video
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-2xl hover:shadow-green-500/25 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg relative overflow-hidden group"
                >
                  <Sparkles size={24} className="animate-pulse" />
                  <span>Generate AI Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
