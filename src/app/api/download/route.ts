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

    // 验证URL是否来自我们的R2存储域名
    const allowedDomains = [
      'pub-7d236ebab03f49ddb1f51cb5feb00790.r2.dev', // Baby Generator R2
      'pub-3626123a908346a7a8be8d9295f44e26.r2.dev', // Main R2
      'pub-da4c030f32c04b9f98cd49773cbf82b5.r2.dev', // Video R2
    ];

    const urlObj = new URL(fileUrl);
    const isAllowedDomain = allowedDomains.some(domain => urlObj.hostname === domain);

    if (!isAllowedDomain) {
      console.warn('[Download API] Unauthorized domain:', urlObj.hostname);
      return NextResponse.json({ message: 'Unauthorized file source' }, { status: 403 });
    }

    console.log('[Download API] Downloading file:', fileUrl);

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
