import { useState, useEffect } from 'react';
import api from '../api/axios';

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await api.get('/weather');
        setWeather(response.data);
      } catch (error) {
        console.error("Erro clima");
      }
    };
    fetchWeather();
  }, []);

  if (!weather) return (
    <div className="card h-100 d-flex align-items-center justify-content-center text-muted p-3" 
         style={{background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.05)'}}>
        <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
        <small>Carregando clima...</small>
    </div>
  );

  return (
    <div className="card h-100 border-0 text-white position-relative overflow-hidden" 
         style={{
             background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
             backdropFilter: 'blur(10px)',
             boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
         }}>
      
      <div className="card-body d-flex flex-column justify-content-between">
        
        <div className="d-flex justify-content-between align-items-start">
            <div>
                <h6 className="text-info text-uppercase mb-1" style={{letterSpacing: '1px', fontSize: '0.7rem', fontWeight: 'bold'}}>
                    Clima Hoje
                </h6>
                <span className="fw-bold d-flex align-items-center gap-1">
                    <span style={{fontSize: '0.9rem'}}>📍</span> {weather.city}
                </span>
            </div>
            
            {/* Ícone com Animação (Depende das classes no index.css) */}
            <div className="text-end">
                <span className={`display-4 ${weather.icon === '☀️' ? 'weather-icon-sun' : 'weather-icon-animate'}`} 
                      style={{filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'}}>
                    {weather.icon}
                </span>
            </div>
        </div>

        <div className="mt-2">
            <div className="d-flex align-items-center">
                <h1 className="display-3 fw-bold mb-0 me-3" style={{textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'}}>
                    {weather.temp}°
                </h1>
                <div className="d-flex flex-column text-white-50 small border-start ps-3 border-secondary border-opacity-50">
                    <span>Min: <span className="text-white">{weather.min}°</span></span>
                    <span>Max: <span className="text-white">{weather.max}°</span></span>
                </div>
            </div>
            <p className="text-info mb-0 fw-bold mt-1">{weather.condition}</p>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-3">
            <div className="d-flex align-items-center gap-2" title="Probabilidade de Chuva">
                <span style={{fontSize: '1.2rem'}}>☔</span>
                <div className="d-flex flex-column" style={{lineHeight: '1'}}>
                    <span className="fw-bold">{weather.rainChance}%</span>
                    <small style={{fontSize: '0.6rem'}} className="text-muted text-uppercase">Chuva</small>
                </div>
            </div>
            <div className="d-flex align-items-center gap-2" title="Umidade Relativa">
                <span style={{fontSize: '1.2rem'}}>💧</span>
                <div className="d-flex flex-column" style={{lineHeight: '1'}}>
                    <span className="fw-bold">{weather.humidity}%</span>
                    <small style={{fontSize: '0.6rem'}} className="text-muted text-uppercase">Umidade</small>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;