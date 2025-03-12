import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [empresaId, setEmpresaId] = useState(localStorage.getItem('empresaId'));
  const [empresaNome, setEmpresaNome] = useState(localStorage.getItem('empresaNome'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('empresaId');
    const nome = localStorage.getItem('empresaNome');

    if (token) setAuthToken(token);
    if (id) setEmpresaId(id);
    if (nome) setEmpresaNome(nome);
  }, []);

  const login = (token, empresaId, empresaNome) => {
    localStorage.setItem('token', token);
    localStorage.setItem('empresaId', empresaId);
    localStorage.setItem('empresaNome', empresaNome);

    setAuthToken(token);
    setEmpresaId(empresaId);
    setEmpresaNome(empresaNome);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('empresaId');
    localStorage.removeItem('empresaNome');

    setAuthToken(null);
    setEmpresaId(null);
    setEmpresaNome(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, empresaId, empresaNome, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
