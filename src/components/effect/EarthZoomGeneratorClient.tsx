'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Upload, Video, Image as ImageIcon, Sparkles } from 'lucide-react';

interface EarthZoomGeneratorClientProps {
  currentCredits: number;
}

export default function EarthZoomGeneratorClient({ currentCredits }: EarthZoomGeneratorClientProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [zoomSpeed, setZoomSpeed] = useState('medium');
  const [outputFormat, setOutputFormat] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      alert('Please upload an image first');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // 模拟生成进度
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 1000);

    try {
      // 这里将来会调用实际的 Earth Zoom API
      await new Promise(resolve => setTimeout(resolve, 5000)); // 模拟5秒生成时间
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // 生成完成后的处理
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        alert('Earth Zoom video generated successfully!');
      }, 1000);
      
    } catch (error) {
      console.error('Generation error:', error);
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
      alert('Generation failed. Please try again.');
    }
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full h-full px-6 py-2 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="mb-2">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span className="text-gray-600">/</span>
            <a href="/effect" className="hover:text-white transition-colors">
              Effects
            </a>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">
              Earth Zoom Generator
            </span>
          </nav>
        </div>

        {/* Full Screen Layout - SuperMaker.ai Style with spacing */}
        <div className="flex flex-1 gap-4">
            {/* Left Side: Control Panel */}
            <div className="w-[370px] bg-gray-800 flex flex-col rounded-xl border border-gray-700">
              {/* Header Section */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Earth Zoom Generator</h2>
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
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300"
                    >
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300 text-sm">Click to upload image</p>
                      <p className="text-gray-500 text-xs">JPG, PNG • Max 10MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                </div>

                {/* Zoom Speed Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Zoom Speed</label>
                  <select
                    value={zoomSpeed}
                    onChange={(e) => setZoomSpeed(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
                  >
                    <option value="slow">Slow (Cinematic)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="fast">Fast (Dynamic)</option>
                  </select>
                </div>

                {/* Output Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Output Format</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
                  >
                    <option value="16:9">Landscape (16:9) - YouTube</option>
                    <option value="9:16">Portrait (9:16) - TikTok/Instagram</option>
                    <option value="1:1">Square (1:1) - Instagram Posts</option>
                  </select>
                </div>

                {/* Custom Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Custom Description (Optional)</label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe the location or add special instructions..."
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-white placeholder-gray-400 text-sm"
                    rows={4}
                  />
                </div>
              </div>

              {/* Credits Display and Generate Button - Fixed at bottom of left panel */}
              <div className="p-5 border-t border-gray-700">
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-medium text-gray-300">Required Credits</span>
                  <span className="text-sm font-bold text-blue-400">1</span>
                </div>

                {/* Generate Button */}
                <div className="pt-3">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedImage || currentCredits < 1}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isGenerating || !selectedImage || currentCredits < 1
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl'
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
                        <span>Generate Earth Zoom (1 Credit)</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Preview Area */}
            <div className="flex-1 bg-gray-800 flex flex-col rounded-xl border border-gray-700">
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Earth Zoom Preview</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Credits: {currentCredits}</span>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 p-6 flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-24 h-24 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Generating Earth Zoom...</h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">AI is creating your cinematic zoom-out effect from Earth to space. This usually takes 30-60 seconds.</p>

                    {/* Processing animation */}
                    <div className="w-full max-w-xs mb-6">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Processing</span>
                        <span>{Math.round(generationProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        ></div>
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
                      Upload your image to create a stunning Earth zoom effect
                    </p>

                    {/* Progress indicator */}
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            selectedImage ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {selectedImage ? (
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
                            selectedImage ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {selectedImage ? (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-white text-xs">2</span>
                            )}
                          </div>
                          <span className="text-gray-300 text-sm">Configure Settings</span>
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