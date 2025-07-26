import React, { useState } from 'react';
import ScannerHotspot from '../components/ScannerHotspot';
import PartModal from '../components/PartModal';
import { scannerParts } from '../utils/constants';
import histologImage from '../assets/images/Histolog.jpg'; 
import '../styles/globle.css';

const ProductFeatures = () => {
  const [selectedPart, setSelectedPart] = useState(null);

  return (
    <div className="product-features">
      <div className="container">
        <h1>Histolog® Scanner Features</h1>
        <div className="scanner-display">
          <ScannerHotspot 
            imageUrl={histologImage} 
            parts={scannerParts}
            onPartSelect={setSelectedPart}
          />
        </div>
        
        <div className="workflow-section">
          <h2>4-Step Quick & Clean Procedure</h2>
          <div className="workflow-steps">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="workflow-step">
                <div className="step-number">{step}</div>
                <div className="step-content">
                  <h3>{step === 1 ? 'Excision' : 
                       step === 2 ? 'Preparation' : 
                       step === 3 ? 'Imaging' : 'Evaluation'}</h3>
                  <p>
                    {step === 1 ? 'Excise the tumor from the patient.' : 
                     step === 2 ? 'Immerse in Histolog Dip and rinse in saline solution (10 sec).' : 
                     step === 3 ? 'Map the whole specimen surface in minutes (~50s per surface).' : 
                     'Assess images on the device or remotely while preserving the specimen.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedPart && (
        <PartModal part={selectedPart} onClose={() => setSelectedPart(null)} />
      )}
    </div>
  );
};

export default ProductFeatures;