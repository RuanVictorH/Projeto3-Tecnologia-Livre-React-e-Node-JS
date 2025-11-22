// frontend/src/pages/TasksPage.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const TasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '', descricao: '', data_fim: '',
    status: 'A', prioridade: 'M', link_anexo: '', materiaId: ''
  });

  useEffect(() => {
    loadTasks();
    loadMaterias();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) { console.error('Erro tasks'); }
  };

  const loadMaterias = async () => {
    try {
      const response = await api.get('/materias');
      setMaterias(response.data);
    } catch (error) { console.error('Erro materias'); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatForInput = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toISOString().slice(0, 16);
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({ titulo: '', descricao: '', data_fim: '', status: 'A', prioridade: 'M', link_anexo: '', materiaId: '' });
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setFormData({
      titulo: task.titulo,
      descricao: task.descricao || '',
      data_fim: formatForInput(task.data_fim),
      status: task.status,
      prioridade: task.prioridade,
      link_anexo: task.link_anexo || '',
      materiaId: task.materiaId
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, formData);
        alert('Tarefa atualizada!');
      } else {
        await api.post('/tasks', formData);
        alert('Tarefa criada!');
      }
      setShowModal(false);
      loadTasks();
    } catch (error) {
      alert('Erro ao salvar tarefa.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir tarefa?')) {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'C' ? 'A' : 'C';
      await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
      
      // EFEITO DE CONFETE SE FOR CONCLUÍDA
      if (newStatus === 'C') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#06b6d4', '#ffffff'] // Cores do seu tema
        });
      }

      loadTasks();
    } catch (error) { alert('Erro status'); }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  const getPriorityColor = (p) => p === 'A' ? 'danger' : p === 'M' ? 'warning' : 'info';
  const getStatusColor = (s) => s === 'C' ? 'success' : s === 'E' ? 'primary' : 'secondary';

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Minhas Tarefas</h1>
        <button className="btn btn-primary" onClick={handleOpenCreate}>Nova Tarefa</button>
      </div>

      {showModal && (
        <div className="card p-4 mb-4 animate-fade-in">
           <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-primary">{editId ? 'Editar Tarefa' : 'Nova Tarefa'}</h4>
            <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Título</label>
                <input name="titulo" className="form-control" value={formData.titulo} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Matéria</label>
                <select name="materiaId" className="form-select" value={formData.materiaId} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {materias.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                </select>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">Prazo Final</label>
                <input type="datetime-local" name="data_fim" className="form-control" value={formData.data_fim} onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Prioridade</label>
                <select name="prioridade" className="form-select" value={formData.prioridade} onChange={handleChange}>
                  <option value="B">Baixa</option>
                  <option value="M">Média</option>
                  <option value="A">Alta</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                  <option value="A">A Fazer</option>
                  <option value="E">Em Andamento</option>
                  <option value="C">Concluída</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Link Anexo</label>
                <input name="link_anexo" className="form-control" value={formData.link_anexo} onChange={handleChange} placeholder="http://..." />
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100">{editId ? 'Atualizar' : 'Salvar'}</button>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-dark table-hover rounded overflow-hidden align-middle">
          <thead>
            <tr>
              <th style={{width: '50px'}}>Check</th>
              <th>Título</th>
              <th>Matéria</th>
              <th>Prazo</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className={task.status === 'C' ? 'opacity-50' : ''}>
                
                {/* Botão Check */}
                <td>
                  <button 
                    className={`btn btn-sm ${task.status === 'C' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => handleToggleStatus(task)}
                    title={task.status === 'C' ? 'Reabrir tarefa' : 'Concluir tarefa'}
                  >
                    {task.status === 'C' ? '✔' : '⬜'}
                  </button>
                </td>

                {/* Título e Link */}
                <td>
                    <span className={task.status === 'C' ? 'text-decoration-line-through text-muted' : 'fw-bold'}>
                        {task.titulo}
                    </span>
                    {task.link_anexo && (
                        <a href={task.link_anexo} target="_blank" className="d-block small text-info text-decoration-none">Ver Anexo 🔗</a>
                    )}
                </td>
                
                <td>{task.materia ? task.materia.nome : '---'}</td>
                <td>{formatDate(task.data_fim)}</td>
                <td><span className={`badge bg-${getPriorityColor(task.prioridade)}`}>{task.prioridade}</span></td>
                <td><span className={`badge bg-${getStatusColor(task.status)}`}>{task.status}</span></td>
                
                {/* AÇÕES: Foco, Editar, Excluir (Ícones) */}
                <td className="text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    {task.status !== 'C' && (
                        <button 
                            onClick={() => navigate(`/tarefas/${task.id}/foco`)} 
                            className="btn btn-sm btn-outline-info" 
                            title="Modo Foco"
                        >
                            ⏱
                        </button>
                    )}
                    <button onClick={() => handleEdit(task)} className="btn btn-sm btn-outline-warning" title="Editar">
                        ✎
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-outline-danger" title="Excluir">
                        ✕
                    </button>
                  </div>
                </td>

              </tr>
            ))}
            {tasks.length === 0 && <tr><td colSpan="7" className="text-center text-white py-4">Nenhuma tarefa encontrada.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksPage;