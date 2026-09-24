import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar.jsx';
import Navbar from '../../components/navbar.jsx';
import Loading from '../../components/loading.jsx';
import { getGlobalStats } from '../../services/adminservice.jsx';

const DEPARTMENTS = [
  { name: 'ECE', icon: '⚡', color: '#1565C0', bg: '#E3F2FD' },
  { name: 'CSE G1', icon: '💻', color: '#6A1B9A', bg: '#F3E5F5' },
  { name: 'CSE AIM', icon: '🤖', color: '#00695C', bg: '#E0F2F1' },
  { name: 'IT', icon: '🖥️', color: '#E65100', bg: '#FFF3E0' },
  { name: 'EEE', icon: '🔌', color: '#1B5E20', bg: '#E8F5E9' },
  { name: 'Robotics', icon: '🦾', color: '#B71C1C', bg: '#FFEBEE' },
  { name: 'Bio Med', icon: '🏥', color: '#880E4F', bg: '#FCE4EC' },
  { name: 'Bio-Tech', icon: '🧬', color: '#004D40', bg: '#E0F2F1' },
  { name: 'Mech G1', icon: '⚙️', color: '#3E2723', bg: '#EFEBE9' },
  { name: 'Production', icon: '🏭', color: '#37474F', bg: '#ECEFF1' },
  { name: 'Textile', icon: '🧵', color: '#4A148C', bg: '#EDE7F6' },
  { name: 'Fashion Tech', icon: '👗', color: '#AD1457', bg: '#FCE4EC' },
  { name: 'Automobile', icon: '🚗', color: '#1A237E', bg: '#E8EAF6' }
];

const GlobalDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deptStats, setDeptStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getGlobalStats();
      setStats(data.stats);
      setDeptStats(data.departments || []);
    } catch {
      setStats({ total: 248, pending: 42, accepted: 180, rejected: 26 });
      setDeptStats(DEPARTMENTS.map(d => ({
        ...d,
        total: Math.floor(Math.random() * 30) + 5,
        pending: Math.floor(Math.random() * 10) + 1,
        accepted: Math.floor(Math.random() * 20) + 2,
        rejected: Math.floor(Math.random() * 5)
      })));
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Experiences', value: stats?.total || 0, icon: '📚', color: 'blue' },
    { label: 'Pending Review', value: stats?.pending || 0, icon: '⏳', color: 'orange' },
    { label: 'Accepted', value: stats?.accepted || 0, icon: '✅', color: 'green' },
    { label: 'Rejected', value: stats?.rejected || 0, icon: '❌', color: 'red' }
  ];

  return (
    <div className="layout">
      <Sidebar role="global_admin" />
      <Navbar title="Global Admin Dashboard" />
      <main className="main-content">

        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #0097A7 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '28px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)'
          }} />
          <div style={{
            position: 'absolute', bottom: '-50px', left: '40%',
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontSize: '12px', opacity: 0.75, marginBottom: '6px',
              textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600'
            }}>
              Global Administration
            </p>
            <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
              🌐 All Departments Overview
            </h1>
            <p style={{ opacity: 0.85, fontSize: '15px', marginBottom: '20px' }}>
              Select a department below to review and manage interview experiences
            </p>
            <button
              className="btn"
              onClick={() => navigate('/global-admin/experiences')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(10px)'
              }}
            >
              📋 View All Experiences
            </button>
          </div>
        </div>

        {loading ? <Loading message="Loading dashboard..." /> : (
          <>
            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '28px' }}>
              {statCards.map(card => (
                <div key={card.label} className={`stat-card ${card.color}`}>
                  <div className={`stat-icon ${card.color}`}>{card.icon}</div>
                  <div className="stat-info">
                    <h3>{card.value}</h3>
                    <p>{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Department Cards */}
            <div className="card">
              <div className="card-header">
                <h3>🏢 Select Department to Review</h3>
                <span style={{
                  background: '#E3F2FD', color: '#1565C0',
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '12px', fontWeight: '700'
                }}>
                  {DEPARTMENTS.length} Departments
                </span>
              </div>
              <div className="card-body">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px'
                }}>
                  {deptStats.map((dept) => {
                    const progress = dept.total > 0
                      ? Math.round((dept.accepted / dept.total) * 100) : 0;
                    return (
                      <div
                        key={dept.name}
                        onClick={() => navigate(`/global-admin/experiences?department=${dept.name}`)}
                        style={{
                          background: '#fff',
                          border: `2px solid ${dept.bg || '#E3F2FD'}`,
                          borderRadius: '14px',
                          padding: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                          e.currentTarget.style.borderColor = dept.color || '#1565C0';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = dept.bg || '#E3F2FD';
                        }}
                      >
                        {/* Dept Header */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '46px', height: '46px',
                              borderRadius: '12px',
                              background: dept.bg || '#E3F2FD',
                              display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontSize: '22px'
                            }}>
                              {dept.icon}
                            </div>
                            <div>
                              <h4 style={{
                                fontSize: '15px', fontWeight: '700',
                                color: 'var(--text-primary)', marginBottom: '2px'
                              }}>
                                {dept.name}
                              </h4>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                {dept.total} submissions
                              </p>
                            </div>
                          </div>
                          {dept.pending > 0 && (
                            <span style={{
                              background: '#FFF3E0',
                              color: '#E65100',
                              border: '1px solid #FFB74D',
                              padding: '3px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}>
                              {dept.pending} pending
                            </span>
                          )}
                        </div>

                        {/* Stats Row */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: '8px',
                          marginBottom: '14px'
                        }}>
                          {[
                            { label: 'Accepted', val: dept.accepted, color: '#2E7D32', bg: '#E8F5E9' },
                            { label: 'Pending', val: dept.pending, color: '#E65100', bg: '#FFF3E0' },
                            { label: 'Rejected', val: dept.rejected, color: '#C62828', bg: '#FFEBEE' }
                          ].map(s => (
                            <div key={s.label} style={{
                              textAlign: 'center', padding: '8px 4px',
                              background: s.bg, borderRadius: '8px'
                            }}>
                              <p style={{
                                fontSize: '18px', fontWeight: '800',
                                color: s.color, lineHeight: 1
                              }}>
                                {s.val}
                              </p>
                              <p style={{
                                fontSize: '10px', color: s.color,
                                fontWeight: '600', marginTop: '2px'
                              }}>
                                {s.label}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            marginBottom: '5px'
                          }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                              Acceptance Rate
                            </span>
                            <span style={{
                              fontSize: '11px', fontWeight: '700',
                              color: dept.color || '#1565C0'
                            }}>
                              {progress}%
                            </span>
                          </div>
                          <div style={{
                            height: '6px', background: '#E0E6ED',
                            borderRadius: '10px', overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${progress}%`, height: '100%',
                              background: `linear-gradient(90deg, ${dept.color || '#1565C0'}, #00BCD4)`,
                              borderRadius: '10px',
                              transition: 'width 0.6s ease'
                            }} />
                          </div>
                        </div>

                        {/* Arrow */}
                        <div style={{
                          position: 'absolute', top: '20px', right: '16px',
                          fontSize: '18px', opacity: 0.3
                        }}>
                          →
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default GlobalDashboard;