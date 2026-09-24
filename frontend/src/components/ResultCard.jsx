import React from 'react';

/**
 * ResultCard – placeholder for an individual interview result entry.
 * Props:
 *   result: object with fields { id, date, role, interviewType, difficulty, score, status }
 *   onClick: optional handler when the card is clicked.
 */
export default function ResultCard({ result, onClick }) {
  const { date, role, interviewType, difficulty, score, status } = result || {};
  return (
    <div
      className="glass-panel result-card"
      style={{ padding: '1rem', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{role || '—'}</span>
        <span style={{ color: 'var(--text-muted)' }}>{date ? new Date(date).toLocaleDateString() : '—'}</span>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <span>{interviewType || '—'}</span> • <span>{difficulty || '—'}</span>
      </div>
      <div>
        <strong>Score:</strong> {score != null ? score : '—'} • <strong>Status:</strong> {status || '—'}
      </div>
    </div>
  );
}

