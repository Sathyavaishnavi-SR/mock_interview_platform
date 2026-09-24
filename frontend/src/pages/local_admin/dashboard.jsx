import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar.jsx';
import Navbar from '../../components/navbar.jsx';
import Loading from '../../components/loading.jsx';
import { getLocalStats } from '../../services/adminservice.jsx';
import { useAuth } from '../../context/authentication.jsx';

const LocalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentExperiences, setRecentExperiences] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getLocalStats();
      setStats(data.stats);
      setRecentExperiences(data.recent || []);
    } catch {
      // Mock data
      setStats({
        total: 38,
        pending: 12,
        accepted: 22,
        rejected: 4
      });
      setRecentExperiences([
        {
          _id: '1',
          studentName: 'Priya Sharma',
          company: 'TCS',
          role: 'Software Engineer',
          status: 'pending',
          submittedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: '2',
          studentName: 'Rahul Verma',
          company: 'Infosys',
          role: 'System Engineer',
          status: 'pending',
          submittedAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          _id: '3',
          studentName: 'Anjali Singh',
          company: 'Wipro',
          role: 'Data Analyst',
          status: 'accepted',
          submittedAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          _id: '4',
          studentName: 'Karthik M',
          company: 'Cognizant',
          role: 'Full Stack Developer',
          status: 'accepted',
          submittedAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
          _id: '5',
          studentName: 'Deepa R',
          company: 'HCL',
          role: 'Cloud Engineer',
          status: 'rejected',
          submittedAt: new Date(Date.now() - 432000000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Submissions',
      value: stats?.total || 0,
      icon: '📚',
      color: 'blue',
      desc: `From ${user?.department || 'Department'} students`
    },
    {
      label: 'Pending Review',
      value: stats?.pending || 0,
      icon: '⏳',
      color: 'orange',
      desc: 'Awaiting your verification'
    },
    {
      label: 'Accepted',
      value: stats?.accepted || 0,
      icon: '✅',
      color: 'green',
      desc: 'Verified experiences'
    },
    {
      label: 'Rejected',
      value: stats?.rejected || 0,
      icon: '❌',
      color: 'red',
      desc: 'Declined submissions'
    }
  ];

  const acceptanceRate = stats?.total > 0
    ? Math.round((stats.accepted / stats.total) * 100)
    : 0;

  return (
    <div className="layout">
      <Sidebar role="local_admin" />
      <Navbar title={`${user?.department || 'Department'} Admin Dashboard`} />

      <main className="main-content">
        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #0097A7 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          marginBottom: '28px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '30%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontSize: '13px',
              opacity: 0.8,
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              Welcome back
            </p>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '800',
              marginBottom: '8px'
            }}>
              👋 {user?.name || 'Local Admin'}
            </h1>
            <p style={{ opacity: 0.85, fontSize: '15px', marginBottom: '16px' }}>
              Managing interview experiences for{' '}
              <strong>{user?.department || 'your department'}</strong>
            </p>
            {stats?.pending > 0 && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,152,0,0.25)',
                border: '1px solid rgba(255,152,0,0.5)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ⏳ {stats.pending} experiences waiting for your review
              </div>
            )}
          </div>
        </div>

        {loading ? <Loading message="Loading dashboard..." /> : (
          <>
            {/* Stats */}
            <div className="stats-grid">
              {statCards.map((card) => (
                <div key={card.label} className={`stat-card ${card.color}`}>
                  <div className={`stat-icon ${card.color}`}>{card.icon}</div>
                  <div className="stat-info">
                    <h3>{card.value}</h3>
                    <p>{card.label}</p>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--text-light)',
                      marginTop: '2px',
                      display: 'block'
                    }}>
                      {card.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress & Action Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '24px'
            }}>
              {/* Acceptance Rate */}
              <div className="card">
                <div className="card-header">
                  <h3>📈 Verification Progress</h3>
                </div>
                <div className="card-body">
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        Acceptance Rate
                      </span>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: 'var(--success)'
                      }}>
                        {acceptanceRate}%
                      </span>
                    </div>
                    <div style={{
                      height: '10px',
                      background: '#E0E6ED',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${acceptanceRate}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #1565C0, #00BCD4)',
                        borderRadius: '10px',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                    marginTop: '20px'
                  }}>
                    {[
                      { label: 'Accepted', value: stats?.accepted || 0, color: '#2E7D32', bg: '#E8F5E9' },
                      { label: 'Pending', value: stats?.pending || 0, color: '#E65100', bg: '#FFF3E0' },
                      { label: 'Rejected', value: stats?.rejected || 0, color: '#C62828', bg: '#FFEBEE' }
                    ].map(item => (
                      <div key={item.label} style={{
                        textAlign: 'center',
                        padding: '12px 8px',
                        background: item.bg,
                        borderRadius: '8px'
                      }}>
                        <p style={{
                          fontSize: '22px',
                          fontWeight: '800',
                          color: item.color
                        }}>
                          {item.value}
                        </p>
                        <p style={{
                          fontSize: '11px',
                          color: item.color,
                          fontWeight: '600',
                          marginTop: '2px'
                        }}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <h3>⚡ Quick Actions</h3>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    className="btn btn-primary"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => navigate('/local-admin/experiences?status=pending')}
                  >
                    ⏳ Review Pending ({stats?.pending || 0})
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => navigate('/local-admin/experiences')}
                  >
                    📋 View All Experiences
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => navigate('/local-admin/experiences?status=accepted')}
                  >
                    ✅ View Accepted ({stats?.accepted || 0})
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="card">
              <div className="card-header">
                <h3>🕐 Recent Submissions</h3>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate('/local-admin/experiences')}
                >
                  View All
                </button>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExperiences.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                          No recent submissions
                        </td>
                      </tr>
                    ) : recentExperiences.map((exp) => (
                      <tr key={exp._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #1565C0, #00BCD4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '700'
                            }}>
                              {exp.studentName?.charAt(0)?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '14px' }}>
                              {exp.studentName}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontWeight: '600', color: 'var(--primary)' }}>
                          {exp.company}
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {exp.role}
                        </td>
                        <td>
                          <span className={`badge badge-${exp.status}`}>{exp.status}</span>
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {new Date(exp.submittedAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`/local-admin/experiences/${exp._id}`)}
                          >
                            👁️ View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default LocalDashboard;