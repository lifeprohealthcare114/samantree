import { motion } from 'framer-motion';
import { 
  FaDollarSign, 
  FaPlug, 
  FaUsers, 
  FaStopwatch, 
  FaCloud,
  FaFlask,
 
} from 'react-icons/fa';
import '../styles/globle.css';

const FeatureHighlights = () => {
  const features = [
    {
      icon: <FaDollarSign />,
      title: "Cost-Efficient Technique",
      description: "Real-time morphology information without expensive consumables or complex infrastructure",
      stats: "60% cost reduction vs. traditional methods",
      color: "#4CAF50",
      animation: {
        hover: { y: -5 },
        tap: { scale: 0.98 }
      }
    },
    {
      icon: <FaPlug />,
      title: "Plug-and-Play Operation",
      description: "Ready-to-use system with <15 minute setup time for immediate clinical use",
      stats: "95% users operational within 1 hour",
      color: "#2196F3",
      animation: {
        hover: { rotate: 3 },
        tap: { rotate: -3 }
      }
    },
    {
      icon: <FaUsers />,
      title: "Dedicated Implementation Support",
      description: "Onsite training and 24/7 technical support during your transition period",
      stats: "100% implementation success rate",
      color: "#FF9800",
      animation: {
        hover: { scale: 1.03 },
        tap: { scale: 0.97 }
      }
    },
    {
      icon: <FaStopwatch />,
      title: "Rapid Turnaround",
      description: "15s specimen prep (10s dye + 5s rinse) + 50s imaging (4.8cm × 3.6cm FOV)",
      stats: "≤65s total processing time",
      color: "#9C27B0",
      animation: {
        hover: { x: 5 },
        tap: { x: -5 }
      }
    },
    {
      icon: <FaCloud />,
      title: "Digital Pathology Integration",
      description: "DICOM-compatible images for EHR integration and remote consultations",
      stats: "Seamless PACS integration",
      color: "#00BCD4",
      animation: {
        hover: { y: -3, x: -3 },
        tap: { y: 3, x: 3 }
      }
    },
    {
      icon: <FaFlask />,
      title: "Non-Destructive Testing",
      description: "Preserves tissue integrity for downstream histopathology and molecular testing",
      stats: "100% specimen preservation",
      color: "#F44336",
      animation: {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
      }
    }
  ];

  return (
    <section className="feature-highlights">
      <div className="medical-pattern-overlay"></div>
      
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2>Histolog<sup>®</sup> Scanner Advantages</h2>
          <p>Transforming breast conserving surgery through innovative technology</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={feature.animation.hover}
              whileTap={feature.animation.tap}
            >
              <div 
                className="icon-container"
                style={{ 
                  backgroundColor: `${feature.color}20`,
                  borderColor: feature.color
                }}
              >
                <div 
                  className="icon-wrapper"
                  style={{ color: feature.color }}
                >
                  {feature.icon}
                </div>
              </div>
              
              <div className="content">
                <h3 style={{ color: feature.color }}>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="stats-badge">
                  <span style={{ backgroundColor: feature.color }}>
                    {feature.stats}
                  </span>
                </div>
              </div>
              
              <div 
                className="hover-glow"
                style={{ 
                  background: `radial-gradient(800px at ${index%2===0?'left':'right'} center, ${feature.color}20, transparent 70%)`
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;