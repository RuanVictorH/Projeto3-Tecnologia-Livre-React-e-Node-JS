// src/pages/LoginPage.jsx
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-dark text-white text-center py-3">
            <h3 className="mb-0">Acesso Restrito</h3>
          </div>
          <div className="card-body p-4">
            <h5 className="card-title text-center mb-4">Agenda de Estudos JS</h5>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3 row align-items-center">
                <label className="col-sm-3 col-form-label text-end fw-bold">Usuário</label>
                <div className="col-sm-9">
                  <input 
                    type="text" 
                    name="username" 
                    className="form-control" 
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label className="col-sm-3 col-form-label text-end fw-bold">Senha</label>
                <div className="col-sm-9">
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control" 
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="d-grid mt-4">
                <button className="btn btn-primary btn-lg" type="submit">Entrar</button>
              </div>
            </form>

            <hr className="my-4" />
            <p className="text-center mb-0">
              Não tem conta? <Link to="/cadastro" className="text-decoration-none">Cadastre-se aqui</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;