import OpenAI from 'openai';

export const hasApiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';

if (!hasApiKey) {
  console.warn('⚠️ MeetMind AI: OPENAI_API_KEY is not defined. Falling back to MOCK MODE.');
}

export const openai = new OpenAI({
  apiKey: hasApiKey ? process.env.OPENAI_API_KEY : 'mock-key',
});
