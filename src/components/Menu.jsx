import {FaHome, FaBook, FaCog, FaSignOutAlt, FaNetworkWired, FaBrain} from  'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Logo from '../img/Logo.svg';
import '../styles/global/menu.sass';

function Menu () {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Adicione useNavigate

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirecionar para a tela de login após logout
  };

  return (
    <div className="menu-container">
      <img src={Logo} alt="Logo" />
      <div className="menu-list">
        <p>Menu</p>
        <hr />
        <ul className='menu-group'>
          <NavLink to="/Dashboard" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>
            <div className='content-menu'>
              <FaHome />
              <p>Home</p>
            </div>
          </NavLink>
          <NavLink to="/conteudos" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>
            <div className='content-menu'>
              <FaBook />
              <p>Conteúdos</p>
            </div>
          </NavLink>
          <NavLink to="/desenvolvimento" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>
            <div className='content-menu'>
              <FaBrain />
              <p>Desenvolvimento</p> 
            </div>
          </NavLink>
          <NavLink to="/organograma" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>
            <div className='content-menu'>
              <FaNetworkWired />
              <p>Orgonograma</p>
            </div>
          </NavLink>
        </ul>
      </div>
      <div className='menu-list'>
        <p>Ferramentas</p>
        <hr />
        <ul>
          <NavLink to="/configuracoes" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>
            <div className='content-menu'>
              <FaCog />
              <p>Configurações</p>
            </div>
          </NavLink>
          
        <div className="menu-link content-menu" onClick={handleLogout}> {/* Use handleLogout para deslogar */}
          <FaSignOutAlt />
          <p>Logout</p>
        </div>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
