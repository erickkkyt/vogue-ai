import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn('[Download API] Authentication error or no user session:', authError?.message);
      return NextResponse.json({ message: 'Authentication required. Please log in.' }, { status: 401 });
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download';

    if (!fileUrl) {
      return NextResponse.json({ message: 'File URL is required' }, { status: 400 });
    }

    // 基本URL验证 - 确保是有效的HTTP/HTTPS URL
    let urlObj;
    try {
      urlObj = new URL(fileUrl);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        console.warn('[Download API] Invalid protocol:', urlObj.protocol);
        return NextResponse.json({ message: 'Invalid file URL protocol' }, { status: 400 });
      }
    } catch (error) {
      console.warn('[Download API] Invalid URL format:', fileUrl);
      return NextResponse.json({ message: 'Invalid file URL format' }, { status: 400 });
    }

    console.log('[Download API] Downloading file from:', urlObj.hostname);

    // 获取文件
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      console.error('[Download API] Failed to fetch file:', response.status, response.statusText);
      return NextResponse.json({ message: 'Failed to fetch file' }, { status: 404 });
    }

    // 获取文件内容
    const fileBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // 创建下载响应
    const downloadResponse = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    });

    console.log('[Download API] File downloaded successfully:', filename);
    return downloadResponse;

  } catch (error) {
    console.error('[Download API] Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
