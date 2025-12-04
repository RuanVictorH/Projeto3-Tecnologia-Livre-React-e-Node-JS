import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import NewsCarousel from '../components/NewsCarousel';
import WeatherCard from '../components/WeatherCard';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando...</span></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  const stats = data?.stats || { totalTasks: 0, completedTasks: 0, progress: 0, totalProvas: 0, futureProvas: 0, totalMaterias: 0 };
  const lists = data?.lists || { urgentTasks: [], nextExams: [], nextTasks: [] };
  const schedule = data?.schedule || { aulasHoje: [], proximaAula: null };
  
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const hojeNome = diasSemana[new Date().getDay()];

  const formatDate = (dateString) => {
    if (!dateString) return '--/--';
    try { return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' }); } catch (e) { return 'Inválida'; }
  };

  const getAulaStatus = (inicio, fim) => {
    try {
      const agora = new Date();
      const horaAtual = agora.getHours().toString().padStart(2,'0') + ':' + agora.getMinutes().toString().padStart(2,'0');
      if (horaAtual > fim) return <span className="badge bg-success">Concluída</span>;
      if (horaAtual >= inicio) return <span className="badge bg-warning text-dark">Em Andamento</span>;
      return <span className="badge bg-secondary">Futura</span>;
    } catch (e) { return null; }
  };

  return (
    <div>
      <Navbar />

      <div className="mb-5 animate-fade-in">
        
        <div className="row">
            {/* ==============================================================
                COLUNA PRINCIPAL (Esquerda - 8/12)
               ============================================================== */}
            <div className="col-lg-8">
                
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h1 className="display-6 fw-bold text-white mb-0">Painel de Controle</h1>
                        <p className="text-muted mb-0">Olá, <span className="text-primary fw-bold">{localStorage.getItem('username')}</span>. Aqui está seu resumo acadêmico.</p>
                    </div>
                </div>

                {/* 1. CARDS DE ESTATÍSTICAS */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3 col-6">
                        <div className="card h-100 border-primary p-3 text-center">
                            <h3 className="fw-bold text-white mb-0">{stats.totalTasks}</h3>
                            <small className="text-uppercase text-muted" style={{fontSize: '0.7rem'}}>Tarefas</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="card h-100 border-success p-3 text-center">
                            <h3 className="fw-bold text-success mb-0">{stats.completedTasks}</h3>
                            <small className="text-uppercase text-muted" style={{fontSize: '0.7rem'}}>Concluídas</small>
                            <div className="progress mt-2" style={{height: '4px', background: '#334155'}}>
                                <div className="progress-bar bg-success" style={{width: `${stats.progress}%`}}></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="card h-100 border-danger p-3 text-center">
                            <h3 className="fw-bold text-danger mb-0">{stats.totalProvas}</h3>
                            <small className="text-uppercase text-muted" style={{fontSize: '0.7rem'}}>Provas</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="card h-100 p-3 text-center">
                            <h3 className="fw-bold text-white mb-0">{stats.totalMaterias}</h3>
                            <small className="text-uppercase text-muted" style={{fontSize: '0.7rem'}}>Matérias</small>
                        </div>
                    </div>
                </div>

                {/* 2. QUADRO DE HORÁRIOS */}
                <div className="card border-info mb-4 shadow">
                    <div className="card-header d-flex justify-content-between align-items-center py-3">
                        <span className="text-info fw-bold">📅 Horários de Hoje ({hojeNome})</span>
                        {schedule.proximaAula && (
                            <span className="badge bg-warning text-dark animate-pulse">
                                Próxima: {schedule.proximaAula.materia ? schedule.proximaAula.materia.nome : 'Aula'} às {schedule.proximaAula.hora_inicio}
                            </span>
                        )}
                    </div>
                    <div className="card-body p-0">
                        {(!schedule.aulasHoje || schedule.aulasHoje.length === 0) ? (
                            <div className="p-4 text-center text-muted">Sem aulas hoje. Bom descanso!</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle mb-0">
                                    <thead className="bg-dark">
                                        <tr>
                                            <th className="ps-4">Horário</th>
                                            <th>Matéria</th>
                                            <th>Local</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedule.aulasHoje.map(aula => (
                                            <tr key={aula.id}>
                                                <td className="fw-bold text-white ps-4">{aula.hora_inicio}</td>
                                                <td>
                                                    {aula.materia ? aula.materia.nome : '---'} 
                                                    {aula.materia && <small className="text-muted ms-2">({aula.materia.nomenclatura})</small>}
                                                </td>
                                                <td>{aula.sala || '-'}</td>
                                                <td>{getAulaStatus(aula.hora_inicio, aula.hora_fim)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. LISTAS DE TAREFAS E PROVAS */}
                <div className="row g-4">
                    {/* Coluna 1: Tarefas Urgentes */}
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-header text-danger">🚨 Urgências</div>
                            <ul className="list-group list-group-flush">
                                {lists.urgentTasks.length === 0 && <li className="list-group-item text-muted text-center small py-3">Nenhuma urgência.</li>}
                                {lists.urgentTasks.map(task => (
                                    <li key={task.id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-white small">{task.titulo}</span>
                                            <span className="badge bg-danger rounded-pill">{formatDate(task.data_fim)}</span>
                                        </div>
                                        <small className="text-muted">{task.materia ? task.materia.nome : '---'}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Coluna 2: Próximas Provas */}
                    <div className="col-md-4">
                        <div className="card h-100" style={{borderColor: '#eab308'}}>
                            <div className="card-header text-warning">🎓 Próximas Provas</div>
                            <ul className="list-group list-group-flush">
                                {lists.nextExams.length === 0 && <li className="list-group-item text-muted text-center small py-3">Sem provas marcadas.</li>}
                                {lists.nextExams.map(prova => (
                                    <li key={prova.id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-white small">{prova.titulo}</span>
                                            <span className="badge bg-warning text-dark rounded-pill">{formatDate(prova.data_prova)}</span>
                                        </div>
                                        <small className="text-muted">{prova.materia ? prova.materia.nome : '---'}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Coluna 3: Próximas Entregas (NOVO CARD INSERIDO AQUI) */}
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-header text-info">📅 Próximas Entregas</div>
                            <ul className="list-group list-group-flush">
                                {lists.nextTasks.length === 0 && <li className="list-group-item text-muted text-center small py-3">Tudo em dia!</li>}
                                {lists.nextTasks.map(task => (
                                    <li key={task.id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-white small">{task.titulo}</span>
                                            <span className="badge bg-info text-dark rounded-pill">{formatDate(task.data_fim)}</span>
                                        </div>
                                        {/* Exibindo Nome da Matéria Corretamente */}
                                        <small className="text-muted">{task.materia ? task.materia.nome : '---'}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

            </div>

            {/* ==============================================================
                COLUNA LATERAL (Direita - 4/12)
               ============================================================== */}
            <div className="col-lg-4 mt-4 mt-lg-0">
                <h6 className="text-uppercase text-muted fw-bold mb-3 small">Informações Gerais</h6>
                <div className="d-flex flex-column gap-4 sticky-top" style={{top: '20px', zIndex: 1}}>
                    <div style={{minHeight: '180px'}}>
                        <WeatherCard />
                    </div>
                    <div style={{height: '250px'}}> 
                        <NewsCarousel />
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;