import { NextRequest, NextResponse } from 'next/server';
import { openai, hasApiKey } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!hasApiKey) {
      // Mock Data for Demo purposes
      return NextResponse.json({
        "summary": "This is a MOCK SUMMARY (API KEY MISSING). Discussion about upcoming product launch.",
        "keyPoints": [
          "Launch planned next week",
          "Sarah to handle slides",
          "John to manage marketing"
        ],
        "actionItems": [
          { "task": "Prepare slides", "assignedTo": "Sarah", "deadline": "Monday" },
          { "task": "Marketing plan", "assignedTo": "John", "deadline": "Wednesday" }
        ],
        "speakers": [
          { "name": "Sarah", "content": "We need to launch by Monday." },
          { "name": "John", "content": "I'll handle the marketing strategy." }
        ],
        "isMock": true
      });
    }

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
