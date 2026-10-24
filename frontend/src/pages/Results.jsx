import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import Auth3D from '../three/Auth3D';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import ResultCard from '../components/ResultCard';
import { apiRequest } from '../services/api';

/**
 * Results & Statistics Page
 * Displays overall performance metrics, interview history, and deep-dive question evaluations.
 */
export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();

  const [interviewResults, setInterviewResults] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    average: '—',
    highest: '—',
    latest: '—',
  });
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch all completed interviews on mount
  useEffect(() => {
    fetchInterviews();
  }, []);

  // If navigated directly from completing an interview, show its details
  useEffect(() => {
    if (location.state?.latestResult) {
      setSelectedInterview(location.state.latestResult);
    }
  }, [location.state]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/interviews/my');
      if (response.success) {
        setInterviewResults(response.interviews || []);
        if (response.stats) {
          setStats(response.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load interview results:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full details of an individual interview session
  const handleSelectInterview = async (id) => {
    setDetailLoading(true);
    try {
      const response = await apiRequest(`/interviews/${id}`);
      if (response.success && response.interview) {
        setSelectedInterview(response.interview);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Failed to fetch interview detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Auth3D />
      <DashboardSidebar />

      <main className="dashboard-main">
        {/* Header */}
        <header className="dash-welcome-header">
          <h1 className="dash-title">Results &amp; Statistics</h1>
          <p className="dash-subtitle">
            Track your mock interview performance, review AI feedback, and identify key areas of improvement.
          </p>
        </header>

        {/* 1. Statistic Cards */}
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
          <StatCard label="Latest Score" value={stats.latest} />
        </section>

        {/* 2. Detailed Performance Report (When an interview is selected or just finished) */}
        {selectedInterview && (
          <section className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', marginBottom: '2.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase' }}>
                  Detailed Performance Evaluation
                </span>
                <h2 style={{ fontSize: '1.5rem', color: '#f8fafc', margin: '0.25rem 0' }}>
                  {selectedInterview.targetRole || selectedInterview.role} ({selectedInterview.interviewType})
                </h2>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  Difficulty: {selectedInterview.difficulty}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.25rem', fontWeight: 700, color: selectedInterview.overallScore >= 70 ? '#10b981' : '#f59e0b' }}>
                  {selectedInterview.overallScore != null ? `${selectedInterview.overallScore}/100` : '—'}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Overall Score</span>
              </div>
            </div>

            {/* Summary Feedback */}
            {selectedInterview.summaryFeedback && (
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Interviewer Summary
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                  {selectedInterview.summaryFeedback}
                </p>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
              {/* Strengths */}
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#34d399', fontSize: '0.95rem', fontWeight: 600, marginTop: 0, marginBottom: '0.75rem' }}>
                  Key Strengths
                </h4>
                {selectedInterview.strengths && selectedInterview.strengths.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {selectedInterview.strengths.map((str, idx) => (
                      <li key={idx} style={{ marginBottom: '0.35rem' }}>{str}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Good overall attempt.</p>
                )}
              </div>

              {/* Improvements */}
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.25rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 600, marginTop: 0, marginBottom: '0.75rem' }}>
                  Areas for Improvement
                </h4>
                {selectedInterview.improvements && selectedInterview.improvements.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {selectedInterview.improvements.map((imp, idx) => (
                      <li key={idx} style={{ marginBottom: '0.35rem' }}>{imp}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Consistent answers across all topics.</p>
                )}
              </div>
            </div>

            {/* Per-Question Breakdown */}
            {selectedInterview.questions && selectedInterview.questions.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '1rem', fontWeight: 600 }}>
                  Question-by-Question Evaluation
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {selectedInterview.questions.map((q, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.25rem',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
                          Question {q.order || idx + 1}
                        </span>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: (q.score ?? 0) >= 7 ? '#10b981' : (q.score ?? 0) >= 4 ? '#f59e0b' : '#ef4444',
                          }}
                        >
                          Score: {q.score != null ? `${q.score}/10` : '—'}
                        </span>
                      </div>

                      <p style={{ color: '#f8fafc', fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                        {q.text}
                      </p>

                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Your Response:</span>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', fontStyle: q.userAnswer ? 'normal' : 'italic', marginTop: '0.25rem' }}>
                          {q.userAnswer || '[No response provided]'}
                        </p>
                      </div>

                      <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 600 }}>AI Feedback:</span>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.25rem 0 0 0', lineHeight: 1.5 }}>
                          {q.feedback || 'Evaluated.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                className="btn-secondary"
                onClick={() => setSelectedInterview(null)}
              >
                Close Detailed View
              </button>
            </div>
          </section>
        )}

        {/* 3. Interview History Section */}
        <section className="history-section">
          <h2 className="dash-section-title" style={{ marginBottom: '1rem' }}>
            Interview History
          </h2>

          {loading ? (
            <p style={{ color: '#94a3b8' }}>Loading interview records...</p>
          ) : interviewResults.length === 0 ? (
            <EmptyState
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
                  onClick={() => handleSelectInterview(result.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
