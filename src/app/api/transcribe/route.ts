import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write to a temp file for Whisper API
    const tempPath = join(tmpdir(), `meetmind_${Date.now()}_${file.name}`);
    await writeFile(tempPath, buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: require('fs').createReadStream(tempPath),
      model: 'whisper-1',
    });

    // Cleanup
    await unlink(tempPath);

    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
