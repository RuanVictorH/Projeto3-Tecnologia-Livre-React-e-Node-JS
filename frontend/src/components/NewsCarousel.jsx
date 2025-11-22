import { useState, useEffect } from 'react';
import api from '../api/axios';

const NewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Buscar notícias do Backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news');
        setNews(response.data);
      } catch (error) {
        console.error("Falha ao carregar notícias");
      }
    };
    fetchNews();
  }, []);

  // 2. Rotação Automática (Timer)
  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, [news]);

  console.log("Notícias carregadas:", news);
  if (news.length === 0) return null;

  const currentArticle = news[currentIndex];

  return (
    <div className="card h-100 overflow-hidden border-0 shadow-lg position-relative news-card-hover">
      {/* Imagem de Fundo com Overlay */}
      <div 
        style={{
          backgroundImage: `url(${currentArticle.urlToImage || 'https://via.placeholder.com/400x200'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          transition: 'background-image 1s ease-in-out'
        }}
      />
      
      {/* Gradiente para legibilidade do texto */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, #0f172a 10%, rgba(15, 23, 42, 0.4) 100%)',
          zIndex: 1
        }}
      />

      {/* Conteúdo */}
      <div className="card-body d-flex flex-column justify-content-end position-relative" style={{zIndex: 2}}>
        <div className="badge bg-info text-dark mb-2 align-self-start animate-pulse">
          TECH NEWS
        </div>
        
        <h5 className="card-title text-white fw-bold text-shadow">
          {currentArticle.title}
        </h5>
        
        <p className="card-text text-white-50 small d-none d-lg-block">
          {currentArticle.description ? currentArticle.description.substring(0, 100) + '...' : ''}
        </p>

        <div className="d-flex justify-content-between align-items-end mt-2">
          {/* Indicadores (Bolinhas) */}
          <div className="d-flex gap-1">
            {news.map((_, idx) => (
              <div 
                key={idx} 
                style={{
                  width: idx === currentIndex ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: idx === currentIndex ? '#06b6d4' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
          
          <a 
            href={currentArticle.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-sm btn-outline-light rounded-pill"
          >
            Ler mais ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCarousel;