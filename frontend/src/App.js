import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Contexto de Autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Componentes de Autenticação
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Componentes de Perfil
import PerfilUtilizador from './components/perfil/PerfilUsuario';

// Componentes de Admin
import PendingUsers from './components/admin/PendingUsers';
import ProdutosPendentes from './components/admin/ProdutosPendentes';

// Componentes de Produtos
import ListaProdutos from './components/produtos/ListaProdutos';
import DetalhesProduto from './components/produtos/DetalhesProduto';
import CriarProduto from './components/produtos/CriarProduto';
import HomePage from './components/home/HomePage';

// Componentes de Informação
import About from './components/about/About';
import FAQ from './components/faq/FAQ';
import Privacy from './components/legal/Privacy';
import Terms from './components/legal/Terms';
import Security from './components/legal/Security';

// Componente para rotas protegidas que requerem autenticação
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"></div></div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Componente para rotas de admin que requerem permissões de administrador
const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"></div></div>;
  }
  
  if (!currentUser || currentUser.TipoUserID_TipoUser !== 2) { // Assumindo que 2 é o ID para admin
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registar" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Rotas de Informação */}
          <Route path="/sobre-nos" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="/seguranca" element={<Security />} />
          
          {/* Rotas de Produtos */}
          <Route path="/anuncios" element={<ListaProdutos />} />
          <Route path="/anuncios/categoria/:categoriaId" element={<ListaProdutos />} />
          <Route path="/anuncios/:id" element={<DetalhesProduto />} />
          
          {/* Rotas Protegidas (requerem login) */}
          <Route path="/perfil" element={<ProtectedRoute><PerfilUtilizador /></ProtectedRoute>} />
          <Route path="/anuncios/novo" element={<ProtectedRoute><CriarProduto /></ProtectedRoute>} />
          
          {/* Rotas de Admin */}
          <Route path="/admin/utilizadores-pendentes" element={<AdminRoute><PendingUsers /></AdminRoute>} />
          <Route path="/admin/produtos-pendentes" element={<AdminRoute><ProdutosPendentes /></AdminRoute>} />
          
          {/* Rota para URLs não encontrados */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
