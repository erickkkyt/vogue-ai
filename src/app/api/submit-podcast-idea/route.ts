import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server'; // User-context client
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // 新增：S3相关导入

// 新增 N8N 请求体接口定义
interface N8nRequestBody {
  jobId: string;
  userId: string;
  appearanceCreationMode: 'features' | 'custom_image' | 'portrait_to_baby';
  contentCreationMode: 'generate_from_topic' | 'audio_script' | 'direct_text_input';
  videoResolution: '540p' | '720p';
  aspectRatio: '1:1' | '16:9' | '9:16';
  ethnicity?: string | null;
  hair?: string | null;
  customImageUrl?: string | null;
  originalPortraitUrl?: string | null;
  topic?: string | null;
  audioScriptUrl?: string | null;
  textScriptDirectInput?: string | null;
  voiceId?: string | null; // 修改：voice 改为 voiceId
}

// 新增：R2上传辅助函数
async function uploadToR2(file: File, userId: string, fileTypeIdentifier: string): Promise<string> {
  const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
  const R2_PUBLIC_HOSTNAME = process.env.R2_PUBLIC_HOSTNAME;

  if (!process.env.R2_ACCOUNT_ID || !R2_BUCKET_NAME || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_HOSTNAME) {
    console.error('[API - R2 Upload] R2 configuration missing in environment variables.');
    throw new Error('Server configuration error: Image/file storage details missing.');
  }

  // 清理文件名并添加唯一前缀
  const cleanedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const uniqueFileName = `user_${userId}/${fileTypeIdentifier}_${Date.now()}_${cleanedFileName}`.toLowerCase();

  const s3Client = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  const putObjectParams = {
    Bucket: R2_BUCKET_NAME,
    Key: uniqueFileName,
    Body: buffer,
    ContentType: file.type,
  };

  await s3Client.send(new PutObjectCommand(putObjectParams));

  const hostname = R2_PUBLIC_HOSTNAME.replace(/^https?:\/\//, ''); // 修正：正确移除 http(s)://
  const publicUrl = `https://${hostname}/${uniqueFileName}`;
  console.log(`[API - R2 Upload] File uploaded successfully to R2: ${publicUrl}`);
  return publicUrl;
}

export async function POST(request: Request) {
  const supabaseUserClient = await createServerSupabaseClient();

  const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();

  if (authError || !user) {
    console.warn('[Submit API] Authentication error or no user session:', authError?.message);
    return NextResponse.json({ message: 'Authentication required. Please log in.' }, { status: 401 });
  }
  console.log(`[Submit API] Authenticated User ID: ${user.id}`);

  try {
    const formData = await request.formData();

    // --- 1. 从 FormData 提取所有字段 ---
    const appearanceCreationMode = formData.get('appearanceCreationMode') as 'features' | 'custom_image' | 'portrait_to_baby' | null;
    const contentCreationMode = formData.get('contentCreationMode') as 'generate_from_topic' | 'audio_script' | 'direct_text_input' | null;
    const videoResolution = formData.get('videoResolution') as '540p' | '720p' | null;
    const aspectRatio = formData.get('aspectRatio') as '1:1' | '16:9' | '9:16' | null;

    // 外观模式 'features' 的字段
    const ethnicity = formData.get('ethnicity') as string | null;
    const hair = formData.get('hair') as string | null;
    // 外观模式 'custom_image' 的字段
    const customBabyImageFile = formData.get('customBabyImageFile') as File | null;
    // 外观模式 'portrait_to_baby' 的字段
    const originalPortraitFile = formData.get('originalPortraitFile') as File | null;

    // 内容模式 'generate_from_topic' 的字段
    const topic = formData.get('topic') as string | null;
    // 内容模式 'audio_script' 的字段
    const audioScriptFile = formData.get('audioScriptFile') as File | null;
    // 内容模式 'direct_text_input' 的字段
    const textScriptDirectInput = formData.get('textScriptDirectInput') as string | null;

    // --- 2. 校验核心模式选择和通用设置 ---
    if (!appearanceCreationMode || !['features', 'custom_image', 'portrait_to_baby'].includes(appearanceCreationMode)) {
      return NextResponse.json({ message: 'Missing or invalid field: appearanceCreationMode.' }, { status: 400 });
    }
    if (!contentCreationMode || !['generate_from_topic', 'audio_script', 'direct_text_input'].includes(contentCreationMode)) {
      return NextResponse.json({ message: 'Missing or invalid field: contentCreationMode.' }, { status: 400 });
    }
    if (!videoResolution || !['540p', '720p'].includes(videoResolution)) {
      return NextResponse.json({ message: 'Missing or invalid field: videoResolution. Must be "540p" or "720p".' }, { status: 400 });
    }
    if (!aspectRatio || !['1:1', '16:9', '9:16'].includes(aspectRatio)) {
      return NextResponse.json({ message: 'Missing or invalid field: aspectRatio. Must be "1:1", "16:9", or "9:16".' }, { status: 400 });
    }

    // --- 3. 根据选择的模式校验特定字段 ---
    if (appearanceCreationMode === 'features' && (!ethnicity?.trim() || !hair?.trim())) {
      return NextResponse.json({ message: 'Missing required fields for features mode: ethnicity and hair.' }, { status: 400 });
    }
    if (appearanceCreationMode === 'custom_image' && !customBabyImageFile) {
      return NextResponse.json({ message: 'Missing required file for custom image mode: customBabyImageFile.' }, { status: 400 });
    }
    if (appearanceCreationMode === 'portrait_to_baby' && !originalPortraitFile) {
      return NextResponse.json({ message: 'Missing required file for portrait to baby mode: originalPortraitFile.' }, { status: 400 });
    }

    if (contentCreationMode === 'generate_from_topic' && !topic?.trim()) {
      return NextResponse.json({ message: 'Missing required field for topic mode: topic.' }, { status: 400 });
    }
    if (contentCreationMode === 'audio_script' && !audioScriptFile) {
      return NextResponse.json({ message: 'Missing required file for audio script mode: audioScriptFile.' }, { status: 400 });
    }
    if (contentCreationMode === 'direct_text_input' && !textScriptDirectInput?.trim()) {
      return NextResponse.json({ message: 'Missing required field for direct text input mode: textScriptDirectInput.' }, { status: 400 });
    }

    // --- 4. N8N Webhook URL 和 API Key 检查 (移到更前面，因为后续可能需要) ---
    const n8nApiKey = process.env.N8N_API_KEY;
    // 注意：我们现在可能有多个N8N工作流URL，或者一个统一的但能处理不同类型的。
    // 为简化，暂时使用一个通用的，但实际应用中可能需要根据 appearanceCreationMode 和 contentCreationMode 选择不同的URL或传递类型参数。
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_GENERAL || process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) { // API Key 可以是可选的，取决于你的N8N设置
        console.error('[Submit API] N8N_WEBHOOK_URL_GENERAL or N8N_WEBHOOK_URL is not properly configured.');
        return NextResponse.json({ message: 'Server configuration error: N8N integration details missing.' }, { status: 500 });
    }

    // --- 5. 文件上传到 R2 (如有必要) ---
    let customImageUrl: string | null = null;
    let originalPortraitUrl: string | null = null;
    let audioScriptUrl: string | null = null;

    try {
      if (appearanceCreationMode === 'custom_image' && customBabyImageFile) {
        console.log('[Submit API] Uploading custom baby image to R2...');
        customImageUrl = await uploadToR2(customBabyImageFile, user.id, 'custom_baby_image');
      }
      if (appearanceCreationMode === 'portrait_to_baby' && originalPortraitFile) {
        console.log('[Submit API] Uploading original portrait to R2...');
        originalPortraitUrl = await uploadToR2(originalPortraitFile, user.id, 'portrait_to_baby');
      }
      if (contentCreationMode === 'audio_script' && audioScriptFile) {
        console.log('[Submit API] Uploading audio script to R2...');
        audioScriptUrl = await uploadToR2(audioScriptFile, user.id, 'audio_script');
      }
    } catch (uploadError: unknown) {
      console.error('[Submit API] File upload to R2 failed:', uploadError instanceof Error ? uploadError.message : String(uploadError));
      return NextResponse.json({ 
        message: 'File upload failed.', 
        details: uploadError instanceof Error ? uploadError.message : String(uploadError) 
      }, { status: 500 });
    }
    
    const jobId = uuidv4();
    console.log(`[Submit API] Generated Job ID for RPC: ${jobId}`);

    // --- 6. 用户积分和现有项目检查 (与之前逻辑类似，保持不变) ---
    const { data: userProfile, error: profileError } = await supabaseUserClient
      .from('user_profiles')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error(`[Submit API] Error fetching user profile for ${user.id}:`, profileError.message);
      return NextResponse.json({ message: 'Failed to fetch user profile.', error_code: 'PROFILE_FETCH_FAILED' }, { status: 500 });
    }
    if (!userProfile || userProfile.credits === undefined) {
      console.error(`[Submit API] User profile or credits not found for ${user.id}.`);
      return NextResponse.json({ message: 'User profile or credits information missing.', error_code: 'PROFILE_CREDITS_MISSING' }, { status: 500 });
    }
    console.log(`[Submit API] User ${user.id} current credits: ${userProfile.credits}`);

    const { data: existingProcessingProject, error: existingProjectError } = await supabaseUserClient
      .from('projects')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'processing')
      .maybeSingle();

    if (existingProjectError) {
      console.error(`[Submit API] Error checking for existing processing projects for user ${user.id}:`, existingProjectError.message);
      return NextResponse.json({ message: 'Failed to check for existing projects. Please try again.', error_code: 'EXISTING_PROJECT_CHECK_FAILED' }, { status: 500 });
    }
    if (existingProcessingProject) {
      console.warn(`[Submit API] User ${user.id} already has a project with status 'processing' (ID: ${existingProcessingProject.id}). New project submission denied.`);
      return NextResponse.json({
        message: 'There is a task currently in progress. Please wait for it to complete before starting a new one.',
        error_code: 'ACTIVE_PROJECT_LIMIT_REACHED'
      }, { status: 409 });
    }
    if (userProfile.credits <= 0) {
      console.warn(`[Submit API] User ${user.id} has insufficient credits (${userProfile.credits}) to create a new project.`);
      return NextResponse.json({ 
        message: "No credits left. Please check out the plan or wait for a top-up.", 
        error_code: 'INSUFFICIENT_CREDITS' 
      }, { status: 402 });
    }

    // --- 7. 准备并调用 Supabase RPC 'create_initial_project' ---
    let rpcImageUrl: string | null = null;
    if (appearanceCreationMode === 'custom_image') {
      rpcImageUrl = customImageUrl;
    } else if (appearanceCreationMode === 'portrait_to_baby') {
      rpcImageUrl = originalPortraitUrl;
    } // 如果是 'features'，则 rpcImageUrl 保持 null

    // 对于 p_ethnicity, p_hair, p_topic，只有当对应模式被选择时才传递值，否则为 null
    const rpcEthnicity = appearanceCreationMode === 'features' ? ethnicity : null;
    const rpcHair = appearanceCreationMode === 'features' ? hair : null;
    const rpcTopic = contentCreationMode === 'generate_from_topic' ? topic : null;
    // 注意：audioScriptUrl 和 textScriptDirectInput 目前没有直接传入RPC的字段

    console.log(`[Submit API] Calling RPC 'create_initial_project' for job ${jobId} by user ${user.id}`);
    const { data: newProjectData, error: rpcError } = await supabaseUserClient.rpc(
      'create_initial_project', 
      {
        p_user_id: user.id,
        p_job_id: jobId,
        p_ethnicity: rpcEthnicity,
        p_hair: rpcHair,
        p_topic: rpcTopic,
        p_appearance_creation_mode: appearanceCreationMode,
        p_content_creation_mode: contentCreationMode,
        p_custom_image_url: appearanceCreationMode === 'custom_image' ? customImageUrl : null,
        p_original_portrait_url: appearanceCreationMode === 'portrait_to_baby' ? originalPortraitUrl : null,
        p_audio_script_url: contentCreationMode === 'audio_script' ? audioScriptUrl : null,
        p_text_script_content: contentCreationMode === 'direct_text_input' ? textScriptDirectInput : null,
        p_video_resolution: videoResolution,
        p_aspect_ratio: aspectRatio
      }
    );

    // --- 8. 处理 Supabase RPC 调用的结果 ---
    if (rpcError) {
      console.error(`[Submit API] RPC call 'create_initial_project' failed for job ${jobId}:`, rpcError);
      const errorDetailsString = typeof rpcError.details === 'string' ? rpcError.details :
                                 rpcError.message ? `${rpcError.message} (Code: ${rpcError.code || 'N/A'})` :
                                 JSON.stringify(rpcError);
      return NextResponse.json({ 
        message: 'Failed to process request due to a database function error.', 
        error: rpcError.message, 
        details: errorDetailsString, 
        error_code: 'RPC_CALL_FAILED' 
      }, { status: 500 });
    }

    const newProjectEntity = Array.isArray(newProjectData) && newProjectData.length > 0 ? newProjectData[0] : null;

    if (newProjectEntity && typeof newProjectEntity === 'object' && 'status' in newProjectEntity && newProjectEntity.status === 'error') {
      console.warn(`[Submit API] RPC returned an application error for job ${jobId}: Code='${newProjectEntity.code}', Message='${newProjectEntity.message}', Details: '${newProjectEntity.details}'`);
      if (newProjectEntity.code === 'insufficient_credits') {
        return NextResponse.json({ 
          message: "No credits left. Please check out the plan.",
          error_code: 'INSUFFICIENT_CREDITS',
        }, { status: 402 });
      } else if (newProjectEntity.code === 'unauthorized') { 
         return NextResponse.json({ 
           message: newProjectEntity.message || 'Unauthorized to perform this action.', 
           error_code: 'UNAUTHORIZED_RPC_ACTION'
         }, { status: 401 });
      }
      return NextResponse.json({ 
        message: newProjectEntity.message || 'Failed to process project due to a transaction error.', 
        error_code: newProjectEntity.code || 'RPC_LOGIC_ERROR', 
        details: typeof newProjectEntity.details === 'string' ? newProjectEntity.details : JSON.stringify(newProjectEntity.details) 
      }, { status: 500 });
    }
    
    if (!newProjectEntity || typeof newProjectEntity !== 'object' || !newProjectEntity.job_id || newProjectEntity.job_id !== jobId) {
        console.error(`[Submit API] RPC 'create_initial_project' for job ${jobId} did not return the expected project data. Actual response:`, newProjectEntity);
        const responseDetailsString = typeof newProjectData === 'object' ? JSON.stringify(newProjectData) : String(newProjectData);
        return NextResponse.json({ 
          message: 'Project creation initiated, but confirmation details from RPC were unexpected or missing critical data.', 
          error_code: 'RPC_UNEXPECTED_RESPONSE_SHAPE',
          details: responseDetailsString 
        }, { status: 500 });
    }
    console.log(`[Submit API] RPC 'create_initial_project' success for job ${jobId}. Project created. Details:`, newProjectEntity);

    // --- 9. 准备并调用 N8N Webhook ---
    const requestBodyToN8n: N8nRequestBody = {
        jobId: newProjectEntity.job_id, 
        userId: user.id,
        appearanceCreationMode: appearanceCreationMode!,
        contentCreationMode: contentCreationMode!,
        videoResolution: videoResolution!,
        aspectRatio: aspectRatio!,
        // 根据模式条件添加字段
        ...(appearanceCreationMode === 'features' && { ethnicity, hair }),
        ...(appearanceCreationMode === 'custom_image' && { customImageUrl }),
        ...(appearanceCreationMode === 'portrait_to_baby' && { originalPortraitUrl }),
        ...(contentCreationMode === 'generate_from_topic' && { topic }),
        ...(contentCreationMode === 'audio_script' && { audioScriptUrl }),
        ...(contentCreationMode === 'direct_text_input' && { textScriptDirectInput }),
    };

    // 仅在文本生成相关的模式下添加voiceId
    if (contentCreationMode === 'generate_from_topic' || contentCreationMode === 'direct_text_input') {
      requestBodyToN8n.voiceId = formData.get('voiceId') as string;
    }
    
    Object.keys(requestBodyToN8n).forEach(key => {
        const typedKey = key as keyof N8nRequestBody; // 类型断言
        if (requestBodyToN8n[typedKey] === null || requestBodyToN8n[typedKey] === undefined) {
            delete requestBodyToN8n[typedKey];
        }
    });

    console.log(`[Submit API] Sending POST request to n8n for job ${jobId}. Payload:`, JSON.stringify(requestBodyToN8n));
    const headersForN8n: HeadersInit = { 'Content-Type': 'application/json' };
    if (n8nApiKey) { 
        headersForN8n[process.env.N8N_API_HEADER_NAME || 'N8N_API_KEY'] = n8nApiKey; 
    }
    
    try {
      const n8nResponse = await fetch(n8nWebhookUrl!, {
        method: 'POST',
        headers: headersForN8n,
        body: JSON.stringify(requestBodyToN8n),
      });
      const responseText = await n8nResponse.text(); 
      if (!n8nResponse.ok) {
        console.error(`[Submit API] Error submitting job ${jobId} to n8n. Status: ${n8nResponse.status}. Response: ${responseText}`);
        // 注意：即使N8N调用失败，项目也已在数据库中创建。可以考虑后续的重试机制或错误标记。
      } else {
        console.log(`[Submit API] Job ${jobId} successfully submitted to n8n. Status: ${n8nResponse.status}. Response: ${responseText}`);
      }
    } catch (n8nCallError: unknown) {
      const networkErrorMessage = n8nCallError instanceof Error ? n8nCallError.message : String(n8nCallError);
      console.error(`[Submit API] Network error or other exception during N8N fetch for job ${jobId}:`, networkErrorMessage, n8nCallError);
       // 同上，N8N调用失败的处理策略
    }

    // --- 10. 最终成功响应 ---
    return NextResponse.json({ 
      message: 'Request received, project creation initiated, and processing started.', 
      status: newProjectEntity.status || 'processing', 
      jobId: newProjectEntity.job_id,
      projectDetails: newProjectEntity 
    });

  } catch (error: unknown) { 
    const criticalErrorMessage = error instanceof Error ? error.message : String(error);
    const criticalErrorStack = error instanceof Error ? error.stack : undefined;
    console.error('[Submit API] Critical error in POST handler:', criticalErrorMessage, criticalErrorStack);
    return NextResponse.json({ message: 'Internal Server Error. Please try again later.', error: criticalErrorMessage }, { status: 500 });
  }
}