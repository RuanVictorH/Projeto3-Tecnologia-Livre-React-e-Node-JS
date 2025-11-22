// frontend/src/pages/ProvasPage.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const ProvasPage = () => {
  const [provas, setProvas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    titulo: '', data_prova: '', observacoes: '', link_anexos: '', materiaId: ''
  });

  useEffect(() => {
    loadProvas();
    loadMaterias();
  }, []);

  const loadProvas = async () => {
    try {
      const response = await api.get('/provas');
      setProvas(response.data);
    } catch (error) { console.error('Erro provas'); }
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

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({ titulo: '', data_prova: '', observacoes: '', link_anexos: '', materiaId: '' });
    setShowModal(true);
  };

  const handleEdit = (prova) => {
    setEditId(prova.id);
    setFormData({
      titulo: prova.titulo,
      data_prova: prova.data_prova, // Sequelize já manda no formato YYYY-MM-DD para DateOnly
      observacoes: prova.observacoes || '',
      link_anexos: prova.link_anexos || '',
      materiaId: prova.materiaId
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/provas/${editId}`, formData);
        alert('Prova atualizada!');
      } else {
        await api.post('/provas', formData);
        alert('Prova agendada!');
      }
      setShowModal(false);
      loadProvas();
    } catch (error) {
      alert('Erro ao salvar prova.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir prova?')) {
      await api.delete(`/provas/${id}`);
      loadProvas();
    }
  };

  const formatDate = (dateString) => {
    // Cria data tratando timezone para evitar dia anterior
    const parts = dateString.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]); 
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <Navbar />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Minhas Provas</h1>
        <button className="btn btn-primary" onClick={handleOpenCreate}>Agendar Prova</button>
      </div>

      {showModal && (
        <div className="card p-4 mb-4 animate-fade-in">
           <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-primary">{editId ? 'Editar Avaliação' : 'Nova Avaliação'}</h4>
            <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Título</label>
                <input name="titulo" className="form-control" placeholder="Ex: P1" value={formData.titulo} onChange={handleChange} required />
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
              <div className="col-md-6 mb-3">
                <label className="form-label">Data da Prova</label>
                <input type="date" name="data_prova" className="form-control" value={formData.data_prova} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Link Material</label>
                <input name="link_anexos" className="form-control" value={formData.link_anexos} onChange={handleChange} placeholder="URL..." />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Observações</label>
              <textarea name="observacoes" className="form-control" rows="2" value={formData.observacoes} onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="btn btn-success w-100">{editId ? 'Atualizar' : 'Salvar'}</button>
          </form>
        </div>
      )}

      <div className="row">
        {provas.length === 0 && <p className="text-center text-white py-5 opacity-75">Nenhuma prova agendada.</p>}
        
        {provas.map(prova => (
          <div key={prova.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 border-danger">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>{formatDate(prova.data_prova)}</span>
                <span className="badge bg-danger">PROVA</span>
              </div>
              <div className="card-body">
                <h5 className="card-title text-white">{prova.titulo}</h5>
                <h6 className="card-subtitle mb-3 text-muted">
                  {prova.materia ? prova.materia.nome : '---'}
                </h6>
                <p className="card-text small text-white-50">
                  {prova.observacoes || "Sem observações."}
                </p>

                {prova.link_anexos && (
                  <a href={prova.link_anexos} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info w-100 mb-2">
                    Acessar Material
                  </a>
                )}
              </div>
              <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end gap-2">
                 <button onClick={() => handleEdit(prova)} className="btn btn-sm btn-warning">Editar</button>
                <button onClick={() => handleDelete(prova.id)} className="btn btn-sm btn-outline-danger">Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvasPage;