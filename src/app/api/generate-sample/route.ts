import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(req: NextRequest) {
  try {
    const demoScript = `
      Sarah: Hi John, I've looked at the product launch timeline. We need to finalize the slides by next Monday.
      John: That sounds good, Sarah. I will prepare the marketing plan and send the invitations by tomorrow. 
      Sarah: Great. Also, Mark needs to review the budget before Friday's board meeting.
      John: I'll make sure he gets it.
    `;

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: demoScript,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const uploadId = crypto.randomUUID();
    const uploadDir = join(tmpdir(), 'meetmind_uploads');
    
    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, `${uploadId}.tmp`);

    // Save as a temporary file for the transcription pipeline
    await writeFile(filePath, buffer);

    return NextResponse.json({ uploadId });
  } catch (error: any) {
    console.error('Demo Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
