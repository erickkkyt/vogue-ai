// 火山引擎 ARK API 客户端
export interface SeedanceTaskRequest {
  model: string;
  content: Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export interface SeedanceTaskResponse {
  id: string;
  model: string;
  status: 'pending' | 'running' | 'succeeded' | 'failed'; // 根据官方示例，成功状态是 'succeeded'
  content?: {
    video_url?: string;
  };
  error?: {
    message?: string;
  };
  seed?: number;
  resolution?: string;
  duration?: number;
  ratio?: string;
  framespersecond?: number;
  usage?: {
    completion_tokens: number;
    total_tokens: number;
  };
  created_at: number; // Unix timestamp
  updated_at: number; // Unix timestamp
}

export class VolcengineClient {
  private apiKey: string;
  private baseUrl: string;

  // 🎯 硬编码轮询配置
  private readonly POLL_INTERVAL = 20000; // 20秒
  private readonly MAX_POLL_ATTEMPTS = 90; // 90次 = 30分钟

  constructor() {
    // 🎯 API Key使用环境变量，轮询配置硬编码
    this.apiKey = process.env.ARK_API_KEY!;
    this.baseUrl = 'https://ark.cn-beijing.volces.com/api/v3';

    if (!this.apiKey) {
      throw new Error('ARK_API_KEY environment variable is required');
    }

    console.log('[Volcengine Client] Initialized - API Key from env, polling config hardcoded');
    console.log('[Volcengine Client] Poll interval:', this.POLL_INTERVAL, 'ms');
    console.log('[Volcengine Client] Max attempts:', this.MAX_POLL_ATTEMPTS);
  }

  // 创建视频生成任务
  async createTask(request: SeedanceTaskRequest): Promise<{ id: string }> {
    try {
      console.log('[Volcengine Client] Creating task with model:', request.model);

      const response = await fetch(`${this.baseUrl}/contents/generations/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Volcengine Client] Create task failed:', response.status, errorText);
        throw new Error(`Failed to create task: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('[Volcengine Client] Task created successfully, id:', data.id);

      return { id: data.id };
    } catch (error) {
      console.error('[Volcengine Client] Create task error:', error);
      throw error;
    }
  }

  // 查询任务状态
  async getTaskStatus(id: string): Promise<SeedanceTaskResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/contents/generations/tasks/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Volcengine Client] Get task status failed:', response.status, errorText);
        throw new Error(`Failed to get task status: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[Volcengine Client] Get task status error:', error);
      throw error;
    }
  }

  // 轮询任务直到完成 (使用硬编码配置)
  async pollTaskUntilComplete(id: string): Promise<SeedanceTaskResponse> {
    console.log(`[Volcengine Client] Starting to poll task ${id}, max attempts: ${this.MAX_POLL_ATTEMPTS}, interval: ${this.POLL_INTERVAL}ms`);

    for (let attempt = 1; attempt <= this.MAX_POLL_ATTEMPTS; attempt++) {
      try {
        const status = await this.getTaskStatus(id);
        const elapsedTime = Math.round((attempt * intervalMs) / 1000);
        console.log(`[Volcengine Client] Poll attempt ${attempt}/${this.MAX_POLL_ATTEMPTS} (${elapsedTime}s elapsed), status: ${status.status}`);

        // 根据官方示例，成功状态是 'succeeded'
        if (status.status === 'succeeded') {
          console.log('[Volcengine Client] Task completed successfully');
          if (status.content?.video_url) {
            console.log('[Volcengine Client] Video URL received:', status.content.video_url);
          }
          return status;
        }

        // 失败状态处理
        if (status.status === 'failed') {
          const errorMessage = status.error?.message || 'Unknown error';
          console.error('[Volcengine Client] Task failed:', errorMessage);
          throw new Error(`Task failed: ${errorMessage}`);
        }

        // 如果还在处理中，等待后继续轮询
        if (status.status === 'pending' || status.status === 'running') {
          if (attempt < this.MAX_POLL_ATTEMPTS) {
            console.log(`[Volcengine Client] Task still ${status.status}, waiting ${this.POLL_INTERVAL}ms for next poll...`);
            await new Promise(resolve => setTimeout(resolve, this.POLL_INTERVAL));
            continue;
          } else {
            // 达到最大轮询次数
            throw new Error(`Task polling timeout after ${this.MAX_POLL_ATTEMPTS} attempts (${Math.round(this.MAX_POLL_ATTEMPTS * this.POLL_INTERVAL / 1000)}s)`);
          }
        }

        // 未知状态
        console.warn(`[Volcengine Client] Unknown task status: ${status.status}`);
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, intervalMs));
          continue;
        }

      } catch (error) {
        console.error(`[Volcengine Client] Poll attempt ${attempt} failed:`, error);
        if (attempt === maxAttempts) {
          throw error;
        }
        // 等待后重试
        console.log(`[Volcengine Client] Retrying in ${intervalMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }

    throw new Error(`Task polling timeout after ${maxAttempts} attempts`);
  }

  // 构建文本提示词（包含参数）
  buildTextPrompt(
    prompt: string,
    aspectRatio: string,
    resolution: string,
    duration: string
  ): string {
    // 根据你的示例格式构建提示词
    const params = [];
    
    // 添加宽高比参数
    if (aspectRatio === '16:9') {
      params.push('--rt 16:9');
    } else if (aspectRatio === '9:16') {
      params.push('--rt 9:16');
    } else if (aspectRatio === '1:1') {
      params.push('--rt 1:1');
    }
    
    // 添加分辨率参数
    params.push(`--rs ${resolution}`);
    
    // 添加时长参数
    params.push(`--dur ${duration}`);
    
    return `${prompt} ${params.join(' ')}`;
  }
}

export default VolcengineClient;
