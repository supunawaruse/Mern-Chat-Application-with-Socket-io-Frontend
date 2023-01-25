import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({component}) => {
    const { userData } =  useAuth();

    if (userData) {
        return component;
    }
    
    return (<Navigate to='/auth-login' replace />);
};

export default ProtectedRoute;