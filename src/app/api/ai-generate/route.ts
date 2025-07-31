/* eslint-disable @typescript-eslint/no-explicit-any */
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { error } from 'console';
import { appConfig } from '@/lib/appConfig';

const appHeaders = {
  "HTTP-Referer": appConfig.baseUrl,
  "X-Title": appConfig.openrouterAI.appName
}

// 公共的mock处理逻辑
async function handleMockResponse(mockType: 'image' | 'txt' | 'audio' | 'video' | 'file', params: any) {
  if (!appConfig.openrouterAI.enableMock) {
    return null;
  }

  console.warn('[AI-Mock-Switch]', appConfig.openrouterAI.enableMock);
  
  // Mock timeout
  if (process.env.NODE_ENV !== 'production' && appConfig.openrouterAI.enableMockTimeout) {
    const mockTimeout = appConfig.openrouterAI.mockTimeoutSeconds * 1000;
    console.warn(`[AI-Mock-Timeout]${mockTimeout}ms`);
    await new Promise(resolve => setTimeout(resolve, mockTimeout));
  }
  
  // Mock ads error
  if (process.env.NODE_ENV !== 'production' && appConfig.openrouterAI.enableMockAds) {
    throw error('MOCK TEST!');
  }
  
  if (mockType === 'image') {
    const { prompt, imageUrl } = params;
    const mockText = `[MockData] Analyzing image: ${imageUrl}. User prompt: ${prompt || 'No specific prompt'}\n\nA solitary figure stands at the edge of a vast, windswept cliff, silhouetted against a sky ablaze with the fiery hues of a setting sun. The horizon is a molten line where deep oranges, radiant pinks, and smoldering reds bleed into the soft indigo of the approaching night.\n\nLong shadows stretch across the rugged terrain behind the person, emphasizing their isolation and stillness amidst the wild landscape. The cliff drops sharply into a churning sea far below, waves crashing against jagged rocks in a rhythmic, thunderous roar that seems to echo even in silence.\n\nThe figure, dressed in a long, flowing coat that flutters in the strong coastal breeze, stands with hands clasped behind their back, gazing out over the endless expanse of ocean. Their posture is contemplative, almost reverent, as if absorbing the magnitude of the moment.`;
    return { text: mockText };
  } else if (mockType === 'txt') {
    const { prompt, context } = params;
    const mockTextRult = `[MockData-${context}] ${prompt}`
    return { text: mockTextRult };
  }
  
  return null;
}

const timeout = appConfig.openrouterAI.timeoutSeconds * 1000;
// AI请求超时控制辅助函数
async function applyTimeout<T>(promise: Promise<T>, ms = timeout): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    // 传递 signal 给AI请求
    // promise需支持signal参数
    return await promise;
  } catch (e: any) {
    if (e.name === 'AbortError') {
      throw new Error('AI model request timeout');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

// POST: 文本生成
export async function POST(request: Request) {
  const { prompt, context } = await request.json()

    if (!context) {
      return Response.json({ error: 'context is required' }, { status: 400 });
    }
  
  // TODO: DPA
  console.warn('[DescribeUI]', { prompt, context });
  
  // 检查mock模式
  const mockResponse = await handleMockResponse('txt', { prompt, context });
  if (mockResponse) {
    return Response.json(mockResponse);
  }
  
  const modelName = appConfig.openrouterAI.translationModelName;

  // Build system prompt for translation
  let systemPrompt= ''
  const preRule = 'Generate a "describe yourself" response in pure plain text, and DO NOT USE any Markdown or HTML formatting. Use multiple paragraphs structured from general to specific. '
  switch(context) {
    case 'professional':
      systemPrompt = `${preRule} of up to 500 words in a formal, professional tone for a resume or job interview. Maintain to reflect the highlight skills, experiences, or achievements.`
      break;
    case 'social':
      systemPrompt = `${preRule} of 50-100 words in a casual, engaging tone for a social media bio or dating profile. Maintain to reflect personality, hobbies, or passions.`
      break;
    case 'academic':
      systemPrompt = `${preRule} of up to 500 words in a structured, goal-oriented tone for a university application or scholarship. Maintain to emphasize academic background, achievements, or aspirations.`
      break;
    case 'self-discovery':
      systemPrompt = `${preRule} of up to 500 words in a reflective, introspective tone for personal exploration. Maintain to reflect highlight values, traits, or experiences.`
      break;
    case 'creative-writing':
      systemPrompt = `${preRule} of up to 500 words in a vivid, narrative-driven tone for a fictional character description. Maintain to reflect traits, background, or story context.`
      break;
    case 'language-learning':
      systemPrompt = `${preRule} of up to 500 words in simple, clear language for language practice. Maintain to basic vocabulary to describe traits or interests.`
      break;
      default:
        console.error('[AI-Request]',  `[${context}]is not supported!`);
        return Response.json({ error: 'context is not supported' }, { status: 400 });
  }

  // Build messages array for translation
  const messages = [
    {
      role: 'system' as const,
      content: systemPrompt,
    },
    {
      role: 'user' as const,
      content: prompt,
    },
  ];

  // print request log, TODO: DPA
  console.warn('[AI-Request]', { modelName, prompt, systemPrompt });
  
  const openrouter = createOpenRouter({
    apiKey: appConfig.openrouterAI.apiKey,
    headers: appHeaders
  });
  try {
    const response = await applyTimeout(
      (async () => {
        const resp = streamText({
          model: openrouter(modelName),
          messages: messages,
        });
        await resp.consumeStream();
        return await resp.text;
      })(),
      timeout
    );
    // print AI response log, TODO: DPA
    console.warn('[AI-Response]', { text: response });
    return Response.json({ text: response });
  } catch (e: any) {
    if (e.message === 'AI model request timeout') {
      return Response.json({ error: e.message }, { status: 504 });
    }
    throw e;
  }
}
