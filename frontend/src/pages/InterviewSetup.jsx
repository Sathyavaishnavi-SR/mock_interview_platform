import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import Auth3D from '../three/Auth3D';
import { apiRequest } from '../services/api';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [resumeFile, setResumeFile] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [interviewType, setInterviewType] = useState('Technical Interview');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('30 minutes');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file);
      const formattedSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setResumeFile({
        name: file.name,
        size: formattedSize,
        type: file.name.split('.').pop().toUpperCase()
      });
      setResumeError('');
      setServerError('');
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setRawFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Submission Validation and Start Interview
  const handleStartInterview = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!rawFile) {
      setResumeError('Please upload your resume before starting the interview.');
      return;
    }

    const durationNumber = parseInt(duration, 10) || 30;

    const formData = new FormData();
    formData.append('resume', rawFile);
    formData.append('targetRole', targetRole);
    formData.append('interviewType', interviewType);
    formData.append('difficulty', difficulty);
    formData.append('duration', durationNumber);

    setLoading(true);
    try {
      const response = await apiRequest('/interviews/start', {
        method: 'POST',
        body: formData,
      });

      if (!response.success) {
        setServerError(response.message || 'Failed to start interview. Please try again.');
        setLoading(false);
        return;
      }

      const sessionPayload = {
        interviewId: response.interviewId,
        questions: response.questions,
        durationMinutes: response.durationMinutes,
        targetRole,
        interviewType,
        difficulty,
        startedAt: Date.now(),
      };

      // Store in sessionStorage so a page refresh does not lose questions or session
      sessionStorage.setItem('currentInterview', JSON.stringify(sessionPayload));

      // Navigate to the interview room
      navigate('/interview', { state: sessionPayload });
    } catch (err) {
      setServerError('Something went wrong starting your interview. Please check your connection.');
      setLoading(false);
    }
  };

  const roleOptions = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Data Scientist',
    'AI / ML Engineer',
    'Other'
  ];

  const typeOptions = [
    'Technical Interview',
    'HR / Behavioral Interview',
    'Mixed Interview'
  ];

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];
  const durationOptions = ['15 minutes', '30 minutes', '45 minutes'];

  return (
    <div className="dashboard-layout">
      {/* Background subtle 3D element */}
      <Auth3D />

      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Setup Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dash-welcome-header">
          <h1 className="dash-title">Prepare for Your Interview</h1>
          <p className="dash-subtitle">Set up your interview preferences before you begin.</p>
        </header>

        {/* Configuration Form */}
        <div className="setup-container">
          <form onSubmit={handleStartInterview} className="setup-form-card glass-panel" noValidate>
            
            {/* 1. Resume Section */}
            <div className="form-section">
              <label className="section-label">Your Resume</label>
              <p className="section-desc">
                Upload your latest resume so the AI can generate questions relevant to your experience and skills (PDF, DOC, DOCX).
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />

              {!resumeFile ? (
                <div
                  className={`upload-dropzone ${resumeError ? 'dropzone-error' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="upload-text">
                    <span className="upload-primary">Click to upload your resume</span>
                    <span className="upload-sub">Supports PDF, DOC, or DOCX</span>
                  </div>
                  <button type="button" className="btn-secondary" style={{ pointerEvents: 'none' }}>
                    Upload Resume
                  </button>
                </div>
              ) : (
                <div className="uploaded-file-card">
                  <div className="file-info-left">
                    <div className="file-details">
                      <span className="file-name">{resumeFile.name}</span>
                      <span className="file-meta">{resumeFile.type} • {resumeFile.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="file-remove-btn"
                    onClick={handleRemoveFile}
                    title="Remove File"
                  >
                    Remove
                  </button>
                </div>
              )}

              {resumeError && <span className="form-error mt-2">{resumeError}</span>}
            </div>

            {/* 2. Interview Type */}
            <div className="form-section">
              <label htmlFor="interviewType" className="section-label">Interview Type</label>
              <div className="segmented-grid">
                {typeOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`segmented-btn ${interviewType === type ? 'active' : ''}`}
                    onClick={() => setInterviewType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Target Role */}
            <div className="form-section">
              <label htmlFor="targetRole" className="section-label">Target Role</label>
              <select
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="form-input form-select"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role} style={{ background: '#121824', color: '#fff' }}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Difficulty */}
            <div className="form-section">
              <label className="section-label">Difficulty</label>
              <div className="segmented-grid grid-3-btn">
                {difficultyOptions.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`segmented-btn ${difficulty === level ? 'active' : ''}`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Interview Duration */}
            <div className="form-section">
              <label className="section-label">Interview Duration</label>
              <div className="segmented-grid grid-3-btn">
                {durationOptions.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`segmented-btn ${duration === time ? 'active' : ''}`}
                    onClick={() => setDuration(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Informational Note */}
            <div className="info-callout">
              <p>
                Questions will be personalized using your resume, selected interview preferences, and approved interview data.
              </p>
            </div>

            {/* Error Message */}
            {serverError && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fca5a5',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                }}
              >
                {serverError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="setup-actions">
              <button
                type="submit"
                className="btn-primary setup-start-btn"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Analyzing Resume...' : 'Start Interview'}
              </button>
              <button
                type="button"
                className="btn-secondary setup-back-btn"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Back to Dashboard
              </button>
            </div>

          </form>
        </div>

        {/* Fullscreen Waiting Screen Overlay */}
        {loading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(10, 15, 29, 0.9)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1.5rem',
              }}
            />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Preparing your interview, please wait
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '420px', lineHeight: 1.6, margin: 0 }}>
              Analyzing your resume keywords, selecting questions for <strong>{targetRole}</strong>, and configuring your session.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
