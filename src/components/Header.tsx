'use client';
import React from 'react';
import { Brain, Settings, Github } from 'lucide-react';

export default function Header() {
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
          <h1 style={{ fontSize: '1.25rem', lineHeight: '1' }}>MeetMind <span className="gradient-text">AI</span></h1>
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
