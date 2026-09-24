import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Register and set up your student profile to track your interview practice and statistics.'
    },
    {
      number: '02',
      title: 'Upload Your Resume',
      description: 'Provide your resume so the system can parse your technical skills, projects, and experiences.'
    },
    {
      number: '03',
      title: 'Practice Your Interview',
      description: 'Participate in AI interviews using questions drawn from approved question banks and tailored to your resume.'
    },
    {
      number: '04',
      title: 'Get Score & Feedback',
      description: 'Receive an overall score out of 100 alongside comprehensive feedback to continuously refine your performance.'
    }
  ];

  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-subtitle">
            Four simple steps from account setup to AI interview score evaluation.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-panel step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="card-title">{step.title}</h3>
              <p className="card-text">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

