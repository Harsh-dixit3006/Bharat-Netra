import { useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from './AppContext.js';

axios.defaults.withCredentials = true;

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_API_URL || 'http://localhost:4000'
    : '';
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    axios
      .get(`${backendUrl}/api/auth/me`)
      .then(({ data }) => {
        if (active) setUser(data.user);
      })
      .catch((error) => {
        if (error.response?.status !== 401) {
          console.error('Unable to restore the authentication session:', error.message);
        }
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, [backendUrl]);

  const login = async (credentials) => {
    const { data } = await axios.post(`${backendUrl}/api/auth/login`, credentials);
    setUser(data.user);
    return data.user;
  };

  const register = async (details) => {
    const { data } = await axios.post(`${backendUrl}/api/auth/register`, details);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await axios.post(`${backendUrl}/api/auth/logout`);
    setUser(null);
  };

  const invalidateSession = () => setUser(null);

  const contextValue = {
    backendUrl,
    user,
    authLoading,
    login,
    register,
    logout,
    invalidateSession,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
