import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import Auth3D from '../three/Auth3D';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import ResultCard from '../components/ResultCard';

/**
 * Results – page that shows a student’s interview performance statistics.
 * No real data is fetched yet; the page is ready for future integration.
 * It displays:
 *   • Four statistic cards (total, average, highest, latest)
 *   • Empty‑state sections for overview, insights, and history
 */
export default function Results() {
  const navigate = useNavigate();

  // ----- 1️⃣ Front‑end only data model -----
  const [interviewResults, setInterviewResults] = useState([]); // Future data will be pushed here.

  // ----- 2️⃣ Derived statistics (safe for empty array) -----
  const stats = useMemo(() => {
    const total = interviewResults.length;
    const scores = interviewResults.map(r => r.score).filter(s => typeof s === 'number');
    const average = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—';
    const highest = scores.length ? Math.max(...scores) : '—';
    const latest = interviewResults[interviewResults.length - 1];
    const latestScore = latest && typeof latest.score === 'number' ? latest.score : '—';
    return { total, average, highest, latestScore };
  }, [interviewResults]);

  return (
    <div className="dashboard-layout">
      <Auth3D />
      <DashboardSidebar />
      <main className="dashboard-main">
        {/* Header */}
        <header className="dash-welcome-header">
          <h1 className="dash-title">Results &amp; Statistics</h1>
          <p className="dash-subtitle">
            Track your mock interview performance and see how you improve over time.
          </p>
        </header>

        {/* Statistic Cards */}
        <section
          className="stat-card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard label="Total Interviews" value={stats.total} />
          <StatCard label="Average Score" value={stats.average} />
          <StatCard label="Highest Score" value={stats.highest} />
          <StatCard label="Latest Score" value={stats.latestScore} />
        </section>

        {/* Performance Overview – empty state */}
        <section className="overview-section" style={{ marginBottom: '2rem' }}>
          <EmptyState
            icon="📈"
            title="No performance data yet"
            description="Start an interview to begin tracking your scores over time."
            buttonLabel="Start Your First Interview"
            buttonPath="/interview-setup"
          />
        </section>

        {/* Performance Insights – empty state */}
        <section className="insights-section" style={{ marginBottom: '2rem' }}>
          <EmptyState
            icon="💡"
            title="No insights available"
            description="Complete a mock interview to receive personalized performance insights."
            buttonLabel="Interview Now"
            buttonPath="/interview-setup"
          />
        </section>

        {/* Interview History */}
        <section className="history-section">
          {interviewResults.length === 0 ? (
            <EmptyState
              icon="🗂️"
              title="No interviews completed yet"
              description="Your interview history will appear here after you finish mock interviews."
              buttonLabel="Start Interview"
              buttonPath="/interview-setup"
            />
          ) : (
            <div className="result-list" style={{ display: 'grid', gap: '1rem' }}>
              {interviewResults.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  onClick={() => navigate(`/results/${result.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
