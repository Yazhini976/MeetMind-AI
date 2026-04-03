import { NextRequest, NextResponse } from 'next/server';
import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const chunkIndex = Number(formData.get('chunkIndex'));
    const uploadId = formData.get('uploadId') as string;
    const chunk = formData.get('chunk') as Blob;
    const totalChunks = Number(formData.get('totalChunks'));

    if (!uploadId || !chunk) {
      return NextResponse.json({ error: 'Missing upload fields' }, { status: 400 });
    }

    const bytes = await chunk.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Temp directory for this specific upload
    const uploadDir = join(tmpdir(), 'meetmind_uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, `${uploadId}.tmp`);

    // Append chunk to the file
    // Important: We assume chunks arrive in order for simplicity in this prototype.
    // In a production system, we'd use a temporary naming scheme or seek to the offset.
    await appendFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      isLast: chunkIndex === totalChunks - 1 
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
