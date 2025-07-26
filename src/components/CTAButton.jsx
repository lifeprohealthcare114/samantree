import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/globle.css';

const CTAButton = ({ text, link, primary, secondary }) => {
  const buttonClass = primary ? 'primary' : secondary ? 'secondary' : '';
  
  return (
    <Link to={link} className={`cta-button ${buttonClass}`}>
      {text}
    </Link>
  );
};

export default CTAButton;