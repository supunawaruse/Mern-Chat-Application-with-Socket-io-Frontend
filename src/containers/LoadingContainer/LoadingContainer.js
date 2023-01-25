import React from 'react';
import logo from '../../assets/images/auth-img.png';
import './LoadingContainer.css';

const LoadingContainer = () => (
  <div className="loading-container d-flex vh-100 vw-100 align-items-center justify-content-center">
    <img src={logo} alt="WeChat" className='logo' />
  </div>
);

export default LoadingContainer;