import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [isTourActive, setIsTourActive] = useState(false);
  const [isTourPaused, setIsTourPaused] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [hotspotTourIndex, setHotspotTourIndex] = useState(0);
  const [isHotspotTourActive, setIsHotspotTourActive] = useState(false);
  const [manualScrollOverride, setManualScrollOverride] = useState(false);
  const tourTimerRef = useRef(null);
  const hotspotTourTimerRef = useRef(null);
  const lastInteractionRef = useRef(Date.now());
  const inactivityTimerRef = useRef(null);

 const workflowSteps = React.useMemo(() => [
  {
    id: 1,
    title: 'Excision',
    description: 'Excise the tumor from the patient.',
    detailedDescription:
      'Surgical removal of the tumor tissue following standard breast conserving surgery protocols.',
    icon: <FaCut />,
    time: '',
    color: '#e74c3c',
    image: '/assets/images/step-excision.jpg'
  },
  {
    id: 2,
    title: 'Preparation',
    description: 'Immerse in Histolog Dip and rinse in saline solution.',
    detailedDescription:
      'Quick 10-second specimen preparation using Histolog Dip fluorescent stain followed by saline rinse.',
    icon: <FaFlask />,
    time: '10 sec',
    color: '#3498db',
    image: '/assets/images/step-preparation.jpg'
  },
  {
    id: 3,
    title: 'Imaging',
    description: 'Map the whole specimen surface in minutes.',
    detailedDescription:
      'Ultra-fast confocal microscopy captures high-resolution images of the entire specimen surface with 4.8cm × 3.6cm field of view.',
    icon: <FaCamera />,
    time: '~50 sec',
    color: '#2ecc71',
    image: '/assets/images/step-imaging.jpg'
  },
  {
    id: 4,
    title: 'Evaluation',
    description: 'Assess images on the device or remotely while preserving the specimen.',
    detailedDescription:
      'Real-time morphology analysis enables immediate decision-making while preserving tissue integrity for downstream testing.',
    icon: <FaEye />,
    time: 'Real-time',
    color: '#9b59b6',
    image: '/assets/images/step-evaluation.jpg'
  }
], []);

  const getFeatureTagsForStep = (stepId) => {
    const features = {
      1: ['Standard BCS Protocol'],
      2: ['Non-destructive', 'Compatible with downstream testing'],
      3: ['17cm² imaging window', 'High resolution'],
      4: ['DICOM compatible', 'Remote consultation']
    };
    return features[stepId] || [];
  };

  const estimateReadingTime = useCallback((step) => {
    const baseTime = 3000;
    const descriptionLength = (step.description + step.detailedDescription).length;
    const featureTagsCount = getFeatureTagsForStep(step.id).length;
    const readingTime = (descriptionLength / 10) * 100 + featureTagsCount * 1000 + baseTime;
    return Math.min(15000, Math.max(4000, readingTime));
  }, []);

  const autoScrollModal = useCallback(() => {
    return new Promise((resolve) => {
      const modalContent = document.querySelector('.workflow-step.active');
      if (!modalContent || manualScrollOverride) {
        return resolve();
      }
      const scrollHeight = modalContent.scrollHeight;
      const clientHeight = modalContent.clientHeight;
      if (scrollHeight <= clientHeight) {
        return resolve();
      }
      const totalScroll = scrollHeight - clientHeight;
      const step = 1;
      let scrolled = 0;
      const interval = setInterval(() => {
        if (scrolled >= totalScroll) {
          clearInterval(interval);
          resolve();
        } else {
          modalContent.scrollTop += step;
          scrolled += step;
        }
      }, 20);
    });
  }, [manualScrollOverride]);


  const runScrollSequence = useCallback(() => {
    const scrollDown = () =>
      new Promise((resolve) => {
        const startY = window.pageYOffset;
        const endY = document.body.scrollHeight - window.innerHeight;
        const distance = endY - startY;
        const duration = Math.min(6000, Math.max(3000, distance * 2.5)); 

        let startTime = null;

        const animation = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeInOutQuad = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          window.scrollTo(0, startY + distance * easeInOutQuad);
          if (progress < 1) {
            requestAnimationFrame(animation);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(animation);
      });

    const scrollUp = () =>
      new Promise((resolve) => {
        const startY = window.pageYOffset;
        const duration = 3000;
        let startTime = null;

        const animation = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeInOutQuad = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          window.scrollTo(0, startY * (1 - easeInOutQuad));
          if (progress < 1) {
            requestAnimationFrame(animation);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(animation);
      });

    return (async () => {
      await new Promise((res) => setTimeout(res, 2000)); 
      await scrollDown();
      await new Promise((res) => setTimeout(res, 9000)); 
      await scrollUp();
      await new Promise((res) => setTimeout(res, 1000)); 
    })();
  }, []);

 
  const runTourStep = useCallback(async () => {
    if (!isTourActive || isTourPaused) return;

    const currentStep = workflowSteps[tourIndex];
    if (!currentStep) return;

    setActiveStep(currentStep.id);

    const stepElement = document.querySelector(`.workflow-step:nth-child(${tourIndex + 1})`);
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    await new Promise((res) => setTimeout(res, 1000)); 

    await autoScrollModal();

    const readingTime = estimateReadingTime(currentStep);

    tourTimerRef.current = setTimeout(async () => {
      if (isTourPaused) return;

      const isLastStep = tourIndex === workflowSteps.length - 1;
      if (!isLastStep) {
        await new Promise((r) => setTimeout(r, 3000)); 
        if (!isTourPaused) {
          setTourIndex((i) => i + 1);
        }
      } else {
      
        await runScrollSequence();
        setIsTourActive(false);
        setActiveStep(1);
        setTourIndex(0);
        window.location.href = '/';
      }
    }, readingTime);
  }, [isTourActive, isTourPaused, tourIndex, workflowSteps, autoScrollModal, estimateReadingTime, runScrollSequence]);

  useEffect(() => {
    clearTimeout(tourTimerRef.current);
    if (isTourActive && !isTourPaused) {
      runTourStep();
    }
  }, [isTourActive, isTourPaused, tourIndex, runTourStep]);

  useEffect(() => {
    if (!isTourActive || isTourPaused || isHotspotTourActive) {
      return; 
    }

    const stepCount = workflowSteps.length;

    const intervalId = setInterval(() => {
      setActiveStep((prevStep) => {
        if (prevStep >= stepCount) {
          return 1;
        }
        return prevStep + 1;
      });
    }, 6000);

    return () => clearInterval(intervalId);
  }, [isTourActive, isTourPaused, isHotspotTourActive, workflowSteps.length]);

  
  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsHotspotTourActive(true);
      setHotspotTourIndex(0);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHotspotTourActive) return;

    if (hotspotTourIndex >= scannerParts.length) {
      
      if (selectedPart !== null) {
        setSelectedPart(null);
        setTimeout(() => {
          setIsHotspotTourActive(false);
          setHotspotTourIndex(0);
          setIsTourActive(true);  
          setTourIndex(0);
          setActiveStep(1);
        }, 1000);
      } else {
        setIsHotspotTourActive(false);
        setHotspotTourIndex(0);
        setIsTourActive(true);
        setTourIndex(0);
        setActiveStep(1);
      }
      return;
    }


    const part = scannerParts[hotspotTourIndex];
    setSelectedPart(part);

    setIsTourPaused(true);
    setManualScrollOverride(true);

    hotspotTourTimerRef.current = setTimeout(() => {
      setSelectedPart(null);
      setIsTourPaused(false);
      setManualScrollOverride(false);
      setHotspotTourIndex((i) => i + 1);
    }, 8000); 

    return () => clearTimeout(hotspotTourTimerRef.current);
  }, [hotspotTourIndex, isHotspotTourActive, selectedPart]);

 
  const handlePartModalClose = () => {
    setSelectedPart(null);
    if (isHotspotTourActive) {
      setIsTourPaused(false);
      setManualScrollOverride(false);
      clearTimeout(hotspotTourTimerRef.current);
      setTimeout(() => setHotspotTourIndex((i) => i + 1), 500);
    } else if (isTourActive && isTourPaused) {
      setTimeout(() => {
        setIsTourPaused(false);
        setManualScrollOverride(false);
      }, 1000);
    }
  };


  useEffect(() => {
    const resetTimer = () => {
      lastInteractionRef.current = Date.now();
    };

    const checkInactivity = () => {
      if (isTourPaused && Date.now() - lastInteractionRef.current > 2 * 60 * 1000) {
        setIsTourPaused(false);
        setManualScrollOverride(false);
      }
    };

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keydown', resetTimer);
    document.addEventListener('touchstart', resetTimer);
    inactivityTimerRef.current = setInterval(checkInactivity, 10000);

    return () => {
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('keydown', resetTimer);
      document.removeEventListener('touchstart', resetTimer);
      clearInterval(inactivityTimerRef.current);
    };
  }, [isTourPaused]);

  return (
    <div className="product-features">

      <div
        className="tour-controls-permanent"
        style={{
          position: 'fixed',
          top: 85,
          right: 0,
          zIndex: 10000,
          background: 'rgba(0,0,0,0.85)',
          padding: '10px 15px',
          borderRadius: 8,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
    <button
  onClick={() => {
    clearTimeout(tourTimerRef.current);
    clearTimeout(hotspotTourTimerRef.current);
    setIsTourActive(false);
    setIsTourPaused(false);
    setIsHotspotTourActive(false);
    setTourIndex(0);
    setHotspotTourIndex(0);
    setActiveStep(1);
    setSelectedPart(null);
    setManualScrollOverride(false);
  }}
  disabled={!isTourActive} // Disable when tour not active
  style={{
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 5,
    cursor: isTourActive ? 'pointer' : 'not-allowed', // Change cursor accordingly
    opacity: isTourActive ? 1 : 0.6, // Visual disable effect
  }}
>
  ■ Stop Tour
</button>

        <button
          onClick={() => {
            clearTimeout(tourTimerRef.current);
            clearTimeout(hotspotTourTimerRef.current);
            setIsTourActive(false);
            setIsTourPaused(false);
            setIsHotspotTourActive(true);  
            setTourIndex(0);
            setHotspotTourIndex(0);
            setActiveStep(1);
            setSelectedPart(null);
            setManualScrollOverride(false);

         
            const container = document.querySelector('.workflow-section'); 
            if (container) {
              container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          style={{
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 5,
            cursor: 'pointer'
          }}
        >
         🔄 Restart Tour
        </button>
      </div>

      <div className="container">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          Histolog® Scanner Features
        </motion.h1>

       
        <motion.div
          className="scanner-zoom-wrapper"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        >
          <ScannerHotspot
            imageUrl="/assets/images/Histolog.jpg"
            parts={scannerParts}
            onPartSelect={(part) => {
              if (!isTourPaused) setIsTourPaused(true);
              setManualScrollOverride(true);
              setSelectedPart(part);
            }}
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
            <p className="workflow-subtitle">Complete specimen analysis in under 65 seconds</p>
          </div>

          <div className="workflow-container">
       
            <div className="timeline-progress">
              <div className="progress-line">
                <motion.div
                  className="progress-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(activeStep / workflowSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {workflowSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`timeline-dot ${activeStep >= step.id ? 'active' : ''}`}
                  style={{ left: `${(idx / (workflowSteps.length - 1)) * 100}%` }}
                >
                  <div className="dot-inner" style={{ backgroundColor: step.color }}>
                    {step.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="workflow-steps">
              {workflowSteps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  className={`workflow-step ${activeStep === step.id ? 'active' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  onMouseEnter={() => {
                    if (!isTourActive && !isHotspotTourActive) setActiveStep(step.id);
                  }}
                  onClick={() => {
                    if (!isTourPaused) setIsTourPaused(true);
                    setManualScrollOverride(true);
                    setActiveStep(step.id);
                  }}
                  whileHover={{ y: -5 }}
                  style={{
                    position: 'relative',
                    opacity: isTourActive && activeStep !== step.id ? 0.6 : 1,
                    transform: isTourActive && activeStep === step.id ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
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
                      {getFeatureTagsForStep(step.id).map((feature, idx) => (
                        <div key={idx} className="feature-tag">
                          <FaCheckCircle />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    className="step-glow"
                    style={{ background: `radial-gradient(600px at center, ${step.color}15, transparent 70%)` }}
                    animate={{ opacity: activeStep === step.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="workflow-summary">
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

      {selectedPart && <PartModal part={selectedPart} onClose={handlePartModalClose} />}
    </div>
  );
};

export default ProductFeatures;
