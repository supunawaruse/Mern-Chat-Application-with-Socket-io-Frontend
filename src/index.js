import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './contexts/AuthContext';
import GlobalProvider from './contexts/GlobalContext';
import SocketProvider from './contexts/SocketContext';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketProvider>
    <AuthProvider>
      <BrowserRouter>
        <GlobalProvider>
          <App />
          <ToastContainer />
        </GlobalProvider>
      </BrowserRouter>
    </AuthProvider>
  </SocketProvider>
);

reportWebVitals();
