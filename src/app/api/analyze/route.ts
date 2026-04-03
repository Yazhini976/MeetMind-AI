import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const prompt = `
      You are an expert meeting analyst. Analyze the following meeting transcript/notes and return a JSON object with the following structure:
      {
        "summary": "Full summary of the meeting",
        "keyPoints": ["Point 1", "Point 2", ...],
        "actionItems": [
          { "task": "What needs to be done", "assignedTo": "Who is responsible", "deadline": "When it's due" }
        ],
        "speakers": [
          { "name": "Speaker Name/Label", "content": "What they said or key contributions" }
        ]
      }

      Transcript:
      ${text}

      If there are no clear speakers, label as "Speaker 1"/ "Speaker 2" or "Narrator".
      Ensure action items are very specific.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
