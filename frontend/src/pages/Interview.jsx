import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Auth3D from '../three/Auth3D';
import { apiRequest } from '../services/api';

/**
 * Mock Interview Room
 * 
 * Educational Notes for Students:
 * - Loads questions generated during the setup step.
 * - Computes remaining time based on a persistent end timestamp so page refreshes do not reset the timer.
 * - Submits all candidate answers to Groq for evaluation once completed or when timer expires.
 */
export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve session data from navigate state or sessionStorage
  const [sessionData, setSessionData] = useState(() => {
    if (location.state && location.state.interviewId && location.state.questions) {
      return location.state;
    }
    const saved = sessionStorage.getItem('currentInterview');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setServerError] = useState('');

  const isSubmittingRef = useRef(false);
  const timerRef = useRef(null);

  // If no interview session is active, redirect back to interview setup
  useEffect(() => {
    if (!sessionData || !sessionData.questions || sessionData.questions.length === 0) {
      navigate('/interview-setup', { replace: true });
    }
  }, [sessionData, navigate]);

  // Persistent Countdown Timer
  useEffect(() => {
    if (!sessionData) return;

    const durationMinutes = sessionData.durationMinutes || 30;
    const storageKey = `interview_end_${sessionData.interviewId}`;

    let endTime = parseInt(sessionStorage.getItem(storageKey), 10);
    if (!endTime || isNaN(endTime)) {
      endTime = Date.now() + durationMinutes * 60 * 1000;
      sessionStorage.setItem(storageKey, endTime.toString());
    }

    const updateTimer = () => {
      const remainingSeconds = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remainingSeconds);

      // Auto-submit when time expires
      if (remainingSeconds <= 0) {
        clearInterval(timerRef.current);
        handleFinishInterview();
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionData]);

  // Safe accessor for questions
  const questions = sessionData?.questions || [];
  const currentQuestion = questions[currentIndex] || null;
  const currentOrder = currentQuestion?.order || currentIndex + 1;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Handle Answer Input
  const handleAnswerChange = (e) => {
    const value = e.target.value;
    setAnswers((prev) => ({
      ...prev,
      [currentOrder]: value,
    }));
  };

  // Next / Previous Navigation
  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishInterview();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Submit and Finish Interview
  const handleFinishInterview = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsEvaluating(true);
    setServerError('');

    // Prepare payload of all questions and answers
    const payload = {
      answers: questions.map((q) => ({
        order: q.order,
        answer: answers[q.order] || '',
      })),
    };

    try {
      const response = await apiRequest(`/interviews/${sessionData.interviewId}/finish`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.success) {
        setServerError(response.message || 'Evaluation failed. Please try submitting again.');
        setIsEvaluating(false);
        isSubmittingRef.current = false;
        return;
      }

      // Clean up session storage after successful submission
      sessionStorage.removeItem('currentInterview');
      sessionStorage.removeItem(`interview_end_${sessionData.interviewId}`);

      // Navigate to Results page with the newly evaluated score & feedback
      navigate('/results', {
        state: {
          latestResult: {
            ...response,
            interviewId: sessionData.interviewId,
            targetRole: sessionData.targetRole,
            interviewType: sessionData.interviewType,
            difficulty: sessionData.difficulty,
          },
        },
      });
    } catch (err) {
      setServerError('A network error occurred while submitting your answers.');
      setIsEvaluating(false);
      isSubmittingRef.current = false;
    }
  };

  // Format MM:SS for countdown display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!sessionData || !currentQuestion) {
    return null;
  }

  const isLowTime = timeLeft < 60;

  return (
    <div className="dashboard-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Auth3D />

      {/* Top Interview Navbar with Progress & Countdown Timer */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: 'rgba(10, 15, 29, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {sessionData.interviewType} • {sessionData.targetRole}
          </span>
          <h2 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: 0 }}>
            Mock Interview Session
          </h2>
        </div>

        {/* Countdown Timer Display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: isLowTime ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isLowTime ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
            color: isLowTime ? '#ef4444' : '#38bdf8',
            fontFamily: 'monospace',
            fontSize: '1.25rem',
            fontWeight: 700,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Question & Answer Area */}
      <main style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '2rem auto', padding: '0 1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          
          {/* Progress Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              {sessionData.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <h3
            style={{
              fontSize: '1.35rem',
              color: '#f8fafc',
              lineHeight: 1.5,
              marginBottom: '1.75rem',
              fontWeight: 500,
            }}
          >
            {currentQuestion.text}
          </h3>

          {/* Answer Input Area */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              Your Answer:
            </label>
            <textarea
              rows={8}
              value={answers[currentOrder] || ''}
              onChange={handleAnswerChange}
              disabled={isEvaluating}
              placeholder="Type your response thoroughly. Explain your thought process, logic, and reasoning clearly..."
              className="form-input form-textarea"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                resize: 'vertical',
              }}
            />
          </div>

          {/*
            ====================================================================
            [FUTURE EXPANSION] Voice / Speech-to-Text Conversational Mode:
            To enable audio response answering:
            1. Initialize webkitSpeechRecognition or MediaRecorder stream.
            2. On mic toggle, stream chunks to Whisper API or browser speech recognition.
            3. Append transcript updates directly into `answers[currentOrder]`.
            ====================================================================
          */}

          {/* Inline Error Message */}
          {errorMessage && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#fca5a5',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Navigation & Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isEvaluating}
              style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
                disabled={isEvaluating}
                style={{ minWidth: '120px' }}
              >
                {isLastQuestion ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Evaluating Overlay Screen */}
      {isEvaluating && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 15, 29, 0.95)',
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
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTopColor: '#10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem',
            }}
          />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Evaluating your answers...
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '440px', lineHeight: 1.6, margin: 0 }}>
            Our AI interviewer is scoring your responses against reference standards and generating your personalized feedback.
          </p>
        </div>
      )}
    </div>
  );
}
