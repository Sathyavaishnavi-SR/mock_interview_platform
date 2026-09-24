import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Interviews', value: '0', icon: '🎯' },
    { label: 'Average Score', value: '—', icon: '📊' },
    { label: 'Highest Score', value: '—', icon: '🏆' },
    { label: 'Interviews This Month', value: '0', icon: '📅' }
  ];

  const mainActions = [
    {
      title: 'Practice for Your Interview',
      description: 'Prepare for an upcoming interview using AI-generated questions based on your resume and approved interview data.',
      buttonText: 'Start Practicing',
      route: '/interview-setup',
      badge: null
    },
    {
      title: 'Post Interview Experience',
      description: 'Share your real interview experience with other PSG students.',
      note: 'Requires admin approval before publication.',
      buttonText: 'Share Experience',
      route: '/post-experience',
      badge: 'Moderated'
    },
    {
      title: 'Post Interview Questions',
      description: 'Submit interview questions you encountered during an interview.',
      note: 'Questions are reviewed before being added to the approved question database.',
      buttonText: 'Submit Questions',
      route: '/post-questions',
      badge: 'Moderated'
    },
    {
      title: 'Results & Statistics',
      description: 'View your previous mock interviews, scores, performance, and progress.',
      buttonText: 'View Results',
      route: '/results',
      badge: null
    }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* 1. Welcome Header */}
        <header className="dash-welcome-header">
          <h1 className="dash-title">Welcome to your interview dashboard</h1>
          <p className="dash-subtitle">Prepare smarter. Practice better. Track your progress.</p>
        </header>

        {/* 2. Statistics Grid */}
        <section className="dash-section">
          <div className="dash-stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="dash-stat-card glass-panel">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-details">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Main Actions Grid */}
        <section className="dash-section">
          <h2 className="dash-section-title">Quick Actions</h2>
          <div className="dash-actions-grid">
            {mainActions.map((action, idx) => (
              <div key={idx} className="dash-action-card glass-panel">
                {action.badge && <span className="action-badge">{action.badge}</span>}
                <h3 className="action-card-title">{action.title}</h3>
                <p className="action-card-desc">{action.description}</p>
                {action.note && <p className="action-card-note">ℹ️ {action.note}</p>}
                <button
                  className="btn-primary action-card-btn"
                  onClick={() => navigate(action.route)}
                >
                  {action.buttonText}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Practice Interview Setup Panel */}
        <section className="dash-section">
          <div className="dash-panel glass-panel setup-panel">
            <div className="panel-content">
              <h2 className="dash-section-title" style={{ marginBottom: '0.5rem' }}>
                Practice for your next interview
              </h2>
              <p className="dash-subtitle" style={{ marginBottom: '1.5rem' }}>
                Get started in 3 simple steps to launch your AI mock interview session.
              </p>

              <div className="setup-steps-horizontal">
                <div className="setup-step">
                  <div className="step-badge">1</div>
                  <span>Upload Resume</span>
                </div>
                <div className="setup-step">
                  <div className="step-badge">2</div>
                  <span>Choose Interview / Role</span>
                </div>
                <div className="setup-step">
                  <div className="step-badge">3</div>
                  <span>Start AI Mock Interview</span>
                </div>
              </div>
            </div>

            <button
              className="btn-primary panel-cta-btn"
              onClick={() => navigate('/interview-setup')}
            >
              Start Interview
            </button>
          </div>
        </section>

        {/* 5. Submissions Status & 6. Recent Activity */}
        <div className="dash-two-col">
          {/* Submissions Section */}
          <section className="dash-section flex-1">
            <h2 className="dash-section-title">Your Submissions</h2>
            <p className="section-subtext">
              Submitted content appears here while waiting for admin review.
            </p>
            <div className="dash-submissions-grid">
              <div className="submission-card glass-panel">
                <div className="sub-icon">📝</div>
                <div className="sub-info">
                  <span className="sub-title">Interview Experiences</span>
                  <span className="sub-status">0 pending</span>
                </div>
              </div>
              <div className="submission-card glass-panel">
                <div className="sub-icon">❓</div>
                <div className="sub-info">
                  <span className="sub-title">Interview Questions</span>
                  <span className="sub-status">0 pending</span>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className="dash-section flex-1">
            <h2 className="dash-section-title">Recent Activity</h2>
            <div className="dash-empty-card glass-panel">
              <div className="empty-icon">📂</div>
              <h4 className="empty-title">No interview activity yet</h4>
              <p className="empty-desc">
                Complete your first mock interview to see your results here.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
