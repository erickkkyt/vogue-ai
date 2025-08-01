// Cloudflare R2 媒体文件配置
// 基础URL - 你的R2公共域名
const R2_BASE_URL = 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev';

// 媒体展示模式配置
export const MEDIA_DISPLAY_MODE = {
  SHOW_LINKS: false, // 设置为 true 显示链接，false 显示实际媒体
  SHOW_PLACEHOLDERS: true, // 是否显示占位符
};

// AI Baby Generator 媒体文件
export const AI_BABY_GENERATOR_MEDIA = {
  hero: {
    demoVideo: `${R2_BASE_URL}/ai-baby-generator/hero/demo-video.mp4`,
    demoPreview: `${R2_BASE_URL}/ai-baby-generator/hero/demo-preview.gif`,
  },
  examples: {
    parents: {
      parent1Demo: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/fat%201.png',
      parent2Demo: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/mom%201.png',
      parent1Family1: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/fat%202.png',
      parent2Family1: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/mom%202.png',
      parent1Family2: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/fat%203.png',
      parent2Family2: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/mom%203.png',
      parent1Family3: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/fat%204.png',
      parent2Family3: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/mom%204.png',
      parent1Family4: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/fat%201.png',
      parent2Family4: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/mom%201.png',
    },
    babies: {
      babyDemo: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/c0js0sn75hrm80cqcxdstpqkyg',
      resultDemo: `${R2_BASE_URL}/ai-baby-generator/examples/babies/result-demo.jpg`,
      babyFamily1: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/fg7kks4b6hrme0cqcyv8v8ezgr',
      babyFamily2: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/jftmpq03psrmc0cqd058bsrxn0',
      babyFamily3: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/901wfnm3ehrma0cqd0b80hvger',
      babyFamily4: 'https://pub-7cd78fc1ea1c48a29b472661774035a5.r2.dev/c0js0sn75hrm80cqcxdstpqkyg',
    },
  },
  process: {
    uploadDemo: `${R2_BASE_URL}/ai-baby-generator/process/upload-demo.gif`,
    generationProcess: `${R2_BASE_URL}/ai-baby-generator/process/generation-process.gif`,
    aiAnalysis: `${R2_BASE_URL}/ai-baby-generator/process/ai-analysis.mp4`,
  },
};

// AI Baby Podcast 媒体文件
export const AI_BABY_PODCAST_MEDIA = {
  hero: {
    featuredVideo: 'https://pub-da4c030f32c04b9f98cd49773cbf82b5.r2.dev/Bobby%20Lee%20and%20Andrew%20Santino%20Funny%20talking%20baby%20podcast.%20%20%23funny%20%23podcast%20%23bobbylee.mp4',
    demoPreview: `${R2_BASE_URL}/ai-baby-podcast/hero/demo-preview.gif`,
  },
  examples: {
    viralVideos: {
      example1: `${R2_BASE_URL}/ai-baby-podcast/examples/viral-videos/example1.mp4`,
      example2: `${R2_BASE_URL}/ai-baby-podcast/examples/viral-videos/example2.mp4`,
      example3: `${R2_BASE_URL}/ai-baby-podcast/examples/viral-videos/example3.mp4`,
      example4: `${R2_BASE_URL}/ai-baby-podcast/examples/viral-videos/example4.mp4`,
    },
    thumbnails: {
      thumb1: `${R2_BASE_URL}/ai-baby-podcast/examples/thumbnails/thumb1.jpg`,
      thumb2: `${R2_BASE_URL}/ai-baby-podcast/examples/thumbnails/thumb2.jpg`,
      thumb3: `${R2_BASE_URL}/ai-baby-podcast/examples/thumbnails/thumb3.jpg`,
      thumb4: `${R2_BASE_URL}/ai-baby-podcast/examples/thumbnails/thumb4.jpg`,
    },
  },
  process: {
    avatarGeneration: `${R2_BASE_URL}/ai-baby-podcast/process/avatar-generation.gif`,
    scriptWriting: `${R2_BASE_URL}/ai-baby-podcast/process/script-writing.gif`,
    voiceGeneration: `${R2_BASE_URL}/ai-baby-podcast/process/voice-generation.gif`,
    animationEditing: `${R2_BASE_URL}/ai-baby-podcast/process/animation-editing.gif`,
  },
  features: {
    aiAnimation: `${R2_BASE_URL}/ai-baby-podcast/features/ai-animation.gif`,
    voiceSync: `${R2_BASE_URL}/ai-baby-podcast/features/voice-sync.gif`,
  },
};

// Hailuo AI Video Generator 媒体文件
export const HAILUO_AI_VIDEO_GENERATOR_MEDIA = {
  hero: {
    transformationDemo: `${R2_BASE_URL}/hailuo-ai-video-generator/hero/transformation-demo.mp4`,
    demoPreview: `${R2_BASE_URL}/hailuo-ai-video-generator/hero/demo-preview.gif`,
  },
  transformations: {
    artistic: {
      beforeVangogh: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/artistic/before-vangogh.jpg`,
      afterVangogh: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/artistic/after-vangogh.jpg`,
      beforePicasso: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/artistic/before-picasso.jpg`,
      afterPicasso: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/artistic/after-picasso.jpg`,
      beforeRenaissance: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/artistic/before-renaissance.jpg`,
      afterRenaissance: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/artistic/after-renaissance.jpg`,
    },
    age: {
      childToAdultBefore: `${R2_BASE_URL}/face-to-many-kontext/transformations/age/child-to-adult-before.jpg`,
      childToAdultAfter: `${R2_BASE_URL}/face-to-many-kontext/transformations/age/child-to-adult-after.jpg`,
      adultToElderBefore: `${R2_BASE_URL}/face-to-many-kontext/transformations/age/adult-to-elder-before.jpg`,
      adultToElderAfter: `${R2_BASE_URL}/face-to-many-kontext/transformations/age/adult-to-elder-after.jpg`,
      timeProgressionBefore: `${R2_BASE_URL}/face-to-many-kontext/transformations/age/time-progression-before.jpg`,
      timeProgressionAfter: `${R2_BASE_URL}/face-to-many-kontext/transformations/age/time-progression-after.jpg`,
    },
    context: {
      casualToProfessionalBefore: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/context/casual-to-professional-before.jpg`,
      casualToProfessionalAfter: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/context/casual-to-professional-after.jpg`,
      normalToFantasyBefore: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/context/normal-to-fantasy-before.jpg`,
      normalToFantasyAfter: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/context/normal-to-fantasy-after.jpg`,
      modernToHistoricalBefore: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/context/modern-to-historical-before.jpg`,
      modernToHistoricalAfter: `${R2_BASE_URL}/hailuo-ai-video-generator/transformations/context/modern-to-historical-after.jpg`,
    },
  },
  features: {
    artisticStyleDemo: `${R2_BASE_URL}/hailuo-ai-video-generator/features/artistic-style-demo.gif`,
    ageProgressionDemo: `${R2_BASE_URL}/hailuo-ai-video-generator/features/age-progression-demo.gif`,
    contextAdaptationDemo: `${R2_BASE_URL}/hailuo-ai-video-generator/features/context-adaptation-demo.gif`,
    expressionControlDemo: `${R2_BASE_URL}/hailuo-ai-video-generator/features/expression-control-demo.gif`,
    lightingEffectsDemo: `${R2_BASE_URL}/hailuo-ai-video-generator/features/lighting-effects-demo.gif`,
    batchProcessingDemo: `${R2_BASE_URL}/hailuo-ai-video-generator/features/batch-processing-demo.gif`,
  },
  showcase: {
    gallery1: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-1.jpg`,
    gallery2: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-2.jpg`,
    gallery3: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-3.jpg`,
    gallery4: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-4.jpg`,
    gallery5: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-5.jpg`,
    gallery6: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-6.jpg`,
    gallery7: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-7.jpg`,
    gallery8: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-8.jpg`,
    gallery9: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-9.jpg`,
    gallery10: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-10.jpg`,
    gallery11: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-11.jpg`,
    gallery12: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-12.jpg`,
    gallery13: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-13.jpg`,
    gallery14: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-14.jpg`,
    gallery15: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-15.jpg`,
    gallery16: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-16.jpg`,
    gallery17: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-17.jpg`,
    gallery18: `${R2_BASE_URL}/hailuo-ai-video-generator/showcase/gallery-18.jpg`,
  },
};

// 通用媒体工具函数
export const getMediaUrl = (path: string): string => {
  return `${R2_BASE_URL}/${path}`;
};

// 检查媒体文件是否存在的函数
export const checkMediaExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// 获取优化的图片URL（支持不同尺寸）
export const getOptimizedImageUrl = (path: string, width?: number, height?: number): string => {
  let url = `${R2_BASE_URL}/${path}`;
  
  // 如果需要特定尺寸，可以在这里添加查询参数
  // 注意：这需要你的R2配置支持图片变换
  if (width || height) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    url += `?${params.toString()}`;
  }
  
  return url;
};
