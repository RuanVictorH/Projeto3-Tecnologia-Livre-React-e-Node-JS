// frontend/src/pages/MateriasPage.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

// Mapeamento para exibição
const DIAS_SEMANA = [
  { id: 1, label: 'Segunda' },
  { id: 2, label: 'Terça' },
  { id: 3, label: 'Quarta' },
  { id: 4, label: 'Quinta' },
  { id: 5, label: 'Sexta' },
  { id: 6, label: 'Sábado' },
  { id: 0, label: 'Domingo' },
];

const MateriasPage = () => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({ 
    nome: '', 
    nomenclatura: '', 
    notas_materia: '', 
    link_plano_ensino: '',
    horarios: [] 
  });

  useEffect(() => {
    loadMaterias();
  }, []);

  const loadMaterias = async () => {
    try {
      const response = await api.get('/materias');
      setMaterias(response.data);
    } catch (error) {
      console.error('Erro ao carregar matérias');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Lógica de Horários ---
  const addHorario = () => {
    setFormData({
      ...formData,
      horarios: [...formData.horarios, { dia_semana: 1, hora_inicio: '', hora_fim: '', sala: '' }]
    });
  };

  const removeHorario = (index) => {
    const newHorarios = formData.horarios.filter((_, i) => i !== index);
    setFormData({ ...formData, horarios: newHorarios });
  };

  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...formData.horarios];
    newHorarios[index][field] = value;
    setFormData({ ...formData, horarios: newHorarios });
  };

  // Helper para nome do dia
  const getDiaLabel = (id) => {
    const dia = DIAS_SEMANA.find(d => d.id === parseInt(id));
    return dia ? dia.label : '---';
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({ nome: '', nomenclatura: '', notas_materia: '', link_plano_ensino: '', horarios: [] });
    setShowModal(true);
  };

  const handleEdit = (materia) => {
    setEditId(materia.id);
    setFormData({
      nome: materia.nome,
      nomenclatura: materia.nomenclatura || '',
      notas_materia: materia.notas_materia || '',
      link_plano_ensino: materia.link_plano_ensino || '',
      horarios: materia.horarios || [] 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/materias/${editId}`, formData);
        alert('Matéria atualizada!');
      } else {
        await api.post('/materias', formData);
        alert('Matéria criada!');
      }
      setShowModal(false);
      loadMaterias();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar matéria.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      try {
        await api.delete(`/materias/${id}`);
        loadMaterias();
      } catch (error) {
        alert('Erro ao deletar.');
      }
    }
  };

  // Estilo inline para garantir legibilidade nos inputs dinâmicos
  const inputStyle = {
    backgroundColor: '#0f172a', // Fundo escuro
    color: '#fff',              // Texto branco
    borderColor: '#475569'
  };

  return (
    <div>
      <Navbar />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Minhas Matérias</h1>
        <button className="btn btn-primary btn-lg" onClick={handleOpenCreate}>
          Nova Matéria
        </button>
      </div>

      {/* Formulário (Modal) */}
      {showModal && (
        <div className="card p-4 mb-4 animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-primary mb-0">{editId ? 'Editar Matéria' : 'Nova Matéria'}</h4>
            <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nome</label>
                <input name="nome" className="form-control" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Sigla</label>
                <input name="nomenclatura" className="form-control" value={formData.nomenclatura} onChange={handleChange} />
              </div>
            </div>

            {/* --- Quadro de Horários --- */}
            <h5 className="text-info mt-4 mb-3 border-bottom border-secondary pb-2">Quadro de Horários</h5>
            
            {formData.horarios.map((horario, index) => (
              <div key={index} className="row g-2 align-items-center mb-2 p-2 rounded" style={{background: 'rgba(255,255,255,0.05)'}}>
                <div className="col-md-3">
                  <label className="small text-muted d-block d-md-none">Dia</label>
                  <select 
                    className="form-select form-select-sm" 
                    value={horario.dia_semana}
                    onChange={(e) => handleHorarioChange(index, 'dia_semana', e.target.value)}
                    style={inputStyle} // APLICANDO ESTILO DE CORREÇÃO
                  >
                    {DIAS_SEMANA.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="small text-muted d-block d-md-none">Início</label>
                  <input 
                    type="time" 
                    className="form-control form-control-sm" 
                    value={horario.hora_inicio}
                    onChange={(e) => handleHorarioChange(index, 'hora_inicio', e.target.value)}
                    style={inputStyle} // APLICANDO ESTILO DE CORREÇÃO
                    required
                  />
                </div>
                <div className="col-md-3">
                   <label className="small text-muted d-block d-md-none">Fim</label>
                   <input 
                    type="time" 
                    className="form-control form-control-sm" 
                    value={horario.hora_fim}
                    onChange={(e) => handleHorarioChange(index, 'hora_fim', e.target.value)}
                    style={inputStyle} // APLICANDO ESTILO DE CORREÇÃO
                    required
                  />
                </div>
                 <div className="col-md-2">
                   <label className="small text-muted d-block d-md-none">Sala</label>
                   <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Sala/Local"
                    value={horario.sala}
                    onChange={(e) => handleHorarioChange(index, 'sala', e.target.value)}
                    style={inputStyle} // APLICANDO ESTILO DE CORREÇÃO
                  />
                </div>
                <div className="col-md-1 text-end">
                  <label className="d-block d-md-none">&nbsp;</label>
                  <button type="button" onClick={() => removeHorario(index)} className="btn btn-sm btn-outline-danger">✕</button>
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addHorario} className="btn btn-sm btn-outline-info mb-3">
              + Adicionar Horário
            </button>

            <div className="mb-3 mt-2">
              <label className="form-label">Link Plano de Ensino</label>
              <input name="link_plano_ensino" className="form-control" value={formData.link_plano_ensino} onChange={handleChange} placeholder="http://..." />
            </div>
            <div className="mb-3">
              <label className="form-label">Anotações</label>
              <textarea name="notas_materia" className="form-control" rows="3" value={formData.notas_materia} onChange={handleChange}></textarea>
            </div>
            
            <button type="submit" className="btn btn-success w-100">
              {editId ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </form>
        </div>
      )}

      {/* Lista de Matérias */}
      {loading ? <p>Carregando...</p> : (
        <div className="list-group">
          {materias.length === 0 && <p className="text-muted text-center mt-4">Nenhuma matéria cadastrada.</p>}
          
          {materias.map((materia) => (
            <div key={materia.id} className="list-group-item list-group-item-action p-3 mb-3 shadow-sm border rounded">
              <div className="row align-items-center">
                
                {/* Coluna 1: Informações Básicas */}
                <div className="col-md-5">
                  <h5 className="mb-1 text-primary">{materia.nome}</h5>
                  <small className="text-muted">{materia.nomenclatura}</small>
                  
                  {materia.notas_materia && (
                    <div className="mt-2 p-2 bg-dark bg-opacity-50 rounded border border-secondary text-light small">
                      <strong>Nota:</strong> {materia.notas_materia}
                    </div>
                  )}

                  {/* --- NOVO: EXIBIÇÃO DOS HORÁRIOS NA LISTA --- */}
                  {materia.horarios && materia.horarios.length > 0 && (
                    <div className="mt-3">
                      <small className="text-info fw-bold text-uppercase" style={{fontSize: '0.7rem'}}>Horários:</small>
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {materia.horarios.map(h => (
                          <span key={h.id} className="badge bg-dark border border-secondary text-light font-monospace">
                             {getDiaLabel(h.dia_semana).substring(0,3)} {h.hora_inicio}-{h.hora_fim}
                             {h.sala && <span className="text-muted ms-1">({h.sala})</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* -------------------------------------------- */}

                </div>

                {/* Coluna 2: Barra de Progresso */}
                <div className="col-md-4 my-3 my-md-0">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progresso</span>
                    <span>{materia.progresso}%</span>
                  </div>
                  <div className="progress" style={{height: '8px', backgroundColor: '#334155'}}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{width: `${materia.progresso}%`}}
                    ></div>
                  </div>
                  <small className="text-muted d-block mt-1">
                    {materia.completedTasks} de {materia.totalTasks} tarefas concluídas
                  </small>
                </div>

                {/* Coluna 3: Ações */}
                <div className="col-md-3 text-end">
                  {materia.link_plano_ensino && (
                      <a href={materia.link_plano_ensino} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info me-2 mb-1">
                        Plano
                      </a>
                  )}
                  <button onClick={() => handleEdit(materia)} className="btn btn-warning btn-sm me-2 mb-1">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(materia.id)} className="btn btn-outline-danger btn-sm mb-1">
                    Excluir
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MateriasPage;