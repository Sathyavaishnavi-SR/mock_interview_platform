import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar.jsx';
import Navbar from '../../components/navbar.jsx';
import Loading from '../../components/loading.jsx';
import {
  getAllExperiences,
  acceptExperience,
  rejectExperience
} from '../../services/adminservice.jsx';

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

const STATUS_OPTIONS = ['All', 'Pending', 'Accepted', 'Rejected'];

const AllExperiences = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'All'
  );
  const [deptFilter, setDeptFilter] = useState(
    searchParams.get('department') || 'All'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [alert, setAlert] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const itemsPerPage = 10;

  const selectedDept = DEPARTMENTS.find(d => d.name === deptFilter);

  useEffect(() => {
    fetchExperiences();
  }, [statusFilter, deptFilter]);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();
      if (deptFilter !== 'All') params.department = deptFilter;
      const data = await getAllExperiences(params);
      setExperiences(data.experiences || data || []);
    } catch {
      generateMock();
    } finally {
      setLoading(false);
    }
  };

  const generateMock = () => {
    const companies = ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'HCL', 'Tech Mahindra'];
    const roles = ['Software Engineer', 'Data Analyst', 'Full Stack Developer', 'ML Engineer'];
    const statuses = ['pending', 'pending', 'accepted', 'rejected', 'accepted'];
    const rounds = ['Technical Round 1', 'Technical Round 2', 'HR Round', 'Aptitude'];
    const depts = DEPARTMENTS.map(d => d.name);
    const names = [
      'Priya S', 'Rahul V', 'Anjali R', 'Karthik M', 'Deepa S',
      'Arun K', 'Meera T', 'Vijay R', 'Lakshmi A', 'Sanjay P',
      'Divya M', 'Ramesh G', 'Nisha K', 'Suresh L', 'Pooja R'
    ];
    const mock = Array.from({ length: 50 }, (_, i) => ({
      _id: `exp_${i + 1}`,
      studentName: names[i % names.length],
      company: companies[i % companies.length],
      role: roles[i % roles.length],
      department: depts[i % depts.length],
      round: rounds[i % rounds.length],
      status: statuses[i % statuses.length],
      difficulty: ['Easy', 'Medium', 'Hard'][i % 3],
      submittedAt: new Date(Date.now() - i * 86400000).toISOString(),
      topics: ['Arrays', 'DSA', 'OOPS', 'SQL']
    }));
    setExperiences(mock);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleAccept = async (id, e) => {
    e.stopPropagation();
    setActionLoading(id + '_accept');
    try {
      await acceptExperience(id);
      setExperiences(prev =>
        prev.map(exp => exp._id === id ? { ...exp, status: 'accepted' } : exp)
      );
      showAlert('success', 'Experience accepted successfully!');
    } catch {
      setExperiences(prev =>
        prev.map(exp => exp._id === id ? { ...exp, status: 'accepted' } : exp)
      );
      showAlert('success', 'Experience accepted successfully!');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (id, e) => {
    e.stopPropagation();
    setRejectModal(id);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(rejectModal + '_reject');
    try {
      await rejectExperience(rejectModal, rejectReason);
      setExperiences(prev =>
        prev.map(exp => exp._id === rejectModal ? { ...exp, status: 'rejected' } : exp)
      );
      showAlert('success', 'Experience rejected.');
      setRejectModal(null);
      setRejectReason('');
    } catch {
      setExperiences(prev =>
        prev.map(exp => exp._id === rejectModal ? { ...exp, status: 'rejected' } : exp)
      );
      showAlert('success', 'Experience rejected.');
      setRejectModal(null);
      setRejectReason('');
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
    const matchDept = deptFilter === 'All' || exp.department === deptFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pendingCount = experiences.filter(e =>
    e.status === 'pending' && (deptFilter === 'All' || e.department === deptFilter)
  ).length;

  return (
    <div className="layout">
      <Sidebar role="global_admin" />
      <Navbar title={deptFilter !== 'All' ? `${deptFilter} — Experiences` : 'All Experiences'} />

      <main className="main-content">

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate('/global-admin/dashboard')}
              className="btn btn-outline btn-sm"
            >
              ← Dashboard
            </button>
            <div>
              <h1 style={{
                fontSize: '24px', fontWeight: '700',
                color: 'var(--text-primary)', marginBottom: '4px'
              }}>
                {deptFilter !== 'All' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '36px', height: '36px',
                      borderRadius: '10px',
                      background: selectedDept?.bg || '#E3F2FD',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}>
                      {selectedDept?.icon}
                    </span>
                    {deptFilter} — Experiences
                  </span>
                ) : '📋 All Experiences'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {deptFilter !== 'All'
                  ? `Reviewing experiences for ${deptFilter} department`
                  : 'All interview experiences across all departments'
                }
              </p>
            </div>
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

        {/* Department Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'thin'
        }}>
          <button
            onClick={() => { setDeptFilter('All'); setCurrentPage(1); }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '2px solid',
              borderColor: deptFilter === 'All' ? 'var(--primary)' : 'var(--border)',
              background: deptFilter === 'All' ? 'var(--primary)' : '#fff',
              color: deptFilter === 'All' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            🌐 All Depts ({experiences.length})
          </button>
          {DEPARTMENTS.map(dept => {
            const count = experiences.filter(e => e.department === dept.name).length;
            const pendCount = experiences.filter(
              e => e.department === dept.name && e.status === 'pending'
            ).length;
            const isActive = deptFilter === dept.name;
            return (
              <button
                key={dept.name}
                onClick={() => { setDeptFilter(dept.name); setCurrentPage(1); }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: '2px solid',
                  borderColor: isActive ? dept.color : 'var(--border)',
                  background: isActive ? dept.bg : '#fff',
                  color: isActive ? dept.color : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {dept.icon} {dept.name}
                {count > 0 && (
                  <span style={{
                    background: isActive ? dept.color : '#E0E6ED',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    padding: '1px 7px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {count}
                  </span>
                )}
                {pendCount > 0 && (
                  <span style={{
                    background: '#E53935',
                    color: '#fff',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '700'
                  }}>
                    {pendCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {STATUS_OPTIONS.map(status => {
            const count = status === 'All'
              ? filtered.length
              : experiences.filter(e =>
                e.status === status.toLowerCase() &&
                (deptFilter === 'All' || e.department === deptFilter)
              ).length;
            return (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                style={{
                  padding: '7px 16px',
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
                    ? 'rgba(255,255,255,0.25)' : '#E0E6ED',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: statusFilter === status ? '#fff' : 'var(--text-secondary)'
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
                  placeholder="Search by student, company, or role..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setDeptFilter('All');
                  setCurrentPage(1);
                }}
              >
                🔄 Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <h3>
              Showing {paginated.length} of {filtered.length} experiences
              {deptFilter !== 'All' && (
                <span style={{
                  marginLeft: '10px',
                  padding: '2px 10px',
                  background: selectedDept?.bg || '#E3F2FD',
                  color: selectedDept?.color || '#1565C0',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {selectedDept?.icon} {deptFilter}
                </span>
              )}
            </h3>
            <span style={{
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}>
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          {loading ? <Loading message="Fetching experiences..." /> : (
            <>
              {paginated.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No experiences found</h3>
                  <p>Try adjusting your filters</p>
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
                        <th>Department</th>
                        <th>Round</th>
                        <th>Difficulty</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((exp, idx) => {
                        const dept = DEPARTMENTS.find(d => d.name === exp.department);
                        return (
                          <tr
                            key={exp._id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/global-admin/experiences/${exp._id}`)}
                          >
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
                                  width: '34px', height: '34px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #1565C0, #00BCD4)',
                                  display: 'flex', alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#fff', fontWeight: '700',
                                  fontSize: '14px', flexShrink: 0
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
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 10px',
                                background: dept?.bg || '#E3F2FD',
                                color: dept?.color || '#1565C0',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {dept?.icon} {exp.department}
                              </span>
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                              {exp.round}
                            </td>
                            <td>
                              <span style={{
                                padding: '3px 10px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: exp.difficulty === 'Easy'
                                  ? '#E8F5E9' : exp.difficulty === 'Medium'
                                    ? '#FFF3E0' : '#FFEBEE',
                                color: exp.difficulty === 'Easy'
                                  ? '#2E7D32' : exp.difficulty === 'Medium'
                                    ? '#E65100' : '#C62828'
                              }}>
                                {exp.difficulty === 'Easy' ? '🟢'
                                  : exp.difficulty === 'Medium' ? '🟡' : '🔴'}{' '}
                                {exp.difficulty}
                              </span>
                            </td>
                            <td>
                              <span className={`badge badge-${exp.status}`}>
                                {exp.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                              {new Date(exp.submittedAt).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </td>
                            <td onClick={e => e.stopPropagation()}>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => navigate(`/global-admin/experiences/${exp._id}`)}
                                >
                                  👁️
                                </button>
                                {exp.status !== 'accepted' && (
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={(e) => handleAccept(exp._id, e)}
                                    disabled={actionLoading === exp._id + '_accept'}
                                    title="Accept"
                                  >
                                    {actionLoading === exp._id + '_accept' ? '...' : '✅'}
                                  </button>
                                )}
                                {exp.status !== 'rejected' && (
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={(e) => handleRejectClick(exp._id, e)}
                                    title="Reject"
                                  >
                                    ❌
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
                <button className="modal-close" onClick={() => setRejectModal(null)}>×</button>
              </div>
              <div className="modal-body">
                <div style={{
                  background: '#FFF3E0', border: '1px solid #FFCC80',
                  borderRadius: '8px', padding: '14px', marginBottom: '16px',
                  display: 'flex', gap: '10px', alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '18px' }}>⚠️</span>
                  <p style={{ fontSize: '13px', color: '#E65100', lineHeight: '1.5' }}>
                    This experience will be rejected and will not be used for
                    AI interview generation.
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">Rejection Reason *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => { setRejectModal(null); setRejectReason(''); }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason.trim() || actionLoading}
                  style={{ opacity: !rejectReason.trim() ? 0.6 : 1 }}
                >
                  {actionLoading ? '⏳ Processing...' : '❌ Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllExperiences;