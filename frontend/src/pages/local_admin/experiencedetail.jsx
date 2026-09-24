import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar.jsx';
import Navbar from '../../components/navbar.jsx';
import Loading from '../../components/loading.jsx';
import {
  getLocalExperienceById,
  localAcceptExperience,
  localRejectExperience
} from '../../services/adminservice.jsx';
import { useAuth } from '../../context/authentication.jsx';

const LocalExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      const data = await getLocalExperienceById(id);
      setExperience(data.experience || data);
    } catch {
      setExperience({
        _id: id,
        studentName: 'Priya Sharma',
        studentEmail: 'priya@college.edu',
        studentRollNo: '2021ECE045',
        company: 'TCS',
        role: 'Software Engineer',
        department: user?.department || 'ECE',
        round: 'Technical Round 1',
        difficulty: 'Medium',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        topics: ['Arrays', 'Linked Lists', 'OOPS', 'SQL', 'System Design'],
        questions: [
          'Explain the time complexity of binary search.',
          'Write a program to find duplicates in an array.',
          'What is the difference between process and thread?',
          'Explain ACID properties in databases.'
        ],
        experience: `The interview began with a warm introduction by the interviewer. They asked about my final year project and internship experience.
        
Technical questions started with simple array problems and then moved to more complex DSA topics. The interviewer was very interactive and gave hints when I was stuck.

After the technical round, there was a brief discussion about TCS's work culture and the role's responsibilities. The entire process took about 90 minutes.

Overall it was a good experience. The interviewer was supportive and the questions were reasonable for a fresher.`,
        tips: 'Revise arrays, strings and basic linked list operations. Practice writing clean code. Be clear while explaining your thought process. Also prepare 2-3 questions to ask the interviewer at the end.',
        overallRating: 4,
        selectionStatus: 'Selected'
      });
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await localAcceptExperience(id);
      setExperience(prev => ({ ...prev, status: 'accepted' }));
      showAlert('success', 'Experience accepted and will be used for AI interviews!');
    } catch {
      showAlert('error', 'Failed to accept. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await localRejectExperience(id, rejectReason);
      setExperience(prev => ({ ...prev, status: 'rejected' }));
      showAlert('success', 'Experience has been rejected.');
      setRejectModal(false);
      setRejectReason('');
    } catch {
      showAlert('error', 'Failed to reject. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const InfoItem = ({ icon, label, value }) => (
    <div style={{
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <div>
        <p style={{
          fontSize: '11px',
          fontWeight: '700',
          color: 'var(--text-light)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '3px'
        }}>
          {label}
        </p>
        <p style={{
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--text-primary)'
        }}>
          {value || '—'}
        </p>
      </div>
    </div>
  );

  const StarRating = ({ rating }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} style={{
          fontSize: '18px',
          color: star <= rating ? '#FF8F00' : '#E0E6ED'
        }}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="layout">
      <Sidebar role="local_admin" />
      <Navbar title="Experience Detail" />

      <main className="main-content">
        {/* Back */}
        <button
          onClick={() => navigate('/local-admin/experiences')}
          className="btn btn-outline btn-sm"
          style={{ marginBottom: '24px' }}
        >
          ← Back to Experiences
        </button>

        {loading ? <Loading message="Loading experience details..." /> : !experience ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Experience not found</h3>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/local-admin/experiences')}
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            {alert && (
              <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
                {alert.type === 'success' ? '✅' : '❌'} {alert.message}
              </div>
            )}

            {/* Header */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-body">
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #1565C0, #00BCD4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '28px',
                      fontWeight: '800'
                    }}>
                      {experience.studentName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h2 style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        marginBottom: '4px'
                      }}>
                        {experience.studentName}
                      </h2>
                      <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        marginBottom: '4px'
                      }}>
                        {experience.studentEmail}
                        {experience.studentRollNo && (
                          <span style={{ marginLeft: '10px', fontWeight: '600' }}>
                            • {experience.studentRollNo}
                          </span>
                        )}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '8px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          padding: '3px 12px',
                          background: '#E3F2FD',
                          color: '#1565C0',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          🏢 {experience.department}
                        </span>
                        <span className={`badge badge-${experience.status}`}>
                          {experience.status}
                        </span>
                        {experience.selectionStatus && (
                          <span style={{
                            padding: '3px 12px',
                            background: experience.selectionStatus === 'Selected'
                              ? '#E8F5E9' : '#FFEBEE',
                            color: experience.selectionStatus === 'Selected'
                              ? '#2E7D32' : '#C62828',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: `1px solid ${experience.selectionStatus === 'Selected'
                              ? '#A5D6A7' : '#EF9A9A'}`
                          }}>
                            🏆 {experience.selectionStatus}
                          </span>
                        )}
                        {experience.overallRating && (
                          <StarRating rating={experience.overallRating} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {experience.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          className="btn btn-success"
                          onClick={handleAccept}
                          disabled={actionLoading}
                          style={{ opacity: actionLoading ? 0.7 : 1 }}
                        >
                          {actionLoading ? '⏳ Processing...' : '✅ Accept'}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => setRejectModal(true)}
                          disabled={actionLoading}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    ) : experience.status === 'accepted' ? (
                      <div style={{
                        padding: '12px 20px',
                        background: '#E8F5E9',
                        border: '1px solid #A5D6A7',
                        borderRadius: '10px',
                        color: '#2E7D32',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        ✅ Accepted — Active for AI Interviews
                      </div>
                    ) : (
                      <div style={{
                        padding: '12px 20px',
                        background: '#FFEBEE',
                        border: '1px solid #EF9A9A',
                        borderRadius: '10px',
                        color: '#C62828',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        ❌ Rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.6fr',
              gap: '24px'
            }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card">
                  <div className="card-header">
                    <h3>📊 Interview Details</h3>
                  </div>
                  <div className="card-body">
                    <InfoItem icon="🏢" label="Company" value={experience.company} />
                    <InfoItem icon="💼" label="Job Role" value={experience.role} />
                    <InfoItem icon="🔄" label="Round" value={experience.round} />
                    <InfoItem icon="📊" label="Difficulty" value={experience.difficulty} />
                    <InfoItem
                      icon="📅"
                      label="Submitted"
                      value={new Date(experience.submittedAt).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    />
                    {experience.selectionStatus && (
                      <InfoItem
                        icon="🏆"
                        label="Selection Outcome"
                        value={experience.selectionStatus}
                      />
                    )}
                  </div>
                </div>

                {/* Topics */}
                <div className="card">
                  <div className="card-header">
                    <h3>🏷️ Topics Covered</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(experience.topics || []).map((topic, i) => (
                        <span key={i} style={{
                          padding: '6px 14px',
                          background: 'var(--light-blue)',
                          color: 'var(--primary)',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          border: '1px solid #BBDEFB'
                        }}>
                          {topic}
                        </span>
                      ))}
                      {(!experience.topics || experience.topics.length === 0) && (
                        <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                          No topics listed
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification Info */}
                {experience.status === 'pending' && (
                  <div className="card" style={{
                    border: '1px solid #FFB74D',
                    background: '#FFFDE7'
                  }}>
                    <div className="card-body">
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start'
                      }}>
                        <span style={{ fontSize: '24px' }}>ℹ️</span>
                        <div>
                          <h4 style={{
                            fontWeight: '700',
                            color: '#E65100',
                            marginBottom: '6px',
                            fontSize: '15px'
                          }}>
                            Verification Required
                          </h4>
                          <p style={{
                            fontSize: '13px',
                            color: '#BF360C',
                            lineHeight: '1.6'
                          }}>
                            Review this experience carefully. Accepted experiences
                            will be used as context for AI-generated mock interviews.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Questions */}
                <div className="card">
                  <div className="card-header">
                    <h3>❓ Interview Questions</h3>
                    <span style={{
                      background: '#E3F2FD',
                      color: '#1565C0',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {(experience.questions || []).length}
                    </span>
                  </div>
                  <div className="card-body">
                    {(experience.questions || []).length === 0 ? (
                      <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                        No questions listed
                      </p>
                    ) : (
                      (experience.questions || []).map((q, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px 0',
                          borderBottom: i < experience.questions.length - 1
                            ? '1px solid var(--border)' : 'none'
                        }}>
                          <span style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'var(--light-blue)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '800',
                            flexShrink: 0
                          }}>
                            {i + 1}
                          </span>
                          <p style={{
                            fontSize: '14px',
                            color: 'var(--text-primary)',
                            lineHeight: '1.6'
                          }}>
                            {q}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="card">
                  <div className="card-header">
                    <h3>📝 Experience Description</h3>
                  </div>
                  <div className="card-body">
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      lineHeight: '1.8',
                      whiteSpace: 'pre-line'
                    }}>
                      {experience.experience || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Tips */}
                {experience.tips && (
                  <div className="card" style={{ border: '1px solid #BBDEFB' }}>
                    <div className="card-header"
                      style={{ background: 'linear-gradient(135deg, #E3F2FD, #F5F7FA)' }}>
                      <h3>💡 Tips from Student</h3>
                    </div>
                    <div className="card-body">
                      <p style={{
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-line'
                      }}>
                        {experience.tips}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <div className="modal-overlay" onClick={() => setRejectModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>❌ Reject Experience</h2>
                <button
                  className="modal-close"
                  onClick={() => setRejectModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div style={{
                  background: '#FFF3E0',
                  border: '1px solid #FFCC80',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '16px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '18px' }}>⚠️</span>
                  <p style={{ fontSize: '13px', color: '#E65100', lineHeight: '1.5' }}>
                    This experience will be marked as rejected and will NOT be used
                    for AI interview generation. The student will be notified.
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason for Rejection *</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="e.g., Questions are too generic, experience lacks detail, company information is incorrect..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-light)',
                    marginTop: '6px'
                  }}>
                    {rejectReason.length}/500 characters
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setRejectModal(false);
                    setRejectReason('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleReject}
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

export default LocalExperienceDetail;