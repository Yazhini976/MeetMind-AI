import OpenAI from 'openai';

export const hasServerApiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';

export function getOpenAIClient(customKey?: string | null) {
  const apiKey = customKey || process.env.OPENAI_API_KEY;
  const isMock = !apiKey || apiKey === 'your_openai_api_key_here';

  return {
    client: new OpenAI({
      apiKey: isMock ? 'mock-key' : apiKey,
    }),
    isMock
  };
}

// Default export for simpler use cases (will use process.env)
export const openai = new OpenAI({
  apiKey: hasServerApiKey ? process.env.OPENAI_API_KEY : 'mock-key',
});
