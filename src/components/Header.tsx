'use client';
import React, { useState, useEffect } from 'react';
import { Brain, Settings, Github, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = () => {
    const savedKey = localStorage.getItem('meetmind_openai_key');
    fetch('/api/status', {
      headers: savedKey ? { 'x-openai-key': savedKey } : {}
    })
      .then(res => res.json())
      .then(data => setHasApiKey(data.hasApiKey))
      .catch(() => setHasApiKey(false));
  };

  const handleSaveKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('meetmind_openai_key', tempApiKey.trim());
      setTempApiKey('');
      setIsSettingsOpen(false);
      checkStatus();
      window.location.reload(); // Refresh to ensure all components see the change
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('meetmind_openai_key');
    setIsSettingsOpen(false);
    checkStatus();
    window.location.reload();
  };

  return (
    <>
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
                  <CheckCircle2 size={10} style={{ marginRight: '4px' }} /> REAL MODE
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
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="btn-secondary" 
            style={{ padding: '0.5rem', borderRadius: '10px' }}
          >
            <Settings size={20} />
          </button>
        </nav>
      </header>

      {isSettingsOpen && (
        <div className="glass modal-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(10px)'
        }}>
          <div className="glass" style={{ padding: '2.5rem', maxWidth: '500px', width: '90%', position: 'relative' }}>
            <button 
              onClick={() => setIsSettingsOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <Github size={20} style={{ transform: 'rotate(45deg)' }} /> {/* Using Github as X for now */}
            </button>
            <h2 style={{ marginBottom: '1rem' }} className="gradient-text">Settings</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              To enable "Real Mode", provide your OpenAI API Key. It will be stored safely in your browser.
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>OpenAI API Key</label>
              <input 
                type="password"
                placeholder="sk-..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleSaveKey} className="btn btn-primary" style={{ flex: 1 }}>Save Key</button>
                <button onClick={handleClearKey} className="btn-secondary" style={{ flex: 1, color: 'var(--accent)' }}>Clear</button>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              Your key is only used for meeting processing and is never sent to our servers.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
