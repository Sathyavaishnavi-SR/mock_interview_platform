import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * EmptyState – generic placeholder UI shown when there is no data.
 * Props:
 *   icon: React element or string (optional) – visual cue, e.g., an emoji or SVG.
 *   title: string – main heading.
 *   description: string – supporting text.
 *   buttonLabel: string – call‑to‑action button text.
 *   buttonPath: string – route to navigate when the button is clicked.
 */
export default function EmptyState({ icon, title, description, buttonLabel, buttonPath }) {
  const navigate = useNavigate();
  return (
    <div className="glass-panel empty-state" style={{ textAlign: 'center', padding: '2rem' }}>
      {icon && <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{description}</p>
      {buttonLabel && buttonPath && (
        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate(buttonPath)}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

