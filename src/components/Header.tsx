'use client';
import React, { useState, useEffect } from 'react';
import { Brain, Settings, Github, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setHasApiKey(data.hasApiKey))
      .catch(() => setHasApiKey(false));
  }, []);

  return (
    <header className="glass" style={{
      margin: '1rem',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: '1rem',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'var(--primary)',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
        }}>
          <Brain size={24} color="white" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.25rem', lineHeight: '1' }}>MeetMind <span className="gradient-text">AI</span></h1>
            {hasApiKey === false && (
              <span className="badge badge-teal" style={{ background: 'rgba(244, 114, 182, 0.2)', color: 'var(--accent)', fontSize: '0.65rem' }}>
                <AlertTriangle size={10} style={{ marginRight: '4px' }} /> MOCK MODE
              </span>
            )}
            {hasApiKey === true && (
              <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>
                <CheckCircle2 size={10} style={{ marginRight: '4px' }} /> API READY
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smart Meeting Intelligence</p>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <a href="https://github.com/Yazhini976/MeetMind-AI" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '10px' }}>
          <Github size={20} />
        </a>
        <button className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '10px' }}>
          <Settings size={20} />
        </button>
      </nav>
    </header>
  );
}
