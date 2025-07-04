'use client';

import { useState } from 'react';

interface HailuoGeneratorClientProps {
  currentCredits: number;
}

export default function HailuoGeneratorClient({ currentCredits }: HailuoGeneratorClientProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (currentCredits < 10) {
      alert('Insufficient credits. You need at least 10 credits to generate a video.');
      return;
    }

    setIsGenerating(true);
    
    // TODO: Implement actual generation logic
    setTimeout(() => {
      setIsGenerating(false);
      alert('Hailuo AI video generation is coming soon!');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">


      {/* Generation Form */}
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">Generate Hailuo AI Video</h3>
        
        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to create..."
            className="w-full h-32 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            maxLength={800}
          />
          <div className="text-right text-sm text-gray-400 mt-1">
            {prompt.length}/800 characters
          </div>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Generation Model
          </label>
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="hailuo-standard"
                name="model"
                value="hailuo"
                defaultChecked
                className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 focus:ring-purple-500"
              />
              <div className="ml-3">
                <span className="text-white font-medium">Hailuo AI</span>
                <span className="text-white text-sm ml-2">(10 credits, $1 for one video)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim() || currentCredits < 10}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
            isGenerating || !prompt.trim() || currentCredits < 10
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transform hover:scale-105 shadow-lg'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Generating Video...
            </div>
          ) : (
            'Generate Hailuo AI Video'
          )}
        </button>



        {/* Coming Soon Notice */}
        <div className="mt-6 p-4 bg-blue-900/40 border border-blue-700 rounded-lg">
          <p className="text-blue-300 text-sm text-center">
            🚧 Hailuo AI video generation is currently in development. Stay tuned for the launch!
          </p>
        </div>
      </div>
    </div>
  );
}
