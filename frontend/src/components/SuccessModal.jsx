import React from 'react';

export default function SuccessModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 style={{ color: '#10b981', margin: '0 0 0.75rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
          {title}
        </h2>

        <p
          style={{
            color: '#94a3b8',
            lineHeight: '1.6',
            fontSize: '0.95rem',
            whiteSpace: 'pre-line',
            margin: '0 0 1.5rem 0',
          }}
        >
          {message}
        </p>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{
            padding: '0.65rem 2rem',
            fontSize: '0.95rem',
            cursor: 'pointer',
            minWidth: '120px',
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

