'use client';

import { useState } from 'react';
import { MEDIA_DISPLAY_MODE } from '../../config/media';

interface MediaLinkProps {
  src: string;
  alt: string;
  type: 'image' | 'video' | 'gif';
  width?: number;
  height?: number;
  className?: string;
  placeholder?: React.ReactNode;
  title?: string;
}

export default function MediaLink({ 
  src, 
  alt, 
  type, 
  width, 
  height, 
  className = '', 
  placeholder,
  title 
}: MediaLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(src);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const getFileExtension = () => {
    if (type === 'video') return '.mp4';
    if (type === 'gif') return '.gif';
    return '.jpg';
  };

  const getFileName = () => {
    const urlParts = src.split('/');
    const fileName = urlParts[urlParts.length - 1];
    return fileName || `${alt.toLowerCase().replace(/\s+/g, '-')}${getFileExtension()}`;
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'gif':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v3m0 0v8a1 1 0 001 1h3M7 4h10M5 8h14M5 8V5a1 1 0 011-1h2a1 1 0 011 1v3" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  if (!MEDIA_DISPLAY_MODE.SHOW_LINKS) {
    // 如果不显示链接，显示实际的媒体内容
    if (type === 'image') {
      return (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={{ objectFit: 'cover' }}
          suppressHydrationWarning={true}
        />
      );
    } else if (type === 'video') {
      return (
        <video
          src={src}
          width={width}
          height={height}
          className={className}
          controls
          style={{ objectFit: 'cover' }}
        />
      );
    } else if (type === 'gif') {
      return (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={{ objectFit: 'cover' }}
          suppressHydrationWarning={true}
        />
      );
    }
    return placeholder ? <>{placeholder}</> : null;
  }

  return (
    <div 
      className={`relative group border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors duration-200 ${className}`}
      style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : 'auto' }}
    >
      {/* 媒体类型指示器 */}
      <div className="absolute top-2 left-2 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-600">
        {getTypeIcon()}
        <span className="uppercase">{type}</span>
      </div>

      {/* 复制按钮 */}
      <button
        onClick={handleCopyLink}
        className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        title="Copy link"
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>

      {/* 主要内容区域 */}
      <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-center">
        {/* 文件图标 */}
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 text-gray-500">
          {getTypeIcon()}
        </div>

        {/* 文件信息 */}
        <div className="space-y-1">
          {title && (
            <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
          )}
          <p className="text-xs text-gray-600">{alt}</p>
          <p className="text-xs font-mono text-blue-600 break-all">{getFileName()}</p>
          {width && height && (
            <p className="text-xs text-gray-500">{width} × {height}</p>
          )}
        </div>

        {/* 链接预览 */}
        <div className="mt-3 w-full">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>View in R2</span>
          </a>
        </div>
      </div>

      {/* 复制成功提示 */}
      {copied && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          Link copied!
        </div>
      )}
    </div>
  );
}

// 快速创建不同类型的媒体链接组件
export const ImageLink = (props: Omit<MediaLinkProps, 'type'>) => (
  <MediaLink {...props} type="image" />
);

export const VideoLink = (props: Omit<MediaLinkProps, 'type'>) => (
  <MediaLink {...props} type="video" />
);

export const GifLink = (props: Omit<MediaLinkProps, 'type'>) => (
  <MediaLink {...props} type="gif" />
);

// 媒体网格组件，用于展示多个媒体链接
interface MediaGridProps {
  items: Array<{
    src: string;
    alt: string;
    type: 'image' | 'video' | 'gif';
    title?: string;
    width?: number;
    height?: number;
  }>;
  columns?: number;
  className?: string;
}

export function MediaGrid({ items, columns = 4, className = '' }: MediaGridProps) {
  return (
    <div className={`grid gap-4 ${
      columns === 1 ? 'grid-cols-1' :
      columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
      columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    } ${className}`}>
      {items.map((item, index) => (
        <MediaLink
          key={index}
          src={item.src}
          alt={item.alt}
          type={item.type}
          title={item.title}
          width={item.width}
          height={item.height}
        />
      ))}
    </div>
  );
}
