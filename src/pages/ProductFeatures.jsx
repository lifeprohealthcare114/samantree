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
  // States
  const [selectedPart, setSelectedPart] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isTourPaused, setIsTourPaused] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [, setManualScrollOverride] = useState(false);
  const [isTourStopped, setIsTourStopped] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [, setScrollSequenceActive] = useState(false);
  const [isScrollingWorkflow, setIsScrollingWorkflow] = useState(false);

  // Refs
  const timerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const lastInteractionRef = useRef(Date.now());
  const isRestartingRef = useRef(false);

  // Workflow Steps Data
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

  // Limit hotspot modals to max 3
  const totalHotspotSteps = Math.min(3, scannerParts.length);
  const totalWorkflowSteps = workflowSteps.length;

  // Feature tags function
  const getFeatureTagsForStep = (stepId) => {
    const features = {
      1: ['Standard BCS Protocol'],
      2: ['Non-destructive', 'Compatible with downstream testing'],
      3: ['17cm² imaging window', 'High resolution'],
      4: ['DICOM compatible', 'Remote consultation']
    };
    return features[stepId] || [];
  };

  // Smooth scroll helper
  const smoothScrollTo = (targetY, duration = 3000) => {
    return new Promise((resolve) => {
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      let startTime = null;

      function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeInOutQuad =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        window.scrollTo(0, startY + distance * easeInOutQuad);
        if (progress < 1) {
          requestAnimationFrame(animation);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(animation);
    });
  };

  // Scroll helpers
  const scrollToWorkflowSection = useCallback(async () => {
    const el = document.querySelector('.workflow-section');
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 50;
    await smoothScrollTo(top, 4000);
  }, []);

  const scrollToBottom = useCallback(async () => {
    const bottom = document.body.scrollHeight - window.innerHeight;
    await smoothScrollTo(bottom, 7000);
  }, []);

  const scrollToTop = useCallback(async () => {
    await smoothScrollTo(0, 4000);
  }, []);

  // Unified tour runner
  const runTourStep = useCallback(async () => {
    if (!isTourActive || isTourPaused || isTourStopped || isRestartingRef.current) return;

    clearTimeout(timerRef.current);

    // Hotspot modals (each shows 6s + 3s delay between)
    if (tourIndex < totalHotspotSteps) {
      const part = scannerParts[tourIndex];
      setSelectedPart(part);
      setManualScrollOverride(true);

      timerRef.current = setTimeout(() => {
        setSelectedPart(null);
        setManualScrollOverride(false);
        if (!isTourStopped && !isRestartingRef.current) {
          timerRef.current = setTimeout(() => {
            setTourIndex((prev) => prev + 1);
          }, 3000);
        }
      }, 6000);
      return;
    }

    // Scroll to workflow section after hotspot modals
    if (tourIndex === totalHotspotSteps && !isScrollingWorkflow) {
      setIsScrollingWorkflow(true);
      await scrollToWorkflowSection();
      setIsScrollingWorkflow(false);
      setTourIndex((prev) => prev + 1);
      setActiveStep(1);
      return;
    }

    // Workflow steps display with auto scroll & timing
    const workflowStepIndex = tourIndex - totalHotspotSteps - 1;
    if (workflowStepIndex >= 0 && workflowStepIndex < totalWorkflowSteps) {
      const currentStep = workflowSteps[workflowStepIndex];
      if (!currentStep) return;

      setActiveStep(currentStep.id);

      const stepElement = document.querySelector(
        `.workflow-step:nth-child(${workflowStepIndex + 1})`
      );
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      timerRef.current = setTimeout(() => {
        if (isTourPaused || isTourStopped || isRestartingRef.current) return;

        const isLastStep = workflowStepIndex === totalWorkflowSteps - 1;
        if (!isLastStep) {
          setTourIndex((prev) => prev + 1);
        } else {
          (async () => {
            setScrollSequenceActive(true);

            await scrollToBottom();

            if (isTourStopped || isRestartingRef.current) return;

            // Highlight 6 cards sequentially for 2 seconds each (total 12 seconds)
            for (let i = 1; i <= 6; i++) {
              if (isTourStopped || isRestartingRef.current) return;
              setActiveStep(i);
              await new Promise((r) => setTimeout(r, 2000));
            }

            if (isTourStopped || isRestartingRef.current) return;

            await scrollToTop();

            if (isTourStopped || isRestartingRef.current) return;

            setScrollSequenceActive(false);
            setIsTourActive(false);
            setActiveStep(1);
            setTourIndex(0);

            if (!(isTourStopped || isRestartingRef.current)) {
              window.location.href = '/';
            }
          })();
        }
      }, 5000);
      return;
    }
  }, [
    isTourActive,
    isTourPaused,
    isTourStopped,
    tourIndex,
    workflowSteps,
    scrollToWorkflowSection,
    scrollToBottom,
    scrollToTop,
    totalHotspotSteps,
    totalWorkflowSteps,
    isScrollingWorkflow,
  ]);

  // Run tour step effect
  useEffect(() => {
    if (isTourActive && !isTourPaused && !isTourStopped && !isRestartingRef.current) {
      runTourStep();
    }
    return () => clearTimeout(timerRef.current);
  }, [isTourActive, isTourPaused, isTourStopped, tourIndex, runTourStep]);

  // Timeline auto highlight when tour inactive
  useEffect(() => {
    if (isTourActive || isTourPaused || isTourStopped || isRestarting) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= totalWorkflowSteps) return 1;
        return prev + 1;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isTourActive, isTourPaused, isTourStopped, isRestarting, totalWorkflowSteps]);

  // Modal close handler for hotspot modal
  const handlePartModalClose = () => {
    setSelectedPart(null);
    if (isTourStopped) return;
    if (isTourPaused) {
      setIsTourPaused(false);
      setManualScrollOverride(false);
    }
  };

  // Inactivity resets pause after 2 minutes
  useEffect(() => {
    const resetTimer = () => {
      lastInteractionRef.current = Date.now();
    };
    const checkInactivity = () => {
      if (
        isTourPaused &&
        Date.now() - lastInteractionRef.current > 2 * 60 * 1000
      ) {
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

  // Start tour automatically 6 seconds after page load
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTourActive(true);
      setTourIndex(0);
      setIsTourStopped(false);
    }, 6000);

    return () => clearTimeout(startTimeout);
  }, []);

  // Restart button handler
  const handleRestart = () => {
    clearTimeout(timerRef.current);
    clearInterval(inactivityTimerRef.current);

    isRestartingRef.current = true;

    setIsRestarting(true);
    setIsTourStopped(false);
    setIsTourActive(false);
    setIsTourPaused(false);
    setManualScrollOverride(false);
    setScrollSequenceActive(false);
    setIsScrollingWorkflow(false);
    setTourIndex(0);
    setActiveStep(1);
    setSelectedPart(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      isRestartingRef.current = false;
      setIsTourActive(true);
      setIsRestarting(false);
    }, 6000);
  };

  // Stop button handler
  const handleStop = () => {
    clearTimeout(timerRef.current);
    clearInterval(inactivityTimerRef.current);

    isRestartingRef.current = false;

    setIsTourStopped(true);
    setIsTourActive(false);
    setIsTourPaused(false);
    setManualScrollOverride(false);
    setScrollSequenceActive(false);
    setIsScrollingWorkflow(false);
    setTourIndex(0);
    setActiveStep(1);
    setSelectedPart(null);
    setIsRestarting(false);
  };

  return (
    <div className="product-features">
      <div className="tour-controls-permanent">
        <button
          className={`tour-btn stop-btn ${!isTourActive ? 'disabled' : ''}`}
          onClick={handleStop}
          disabled={!isTourActive}
          aria-label="Stop Tour"
          type="button"
        >
          ■ Stop Tour
        </button>

        <button
          className="tour-btn restart-btn"
          onClick={handleRestart}
          aria-label="Restart Tour"
          type="button"
        >
          🔄 Restart Tour
        </button>
      </div>

      <div className="container">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Histolog® Scanner Features
        </motion.h1>

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
            <h2>4-Step Quick &amp; Clean Procedure</h2>
            <p className="workflow-subtitle">
              Complete specimen analysis in under 65 seconds
            </p>
          </div>

          <div className="workflow-container">
            <div className="timeline-progress">
              <div className="progress-line">
                <motion.div
                  className="progress-fill"
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${(activeStep / workflowSteps.length) * 100}%`
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {workflowSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`timeline-dot ${activeStep >= step.id ? 'active' : ''}`}
                  style={{
                    left: `${(idx / (workflowSteps.length - 1)) * 100}%`
                  }}
                >
                  <div
                    className="dot-inner"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="workflow-steps">
              {workflowSteps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  className={`workflow-step ${
                    activeStep === step.id ? 'active' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  onMouseEnter={() => {
                    if (!isTourActive) setActiveStep(step.id);
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
                    transform:
                      isTourActive && activeStep === step.id
                        ? 'scale(1.05)'
                        : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="step-visual">
                    <div
                      className="step-icon"
                      style={{
                        backgroundColor: `${step.color}20`,
                        borderColor: step.color
                      }}
                    >
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
                    style={{
                      background: `radial-gradient(600px at center, ${step.color}15, transparent 70%)`
                    }}
                    animate={{ opacity: activeStep === step.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="workflow-summary"
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

      {selectedPart && <PartModal part={selectedPart} onClose={handlePartModalClose} />}
    </div>
  );
};

export default ProductFeatures;
