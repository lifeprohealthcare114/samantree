import React from 'react';
import '../stylesgloble.css';

const ClinicalEvidence = ({ study }) => {
  return (
    <div className="clinical-evidence">
      <h2>{study.title}</h2>
      <p className="study-meta">{study.journal} • {study.authors}</p>
      <ul className="study-findings">
        {study.findings.map((finding, index) => (
          <li key={index}>{finding}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClinicalEvidence;