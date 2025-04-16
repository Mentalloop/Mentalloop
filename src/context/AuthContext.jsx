import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [empresaId, setEmpresaId] = useState(localStorage.getItem('empresaId'));
  const [empresaNome, setEmpresaNome] = useState(localStorage.getItem('empresaNome'));
  const [colaboradorId, setColaboradorId] = useState(localStorage.getItem('colaboradorId'));
  const [colaboradorNome, setColaboradorNome] = useState(localStorage.getItem('colaboradorNome'));
  const [colaboradorTasks, setColaboradorTasks] = useState(JSON.parse(localStorage.getItem('colaboradorTasks')) || []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('empresaId');
    const empresaNome = localStorage.getItem('empresaNome');
    const colaboradorId = localStorage.getItem('colaboradorId');
    const colaboradorNome = localStorage.getItem('colaboradorNome');
    const tasks = JSON.parse(localStorage.getItem('colaboradorTasks'));

    if (token) setAuthToken(token);
    if (id) setEmpresaId(id);
    if (empresaNome) setEmpresaNome(empresaNome);
    if (colaboradorId) setColaboradorId(colaboradorId);
    if (colaboradorNome) setColaboradorNome(colaboradorNome);
    if (tasks) setColaboradorTasks(tasks);
  }, []);

  const login = (token, empresaId, empresaNome, colaboradorId = '', colaboradorNome = '', colaboradorTasks = []) => {
    localStorage.setItem('token', token);
    localStorage.setItem('empresaId', empresaId);
    localStorage.setItem('empresaNome', empresaNome);
    if (colaboradorId) {
      localStorage.setItem('colaboradorId', colaboradorId);
    }
    if (colaboradorNome) {
      localStorage.setItem('colaboradorNome', colaboradorNome);
    }
    if (colaboradorTasks.length > 0) {
      localStorage.setItem('colaboradorTasks', JSON.stringify(colaboradorTasks));
    }

    setAuthToken(token);
    setEmpresaId(empresaId);
    setEmpresaNome(empresaNome);
    setColaboradorId(colaboradorId);
    setColaboradorNome(colaboradorNome);
    setColaboradorTasks(colaboradorTasks);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('empresaId');
    localStorage.removeItem('empresaNome');
    localStorage.removeItem('colaboradorId');
    localStorage.removeItem('colaboradorNome');
    localStorage.removeItem('colaboradorTasks');

    setAuthToken(null);
    setEmpresaId(null);
    setEmpresaNome(null);
    setColaboradorId(null);
    setColaboradorNome(null);
    setColaboradorTasks([]);
  };

  return (
    <AuthContext.Provider value={{ authToken, empresaId, empresaNome, colaboradorId, colaboradorNome, colaboradorTasks, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
