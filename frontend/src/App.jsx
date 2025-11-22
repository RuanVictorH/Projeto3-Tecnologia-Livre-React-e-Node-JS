import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';

// Importação das Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MateriasPage from './pages/MateriasPage';
import TasksPage from './pages/TasksPage';
import ProvasPage from './pages/ProvasPage';
import FocusModePage from './pages/FocusModePage';

// Componente para proteger rotas (só acessa se estiver logado)
const PrivateRoute = ({ children }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) return <div className="text-white text-center mt-5">Carregando sistema...</div>;

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  
  useEffect(() => {
    const hour = new Date().getHours();
    // Se for entre 6h e 18h, ativa o modo claro
    if (hour >= 6 && hour < 18) {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
  }, []);
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="container mt-4">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            
            {/* Rotas Protegidas */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/materias" 
              element={
                <PrivateRoute>
                  <MateriasPage />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/tarefas" 
              element={
                <PrivateRoute>
                  <TasksPage />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/provas" 
              element={
                <PrivateRoute>
                  <ProvasPage />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/tarefas/:id/foco"
              element={
                <PrivateRoute>
                  <FocusModePage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;