import { Link } from 'react-router-dom';
import '../styles/globle.css';

const Hero = () => {
  return (
    <section className="hero">
      {/* Video Background */}
      <div className="video-container">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="background-video"
        >
          <source src="/assets/videos/histolog.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="container">
          <h1 className="product-name">Histolog<sup>®</sup> Scanner</h1>
          <p className="product-tagline">Cancer cells at your fingertips</p>
          <div className="product-line"></div>
          <p className="product-description">
            The breakthrough medical imaging modality for intraoperative margin assessment
          </p>
          <Link to="/features" className="cta-button">
            Explore Features
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
