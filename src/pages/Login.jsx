import React, { useState, useContext, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (response === 'Login realizado com sucesso!') {
      setEmail('');
      setSenha('');
    }
  }, [response]);

  const handleLogin = async () => {
    setResponse('');

    if (!email || !senha) {
      setResponse('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    const endpoint = userType === 'empresa'
      ? 'http://localhost:1337/api/empresa/login'
      : 'http://localhost:1337/api/colaborador/login?populate=tasks'; // Corrigido endpoint do colaborador para retornar tarefas

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
        const empresaId = userType === 'empresa' ? data.empresa.id : data.colaborador.empresa.id;
        const empresaNome = userType === 'empresa' ? data.empresa.nome : data.colaborador.empresa.nome;
        const colaboradorId = userType === 'colaborador' ? data.colaborador.id : '';
        const colaboradorNome = userType === 'colaborador' ? data.colaborador.nome : '';
        const colaboradorTasks = userType === 'colaborador' ? data.colaborador.tasks : [];

        // Armazenar no contexto e localStorage
        login(token, empresaId, empresaNome, colaboradorId, colaboradorNome, colaboradorTasks);

        // Redirecionar para outra página
        navigate('/dashboard');
      } else {
        setResponse(`Erro: ${data.error?.message || 'Falha ao fazer login'}`);
      }
    } catch (error) {
      setResponse(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
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
          <Button variant="fill" onClick={handleLogin} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>   
      </div>
    </div>
  );
};

export default Login;
