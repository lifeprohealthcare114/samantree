import React from 'react';
import { motion } from 'framer-motion';
import '../styles/globle.css';

const ScannerHotspot = ({ imageUrl, parts, onPartSelect }) => {
  return (
    <div className="scanner-hotspot-container">
      {/* Zoom wrapper for image + hotspots */}
      <motion.div
        className="scanner-zoom-content"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut'
        }}
        style={{ position: 'relative' }}
      >
        <img src={imageUrl} alt="Histolog Scanner" className="scanner-image" />

        {parts.map((part) => (
          <button
            key={part.id}
            className="hotspot"
            style={{
              position: 'absolute',
              left: `${part.position.x}%`,
              top: `${part.position.y}%`,
            }}
            onClick={() => onPartSelect(part)}
            aria-label={`Learn more about ${part.name}`}
          >
            <div className="hotspot-marker"></div>

            {/* Label positioned separately using labelPosition */}
            <span
              className="hotspot-label always-visible"
              style={{
                position: 'absolute',
                left: `${part.labelPosition ? part.labelPosition.x : part.position.x}%`,
                top: `${part.labelPosition ? part.labelPosition.y : part.position.y}%`,
                transform: part.labelLeft ? 'translateX(-100%)' : 'translateX(0)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none' // Ensure label does not block hotspot button clicks
              }}
            >
              {part.name}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default ScannerHotspot;
