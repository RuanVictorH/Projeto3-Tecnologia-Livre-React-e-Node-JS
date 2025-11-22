// backend/src/controllers/newsController.js
const axios = require('axios');

exports.getTechNews = async (req, res) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    
    // Faz a requisição para a NewsAPI
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        // QUERY REFINADA:
        // Usamos aspas para termos exatos ("inteligência artificial")
        // Focamos em desenvolvimento e ciência
        q: '("inteligência artificial" OR "engenharia de software" OR "linguagem de programação" OR "desenvolvimento web" OR "python" OR "javascript") AND NOT "celular" AND NOT "oferta"',
        
        language: "pt",
        
        // Ordenar por RELEVÂNCIA traz artigos mais densos sobre o tema,
        // em vez do último post de blog aleatório.
        sortBy: "relevancy", 
        
        pageSize: 4,
        apiKey: API_KEY
      }
    });

    // Mapeia os dados para o formato do nosso Frontend
    const articles = response.data.articles
      .filter(article => article.title !== '[Removed]')
      .map(article => ({
        title: article.title,
        description: article.description || 'Clique para ler o artigo completo sobre tecnologia.',
        url: article.url,
        // Imagem genérica de fallback caso a notícia não tenha
        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'
      }));

    res.json(articles);

  } catch (error) {
    console.error("Erro na API de Notícias:", error.response?.data || error.message);
    
    // --- PLANO B (Mock Data Profissional) ---
    // Se a API falhar ou trouxer coisas ruins no dia da apresentação
    
    /*
    const mockNews = [
      {
        title: "O impacto da IA Generativa no mercado de desenvolvimento de software",
        description: "Como ferramentas como Copilot e GPT-4 estão mudando a rotina dos programadores júnior e sênior.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
      },
      {
        title: "Roadmap 2025: O que estudar para ser um Engenheiro de Software completo",
        description: "Guia atualizado sobre algoritmos, estruturas de dados e novas arquiteturas de microsserviços.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
      },
      {
        title: "Python ou JavaScript: Qual linguagem escolher para começar?",
        description: "Uma análise comparativa sobre curva de aprendizado, mercado de trabalho e versatilidade.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
      },
      {
        title: "A importância da Segurança da Informação em aplicações Web",
        description: "Entenda as principais vulnerabilidades (OWASP) e como proteger seus projetos acadêmicos e profissionais.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
      }
    ];
    return res.json(mockNews);
    */

    res.status(500).json({ message: "Erro ao buscar notícias" });
  }
};