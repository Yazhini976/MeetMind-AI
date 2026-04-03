'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import InputSection from '@/components/InputSection';
import MainDashboard, { AnalysisResult } from '@/components/MainDashboard';
import { jsPDF } from 'jspdf';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleProcess = async (content: string | File) => {
    setIsLoading(true);
    setResult(null);

    try {
      const getHeaders = (base: any = {}) => {
        const savedKey = localStorage.getItem('meetmind_openai_key');
        return savedKey ? { ...base, 'x-openai-key': savedKey } : base;
      };

      let transcript = '';

      if (typeof content === 'string') {
        if (content === 'DEMO_SAMPLE') {
          // Generate a synthetic sample
          const genRes = await fetch('/api/generate-sample', { 
            method: 'POST',
            headers: getHeaders()
          });
          if (!genRes.ok) throw new Error('Failed to generate sample');
          const { uploadId } = await genRes.json();
          
          const transcribeRes = await fetch('/api/transcribe', {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ uploadId }),
          });

          if (!transcribeRes.ok) throw new Error('Transcription of sample failed');
          const transcribeData = await transcribeRes.json();
          transcript = transcribeData.text;
        } else {
          transcript = content;
        }
      } else {
        // Transcribe audio using chunked upload
        const { uploadInChunks } = await import('@/lib/uploader');
        const uploadId = await uploadInChunks(content, (p) => {
          console.log(`Upload progress: ${p}%`);
        });
        
        const transcribeRes = await fetch('/api/transcribe', {
          method: 'POST',
          headers: getHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ uploadId }),
        });

        if (!transcribeRes.ok) {
          const err = await transcribeRes.json();
          throw new Error(err.error || 'Transcription failed');
        }
        const transcribeData = await transcribeRes.json();
        transcript = transcribeData.text;
      }

      // Analyze transcript
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ text: transcript }),
      });

      if (!analyzeRes.ok) throw new Error('Analysis failed');
      const analyzeData = await analyzeRes.json();
      setResult(analyzeData);
    } catch (error) {
      console.error(error);
      alert('An error occurred during processing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'pdf' | 'md' | 'txt') => {
    if (!result) return;

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Meeting Intelligence Report', 20, 20);
      
      doc.setFontSize(12);
      doc.text('Summary:', 20, 35);
      const splitSummary = doc.splitTextToSize(result.summary, 170);
      doc.text(splitSummary, 20, 45);

      let yPos = 45 + (splitSummary.length * 7);

      doc.text('Action Items:', 20, yPos + 10);
      yPos += 20;
      result.actionItems.forEach(item => {
        doc.text(`- ${item.task} (${item.assignedTo}) - ${item.deadline}`, 25, yPos);
        yPos += 10;
      });

      doc.save('MeetMind_Report.pdf');
    } else if (format === 'md') {
      const md = `# Meeting Intelligence Report\n\n## Summary\n${result.summary}\n\n## Key Points\n${result.keyPoints.map(p => `- ${p}`).join('\n')}\n\n## Action Items\n${result.actionItems.map(i => `- **${i.task}** | Assinged to: ${i.assignedTo} | Deadline: ${i.deadline}`).join('\n')}\n\n## Speakers\n${result.speakers.map(s => `### ${s.name}\n${s.content}`).join('\n\n')}`;
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MeetMind_Notes.md';
      a.click();
    } else {
      const txt = `Meeting Summary:\n${result.summary}\n\nAction Items:\n${result.actionItems.map(i => `- ${i.task} (${i.assignedTo})`).join('\n')}`;
      const blob = new Blob([txt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MeetMind_Notes.txt';
      a.click();
    }
  };

  return (
    <main>
      <div className="bg-gradient" />
      <Header />
      
      <div className="container">
        {!result && (
          <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="gradient-text">Capture the Essence of Your Meetings</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Upload meeting audio or paste a transcript to get AI-powered summaries, action items, and clear speaker insights in seconds.
            </p>
          </div>
        )}

        <InputSection onProcess={handleProcess} isLoading={isLoading} />

        {result && (
          <MainDashboard result={result} onExport={handleExport} />
        )}
      </div>

      <footer style={{ marginTop: '5rem', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)' }}>
        <p>&copy; 2026 MeetMind AI • Powered by OpenAI</p>
      </footer>
    </main>
  );
}
