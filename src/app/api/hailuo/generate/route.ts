import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

// N8N 请求体接口
interface N8nHailuoRequestBody {
  jobId: string;
  userId: string;
  prompt: string;
  duration: number;
}

// 环境变量 - 使用专门的Hailuo webhook配置
const n8nWebhookUrl = process.env.N8N_HAILUO_WEBHOOK_URL;
const n8nApiKey = process.env.N8N_API_KEY;

export async function POST(request: NextRequest) {
  try {
    console.log('[Hailuo API] Starting video generation request...');

    // 1. 获取请求数据
    const { prompt, duration } = await request.json();

    // 验证输入参数
    if (!prompt || prompt.trim().length < 10) {
      return NextResponse.json({
        message: 'Prompt must be at least 10 characters long.'
      }, { status: 400 });
    }

    if (prompt.trim().length > 800) {
      return NextResponse.json({
        message: 'Prompt must not exceed 800 characters.'
      }, { status: 400 });
    }

    if (!duration || ![6, 10].includes(duration)) {
      return NextResponse.json({
        message: 'Duration must be either 6 or 10 seconds.'
      }, { status: 400 });
    }

    // 2. 验证用户身份
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Hailuo API] Authentication failed:', authError);
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    console.log('[Hailuo API] User authenticated:', user.id);

    // 3. 验证N8N配置
    if (!n8nWebhookUrl) {
      console.error('[Hailuo API] N8N_HAILUO_WEBHOOK_URL not configured');
      return NextResponse.json({
        message: 'Service configuration error.'
      }, { status: 500 });
    }

    // 4. 生成唯一的jobId
    const jobId = uuidv4();
    console.log('[Hailuo API] Generated jobId:', jobId);

    // 5. 调用 RPC 创建项目并扣除积分
    const rpcParams = {
      p_user_id: user.id,
      p_job_id: jobId,
      p_prompt: prompt.trim(),
      p_duration: duration
    };

    console.log('[Hailuo API] Calling RPC create_hailuo_project for job', jobId, 'by user', user.id);

    const { data: projectData, error: rpcError } = await supabase.rpc(
      'create_hailuo_project',
      rpcParams
    );

    if (rpcError) {
      console.error('[Hailuo API] RPC error:', rpcError);
      return NextResponse.json({
        message: 'Database operation failed.'
      }, { status: 500 });
    }

    if (!projectData || projectData.length === 0) {
      console.error('[Hailuo API] No data returned from RPC');
      return NextResponse.json({
        message: 'Failed to create project.'
      }, { status: 500 });
    }

    const result = projectData[0];
    console.log('[Hailuo API] RPC result:', result);

    // 6. 检查RPC返回的状态
    if (result.status === 'user_not_found') {
      return NextResponse.json({
        message: 'User profile not found.'
      }, { status: 404 });
    }

    if (result.status === 'insufficient_credits') {
      return NextResponse.json({
        message: 'Insufficient credits.',
        required: duration,
        available: 0
      }, { status: 402 });
    }

    if (result.status === 'concurrent_generation_exists') {
      return NextResponse.json({
        message: 'You already have a Hailuo video generation in progress. Please wait for it to complete before starting a new one.'
      }, { status: 409 });
    }

    if (result.status === 'invalid_duration') {
      return NextResponse.json({
        message: 'Invalid video duration. Only 6 and 10 seconds are supported.'
      }, { status: 400 });
    }

    if (result.status.startsWith('database_error')) {
      console.error('[Hailuo API] Database error:', result.status);
      return NextResponse.json({
        message: 'Database operation failed.'
      }, { status: 500 });
    }

    // 7. 准备发送到N8N的数据
    const requestBodyToN8n: N8nHailuoRequestBody = {
      jobId,
      userId: user.id,
      prompt: prompt.trim(),
      duration
    };

    console.log('[Hailuo API] Sending request to N8N Hailuo webhook:', requestBodyToN8n);

    // 8. 发送请求到N8N
    const headersForN8n: HeadersInit = { 'Content-Type': 'application/json' };
    if (n8nApiKey) {
      headersForN8n['N8N_API_KEY'] = n8nApiKey;
    }

    try {
      // 添加超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时

      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: headersForN8n,
        body: JSON.stringify(requestBodyToN8n),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let responseData;
      try {
        responseData = await n8nResponse.json();
      } catch (jsonError) {
        const responseText = await n8nResponse.text();
        console.error('[Hailuo API] N8N response is not JSON:', responseText);
        responseData = { message: 'Invalid response format', responseText };
      }

      console.log(`[Hailuo API] N8N response status: ${n8nResponse.status}`);
      console.log('[Hailuo API] N8N response data:', responseData);

      if (!n8nResponse.ok) {
        const errorMessage = `N8N request failed with status ${n8nResponse.status}: ${responseData?.message || 'Unknown error'}`;
        console.error('[Hailuo API] N8N request failed:', errorMessage);

        // 更新数据库记录为失败状态
        await supabase
          .from('hailuo_generations')
          .update({
            status: 'failed',
            error_message: errorMessage,
            completed_at: new Date().toISOString()
          })
          .eq('job_id', jobId);

        return NextResponse.json({
          message: errorMessage,
          details: responseData,
          status: n8nResponse.status
        }, { status: n8nResponse.status });
      }

      console.log(`[Hailuo API] Successfully submitted to N8N. Status: ${n8nResponse.status}. Response:`, responseData);
      return NextResponse.json({
        message: 'Hailuo video generation request received and processing started.',
        status: 'processing',
        jobId,
        prompt: prompt.trim(),
        duration,
        creditsUsed: result.credits_deducted,
        workflowData: responseData
      });

    } catch (n8nCallError: unknown) {
      const errorMessage = n8nCallError instanceof Error ? n8nCallError.message : String(n8nCallError);
      console.error('[Hailuo API] Network error during N8N call:', errorMessage);

      // 更新数据库记录为失败状态
      await supabase
        .from('hailuo_generations')
        .update({
          status: 'failed',
          error_message: `Network error: ${errorMessage}`,
          completed_at: new Date().toISOString()
        })
        .eq('job_id', jobId);

      return NextResponse.json({
        message: 'Failed to communicate with video generation service.',
        error: errorMessage
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[Hailuo API] Unexpected error:', error);
    return NextResponse.json({
      message: 'Internal server error.',
      error: String(error)
    }, { status: 500 });
  }
}
