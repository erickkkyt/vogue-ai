'use client';

import { useState, useRef } from 'react';

interface Props {
  onAudioReady: (blob: Blob, filename: string) => void;
  maxDuration?: number; // 选区时长上限，秒
}

export default function SimpleAudioTrimUpload({ onAudioReady, maxDuration }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [durErr, setDurErr] = useState('');
  const [outUrl, setOutUrl] = useState<string>();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErr('');
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 5 * 1024 * 1024) {
      setErr('File larger than 5 MB');
      return;
    }

    setFile(f);
    setOutUrl(undefined);
    
    const url = URL.createObjectURL(f);
    setAudioUrl(url);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      setDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, maxDuration || dur));
    }
  };

  const setCurrentTimeAsStart = () => {
    if (audioRef.current) {
      const newStartTime = audioRef.current.currentTime;
      setStartTime(newStartTime);
      
      // 检查是否超过时长限制
      if (maxDuration && endTime - newStartTime > maxDuration) {
        setDurErr(`Selected segment exceeds ${maxDuration}s limit`);
      } else {
        setDurErr('');
      }
    }
  };

  const setCurrentTimeAsEnd = () => {
    if (audioRef.current) {
      const newEndTime = audioRef.current.currentTime;
      setEndTime(newEndTime);
      
      // 检查是否超过时长限制
      if (maxDuration && newEndTime - startTime > maxDuration) {
        setDurErr(`Selected segment exceeds ${maxDuration}s limit`);
      } else {
        setDurErr('');
      }
    }
  };

  const handleStartTimeChange = (value: number) => {
    setStartTime(value);
    if (maxDuration && endTime - value > maxDuration) {
      setDurErr(`Selected segment exceeds ${maxDuration}s limit`);
    } else {
      setDurErr('');
    }
  };

  const handleEndTimeChange = (value: number) => {
    setEndTime(value);
    if (maxDuration && value - startTime > maxDuration) {
      setDurErr(`Selected segment exceeds ${maxDuration}s limit`);
    } else {
      setDurErr('');
    }
  };

  const trim = async () => {
    if (!file) return;

    const trimDuration = endTime - startTime;
    if (maxDuration && trimDuration > maxDuration) {
      setErr(`Selected segment exceeds ${maxDuration}s limit`);
      return;
    }

    if (startTime >= endTime) {
      setErr('End time must be greater than start time');
      return;
    }

    setBusy(true);
    setErr('');
    
    try {
      // 解码音频文件
      const buf = await file.arrayBuffer();
      const ctx = new OfflineAudioContext(1, 1, 44100);
      const audio = await ctx.decodeAudioData(buf);

      const sr = audio.sampleRate;
      const ch = audio.numberOfChannels;
      const beg = Math.floor(startTime * sr);
      const end = Math.floor(endTime * sr);
      const len = end - beg;

      // 创建裁剪后的音频缓冲区
      const clip = ctx.createBuffer(ch, len, sr);
      for (let c = 0; c < ch; c++) {
        clip.getChannelData(c).set(
          audio.getChannelData(c).slice(beg, end),
        );
      }

      // 转换为 WAV 格式
      const arrayBuffer = audioBufferToWav(clip);
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setOutUrl(url);
      
      // 生成输出文件名
      const originalName = file.name.replace(/\.[^.]+$/, '');
      const outputFilename = `${originalName}_clip.wav`;
      
      onAudioReady(blob, outputFilename);
      
    } catch (e: unknown) {
      console.error('Trim error:', e);
      setErr('Trim failed: ' + (e instanceof Error ? e.message : 'unknown'));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFile(null);
    setAudioUrl('');
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setOutUrl(undefined);
    setErr('');
    setDurErr('');
  };

  return (
    <div className="space-y-4">
      {/* 文件选择 - 保持原样式 */}
      <div className="mt-1 flex items-center">
        <label
          htmlFor="audio-upload-input"
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-150 ease-in-out mr-3"
        >
          Choose File
        </label>
        <input
          type="file"
          id="audio-upload-input"
          accept="audio/*"
          onChange={handleFile}
          className="sr-only"
        />
        <span className="text-sm text-gray-400 flex items-center gap-2">
          {file ? (
            <>
              {file.name}
              <button
                type="button"
                onClick={reset}
                className="text-sm text-red-500 hover:text-red-400 px-3 py-1 border border-red-500 hover:border-red-400 rounded-md transition-colors"
                aria-label="Remove uploaded audio"
              >
                Remove
              </button>
            </>
          ) : 'No file chosen'}
        </span>
      </div>

      {/* 音频播放器 */}
      {audioUrl && (
        <>
          <audio
            ref={audioRef}
            controls
            src={audioUrl}
            className="w-full"
            onLoadedMetadata={handleLoadedMetadata}
          />

          {/* 时间选择控制 - 保持原来的紧凑布局 */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm">Start:</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={duration}
                  value={startTime.toFixed(1)}
                  onChange={(e) => handleStartTimeChange(parseFloat(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={setCurrentTimeAsStart}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                >
                  Use Current
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm">End:</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={duration}
                  value={endTime.toFixed(1)}
                  onChange={(e) => handleEndTimeChange(parseFloat(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={setCurrentTimeAsEnd}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                >
                  Use Current
                </button>
              </div>
            </div>

            {/* 选择信息显示 - 保持原来的简洁样式 */}
            <p className="text-sm text-gray-600">
              Selection: {startTime.toFixed(1)}s - {endTime.toFixed(1)}s 
              (Duration: {(endTime - startTime).toFixed(1)}s)
            </p>
          </div>
          
          {/* 时长限制错误提示 */}
          {durErr && <p className="text-red-500 text-xs">{durErr}</p>}
        </>
      )}

      {/* 按钮 - 保持原样式 */}
      <div className="flex gap-2">
        <button
          disabled={!file || startTime >= endTime || busy || !!durErr}
          onClick={trim}
          className="px-4 py-1.5 bg-purple-600 text-white rounded disabled:opacity-40"
        >
          {busy ? 'Trimming…' : 'Trim & Preview'}
        </button>
      </div>

      {/* 输出结果 - 保持原样式 */}
      {outUrl && (
        <div className="mt-3">
          <p className="text-sm text-green-600 mb-2">Trimmed audio:</p>
          <audio controls src={outUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}

// WAV 编码函数
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numberOfChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;
  const bufferSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  // 写入字符串到 ArrayBuffer
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // WAV 文件头部
  writeString(0, 'RIFF');                          // ChunkID
  view.setUint32(4, bufferSize - 8, true);         // ChunkSize
  writeString(8, 'WAVE');                          // Format
  writeString(12, 'fmt ');                         // Subchunk1ID
  view.setUint32(16, 16, true);                    // Subchunk1Size (PCM = 16)
  view.setUint16(20, 1, true);                     // AudioFormat (PCM = 1)
  view.setUint16(22, numberOfChannels, true);      // NumChannels
  view.setUint32(24, sampleRate, true);            // SampleRate
  view.setUint32(28, byteRate, true);              // ByteRate
  view.setUint16(32, blockAlign, true);            // BlockAlign
  view.setUint16(34, bitsPerSample, true);         // BitsPerSample
  writeString(36, 'data');                         // Subchunk2ID
  view.setUint32(40, dataSize, true);              // Subchunk2Size

  // 写入音频数据
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      // 将浮点数样本转换为 16 位整数
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      const intSample = sample * 0x7fff; // 转换为 16 位范围
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}