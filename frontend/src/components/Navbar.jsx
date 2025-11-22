// frontend/src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Para saber qual aba está ativa

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    // Navbar fixed-top ou sticky-top para efeito de vidro ao rolar
    <nav className="navbar navbar-expand-lg sticky-top mb-5">
      <div className="container">
        <Link className="navbar-brand" to="/">AGENDA<span style={{color:'white'}}></span></Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" style={{filter: 'invert(1)'}}></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/materias')}`} to="/materias">Matérias</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/tarefas')}`} to="/tarefas">Tarefas</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/provas')}`} to="/provas">Provas</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-lg-block">
              <div className="small text-muted" style={{fontSize: '0.7rem'}}>LOGADO COMO</div>
              <div className="fw-bold text-white">{user?.username}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
              SAIR
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;