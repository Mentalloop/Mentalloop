import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Desenvolvimento = () => {
  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataDeInicio, setDataDeInicio] = useState('');
  const [dataDeTermino, setDataDeTermino] = useState('');
  const [statusTask, setStatusTask] = useState('Não iniciado'); // Estado para status_task
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/tasks?populate=*');
      console.log('Dados recebidos da API:', response.data.data);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      console.log('Dados enviados para adicionar tarefa:', { data: task });
      await axios.post('http://localhost:1337/api/tasks', { data: task });
      fetchTasks();
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
      const { documentId, ...taskData } = task; // Removendo o documentId do corpo da solicitação
      const apiPath = `http://localhost:1337/api/tasks/${documentId}`;
      console.log('documentId da tarefa:', documentId);
      console.log('Caminho da API:', apiPath);
      console.log('Dados enviados para atualizar tarefa:', { data: taskData });
      const response = await axios.put(apiPath, { data: taskData });
      console.log('Resposta da API ao atualizar tarefa:', response.data);
      fetchTasks();
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
      const apiPath = `http://localhost:1337/api/tasks/${documentId}`;
      console.log('documentId da tarefa a ser excluída:', documentId);
      console.log('Caminho da API para exclusão:', apiPath);
      await axios.delete(apiPath);
      fetchTasks();
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
    <div>
      <h1>Desenvolvimento</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
        <input type="date" value={dataDeInicio} onChange={(e) => setDataDeInicio(e.target.value)} />
        <input type="date" value={dataDeTermino} onChange={(e) => setDataDeTermino(e.target.value)} />
        <select value={statusTask} onChange={(e) => setStatusTask(e.target.value)}>
          <option value="Não iniciado">Não iniciado</option>
          <option value="Em progresso">Em progresso</option>
          <option value="Concluído">Concluído</option>
        </select>
        <button type="submit">{editTask ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}</button>
      </form>
      <h2>Tarefas Criadas</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h4>{task.titulo}</h4>
            <p>{task.descricao}</p>
            <p>Início: {task.data_de_inicio}</p>
            <p>Término: {task.data_de_termino}</p>
            <p>Status: {task.status_task}</p>
            <button onClick={() => handleEdit(task)}>Editar</button>
            <button onClick={() => deleteTask(task.documentId)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Desenvolvimento;
