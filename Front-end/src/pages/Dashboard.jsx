import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Menu from '../components/Menu';
import '../styles/pages/dashboard.sass';

const Dashboard = () => {
  const { empresaNome } = useContext(AuthContext);

  return (
    <div id='dashboard'>
      <Menu/>
      <div className='main-dashboard'>
        <div className='dashboard-content'>
          <div>
          <h5>Olá novamente!</h5>
          <h2>{empresaNome}</h2>
          {/* Adicione o restante do conteúdo do dashboard aqui */}         
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
