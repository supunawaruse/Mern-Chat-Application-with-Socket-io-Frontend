import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LoadingContainer from '../containers/LoadingContainer/LoadingContainer';
import axios from '../services/ApiService';
import { getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken, setAccessToken } from '../services/TokenService';
import { useSocket } from './SocketContext';
import {io} from 'socket.io-client'

const AuthContext = createContext({
    userData: null,
    setUserData:() => {},
    handleUser: () => {},
    logout: () => {}
});
  
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {setSocket} = useSocket()
  
    useEffect(() => {
      window.addEventListener('userChange', handleUser);
      document.getElementById('loader') && (document.getElementById('loader').style.display = 'none');
      initApp();
    }, []);
  
    const initApp = async () => {
      const token = getRefreshToken();
      if (token) {
        try {
          const res = await axios.post('/users/refresh-token', {
            refreshToken: token
          });
          const { accessToken } = res.data.data;
          setAccessToken(accessToken);
        } catch (err) {
          removeRefreshToken();
          toast.error('Login expired. Please login as usual.');
        }
      }
      setIsLoading(false);
    };
  
    const handleUser = () => {
      const token = getAccessToken();
      if (token) {
        const user = jwtDecode(token);
        setUserData(user);
        setSocket(io("http://localhost:5000"))
      } else {
        setUserData(null);
      }
    };
  
    const logout = () => {
      setUserData(null);
      setSocket(null)
      removeAccessToken();
      removeRefreshToken();
    };
  
    if (isLoading) {
      return <LoadingContainer />;
    }
  
    return (
      <AuthContext.Provider value={{
        userData,
        setUserData,
        handleUser,
        logout
      }}>
        {!isLoading && children}
      </AuthContext.Provider>
    );
  };
  
  export const AuthConsumer = AuthContext.Consumer;
  
  export default AuthProvider;