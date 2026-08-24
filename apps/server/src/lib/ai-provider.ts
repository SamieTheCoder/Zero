import { createOpenAI } from '@ai-sdk/openai';
import { env } from '../env';

export const openai = (model: string) => {
  const provider = createOpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  });
  return provider(model);
};
