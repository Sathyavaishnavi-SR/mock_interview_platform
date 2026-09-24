import React from 'react';

export default function CompanyMarquee() {
  const companies = [
    'Google',
    'Microsoft',
    'Amazon',
    'Meta',
    'Apple',
    'Nvidia',
    'Goldman Sachs',
    'McKinsey & Co',
    'Adobe',
    'Salesforce',
    'Cisco',
    'Intel'
  ];

  return (
    <section className="marquee-section">
      <div className="marquee-title">
        Prepare for the companies you aspire to join
      </div>

      <div className="marquee-track">
        {/* Double array for seamless loop */}
        {[...companies, ...companies].map((company, index) => (
          <div key={index} className="marquee-item">
            <span style={{ fontSize: '1.2rem', color: '#3b82f6' }}>❖</span>
            <span>{company}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

