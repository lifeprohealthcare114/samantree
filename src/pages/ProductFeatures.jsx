import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCut, 
  FaFlask, 
  FaCamera, 
  FaEye,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import ScannerHotspot from '../components/ScannerHotspot';
import FeatureHighlights from '../components/FeatureHighlights';
import PartModal from '../components/PartModal';
import { scannerParts } from '../utils/constants';
import '../styles/globle.css';

const ProductFeatures = () => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const workflowSteps = [
    {
      id: 1,
      title: 'Excision',
      description: 'Excise the tumor from the patient.',
      detailedDescription: 'Surgical removal of the tumor tissue following standard breast conserving surgery protocols.',
      icon: <FaCut />,
      time: '',
      color: '#e74c3c',
      image: '/assets/images/step-excision.jpg'
    },
    {
      id: 2,
      title: 'Preparation',
      description: 'Immerse in Histolog Dip and rinse in saline solution.',
      detailedDescription: 'Quick 10-second specimen preparation using Histolog Dip fluorescent stain followed by saline rinse.',
      icon: <FaFlask />,
      time: '10 sec',
      color: '#3498db',
      image: '/assets/images/step-preparation.jpg'
    },
    {
      id: 3,
      title: 'Imaging',
      description: 'Map the whole specimen surface in minutes.',
      detailedDescription: 'Ultra-fast confocal microscopy captures high-resolution images of the entire specimen surface with 4.8cm × 3.6cm field of view.',
      icon: <FaCamera />,
      time: '~50 sec',
      color: '#2ecc71',
      image: '/assets/images/step-imaging.jpg'
    },
    {
      id: 4,
      title: 'Evaluation',
      description: 'Assess images on the device or remotely while preserving the specimen.',
      detailedDescription: 'Real-time morphology analysis enables immediate decision-making while preserving tissue integrity for downstream testing.',
      icon: <FaEye />,
      time: 'Real-time',
      color: '#9b59b6',
      image: '/assets/images/step-evaluation.jpg'
    }
  ];

  return (
    <div className="product-features">
      <div className="container">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Histolog® Scanner Features
        </motion.h1>

        {/* Zoom-In-Out Animation Wrapper */}
        <motion.div
          className="scanner-zoom-wrapper"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut'
          }}
        >
          <ScannerHotspot 
            imageUrl="/assets/images/Histolog.jpg"
            parts={scannerParts}
            onPartSelect={setSelectedPart}
          />
        </motion.div>

        <motion.div 
          className="workflow-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="workflow-header">
            <h2>4-Step Quick & Clean Procedure</h2>
            <p className="workflow-subtitle">
              Complete specimen analysis in under 65 seconds
            </p>
          </div>

          <div className="workflow-container">
            {/* Timeline Progress */}
            <div className="timeline-progress">
              <div className="progress-line">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(activeStep / workflowSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {workflowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`timeline-dot ${activeStep >= step.id ? 'active' : ''}`}
                  style={{ left: `${(index / (workflowSteps.length - 1)) * 100}%` }}
                >
                  <div className="dot-inner" style={{ backgroundColor: step.color }}>
                    {step.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Step Cards */}
            <div className="workflow-steps">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`workflow-step ${activeStep === step.id ? 'active' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onMouseEnter={() => setActiveStep(step.id)}
                  whileHover={{ y: -5 }}
                >
                  <div className="step-visual">
                    <div className="step-icon" style={{ backgroundColor: `${step.color}20`, borderColor: step.color }}>
                      <div className="icon-wrapper" style={{ color: step.color }}>
                        {step.icon}
                      </div>
                    </div>
                    <div className="step-number">
                      <span style={{ backgroundColor: step.color }}>{step.id}</span>
                    </div>
                  </div>

                  <div className="step-content">
                    <div className="step-header">
                      <h3 style={{ color: step.color }}>{step.title}</h3>
                      {step.time && (
                        <div className="step-time">
                          <FaClock />
                          <span>{step.time}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="step-description">{step.description}</p>
                    <p className="step-detailed">{step.detailedDescription}</p>
                    
                    <div className="step-features">
                      {step.id === 1 && (
                        <div className="feature-tag">
                          <FaCheckCircle />
                          <span>Standard BCS Protocol</span>
                        </div>
                      )}
                      {step.id === 2 && (
                        <>
                          <div className="feature-tag">
                            <FaCheckCircle />
                            <span>Non-destructive</span>
                          </div>
                          <div className="feature-tag">
                            <FaCheckCircle />
                            <span>Compatible with downstream testing</span>
                          </div>
                        </>
                      )}
                      {step.id === 3 && (
                        <>
                          <div className="feature-tag">
                            <FaCheckCircle />
                            <span>17cm² imaging window</span>
                          </div>
                          <div className="feature-tag">
                            <FaCheckCircle />
                            <span>High resolution</span>
                          </div>
                        </>
                      )}
                      {step.id === 4 && (
                        <>
                          <div className="feature-tag">
                            <FaCheckCircle />
                            <span>DICOM compatible</span>
                          </div>
                          <div className="feature-tag">
                            <FaCheckCircle />
                            <span>Remote consultation</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <motion.div 
                    className="step-glow"
                    style={{ 
                      background: `radial-gradient(600px at center, ${step.color}15, transparent 70%)`
                    }}
                    animate={{ 
                      opacity: activeStep === step.id ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Summary Stats */}
            <motion.div 
              className="workflow-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="summary-stat">
                <div className="stat-value">≤65s</div>
                <div className="stat-label">Total Processing Time</div>
              </div>
              <div className="summary-stat">
                <div className="stat-value">75%</div>
                <div className="stat-label">Re-operation Reduction</div>
              </div>
              <div className="summary-stat">
                <div className="stat-value">100%</div>
                <div className="stat-label">Specimen Preservation</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <section className="features-overview">
        <FeatureHighlights />
      </section>
      
      {selectedPart && (
        <PartModal part={selectedPart} onClose={() => setSelectedPart(null)} />
      )}
    </div>
  );
};

export default ProductFeatures;
