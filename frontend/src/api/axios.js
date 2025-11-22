// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Interceptor de Requisição (Envia o Token)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// NOVO: Interceptor de Resposta (Trata Erros 401)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se o erro for 401 (Não autorizado / Token inválido)
        if (error.response && error.response.status === 401) {
            console.warn('Sessão expirada ou token inválido. Redirecionando para login...');
            
            // Limpa o lixo do local storage
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            
            // Força o redirecionamento para a tela de login
            // Usamos window.location aqui porque o hook useNavigate não funciona fora de componentes React
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;