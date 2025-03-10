import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/pages/login.sass'; // Importar o arquivo SASS
import Button from '../components/Button';
import Logo from '../img/Logo.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [userType, setUserType] = useState('empresa'); // Estado para tipo de usuário
  const [response, setResponse] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setResponse('');

    if (!email || !senha) {
      setResponse('Por favor, preencha todos os campos.');
      return;
    }

    const endpoint = userType === 'empresa'
      ? 'http://localhost:1337/api/empresa/login'
      : 'http://localhost:1337/api/colaborador/login'; // Corrigido endpoint do colaborador

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse('Login realizado com sucesso!');

        const token = data.token;
        const empresaId = userType === 'empresa' ? data.empresa.id : data.colaborador.empresaId;
        const empresaNome = userType === 'empresa' ? data.empresa.nome : data.colaborador.empresaNome;

        // Armazenar no contexto e localStorage
        login(token, empresaId, empresaNome);

        // Redirecionar para outra página
        navigate('/dashboard');
      } else {
        setResponse(`Erro: ${data.error?.message || 'Falha ao fazer login'}`);
      }
    } catch (error) {
      setResponse(`Erro: ${error.message}`);
    }
  };

  return (
    <div className='login-container'>
      <div className="login-content">
        <img src={Logo} alt="Logo" />
        <h4>Entre na sua conta</h4>
        <div className="tabs">
          <button
            className={userType === 'empresa' ? 'active' : ''}
            onClick={() => setUserType('empresa')}
          >
            Empresa
          </button>
          <button
            className={userType === 'colaborador' ? 'active' : ''}
            onClick={() => setUserType('colaborador')}
          >
            Colaborador
          </button>
        </div>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <p>{response}</p>
        <div className='button-container'>
          <Button variant="fill" onClick={handleLogin}>Entrar</Button>
        </div>   
      </div>
    </div>
  );
};

export default Login;
