import React from 'react';

/**
 * StatCard – displays a label and a numeric/value.
 * Props:
 *   label: string – the description (e.g., "Total Interviews")
 *   value: string|number – the displayed value (e.g., 0 or "—")
 */
export default function StatCard({ label, value }) {
  return (
    <div className="glass-panel stat-card">
      <div className="stat-label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{label}</div>
      <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--primary)' }}>{value}</div>
    </div>
  );
}

