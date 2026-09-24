import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar.jsx';
import Navbar from '../../components/navbar.jsx';
import Loading from '../../components/loading.jsx';
import {
  getExperienceById,
  acceptExperience,
  rejectExperience,
  editExperience
} from '../../services/adminservice.jsx';

const DEPARTMENTS = [
  'ECE', 'CSE G1', 'CSE AIM', 'IT', 'EEE',
  'Robotics', 'Bio Med', 'Bio-Tech', 'Mech G1',
  'Production', 'Textile', 'Fashion Tech', 'Automobile'
];

const ROUNDS = [
  'Aptitude', 'Technical Round 1', 'Technical Round 2',
  'HR Round', 'Managerial Round', 'Group Discussion'
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const GlobalExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromDept = searchParams.get('department') || null;

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => { fetchExperience(); }, [id]);

  const fetchExperience = async () => {
    try {
      const data = await getExperienceById(id);
      setExperience(data.experience || data);
    } catch {
      setExperience({
        _id: id,
        studentName: 'Arjun Kumar',
        studentEmail: 'arjun.kumar@college.edu',
        studentRollNo: '2021CSE012',
        company: 'TCS',
        role: 'Software Engineer',
        department: 'CSE G1',
        round: 'Technical Round 1',
        difficulty: 'Medium',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        topics: ['Arrays', 'Linked Lists', 'OOPS', 'SQL'],
        questions: [
          'Explain difference between Array and Linked List.',
          'Write a program to reverse a linked list.',
          'What is polymorphism in OOPS?',
          'Write SQL query to find the second highest salary.'
        ],
        experience: `Interview started with a brief self-introduction. 
The interviewer was friendly and professional throughout.

First discussed my final year project and then moved to technical questions. 
Questions were focused on DSA and OOPS concepts. The interviewer gave hints when needed.

After the technical part, there was a brief HR discussion about work culture and role expectations. 
Total duration was around 90 minutes.`,
        tips: 'Focus on DSA basics especially arrays and linked lists. Be confident, explain your approach before coding. Prepare 2-3 questions to ask at the end.',
        selectionStatus: 'Selected'
      });
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const openEdit = () => {
    setEditForm({
      company: experience.company || '',
      role: experience.role || '',
      department: experience.department || '',
      round: experience.round || '',
      difficulty: experience.difficulty || 'Medium',
      topics: [...(experience.topics || [])],
      questions: [...(experience.questions || [])],
      experience: experience.experience || '',
      tips: experience.tips || ''
    });
    setEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setEditForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion.trim()]
    }));
    setNewQuestion('');
  };

  const handleRemoveQuestion = (i) => {
    setEditForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== i)
    }));
  };

  const handleEditQuestion = (i, val) => {
    setEditForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) => idx === i ? val : q)
    }));
  };

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    setEditForm(prev => ({
      ...prev,
      topics: [...prev.topics, newTopic.trim()]
    }));
    setNewTopic('');
  };

  const handleRemoveTopic = (i) => {
    setEditForm(prev => ({
      ...prev,
      topics: prev.topics.filter((_, idx) => idx !== i)
    }));
  };

  const handleSaveEdit = async () => {
    setEditLoading(true);
    try {
      await editExperience(id, editForm);
    } catch { }
    setExperience(prev => ({ ...prev, ...editForm }));
    showAlert('success', 'Experience updated successfully!');
    setEditModal(false);
    setEditLoading(false);
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await acceptExperience(id);
    } catch { }
    setExperience(prev => ({ ...prev, status: 'accepted' }));
    showAlert('success', '✅ Experience accepted and active for AI interviews!');
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await rejectExperience(id, rejectReason);
    } catch { }
    setExperience(prev => ({ ...prev, status: 'rejected' }));
    showAlert('success', 'Experience has been rejected.');
    setRejectModal(false);
    setRejectReason('');
    setActionLoading(false);
  };

  const InfoItem = ({ icon, label, value }) => (
    <div style={{
      padding: '13px 0',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <span style={{ fontSize: '17px', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
      <div>
        <p style={{
          fontSize: '11px', fontWeight: '700',
          color: 'var(--text-light)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px', marginBottom: '3px'
        }}>
          {label}
        </p>
        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {value || '—'}
        </p>
      </div>
    </div>
  );

  const backUrl = fromDept
    ? `/global-admin/experiences?department=${fromDept}`
    : '/global-admin/experiences';

  return (
    <div className="layout">
      <Sidebar role="global_admin" />
      <Navbar title="Experience Detail" />

      <main className="main-content">

        {/* Back */}
        <button
          onClick={() => navigate(backUrl)}
          className="btn btn-outline btn-sm"
          style={{ marginBottom: '24px' }}
        >
          ← Back to {fromDept ? `${fromDept} Experiences` : 'All Experiences'}
        </button>

        {loading ? <Loading message="Loading experience..." /> : !experience ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Experience not found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/global-admin/experiences')}>
              Go Back
            </button>
          </div>
        ) : (
          <>
            {alert && (
              <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
                {alert.message}
              </div>
            )}

            {/* Header Card */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-body">
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  {/* Student */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '16px',
                      background: 'linear-gradient(135deg, #1565C0, #00BCD4)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff', fontSize: '28px', fontWeight: '800'
                    }}>
                      {experience.studentName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h2 style={{
                        fontSize: '22px', fontWeight: '800',
                        color: 'var(--text-primary)', marginBottom: '4px'
                      }}>
                        {experience.studentName}
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {experience.studentEmail}
                        {experience.studentRollNo && (
                          <span style={{ marginLeft: '10px', fontWeight: '600' }}>
                            • {experience.studentRollNo}
                          </span>
                        )}
                      </p>
                      <div style={{
                        display: 'flex', gap: '8px',
                        marginTop: '10px', flexWrap: 'wrap',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          padding: '4px 12px',
                          background: '#E3F2FD', color: '#1565C0',
                          borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                        }}>
                          🏢 {experience.department}
                        </span>
                        <span className={`badge badge-${experience.status}`}>
                          {experience.status}
                        </span>
                        {experience.selectionStatus && (
                          <span style={{
                            padding: '4px 12px',
                            background: experience.selectionStatus === 'Selected'
                              ? '#E8F5E9' : '#FFEBEE',
                            color: experience.selectionStatus === 'Selected'
                              ? '#2E7D32' : '#C62828',
                            borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                            border: `1px solid ${experience.selectionStatus === 'Selected'
                              ? '#A5D6A7' : '#EF9A9A'}`
                          }}>
                            🏆 {experience.selectionStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Edit - always */}
                    <button
                      className="btn"
                      onClick={openEdit}
                      style={{
                        background: 'linear-gradient(135deg, #7B1FA2, #9C27B0)',
                        color: '#fff',
                        boxShadow: '0 4px 15px rgba(123,31,162,0.3)'
                      }}
                    >
                      ✏️ Edit
                    </button>

                    {/* Accept */}
                    {experience.status !== 'accepted' && (
                      <button
                        className="btn btn-success"
                        onClick={handleAccept}
                        disabled={actionLoading}
                        style={{ opacity: actionLoading ? 0.7 : 1 }}
                      >
                        {actionLoading ? '⏳...' : '✅ Accept'}
                      </button>
                    )}

                    {/* Reject */}
                    {experience.status !== 'rejected' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => setRejectModal(true)}
                        disabled={actionLoading}
                      >
                        ❌ Reject
                      </button>
                    )}

                    {/* Status indicators */}
                    {experience.status === 'accepted' && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 16px',
                        background: '#E8F5E9', border: '1px solid #A5D6A7',
                        borderRadius: '10px', color: '#2E7D32', fontWeight: '700', fontSize: '14px'
                      }}>
                        ✅ Accepted
                      </div>
                    )}
                    {experience.status === 'rejected' && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 16px',
                        background: '#FFEBEE', border: '1px solid #EF9A9A',
                        borderRadius: '10px', color: '#C62828', fontWeight: '700', fontSize: '14px'
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
                  <div className="card-header"><h3>📊 Interview Details</h3></div>
                  <div className="card-body">
                    <InfoItem icon="🏢" label="Company" value={experience.company} />
                    <InfoItem icon="💼" label="Job Role" value={experience.role} />
                    <InfoItem icon="🎓" label="Department" value={experience.department} />
                    <InfoItem icon="🔄" label="Round" value={experience.round} />
                    <InfoItem icon="📊" label="Difficulty" value={experience.difficulty} />
                    <InfoItem
                      icon="📅"
                      label="Submitted"
                      value={new Date(experience.submittedAt).toLocaleDateString('en-IN', {
                        weekday: 'long', day: '2-digit',
                        month: 'long', year: 'numeric'
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
                  <div className="card-header"><h3>🏷️ Topics Covered</h3></div>
                  <div className="card-body">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(experience.topics || []).map((t, i) => (
                        <span key={i} style={{
                          padding: '6px 14px',
                          background: '#E3F2FD', color: '#1565C0',
                          borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                          border: '1px solid #BBDEFB'
                        }}>
                          {t}
                        </span>
                      ))}
                      {!experience.topics?.length && (
                        <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                          No topics listed
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification Note */}
                {experience.status === 'pending' && (
                  <div className="card" style={{
                    border: '1px solid #FFB74D', background: '#FFFDE7'
                  }}>
                    <div className="card-body">
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '22px' }}>ℹ️</span>
                        <div>
                          <h4 style={{
                            fontWeight: '700', color: '#E65100',
                            marginBottom: '6px', fontSize: '14px'
                          }}>
                            Awaiting Verification
                          </h4>
                          <p style={{ fontSize: '13px', color: '#BF360C', lineHeight: '1.6' }}>
                            Accepted experiences will be used as context
                            for AI-generated mock interviews.
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
                      background: '#E3F2FD', color: '#1565C0',
                      padding: '3px 10px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '700'
                    }}>
                      {experience.questions?.length || 0}
                    </span>
                  </div>
                  <div className="card-body">
                    {(experience.questions || []).map((q, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '12px', padding: '12px 0',
                        borderBottom: i < experience.questions.length - 1
                          ? '1px solid var(--border)' : 'none'
                      }}>
                        <span style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: '#E3F2FD', color: '#1565C0',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px', fontWeight: '800', flexShrink: 0
                        }}>
                          {i + 1}
                        </span>
                        <p style={{
                          fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6'
                        }}>
                          {q}
                        </p>
                      </div>
                    ))}
                    {!experience.questions?.length && (
                      <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                        No questions listed
                      </p>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="card">
                  <div className="card-header"><h3>📝 Experience Description</h3></div>
                  <div className="card-body">
                    <p style={{
                      fontSize: '14px', color: 'var(--text-primary)',
                      lineHeight: '1.8', whiteSpace: 'pre-line'
                    }}>
                      {experience.experience || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Tips */}
                {experience.tips && (
                  <div className="card" style={{ border: '1px solid #BBDEFB' }}>
                    <div className="card-header"
                      style={{ background: 'linear-gradient(135deg,#E3F2FD,#F5F7FA)' }}>
                      <h3>💡 Tips from Student</h3>
                    </div>
                    <div className="card-body">
                      <p style={{
                        fontSize: '14px', color: 'var(--text-primary)',
                        lineHeight: '1.8', whiteSpace: 'pre-line'
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

        {/* ===== EDIT MODAL ===== */}
        {editModal && (
          <div className="modal-overlay" onClick={() => setEditModal(false)}>
            <div
              className="modal"
              style={{ maxWidth: '750px' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>✏️ Edit Experience</h2>
                <button className="modal-close" onClick={() => setEditModal(false)}>×</button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                {/* Company & Role */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.company}
                      onChange={e => handleEditChange('company', e.target.value)}
                      placeholder="e.g. TCS, Infosys"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Role *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.role}
                      onChange={e => handleEditChange('role', e.target.value)}
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                </div>

                {/* Department & Round */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select
                      className="form-control"
                      value={editForm.department}
                      onChange={e => handleEditChange('department', e.target.value)}
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Round *</label>
                    <select
                      className="form-control"
                      value={editForm.round}
                      onChange={e => handleEditChange('round', e.target.value)}
                    >
                      {ROUNDS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {DIFFICULTIES.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleEditChange('difficulty', d)}
                        style={{
                          padding: '8px 20px', borderRadius: '20px', border: '2px solid',
                          borderColor: editForm.difficulty === d
                            ? (d === 'Easy' ? '#2E7D32' : d === 'Medium' ? '#E65100' : '#C62828')
                            : 'var(--border)',
                          background: editForm.difficulty === d
                            ? (d === 'Easy' ? '#E8F5E9' : d === 'Medium' ? '#FFF3E0' : '#FFEBEE')
                            : '#fff',
                          color: editForm.difficulty === d
                            ? (d === 'Easy' ? '#2E7D32' : d === 'Medium' ? '#E65100' : '#C62828')
                            : 'var(--text-secondary)',
                          cursor: 'pointer', fontWeight: '600',
                          fontSize: '13px', transition: 'all 0.2s ease'
                        }}
                      >
                        {d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topics */}
                <div className="form-group">
                  <label className="form-label">Topics Covered</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {editForm.topics?.map((t, i) => (
                      <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '5px 12px', background: '#E3F2FD',
                        color: '#1565C0', borderRadius: '20px',
                        fontSize: '13px', fontWeight: '600', border: '1px solid #BBDEFB'
                      }}>
                        {t}
                        <button
                          onClick={() => handleRemoveTopic(i)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#C62828', fontWeight: '800', fontSize: '14px',
                            lineHeight: 1, padding: '0 2px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add topic and press Enter"
                      value={newTopic}
                      onChange={e => setNewTopic(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleAddTopic}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Questions */}
                <div className="form-group">
                  <label className="form-label">
                    Questions ({editForm.questions?.length || 0})
                  </label>
                  {editForm.questions?.map((q, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '8px',
                      marginBottom: '8px', alignItems: 'flex-start'
                    }}>
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: '#E3F2FD', color: '#1565C0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '800',
                        flexShrink: 0, marginTop: '8px'
                      }}>
                        {i + 1}
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={q}
                        onChange={e => handleEditQuestion(i, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button
                        onClick={() => handleRemoveQuestion(i)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px',
                          background: '#FFEBEE', border: '1px solid #EF9A9A',
                          color: '#C62828', cursor: 'pointer',
                          fontSize: '16px', fontWeight: '800',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', flexShrink: 0, marginTop: '4px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add new question and press Enter"
                      value={newQuestion}
                      onChange={e => setNewQuestion(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddQuestion()}
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleAddQuestion}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Experience */}
                <div className="form-group">
                  <label className="form-label">Experience Description</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={editForm.experience}
                    onChange={e => handleEditChange('experience', e.target.value)}
                    placeholder="Describe the interview experience..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Tips */}
                <div className="form-group">
                  <label className="form-label">Tips & Advice</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={editForm.tips}
                    onChange={e => handleEditChange('tips', e.target.value)}
                    placeholder="Any tips for future candidates..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setEditModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  style={{ opacity: editLoading ? 0.7 : 1 }}
                >
                  {editLoading ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== REJECT MODAL ===== */}
        {rejectModal && (
          <div className="modal-overlay" onClick={() => setRejectModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>❌ Reject Experience</h2>
                <button className="modal-close" onClick={() => setRejectModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div style={{
                  background: '#FFF3E0', border: '1px solid #FFCC80',
                  borderRadius: '8px', padding: '14px', marginBottom: '16px',
                  display: 'flex', gap: '10px', alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '18px' }}>⚠️</span>
                  <p style={{ fontSize: '13px', color: '#E65100', lineHeight: '1.5' }}>
                    This experience will be rejected and will NOT be used
                    for AI interview question generation.
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">Rejection Reason *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="e.g. Insufficient detail, irrelevant content..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => { setRejectModal(false); setRejectReason(''); }}
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

export default GlobalExperienceDetail;
