import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar.jsx';
import Navbar from '../../components/navbar.jsx';
import Loading from '../../components/loading.jsx';
import {
  getDepartmentExperiences,
  localAcceptExperience,
  localRejectExperience
} from '../../services/adminservice.jsx';
import { useAuth } from '../../context/authentication.jsx';

const STATUS_OPTIONS = ['All', 'Pending', 'Accepted', 'Rejected'];

const DepartmentExperiences = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'All'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [alert, setAlert] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchExperiences();
  }, [statusFilter]);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();
      const data = await getDepartmentExperiences(params);
      setExperiences(data.experiences || data || []);
    } catch {
      // Mock data
      const companies = ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture'];
      const roles = ['Software Engineer', 'Data Analyst', 'Full Stack Developer'];
      const statuses = ['pending', 'pending', 'accepted', 'rejected', 'accepted'];
      const rounds = ['Technical Round 1', 'HR Round', 'Aptitude', 'Technical Round 2'];
      const names = ['Priya S', 'Rahul V', 'Anjali R', 'Karthik M', 'Deepa S',
        'Arun K', 'Meera T', 'Vijay R', 'Lakshmi A', 'Sanjay P',
        'Divya M', 'Ramesh G', 'Nisha K', 'Suresh L', 'Pooja R'];

      setExperiences(Array.from({ length: 25 }, (_, i) => ({
        _id: `exp_${i + 1}`,
        studentName: names[i % names.length],
        company: companies[i % companies.length],
        role: roles[i % roles.length],
        department: user?.department || 'ECE',
        round: rounds[i % rounds.length],
        status: statuses[i % statuses.length],
        submittedAt: new Date(Date.now() - i * 86400000).toISOString(),
        topics: ['DSA', 'OOPS', 'SQL']
      })));
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleAccept = async (id) => {
    setActionLoading(id + '_accept');
    try {
      await localAcceptExperience(id);
      setExperiences(prev =>
        prev.map(e => e._id === id ? { ...e, status: 'accepted' } : e)
      );
      showAlert('success', 'Experience accepted successfully!');
    } catch {
      showAlert('error', 'Failed to accept experience.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(rejectModal + '_reject');
    try {
      await localRejectExperience(rejectModal, rejectReason);
      setExperiences(prev =>
        prev.map(e => e._id === rejectModal ? { ...e, status: 'rejected' } : e)
      );
      showAlert('success', 'Experience rejected.');
      setRejectModal(null);
      setRejectReason('');
    } catch {
      showAlert('error', 'Failed to reject experience.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = experiences.filter(exp => {
    const matchSearch = !search ||
      exp.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      exp.company?.toLowerCase().includes(search.toLowerCase()) ||
      exp.role?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' ||
      exp.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pendingCount = experiences.filter(e => e.status === 'pending').length;

  return (
    <div className="layout">
      <Sidebar role="local_admin" />
      <Navbar title={`${user?.department || 'Department'} Experiences`} />

      <main className="main-content">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              🏢 {user?.department || 'Department'} Experiences
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Verify interview experiences submitted by your department students
            </p>
          </div>
          {pendingCount > 0 && (
            <div style={{
              background: '#FFF3E0',
              border: '1px solid #FFB74D',
              borderRadius: '10px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>⏳</span>
              <div>
                <p style={{ fontWeight: '700', color: '#E65100', fontSize: '16px' }}>
                  {pendingCount}
                </p>
                <p style={{ fontSize: '12px', color: '#BF360C' }}>Pending Review</p>
              </div>
            </div>
          )}
        </div>

        {/* Alert */}
        {alert && (
          <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
            {alert.type === 'success' ? '✅' : '❌'} {alert.message}
          </div>
        )}

        {/* Status Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {STATUS_OPTIONS.map(status => {
            const count = status === 'All'
              ? experiences.length
              : experiences.filter(e => e.status === status.toLowerCase()).length;
            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '20px',
                  border: '2px solid',
                  borderColor: statusFilter === status ? 'var(--primary)' : 'var(--border)',
                  background: statusFilter === status ? 'var(--primary)' : '#fff',
                  color: statusFilter === status ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {status}
                <span style={{
                  background: statusFilter === status
                    ? 'rgba(255,255,255,0.25)'
                    : '#E0E6ED',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-body" style={{ paddingBottom: '20px' }}>
            <div className="filter-section" style={{ margin: 0 }}>
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by student name, company, or role..."
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setCurrentPage(1);
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <h3>
              Showing {paginated.length} of {filtered.length} experiences
            </h3>
          </div>

          {loading ? <Loading message="Loading experiences..." /> : (
            <>
              {paginated.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No experiences found</h3>
                  <p>No experiences match your current filter</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Round</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((exp, idx) => (
                        <tr key={exp._id}>
                          <td style={{
                            color: 'var(--text-light)',
                            fontWeight: '600',
                            fontSize: '13px'
                          }}>
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </td>
                          <td>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}>
                              <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1565C0, #00BCD4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: '14px',
                                flexShrink: 0
                              }}>
                                {exp.studentName?.charAt(0)?.toUpperCase()}
                              </div>
                              <span style={{ fontWeight: '600', fontSize: '14px' }}>
                                {exp.studentName}
                              </span>
                            </div>
                          </td>
                          <td style={{
                            fontWeight: '600',
                            color: 'var(--primary)'
                          }}>
                            {exp.company}
                          </td>
                          <td style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)'
                          }}>
                            {exp.role}
                          </td>
                          <td style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)'
                          }}>
                            {exp.round}
                          </td>
                          <td>
                            <span className={`badge badge-${exp.status}`}>
                              {exp.status}
                            </span>
                          </td>
                          <td style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)'
                          }}>
                            {new Date(exp.submittedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td>
                            <div style={{
                              display: 'flex',
                              gap: '6px',
                              flexWrap: 'nowrap'
                            }}>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => navigate(`/local-admin/experiences/${exp._id}`)}
                              >
                                👁️ View
                              </button>
                              {exp.status === 'pending' && (
                                <>
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleAccept(exp._id)}
                                    disabled={actionLoading === exp._id + '_accept'}
                                    style={{ opacity: actionLoading ? 0.7 : 1 }}
                                  >
                                    {actionLoading === exp._id + '_accept' ? '...' : '✅'}
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => setRejectModal(exp._id)}
                                  >
                                    ❌
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination" style={{ padding: '20px' }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                    ←
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) page = i + 1;
                    else if (currentPage <= 3) page = i + 1;
                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                    else page = currentPage - 2 + i;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'active' : ''}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Reject Modal */}
        {rejectModal && (
          <div className="modal-overlay" onClick={() => setRejectModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>❌ Reject Experience</h2>
                <button
                  className="modal-close"
                  onClick={() => setRejectModal(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  Please provide a reason for rejection to help the student improve.
                </p>
                <div className="form-group">
                  <label className="form-label">Rejection Reason *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setRejectModal(null);
                    setRejectReason('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason.trim() || actionLoading}
                  style={{ opacity: !rejectReason.trim() ? 0.6 : 1 }}
                >
                  {actionLoading ? 'Rejecting...' : '❌ Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DepartmentExperiences;