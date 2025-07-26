import React, { useEffect } from 'react';
import '../styles/globle.css';

const PartModal = ({ part, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <h2>{part.name}</h2>
        <img src={part.image} alt={part.name} className="modal-part-image" />
        <div className="part-details">
          <h3>Functionality</h3>
          <p>{part.description}</p>
          <h3>Key Features</h3>
          <ul>
            {part.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PartModal;