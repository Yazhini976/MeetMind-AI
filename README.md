# MeetMind AI – Smart Meeting Intelligence System

MeetMind AI transforms unstructured meeting conversations into structured, actionable insights in real time.

## 🚀 Features

*   **Speech-to-Text (OpenAI Whisper)**: High-accuracy transcription of meeting audio.
*   **AI Summarization**: Concise executive summaries of long discussions.
*   **Action Item Extraction**: Automatic identification of tasks, assignees, and deadlines.
*   **Speaker Differentiation**: Intelligent labeling of conversation participants.
*   **Multi-format Export**: Download reports in PDF, Markdown, or Plain Text.
*   **Premium UI**: A modern, glassmorphism-inspired dark mode interface.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15, React, Lucide Icons, Vanilla CSS (Premium Custom Design).
*   **AI Models**: 
    *   OpenAI Whisper (`whisper-1`) for STT.
    *   OpenAI GPT-4o for Meeting Analysis.
*   **Libraries**: `jspdf` for PDF generation, `openai` SDK.

## 📋 Prerequisites

*   Node.js 18+
*   OpenAI API Key

## ⚙️ Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file from the example:
    ```bash
    cp .env.local.example .env.local
    ```
4.  Add your `OPENAI_API_KEY` to `.env.local`.
5.  Run the development server:
    ```bash
    npm run dev
    ```

## 🔗 Workflow

1.  **Input**: User uploads an audio file (`.mp3`, `.wav`, etc.) or pastes a raw transcript.
2.  **Transcription**: If audio is uploaded, it's sent to Whisper for conversion to text.
3.  **Analysis**: The transcript is processed by GPT-4o using custom prompts to extract structured data.
4.  **Display**: MeetMind AI displays the Summary, Key Highlights, Action Items, and Speaker split in a glass-finished dashboard.
5.  **Export**: Users can export the generated intelligence for follow-ups.

---
Developed with ❤️ by MeetMind AI Team.
"Transforming conversations into clarity."
