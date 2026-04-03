'use client';
import React from 'react';
import { Calendar, CheckSquare, MessageSquare, Download, Share2, Clipboard, FileType, FileText, ChevronRight } from 'lucide-react';

export interface ActionItem {
  task: string;
  assignedTo: string;
  deadline: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  speakers: { name: string; content: string }[];
}

interface MainDashboardProps {
  result: AnalysisResult;
  onExport: (format: 'pdf' | 'md' | 'txt') => void;
}

export default function MainDashboard({ result, onExport }: MainDashboardProps) {
  return (
    <div className="animate-fade">
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Meeting Intelligence</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => onExport('pdf')} className="btn btn-secondary">
            <FileType size={18} /> Export PDF
          </button>
          <button onClick={() => onExport('md')} className="btn btn-secondary">
            <Clipboard size={18} /> Markdown
          </button>
          <button onClick={() => onExport('txt')} className="btn btn-secondary">
            <FileText size={18} /> Plain Text
          </button>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Summary & Speakers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Sparkles size={20} color="var(--primary)" />
              <h3 style={{ fontWeight: 600 }}>Executive Summary</h3>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>{result.summary}</p>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <MessageSquare size={20} color="var(--secondary)" />
              <h3 style={{ fontWeight: 600 }}>Transcript & Speakers</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {result.speakers.map((speaker, idx) => (
                <div key={idx} style={{ paddingLeft: '1rem', borderLeft: `2px solid ${idx % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'}` }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem', color: idx % 2 === 0 ? 'var(--primary)' : 'var(--secondary)' }}>
                    {speaker.name}
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>{speaker.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Points & Action Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <ChevronRight size={20} color="var(--accent)" />
              <h3 style={{ fontWeight: 600 }}>Key Highlights</h3>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
              {result.keyPoints.map((point, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', marginTop: '0.65rem' }} />
                  <p style={{ fontSize: '0.95rem' }}>{point}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card" style={{ background: 'rgba(124, 58, 237, 0.05)', borderColor: 'rgba(124, 58, 237, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <CheckSquare size={20} color="var(--primary)" />
              <h3 style={{ fontWeight: 600 }}>Action Items</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.actionItems.map((item, idx) => (
                <div key={idx} className="glass" style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '1rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.task}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span className="badge badge-purple">{item.assignedTo}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      {item.deadline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/>
    </svg>
  );
}
