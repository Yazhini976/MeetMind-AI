import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

export async function GET(req: NextRequest) {
  const customKey = req.headers.get('x-openai-key');
  const { isMock } = getOpenAIClient(customKey);
  return NextResponse.json({ hasApiKey: !isMock });
}
