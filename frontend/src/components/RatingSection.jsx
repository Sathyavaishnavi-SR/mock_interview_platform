import React from 'react';

export default function RatingSection() {
  return (
    <section className="section" id="student-ratings">
      <div className="container">
        <div className="glass-panel rating-panel">
          <div className="rating-stars">★★★★★</div>
          <div className="rating-score">4.9 / 5.0</div>
          <p className="rating-subtext">
            Average rating based on student mock interview evaluation trials
          </p>
          <div className="demo-tag">
            ℹ️ Demo Metric Placeholder • Real platform analytics powered by Supabase backend
          </div>
        </div>
      </div>
    </section>
  );
}

