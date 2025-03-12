import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from '../components/Menu';
import Button from '../components/Button'; // Importe o componente Button
import '../styles/pages/dashboard.sass';


const Desenvolvimento = () => {
  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataDeInicio, setDataDeInicio] = useState('');
  const [dataDeTermino, setDataDeTermino] = useState('');
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/tasks?populate=*');
        setTasks(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      await axios.post('http://localhost:1337/api/tasks', { data: task });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const updateTask = async (task) => {
    try {
      await axios.put(`http://localhost:1337/api/tasks/${task.id}`, { data: task });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:1337/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = { titulo, descricao, data_de_inicio: dataDeInicio, data_de_termino: dataDeTermino };
    if (editTask) {
      await updateTask({ ...task, id: editTask.id });
      setEditTask(null);
    } else {
      await addTask({ ...task, status_task: 'Não Iniciado' });
    }
    setTitulo('');
    setDescricao('');
    setDataDeInicio('');
    setDataDeTermino('');
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setTitulo(task.attributes.titulo);
    setDescricao(task.attributes.descricao);
    setDataDeInicio(task.attributes.data_de_inicio);
    setDataDeTermino(task.attributes.data_de_termino);
  };

  return (
    <div id="dashboard">
      <Menu />
      <div className="main-dashboard">
        <div className="dashboard-content">
          <h3>Página de Desenvolvimento</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
            <input type="date" value={dataDeInicio} onChange={(e) => setDataDeInicio(e.target.value)} />
            <input type="date" value={dataDeTermino} onChange={(e) => setDataDeTermino(e.target.value)} />
            <Button variant="fill" type="submit">{editTask ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}</Button>
          </form>
          <ul className="tasks-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <h4>{task.attributes.titulo}</h4>
                <p>{task.attributes.descricao}</p>
                <p>Status: {task.attributes.status_task}</p>
                <p>Início: {task.attributes.data_de_inicio}</p>
                <p>Término: {task.attributes.data_de_termino}</p>
                <div className="task-actions">
                  <Button variant="text" onClick={() => handleEdit(task)}>Editar</Button>
                  <Button variant="text" onClick={() => deleteTask(task.id)}>Excluir</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Desenvolvimento;
