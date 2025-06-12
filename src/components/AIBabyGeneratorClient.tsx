'use client';

import { useState, useRef } from 'react';

interface AIBabyGeneratorClientProps {
  currentCredits: number;
}

export default function AIBabyGeneratorClient({ currentCredits }: AIBabyGeneratorClientProps) {
  const [fatherImage, setFatherImage] = useState<File | null>(null);
  const [motherImage, setMotherImage] = useState<File | null>(null);
  const [fatherPreview, setFatherPreview] = useState<string | null>(null);
  const [motherPreview, setMotherPreview] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBaby, setGeneratedBaby] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<'father' | 'mother' | null>(null);

  const fatherInputRef = useRef<HTMLInputElement>(null);
  const motherInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File, type: 'father' | 'mother') => {
    // 校验文件类型
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('仅支持 PNG、JPG、WEBP 格式的图片');
      return;
    }
    // 校验文件大小（最大 3MB）
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`图片大小不能超过 3MB，当前为 ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }
    // 生成预览
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'father') {
        setFatherImage(file);
        setFatherPreview(result);
      } else {
        setMotherImage(file);
        setMotherPreview(result);
      }
    };
    reader.onerror = (e) => {
      alert('读取图片失败，请重试');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent, type: 'father' | 'mother') => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'father' | 'mother') => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0], type);
    }
  };

  const handleGenerate = async () => {
    if (!fatherImage || !motherImage || !selectedGender) {
      alert('请上传父亲和母亲的照片，并选择性别');
      return;
    }

    if (currentCredits < 1) {
      alert('积分不足，请先充值');
      return;
    }

    setIsGenerating(true);
    
    // 模拟生成过程
    setTimeout(() => {
      // 这里应该调用实际的API
      setGeneratedBaby('/api/placeholder/300/300'); // 临时占位符
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="bg-gray-800/90 border border-gray-600 rounded-2xl p-8 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">AI Baby Generator</h2>
          <p className="text-gray-300">Upload parent photos to generate your future baby</p>
        </div>

        {/* Main content area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left side: Upload area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload area */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Father photo upload */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-white">
                  Father <span className="text-red-400">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-0 text-center cursor-pointer transition-colors bg-gray-700/30 w-full h-48 flex items-center justify-center overflow-hidden relative ${
                    dragOver === 'father'
                      ? 'border-blue-400 bg-blue-900/20'
                      : 'border-gray-600 hover:border-blue-500'
                  }`}
                  onClick={() => fatherInputRef.current?.click()}
                  onDragOver={(e) => handleDragOver(e, 'father')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'father')}
                >
                  {fatherPreview ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={fatherPreview}
                          alt="Father preview"
                          className="object-contain max-w-full max-h-full m-auto block"
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Father
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFatherImage(null);
                          setFatherPreview(null);
                          if (fatherInputRef.current) {
                            fatherInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all duration-200 hover:scale-110 z-20"
                        style={{ zIndex: 20 }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-gray-300 font-medium">Upload Image</p>
                      <p className="text-gray-500 text-sm mt-2">Click or drag to upload father's photo</p>
                      <p className="text-gray-400 text-xs mt-1">最大 3MB • PNG, JPG, WEBP</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fatherInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileChange(file, 'father');
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>

              {/* Mother photo upload */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-white">
                  Mother <span className="text-red-400">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-0 text-center cursor-pointer transition-colors bg-gray-700/30 w-full h-48 flex items-center justify-center overflow-hidden relative ${
                    dragOver === 'mother'
                      ? 'border-pink-400 bg-pink-900/20'
                      : 'border-gray-600 hover:border-pink-500'
                  }`}
                  onClick={() => motherInputRef.current?.click()}
                  onDragOver={(e) => handleDragOver(e, 'mother')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'mother')}
                >
                  {motherPreview ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={motherPreview}
                          alt="Mother preview"
                          className="object-contain max-w-full max-h-full m-auto block"
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Mother
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMotherImage(null);
                          setMotherPreview(null);
                          if (motherInputRef.current) {
                            motherInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all duration-200 hover:scale-110 z-20"
                        style={{ zIndex: 20 }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-pink-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-gray-300 font-medium">Upload Image</p>
                      <p className="text-gray-500 text-sm mt-2">Click or drag to upload mother's photo</p>
                      <p className="text-gray-400 text-xs mt-1">最大 3MB • PNG, JPG, WEBP</p>
                    </div>
                  )}
                </div>
                <input
                  ref={motherInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileChange(file, 'mother');
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>
            </div>

            {/* Gender selection and generate button */}
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-white mb-4">
                  Choose Your Future Child's Gender:
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Gender</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                </select>
              </div>

              <div>
                <button
                  onClick={handleGenerate}
                  disabled={!fatherImage || !motherImage || !selectedGender || isGenerating}
                  className={`w-full px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                    !fatherImage || !motherImage || !selectedGender || isGenerating
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-lg'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </div>
                  ) : (
                    'Generate'
                  )}
                </button>
                <p className="text-gray-400 text-sm mt-2 text-center">
                  Cost: 1 Credit | Current Credits: {currentCredits}
                </p>
              </div>
            </div>
          </div>

          {/* Right side: Preview box */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/50 rounded-2xl p-6 h-full backdrop-blur-sm shadow-xl">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  <h3 className="text-xl font-bold text-center">Preview</h3>
                </div>
              </div>

              {/* Preview content */}
              {generatedBaby ? (
                <div className="space-y-6">
                  <div className="relative group">
                    <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 p-1 rounded-2xl shadow-2xl">
                      <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden">
                        <img
                          src={generatedBaby}
                          alt="Generated baby"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="text-center space-y-4">
                    <h4 className="text-lg font-bold text-white">Your Future Baby</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Download</span>
                        </div>
                      </button>
                      <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          <span>Share</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setGeneratedBaby(null)}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Generate Again</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center border-2 border-dashed border-gray-500/50">
                      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-3">Your Future Baby</h4>
                  <p className="text-gray-400 text-sm mb-8 max-w-xs">Upload parent photos and select gender to generate your future baby preview</p>

                  {/* Enhanced Progress indicator */}
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${fatherImage ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30' : 'bg-gray-600'}`}>
                          {fatherImage && (
                            <svg className="w-3 h-3 text-white m-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${fatherImage ? 'text-blue-400' : 'text-gray-500'}`}>Father Photo</span>
                      </div>
                      {fatherImage && <span className="text-xs text-blue-400">✓</span>}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${motherImage ? 'bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg shadow-pink-500/30' : 'bg-gray-600'}`}>
                          {motherImage && (
                            <svg className="w-3 h-3 text-white m-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${motherImage ? 'text-pink-400' : 'text-gray-500'}`}>Mother Photo</span>
                      </div>
                      {motherImage && <span className="text-xs text-pink-400">✓</span>}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${selectedGender ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30' : 'bg-gray-600'}`}>
                          {selectedGender && (
                            <svg className="w-3 h-3 text-white m-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${selectedGender ? 'text-purple-400' : 'text-gray-500'}`}>
                          Gender: {selectedGender ? (selectedGender === 'boy' ? 'Boy' : 'Girl') : 'Not Selected'}
                        </span>
                      </div>
                      {selectedGender && <span className="text-xs text-purple-400">✓</span>}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full mt-6">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(((fatherImage ? 1 : 0) + (motherImage ? 1 : 0) + (selectedGender ? 1 : 0)) / 3 * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((fatherImage ? 1 : 0) + (motherImage ? 1 : 0) + (selectedGender ? 1 : 0)) / 3 * 100}%` }}
                      ></div>
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
