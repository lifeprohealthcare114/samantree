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
      >
        <img src={imageUrl} alt="Histolog Scanner" className="scanner-image" />

        {parts.map((part) => (
          <button
            key={part.id}
            className="hotspot"
            style={{
              left: `${part.position.x}%`,
              top: `${part.position.y}%`,
            }}
            onClick={() => onPartSelect(part)}
            aria-label={`Learn more about ${part.name}`}
          >
            <div className="hotspot-marker"></div>
            <span className="hotspot-label">{part.name}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default ScannerHotspot;
