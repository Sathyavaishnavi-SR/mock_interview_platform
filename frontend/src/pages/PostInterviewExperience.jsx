import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import Auth3D from '../three/Auth3D';

export default function PostInterviewExperience() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    interviewType: 'Technical',
    interviewMode: 'Online',
    interviewDate: '',
    numberOfRounds: '3',
    rounds: [
      { id: 1, roundNumber: 1, type: 'Technical', description: '' }
    ],
    questions: [
      { id: 1, text: '' }
    ],
    experience: '',
    preparation: '',
    difficulty: 'Medium',
    status: 'pending'
  });

  const [errors, setErrors] = useState({});

  // Input Change Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Rounds Handler
  const handleRoundChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      rounds: prev.rounds.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    }));
    if (errors.rounds) {
      setErrors((prev) => ({ ...prev, rounds: '' }));
    }
  };

  const addRound = () => {
    const nextId = formData.rounds.length > 0 ? Math.max(...formData.rounds.map(r => r.id)) + 1 : 1;
    setFormData((prev) => ({
      ...prev,
      rounds: [
        ...prev.rounds,
        { id: nextId, roundNumber: prev.rounds.length + 1, type: 'Technical', description: '' }
      ]
    }));
  };

  const removeRound = (id) => {
    if (formData.rounds.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((r) => r.id !== id).map((r, idx) => ({ ...r, roundNumber: idx + 1 }))
    }));
  };

  // Questions Handler
  const handleQuestionChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, text: value } : q))
    }));
    if (errors.questions) {
      setErrors((prev) => ({ ...prev, questions: '' }));
    }
  };

  const addQuestion = () => {
    const nextId = formData.questions.length > 0 ? Math.max(...formData.questions.map(q => q.id)) + 1 : 1;
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { id: nextId, text: '' }]
    }));
  };

  const removeQuestion = (id) => {
    if (formData.questions.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id)
    }));
  };

  // Clear Form Handler
  const handleClearForm = () => {
    const isDirty = formData.company || formData.role || formData.experience || formData.preparation;
    if (isDirty) {
      if (!window.confirm('Are you sure you want to clear the form? All entered information will be lost.')) {
        return;
      }
    }

    setFormData({
      company: '',
      role: '',
      interviewType: 'Technical',
      interviewMode: 'Online',
      interviewDate: '',
      numberOfRounds: '3',
      rounds: [{ id: 1, roundNumber: 1, type: 'Technical', description: '' }],
      questions: [{ id: 1, text: '' }],
      experience: '',
      preparation: '',
      difficulty: 'Medium',
      status: 'pending'
    });
    setErrors({});
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.company.trim()) newErrors.company = 'Company name is required.';
    if (!formData.role.trim()) newErrors.role = 'Role / Position is required.';
    if (!formData.interviewType) newErrors.interviewType = 'Interview Type is required.';
    if (!formData.interviewMode) newErrors.interviewMode = 'Interview Mode is required.';

    if (!formData.rounds || formData.rounds.length === 0) {
      newErrors.rounds = 'Please add at least one interview round.';
    } else {
      const hasEmptyRound = formData.rounds.some((r) => !r.description.trim());
      if (hasEmptyRound) {
        newErrors.rounds = 'Please fill out the description for all added rounds.';
      }
    }

    if (!formData.questions || formData.questions.length === 0) {
      newErrors.questions = 'Please add at least one interview question.';
    } else {
      const hasEmptyQ = formData.questions.some((q) => !q.text.trim());
      if (hasEmptyQ) {
        newErrors.questions = 'Please enter question details for all added questions.';
      }
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Please describe your overall interview experience.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Frontend simulation successful -> Show Pending Review confirmation
    console.log('Interview Experience Submitted (Frontend State):', formData);
    setIsSubmitted(true);
  };

  const typeOptions = ['Technical', 'HR / Behavioral', 'Technical + HR', 'Other'];
  const modeOptions = ['Online', 'Offline', 'Hybrid'];
  const roundTypeOptions = ['Aptitude', 'Technical', 'Coding', 'HR', 'Other'];
  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="dashboard-layout">
      {/* Background subtle 3D element */}
      <Auth3D />

      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dash-welcome-header">
          <h1 className="dash-title">Share Your Interview Experience</h1>
          <p className="dash-subtitle">
            Help other PSG students prepare by sharing what you experienced during your interview.
          </p>
          <div className="subtle-notice">
            <span>ℹ️</span> Your submission will be reviewed by an admin before it is published.
          </div>
        </header>

        {/* Confirmation State UI when Submitted */}
        {isSubmitted ? (
          <div className="setup-container">
            <div className="glass-panel confirmation-box">
              <div className="confirmation-icon">⏳</div>
              <span className="confirmation-badge">Pending Review</span>
              <h2 className="dash-section-title" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                Experience Submitted
              </h2>
              <p className="dash-subtitle" style={{ maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
                Your interview experience for <strong>{formData.company}</strong> ({formData.role}) has been submitted for admin review. Only approved content will be published and used by the platform.
              </p>
              <div className="setup-actions" style={{ justifyContent: 'center' }}>
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsSubmitted(false);
                    handleClearForm();
                  }}
                >
                  Submit Another Experience
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Multi-Section Submission Form */
          <div className="setup-container">
            <form onSubmit={handleSubmit} className="setup-form-card glass-panel" noValidate>

              {/* SECTION 1 — INTERVIEW DETAILS */}
              <div className="form-section">
                <h3 className="section-label">1. Interview Details</h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="company" className="form-label">
                      Company / Organization <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Microsoft, Google, TCS"
                      className={`form-input ${errors.company ? 'input-error' : ''}`}
                    />
                    {errors.company && <span className="form-error">{errors.company}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="role" className="form-label">
                      Role / Position <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Development Engineer"
                      className={`form-input ${errors.role ? 'input-error' : ''}`}
                    />
                    {errors.role && <span className="form-error">{errors.role}</span>}
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label htmlFor="interviewType" className="form-label">
                      Interview Type <span className="required-star">*</span>
                    </label>
                    <select
                      id="interviewType"
                      name="interviewType"
                      value={formData.interviewType}
                      onChange={handleInputChange}
                      className="form-input form-select"
                    >
                      {typeOptions.map((t) => (
                        <option key={t} value={t} style={{ background: '#121824', color: '#fff' }}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="interviewMode" className="form-label">
                      Interview Mode <span className="required-star">*</span>
                    </label>
                    <select
                      id="interviewMode"
                      name="interviewMode"
                      value={formData.interviewMode}
                      onChange={handleInputChange}
                      className="form-input form-select"
                    >
                      {modeOptions.map((m) => (
                        <option key={m} value={m} style={{ background: '#121824', color: '#fff' }}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="interviewDate" className="form-label">
                      Interview Date <span className="optional-badge">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      id="interviewDate"
                      name="interviewDate"
                      value={formData.interviewDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2 — INTERVIEW PROCESS */}
              <div className="form-section">
                <h3 className="section-label">2. Interview Process</h3>
                
                <div className="form-group mb-2">
                  <label htmlFor="numberOfRounds" className="form-label">
                    Number of Rounds <span className="required-star">*</span>
                  </label>
                  <select
                    id="numberOfRounds"
                    name="numberOfRounds"
                    value={formData.numberOfRounds}
                    onChange={handleInputChange}
                    className="form-input form-select"
                    style={{ maxWidth: '220px' }}
                  >
                    {['1', '2', '3', '4', '5', '6+'].map((r) => (
                      <option key={r} value={r} style={{ background: '#121824', color: '#fff' }}>
                        {r} {r === '1' ? 'Round' : 'Rounds'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounds-list">
                  {formData.rounds.map((round) => (
                    <div key={round.id} className="round-item-card">
                      <div className="round-card-header">
                        <span className="round-title">Round {round.roundNumber}</span>
                        {formData.rounds.length > 1 && (
                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() => removeRound(round.id)}
                          >
                            Remove Round
                          </button>
                        )}
                      </div>

                      <div className="form-group mb-2">
                        <label className="form-label">Round Type</label>
                        <select
                          value={round.type}
                          onChange={(e) => handleRoundChange(round.id, 'type', e.target.value)}
                          className="form-input form-select"
                        >
                          {roundTypeOptions.map((rt) => (
                            <option key={rt} value={rt} style={{ background: '#121824', color: '#fff' }}>
                              {rt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Round Description / Details</label>
                        <textarea
                          rows={2}
                          value={round.description}
                          onChange={(e) => handleRoundChange(round.id, 'description', e.target.value)}
                          placeholder="Describe what occurred during this round (e.g. Live coding, System design, HR questions)"
                          className="form-input form-textarea"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {errors.rounds && <span className="form-error">{errors.rounds}</span>}

                <button type="button" className="btn-secondary add-btn" onClick={addRound}>
                  + Add Round
                </button>
              </div>

              {/* SECTION 3 — QUESTIONS ASKED */}
              <div className="form-section">
                <h3 className="section-label">3. Questions Asked</h3>
                <p className="section-desc">
                  Share questions you remember from the interview. Do not include confidential or sensitive personal information.
                </p>

                <div className="questions-list">
                  {formData.questions.map((q, idx) => (
                    <div key={q.id} className="question-item-card">
                      <div className="question-card-header">
                        <span className="question-number">Question {idx + 1}</span>
                        {formData.questions.length > 1 && (
                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() => removeQuestion(q.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        value={q.text}
                        onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                        placeholder="Example: Explain the difference between stack and queue, or write a program to reverse a linked list."
                        className="form-input form-textarea"
                      />
                    </div>
                  ))}
                </div>

                {errors.questions && <span className="form-error">{errors.questions}</span>}

                <button type="button" className="btn-secondary add-btn" onClick={addQuestion}>
                  + Add Question
                </button>
              </div>

              {/* SECTION 4 — YOUR EXPERIENCE */}
              <div className="form-section">
                <div className="flex-between">
                  <h3 className="section-label">
                    4. Your Overall Experience <span className="required-star">*</span>
                  </h3>
                  <span className="char-counter">
                    {formData.experience.length} / 2000
                  </span>
                </div>
                <p className="section-desc">
                  Describe your overall interview experience. Prompts: How was the panel? What topics were emphasized? What would you recommend to future candidates?
                </p>
                <textarea
                  rows={5}
                  maxLength={2000}
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Share your detailed experience, insights, key topics asked, and tips for PSG students..."
                  className={`form-input form-textarea ${errors.experience ? 'input-error' : ''}`}
                />
                {errors.experience && <span className="form-error">{errors.experience}</span>}
              </div>

              {/* SECTION 5 — PREPARATION */}
              <div className="form-section">
                <div className="flex-between">
                  <h3 className="section-label">
                    5. Preparation <span className="optional-badge">(Optional)</span>
                  </h3>
                  <span className="char-counter">
                    {formData.preparation.length} / 1000
                  </span>
                </div>
                <p className="section-desc">What subjects or resources did you prepare for this interview?</p>
                <textarea
                  rows={3}
                  maxLength={1000}
                  name="preparation"
                  value={formData.preparation}
                  onChange={handleInputChange}
                  placeholder="e.g. DSA, DBMS, System Design, LeetCode, core CS subjects, communication practice..."
                  className="form-input form-textarea"
                />
              </div>

              {/* SECTION 6 — DIFFICULTY */}
              <div className="form-section">
                <h3 className="section-label">
                  6. How difficult was the interview? <span className="required-star">*</span>
                </h3>
                <div className="segmented-grid grid-3-btn">
                  {difficultyOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`segmented-btn ${formData.difficulty === level ? 'active' : ''}`}
                      onClick={() => setFormData((prev) => ({ ...prev, difficulty: level }))}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBMISSION NOTICE */}
              <div className="info-callout">
                <span>🛡️</span>
                <div>
                  <strong>Review before submission:</strong> Your interview experience will be reviewed by a Local Admin or Global Admin before it is published. Only approved content will be visible to other students and used as approved interview data.
                </div>
              </div>

              {/* FORM ACTIONS */}
              <div className="setup-actions">
                <button type="submit" className="btn-primary setup-start-btn">
                  Submit Experience
                </button>
                <button type="button" className="btn-secondary" onClick={handleClearForm}>
                  Clear Form
                </button>
                <button
                  type="button"
                  className="btn-secondary setup-back-btn"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}
      </main>
    </div>
  );
}
