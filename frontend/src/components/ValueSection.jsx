import React from 'react';

export default function ValueSection() {
  const valueItems = [
    {
      icon: '🤖',
      title: 'AI-Powered Practice',
      description: 'Simulate realistic behavioral and technical interview scenarios with adaptive AI interviewers.'
    },
    {
      icon: '📄',
      title: 'Resume-Based Questions',
      description: 'Questions tailored directly to your projects, skills, and experience extracted from your uploaded resume.'
    },
    {
      icon: '🏛️',
      title: 'Approved Question Bank',
      description: 'Access peer-submitted and admin-verified real interview questions from top recruiting companies.'
    },
    {
      icon: '⚡',
      title: 'Instant Evaluation & Score',
      description: 'Receive detailed evaluations scored out of 100 with comprehensive constructive feedback after every mock session.'
    },
    {
      icon: '📈',
      title: 'Performance Analytics',
      description: 'Track score progression over time, identify skill gaps, and monitor your average performance statistics.'
    },
    {
      icon: '🛡️',
      title: 'Quality Content Workflow',
      description: 'All interview experiences undergo strict admin verification so you practice with trusted, high-value material.'
    }
  ];

  return (
    <section className="section" id="value-props">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Built for <span className="gradient-text">Student Success</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to master your technical, domain-specific, and behavioral interviews.
          </p>
        </div>

        <div className="grid-3">
          {valueItems.map((item, idx) => (
            <div key={idx} className="glass-panel card">
              <div className="card-icon">{item.icon}</div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-text">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

