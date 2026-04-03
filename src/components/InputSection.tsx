'use client';
import React, { useState, useRef } from 'react';
import { Upload, FileText, Mic, Sparkles, X } from 'lucide-react';

interface InputSectionProps {
  onProcess: (content: string | File) => void;
  isLoading: boolean;
}

export default function InputSection({ onProcess, isLoading }: InputSectionProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = () => {
    if (activeTab === 'upload' && file) {
      onProcess(file);
    } else if (activeTab === 'text' && text.trim()) {
      onProcess(text);
    }
  };

  return (
    <section className="glass animate-fade" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('upload')}
          className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
        >
          <Upload size={20} /> Upload Audio
        </button>
        <button 
          onClick={() => setActiveTab('text')}
          className={`btn ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
        >
          <FileText size={20} /> Raw Transcript
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div style={{ position: 'relative' }}>
          <div 
            onClick={handleUploadClick}
            style={{
              border: '2px dashed var(--glass-border)',
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              background: 'rgba(15, 23, 42, 0.2)',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="audio/*" 
            />
            {file ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Mic size={48} color="var(--primary)" />
                <div>
                  <p style={{ fontWeight: 600 }}>{file.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }} 
                  className="btn-secondary" 
                  style={{ padding: '0.25rem', borderRadius: '50%' }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                  <Upload size={48} />
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Click or drag audio file here</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>MP3, WAV, M4A up to 500MB</p>
              </>
            )}
          </div>
          
          {!file && !isLoading && (
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem'
            }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onProcess('DEMO_SAMPLE');
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                <Mic size={14} style={{ marginRight: '4px' }} /> Try a Demo
              </button>
            </div>
          )}
        </div>
      ) : (
        <textarea 
          placeholder="Paste your meeting notes or raw transcript here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          style={{ resize: 'none' }}
        />
      )}

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn btn-primary" 
          disabled={isLoading || (activeTab === 'upload' ? !file : !text.trim())}
          onClick={handleProcess}
          style={{ minWidth: '200px' }}
        >
          {isLoading ? (
            <span className="spinner" />
          ) : (
            <>
              <Sparkles size={20} /> Generate Intelligence
            </>
          )}
        </button>
      </div>
    </section>
  );
}
