import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import Auth3D from '../three/Auth3D';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [interviewType, setInterviewType] = useState('Technical Interview');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('30 minutes');

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formattedSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setResumeFile({
        name: file.name,
        size: formattedSize,
        type: file.name.split('.').pop().toUpperCase()
      });
      setResumeError('');
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Submission Validation
  const handleStartInterview = (e) => {
    e.preventDefault();

    if (!resumeFile) {
      setResumeError('Please upload your resume before starting the interview.');
      return;
    }

    // Frontend validation passed -> Navigate to Mock Interview Room
    navigate('/interview');
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
                  <div className="upload-icon">📄</div>
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
                    <div className="file-icon">📑</div>
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
              <span>💡</span>
              <p>
                Questions will be personalized using your resume, selected interview preferences, and approved interview data.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="setup-actions">
              <button type="submit" className="btn-primary setup-start-btn">
                Start Interview
              </button>
              <button
                type="button"
                className="btn-secondary setup-back-btn"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
