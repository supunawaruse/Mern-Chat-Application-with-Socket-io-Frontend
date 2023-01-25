import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NonProtectedRoute = ({ component }) => {
    const { userData } =  useAuth();
  
    if (!userData) {
      return component;
    }
  
    return (<Navigate to={'/'} />);
  };
  
export default NonProtectedRoute;
