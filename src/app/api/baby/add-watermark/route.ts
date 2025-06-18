import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing image URL parameter' }, { status: 400 });
    }

    // 验证用户登录状态（可选，用于日志记录）
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log(`[Add Watermark API] Processing watermark for image: ${imageUrl}, user: ${user?.id || 'anonymous'}`);

    // 下载原始图片
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error(`[Add Watermark API] Failed to fetch image: ${imageResponse.status}`);
      return NextResponse.json({ error: 'Failed to fetch original image' }, { status: 400 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const originalImage = Buffer.from(imageBuffer);

    // 使用Canvas API添加水印
    const watermarkedImage = await addWatermarkToImage(originalImage);

    // 返回带水印的图片
    return new Response(watermarkedImage, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600', // 缓存1小时
        'Content-Disposition': 'inline; filename="baby-watermarked.jpg"'
      }
    });

  } catch (error) {
    console.error('[Add Watermark API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while adding watermark' },
      { status: 500 }
    );
  }
}

// 使用Sharp库添加水印的函数
async function addWatermarkToImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // 动态导入sharp库
    const sharp = (await import('sharp')).default;

    // 获取图片信息
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const { width = 800, height = 600 } = metadata;

    // 计算水印大小和位置
    const fontSize = Math.max(width * 0.04, 24);
    const margin = Math.max(width * 0.02, 20);

    // 创建水印文字SVG
    const watermarkText = 'VogueAI';
    const watermarkSvg = `
      <svg width="${width}" height="${height}">
        <defs>
          <style>
            .watermark-text {
              font-family: Arial, sans-serif;
              font-size: ${fontSize}px;
              font-weight: bold;
              fill: rgba(255, 255, 255, 0.8);
              stroke: rgba(0, 0, 0, 0.3);
              stroke-width: 2;
            }
          </style>
        </defs>
        <text x="${width - margin}" y="${height - margin}"
              text-anchor="end"
              dominant-baseline="bottom"
              class="watermark-text">
          ${watermarkText}
        </text>
      </svg>
    `;

    // 将SVG转换为Buffer
    const watermarkBuffer = Buffer.from(watermarkSvg);

    // 合成图片和水印
    const watermarkedImage = await image
      .composite([
        {
          input: watermarkBuffer,
          top: 0,
          left: 0,
        }
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    console.log(`[Add Watermark API] Successfully added watermark to image (${width}x${height})`);
    return watermarkedImage;

  } catch (error) {
    console.error('[Add Watermark API] Sharp processing error:', error);
    throw new Error('Failed to process image with Sharp');
  }
}
