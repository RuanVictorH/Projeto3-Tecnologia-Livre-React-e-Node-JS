// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ao carregar a página, verifica se tem token salvo
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser({ username });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      
      const { token, username: userUser } = response.data;

      // Salva no navegador
      localStorage.setItem('token', token);
      localStorage.setItem('username', userUser);

      // Configura o axios para as próximas requisições
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      setUser({ username: userUser });
      navigate('/'); // Manda para o Dashboard
    } catch (error) {
      console.error('Erro no login', error);
      throw error; // Lança o erro para a página de Login tratar (exibir msg)
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    api.defaults.headers.Authorization = undefined;
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;