import { NextRequest, NextResponse } from 'next/server';
import { openai, hasApiKey } from '@/lib/openai';
import { unlink, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from 'ffmpeg-static';
import ffprobeInstaller from 'ffprobe-static';
import fs from 'fs';

// Configure ffmpeg and ffprobe paths
if (ffmpegInstaller) {
  ffmpeg.setFfmpegPath(ffmpegInstaller);
}
if (ffprobeInstaller) {
  ffmpeg.setFfprobePath(ffprobeInstaller.path);
}

const CHUNK_DURATION = 600; // 10 minutes in seconds

export async function POST(req: NextRequest) {
  if (!hasApiKey) {
    return NextResponse.json({ 
      text: "This is a MOCK TRANSCRIPT because the OpenAI API Key is missing. Sarah: We need to launch by Monday. John: I'll handle the marketing strategy." 
    });
  }
  const uploadDir = join(tmpdir(), 'meetmind_uploads');
  let tempFiles: string[] = [];

  try {
    const { uploadId } = await req.json();

    if (!uploadId) {
      return NextResponse.json({ error: 'No uploadId provided' }, { status: 400 });
    }

    const fullFilePath = join(uploadDir, `${uploadId}.tmp`);
    
    // Check if file exists
    try {
      await access(fullFilePath);
    } catch {
      return NextResponse.json({ error: 'Uploaded file not found' }, { status: 404 });
    }

    // Get duration to decide if we need to split
    const duration = await new Promise<number>((resolve, reject) => {
      ffmpeg.ffprobe(fullFilePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration || 0);
      });
    });

    console.log(`Processing file: ${uploadId}, Duration: ${duration}s`);

    let finalTranscript = '';

    if (duration <= CHUNK_DURATION) {
      // Small file, process directly
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(fullFilePath),
        model: 'whisper-1',
      });
      finalTranscript = transcription.text;
    } else {
      // Large file, split into chunks
      const totalChunks = Math.ceil(duration / CHUNK_DURATION);
      
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = join(uploadDir, `${uploadId}_chunk_${i}.mp3`);
        tempFiles.push(chunkPath);

        const startTime = i * CHUNK_DURATION;

        await new Promise((resolve, reject) => {
          ffmpeg(fullFilePath)
            .setStartTime(startTime)
            .setDuration(CHUNK_DURATION)
            .on('end', resolve)
            .on('error', reject)
            .save(chunkPath);
        });

        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(chunkPath),
          model: 'whisper-1',
        });

        finalTranscript += transcription.text + ' ';
        // Clean up chunk immediately to save space
        await unlink(chunkPath).catch(() => {});
      }
    }

    // Response Cleanup
    await unlink(fullFilePath).catch(() => {});

    return NextResponse.json({ text: finalTranscript.trim() });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Final cleanup attempt
    for (const file of tempFiles) {
      await unlink(file).catch(() => {});
    }
  }
}
