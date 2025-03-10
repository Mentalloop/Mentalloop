import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute'; // Importe o componente de rota protegida
import Conteudos from './pages/Conteudos'; // Importe o componente Conteudos
import ConteudoCompleto from './pages/ConteudoCompleto'; // Importe o componente ConteudoCompleto
import Organograma from './pages/Organograma'; // Importe o componente Organograma

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conteudos"
            element={
              <ProtectedRoute>
                <Conteudos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conteudo/:id"
            element={
              <ProtectedRoute>
                <ConteudoCompleto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organograma"
            element={
              <ProtectedRoute>
                <Organograma />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
