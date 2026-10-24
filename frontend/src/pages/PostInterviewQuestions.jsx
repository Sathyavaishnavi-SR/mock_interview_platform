import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import Auth3D from '../three/Auth3D';
import SuccessModal from '../components/SuccessModal';
import { apiRequest } from '../services/api';

export default function PostInterviewQuestions() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    interviewRound: '',
    interviewDate: '',
    question: '',
    topic: '',
    questionType: '',
    difficulty: 'Medium',
    memory: 'mostly', // values: exact, mostly, partial
    answerNotes: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    if (!formData.company.trim()) newErrors.company = 'Please enter the company name.';
    if (!formData.role.trim()) newErrors.role = 'Please enter the role / position.';
    if (!formData.interviewRound) newErrors.interviewRound = 'Please select the interview round.';
    if (!formData.interviewDate) newErrors.interviewDate = 'Please select the interview date.';
    if (!formData.question.trim()) newErrors.question = 'Please enter the interview question.';
    if (formData.question.length > 500) newErrors.question = 'Question must be 500 characters or less.';
    if (!formData.topic) newErrors.topic = 'Please select a topic.';
    if (!formData.questionType) newErrors.questionType = 'Please select a question type.';
    if (!formData.memory) newErrors.memory = 'Please indicate how accurately you remember the question.';
    if (formData.answerNotes.length > 1000) newErrors.answerNotes = 'Answer / notes must be 1000 characters or less.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      company: formData.company.trim(),
      role: formData.role.trim(),
      interviewRound: formData.interviewRound,
      interviewDate: formData.interviewDate,
      question: formData.question.trim(),
      topic: formData.topic,
      questionType: formData.questionType,
      difficulty: formData.difficulty,
      memory: formData.memory,
      answerNotes: formData.answerNotes ? formData.answerNotes.trim() : '',
    };

    setLoading(true);
    try {
      const response = await apiRequest('/submissions/questions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.success) {
        setShowSuccessPopup(true);
        setPopupMessage(
          'Your question has been submitted successfully.\n\nIt will be reviewed and approved/rejected by the admin.\n\nThank you for contributing!'
        );
        setIsSubmitted(true);
      } else {
        setServerError(response.message || 'Failed to submit question. Please try again.');
      }
    } catch (err) {
      setServerError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    const isDirty = Object.values(formData).some((val) => val && val !== 'Medium' && val !== 'mostly');
    if (isDirty) {
      if (!window.confirm('Are you sure you want to clear the form? All entered information will be lost.')) {
        return;
      }
    }
    setFormData({
      company: '',
      role: '',
      interviewRound: '',
      interviewDate: '',
      question: '',
      topic: '',
      questionType: '',
      difficulty: 'Medium',
      memory: 'mostly',
      answerNotes: '',
      status: 'pending',
    });
    setErrors({});
    setServerError('');
  };

  // Options
  const roleOptions = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Data Scientist',
    'AI / ML Engineer',
    'Other',
  ];

  const roundOptions = [
    'Online Assessment',
    'Technical Round',
    'Coding Round',
    'Technical + Coding',
    'System Design',
    'HR / Behavioral',
    'Managerial',
    'Group Discussion',
    'Other',
  ];

  const topicOptions = [
    'DSA',
    'DBMS',
    'Operating Systems',
    'Computer Networks',
    'OOP',
    'System Design',
    'Aptitude',
    'HR / Behavioral',
    'Core / Domain',
    'SQL',
    'Other',
  ];

  const typeOptions = [
    'Coding',
    'Conceptual',
    'MCQ',
    'Problem Solving',
    'Behavioral',
    'SQL',
    'System Design',
    'Other',
  ];

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const memoryOptions = [
    { value: 'exact', label: 'Exact Question', description: 'I remember the question almost exactly.' },
    { value: 'mostly', label: 'Mostly Remember', description: 'The wording may be slightly different.' },
    { value: 'partial', label: 'Partially Remember', description: 'I remember the main idea, but not the exact question.' },
  ];

  return (
    <div className="dashboard-layout">
      <Auth3D />
      <DashboardSidebar />
      <main className="dashboard-main">
        <header className="dash-welcome-header">
          <h1 className="dash-title">Contribute Interview Questions</h1>
          <p className="dash-subtitle">
            Share questions you remember from interviews and help build a better question bank for students.
          </p>
          <div className="subtle-notice">
            Submit individual questions you remember from interviews. Each question will be reviewed by an admin before it becomes part of the approved question bank.
          </div>
        </header>

        {isSubmitted ? (
          <div className="setup-container">
            <div className="glass-panel confirmation-box">
              <span className="confirmation-badge">Pending Review</span>
              <h2 className="dash-section-title" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                Question Submitted
              </h2>
              <p className="dash-subtitle" style={{ maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
                Your question for <strong>{formData.company}</strong> ({formData.role}) has been submitted for admin review.
              </p>
              <div className="setup-actions" style={{ justifyContent: 'center' }}>
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                <button
                  className="btn-secondary"
                  onClick={() => { setIsSubmitted(false); handleClearForm(); }}
                >
                  Submit Another Question
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="setup-container">
            <form onSubmit={handleSubmit} className="setup-form-card glass-panel" noValidate>
              {/* SECTION A – INTERVIEW DETAILS */}
              <div className="form-section">
                <h3 className="section-label">A. Interview Details</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="company" className="form-label">Company / Organization <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Google, TCS, Zoho"
                      className={`form-input ${errors.company ? 'input-error' : ''}`}
                    />
                    {errors.company && <span className="form-error">{errors.company}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="role" className="form-label">Role / Position <span className="required-star">*</span></label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`form-input ${errors.role ? 'input-error' : ''}`}
                    >
                      <option value="">Select role</option>
                      {roleOptions.map((opt) => (
                        <option key={opt} value={opt} style={{ background: '#121824', color: '#fff' }}>{opt}</option>
                      ))}
                    </select>
                    {errors.role && <span className="form-error">{errors.role}</span>}
                  </div>
                </div>
                <div className="form-grid-2" style={{ marginTop: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="interviewRound" className="form-label">Interview Round <span className="required-star">*</span></label>
                    <select
                      id="interviewRound"
                      name="interviewRound"
                      value={formData.interviewRound}
                      onChange={handleInputChange}
                      className={`form-input ${errors.interviewRound ? 'input-error' : ''}`}
                    >
                      <option value="">Select round</option>
                      {roundOptions.map((opt) => (
                        <option key={opt} value={opt} style={{ background: '#121824', color: '#fff' }}>{opt}</option>
                      ))}
                    </select>
                    {errors.interviewRound && <span className="form-error">{errors.interviewRound}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="interviewDate" className="form-label">Interview Date <span className="required-star">*</span></label>
                    <input
                      type="date"
                      id="interviewDate"
                      name="interviewDate"
                      value={formData.interviewDate}
                      onChange={handleInputChange}
                      className={`form-input ${errors.interviewDate ? 'input-error' : ''}`}
                    />
                    {errors.interviewDate && <span className="form-error">{errors.interviewDate}</span>}
                  </div>
                </div>
              </div>

              {/* SECTION B – QUESTION DETAILS */}
              <div className="form-section">
                <h3 className="section-label">B. Question Details</h3>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label htmlFor="question" className="form-label">Question <span className="required-star">*</span></label>
                  <textarea
                    id="question"
                    name="question"
                    rows={3}
                    maxLength={500}
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Type the interview question you were asked…"
                    className={`form-input form-textarea ${errors.question ? 'input-error' : ''}`}
                  />
                  <div className="char-counter">{formData.question.length} / 500</div>
                  {errors.question && <span className="form-error">{errors.question}</span>}
                </div>
                <div className="form-grid-3" style={{ marginBottom: '0.75rem' }}>
                  <div className="form-group">
                    <label htmlFor="topic" className="form-label">Topic <span className="required-star">*</span></label>
                    <select
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className={`form-input ${errors.topic ? 'input-error' : ''}`}
                    >
                      <option value="">Select topic</option>
                      {topicOptions.map((opt) => (
                        <option key={opt} value={opt} style={{ background: '#121824', color: '#fff' }}>{opt}</option>
                      ))}
                    </select>
                    {errors.topic && <span className="form-error">{errors.topic}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="questionType" className="form-label">Question Type <span className="required-star">*</span></label>
                    <select
                      id="questionType"
                      name="questionType"
                      value={formData.questionType}
                      onChange={handleInputChange}
                      className={`form-input ${errors.questionType ? 'input-error' : ''}`}
                    >
                      <option value="">Select type</option>
                      {typeOptions.map((opt) => (
                        <option key={opt} value={opt} style={{ background: '#121824', color: '#fff' }}>{opt}</option>
                      ))}
                    </select>
                    {errors.questionType && <span className="form-error">{errors.questionType}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Difficulty <span className="required-star">*</span></label>
                    <div className="segmented-grid grid-3-btn">
                      {difficultyOptions.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          className={`segmented-btn ${formData.difficulty === lvl ? 'active' : ''}`}
                          onClick={() => setFormData((prev) => ({ ...prev, difficulty: lvl }))}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-section" style={{ marginTop: '1rem' }}>
                  <h4 className="section-label">How accurately do you remember this question?</h4>
                  <div className="form-grid-3">
                    {memoryOptions.map((opt) => (
                      <label key={opt.value} className={`radio-card ${formData.memory === opt.value ? 'active' : ''}`} style={{ cursor: 'pointer', padding: '0.75rem', border: '1px solid var(--bg-card-border)', borderRadius: 'var(--radius-md)', background: formData.memory === opt.value ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                        <input
                          type="radio"
                          name="memory"
                          value={opt.value}
                          checked={formData.memory === opt.value}
                          onChange={() => setFormData((prev) => ({ ...prev, memory: opt.value }))}
                          style={{ display: 'none' }}
                        />
                        <strong>{opt.label}</strong><br />
                        <small>{opt.description}</small>
                      </label>
                    ))}
                  </div>
                  {errors.memory && <span className="form-error">{errors.memory}</span>}
                </div>
              </div>

              {/* SECTION C – OPTIONAL ANSWER / NOTES */}
              <div className="form-section">
                <h3 className="section-label">C. Your Answer / Notes (Optional)</h3>
                <textarea
                  id="answerNotes"
                  name="answerNotes"
                  rows={4}
                  maxLength={1000}
                  value={formData.answerNotes}
                  onChange={handleInputChange}
                  placeholder="Add your approach, answer, hints, or anything useful you remember…"
                  className="form-input form-textarea"
                />
                <div className="char-counter">{formData.answerNotes.length} / 1000</div>
                {errors.answerNotes && <span className="form-error">{errors.answerNotes}</span>}
              </div>

              {/* INFORMATION CARD BEFORE SUBMIT */}
              <div className="info-callout" style={{ marginTop: '1.5rem', padding: '1rem', borderLeft: '4px solid var(--accent-blue)', background: 'rgba(59,130,246,0.05)' }}>
                <strong>Before you submit</strong>
                <p style={{ marginTop: '0.5rem' }}>
                  Your question will first be marked as Pending Review. A Local Admin or Global Admin will review it before publication. Only approved questions will be added to the platform’s official question bank and used as approved data for AI‑generated mock interviews.
                </p>
              </div>

              {/* Server Error Message */}
              {serverError && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #ef4444',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fca5a5',
                    fontSize: '0.85rem',
                    marginTop: '1rem',
                  }}
                >
                  {serverError}
                </div>
              )}

              {/* FORM ACTIONS */}
              <div className="setup-actions" style={{ marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn-primary setup-start-btn"
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Submitting Question...' : 'Submit Question'}
                </button>
                <button type="button" className="btn-secondary" onClick={handleClearForm} disabled={loading}>
                  Clear Form
                </button>
                <button
                  type="button"
                  className="btn-secondary setup-back-btn"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Success Modal Popup */}
        <SuccessModal
          isOpen={showSuccessPopup}
          title="Submitted Successfully"
          message={popupMessage}
          onClose={() => {
            setShowSuccessPopup(false);
            navigate('/dashboard');
          }}
        />
      </main>
    </div>
  );
}
