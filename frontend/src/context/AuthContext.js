// 17. src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [expiration, setExpiration] = useState(localStorage.getItem('expiration'));

  useEffect(() => {
    const checkExpiration = async () => {
      const now = Date.now();
      if (expiration && now > parseInt(expiration, 10)) {
        try {
          const refreshRes = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
          const newToken = refreshRes.data.token;
          const newExpiresIn = refreshRes.data.expiresIn;
          const newExpirationTime = now + newExpiresIn;
          localStorage.setItem('token', newToken);
          localStorage.setItem('expiration', newExpirationTime);
          setToken(newToken);
          setExpiration(newExpirationTime);
        } catch (err) {
          logout();
        }
      }
    };
    checkExpiration();
  }, [expiration]);

  const login = (token, userData, expiresInMs = 3600000) => {
    const expirationTime = Date.now() + expiresInMs;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('expiration', expirationTime);
    setToken(token);
    setUser(userData);
    setExpiration(expirationTime);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiration');
    setToken(null);
    setUser(null);
    setExpiration(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);