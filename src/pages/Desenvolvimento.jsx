import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Menu from '../components/Menu';
import Button from '../components/Button';
import { LuPen, LuTrash, LuCalendarArrowUp, LuCalendarArrowDown } from 'react-icons/lu';
import { AuthContext } from '../context/AuthContext'; // Importando o contexto de autenticação
import '../styles/pages/desenvolvimento.sass';

const Desenvolvimento = () => {
  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataDeInicio, setDataDeInicio] = useState('');
  const [dataDeTermino, setDataDeTermino] = useState('');
  const [statusTask, setStatusTask] = useState('Não iniciado'); // Estado para status_task
  const [editTask, setEditTask] = useState(null);
  const { colaboradorId } = useContext(AuthContext); // Obtendo o ID do colaborador do contexto

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await axios.get('http://localhost:1337/api/colaboradores?populate=*', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Dados recebidos da API:', response.data);
        const colaboradores = response.data.colaboradores || response.data.data;
        const colaborador = colaboradores.find(c => c.id == colaboradorId); // Usar == para comparar número e string
        console.log('Colaborador logado:', colaborador);
        const tasksArray = Array.isArray(colaborador.tasks) ? colaborador.tasks : [colaborador.tasks];
        setTasks(tasksArray); // Garante que tasks será uma array
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };

    if (colaboradorId) {
      fetchTasks();
    }
  }, [colaboradorId]);

  const addTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      console.log('Dados enviados para adicionar tarefa:', { data: { ...task, colaborador: colaboradorId } });
      await axios.post('http://localhost:1337/api/tasks', { data: { ...task, colaborador: colaboradorId } }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Atualiza a lista de tarefas após adicionar uma nova tarefa
      const response = await axios.get('http://localhost:1337/api/colaboradores?populate=*', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const colaboradores = response.data.colaboradores || response.data.data;
      const colaborador = colaboradores.find(c => c.id == colaboradorId); // Usar == para comparar número e string
      const tasksArray = Array.isArray(colaborador.tasks) ? colaborador.tasks : [colaborador.tasks];
      setTasks(tasksArray); // Garante que tasks será uma array
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      if (error.response) {
        console.log('Detalhes do erro:', error.response.data);
      } else {
        console.log('Erro desconhecido:', error);
      }
    }
  };

  const updateTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      const { documentId, ...taskData } = task; // Removendo o documentId do corpo da solicitação
      const apiPath = `http://localhost:1337/api/tasks/${documentId}`;
      console.log('documentId da tarefa:', documentId);
      console.log('Caminho da API:', apiPath);
      console.log('Dados enviados para atualizar tarefa:', { data: taskData });
      const response = await axios.put(apiPath, { data: taskData }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Resposta da API ao atualizar tarefa:', response.data);
      // Atualiza a lista de tarefas após atualizar a tarefa
      const updatedResponse = await axios.get('http://localhost:1337/api/colaboradores?populate=*', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const colaboradores = updatedResponse.data.colaboradores || updatedResponse.data.data;
      const colaborador = colaboradores.find(c => c.id == colaboradorId); // Usar == para comparar número e string
      const tasksArray = Array.isArray(colaborador.tasks) ? colaborador.tasks : [colaborador.tasks];
      setTasks(tasksArray); // Garante que tasks será uma array
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      if (error.response) {
        console.log('Detalhes do erro:', error.response.data);
      } else {
        console.log('Erro desconhecido:', error);
      }
    }
  };

  const deleteTask = async (documentId) => {
    try {
      const token = localStorage.getItem("token");
      const apiPath = `http://localhost:1337/api/tasks/${documentId}`;
      console.log('documentId da tarefa a ser excluída:', documentId);
      console.log('Caminho da API para exclusão:', apiPath);
      await axios.delete(apiPath, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Atualiza a lista de tarefas após excluir a tarefa
      const response = await axios.get('http://localhost:1337/api/colaboradores?populate=*', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const colaboradores = response.data.colaboradores || response.data.data;
      const colaborador = colaboradores.find(c => c.id == colaboradorId); // Usar == para comparar número e string
      const tasksArray = Array.isArray(colaborador.tasks) ? colaborador.tasks : [colaborador.tasks];
      setTasks(tasksArray); // Garante que tasks será uma array
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      if (error.response) {
        console.log('Detalhes do erro:', error.response.data);
      } else {
        console.log('Erro desconhecido:', error);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = {
      titulo,
      descricao,
      data_de_inicio: dataDeInicio,
      data_de_termino: dataDeTermino,
      status_task: statusTask.trim() // Remove qualquer espaço em branco
    };
    if (editTask) {
      await updateTask({ ...task, documentId: editTask.documentId });
      setEditTask(null);
    } else {
      await addTask(task);
    }
    setTitulo('');
    setDescricao('');
    setDataDeInicio('');
    setDataDeTermino('');
    setStatusTask('Não iniciado');
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setTitulo(task.titulo);
    setDescricao(task.descricao);
    setDataDeInicio(task.data_de_inicio);
    setDataDeTermino(task.data_de_termino);
    setStatusTask(task.status_task);
  };

  return (
    <div id='dashboard'>
      <Menu />
      <div className='main-dashboard'>
        <div className='dashboard-content'>
          <h3>Desenvolvimento</h3>
          <form className='forms-desenvolvimento' onSubmit={handleSubmit}>
            <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)}></input>
            <div className="input-container">
              <input type="date" value={dataDeInicio} onChange={(e) => setDataDeInicio(e.target.value)} className="date-input" />
              
            </div>
            <div className="input-container">
              <input type="date" value={dataDeTermino} onChange={(e) => setDataDeTermino(e.target.value)} className="date-input" />
              
            </div>
            <select value={statusTask} onChange={(e) => setStatusTask(e.target.value)}>
              <option value="Não iniciado">Não iniciado</option>
              <option value="Em progresso">Em progresso</option>
              <option value="Concluído">Concluído</option>
            </select>
            <Button variant="outline" type="submit">{editTask ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}</Button>
          </form>
          <h3>Tarefas Criadas</h3>
          {Array.isArray(tasks) && tasks.length > 0 ? (
            <ul className='task-container'>
              {tasks.map((task) => (
                <li className='task-list' key={task.id}>
                  <div className='info-task'>
                    <h4>{task.titulo}</h4>
                    <p>{task.descricao}</p>
                    <div className='date-group'>
                      <p><LuCalendarArrowUp /> Início: {task.data_de_inicio}</p>
                      <p><LuCalendarArrowDown /> Término: {task.data_de_termino}</p>
                    </div>
                    <p>Status: {task.status_task}</p>
                  </div>
                  <div>
                    <Button variant="text" onClick={() => handleEdit(task)}><LuPen /></Button>
                    <Button variant="text" onClick={() => deleteTask(task.documentId)}><LuTrash /></Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma tarefa encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Desenvolvimento;