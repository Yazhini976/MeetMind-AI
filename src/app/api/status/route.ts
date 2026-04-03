import { NextResponse } from 'next/server';
import { hasApiKey } from '@/lib/openai';

export async function GET() {
  return NextResponse.json({ hasApiKey });
}
