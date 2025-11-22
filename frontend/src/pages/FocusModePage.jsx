// frontend/src/pages/FocusModePage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const FocusModePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Configuração do Tempo (20 minutos)
  const FOCUS_TIME = 20 * 60; 
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  
  // Referência para o som de alarme (URL pública de exemplo)
  const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'));

  // 1. Carregar a Tarefa
  useEffect(() => {
    const loadTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
      } catch (error) {
        alert('Erro ao carregar tarefa.');
        navigate('/tarefas');
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id, navigate]);

  // 2. Lógica do Cronômetro
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Acabou o tempo!
      setIsActive(false);
      clearInterval(interval);
      playAlarm();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const playAlarm = () => {
    audioRef.current.play().catch(e => console.log("Erro ao tocar som:", e));
    alert("⏰ Tempo Esgotado! Bom trabalho!");
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(FOCUS_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="text-white text-center mt-5">Carregando...</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div className="container flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div className="card p-5 shadow-lg text-center border-0" style={{ maxWidth: '600px', width: '100%', background: 'rgba(30, 41, 59, 0.8)' }}>
          
          <h5 className="text-uppercase text-info mb-2">MODO FOCO</h5>
          <h2 className="display-6 fw-bold text-white mb-4">{task.titulo}</h2>
          
          {/* Relógio Gigante */}
          <div className="display-1 fw-bold mb-5" style={{ 
              fontFamily: 'monospace', 
              color: isActive ? '#a855f7' : '#94a3b8',
              textShadow: isActive ? '0 0 20px rgba(168, 85, 247, 0.5)' : 'none'
            }}>
            {formatTime(timeLeft)}
          </div>

          {/* Controles */}
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <button 
              onClick={toggleTimer} 
              className={`btn btn-lg px-5 ${isActive ? 'btn-warning' : 'btn-success'}`}
            >
              {isActive ? '⏸ Pausar' : '▶ Iniciar'}
            </button>
            
            <button onClick={resetTimer} className="btn btn-outline-light btn-lg px-4">
              ↺ Reiniciar
            </button>
          </div>

          <div className="mt-5 pt-3 border-top border-secondary">
            <button onClick={() => navigate('/tarefas')} className="btn btn-link text-muted text-decoration-none">
              ← Voltar para lista de tarefas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusModePage;