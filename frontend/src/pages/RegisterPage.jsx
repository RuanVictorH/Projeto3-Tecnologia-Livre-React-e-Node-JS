// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('As senhas não conferem.');
    }

    try {
      await api.post('/register', {
        username: formData.username,
        password: formData.password
      });
      alert('Conta criada com sucesso! Faça login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta.');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-dark text-white text-center py-3">
            <h3 className="mb-0">Crie sua Conta</h3>
          </div>
          <div className="card-body p-4">
            <h5 className="card-title text-center mb-4">Agenda de Estudos JS</h5>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Usuário</label>
                <input 
                  type="text" 
                  name="username" 
                  className="form-control" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Senha</label>
                <input 
                  type="password" 
                  name="password" 
                  className="form-control" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Confirmar Senha</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  className="form-control" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-success w-100 btn-lg">Cadastrar</button>
            </form>
            
            <p className="text-center mt-3 mb-0">
              Já tem conta? <Link to="/login" className="text-decoration-none">Faça login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;