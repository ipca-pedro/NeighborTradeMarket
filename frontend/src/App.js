import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Contextos
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

// Componentes de Autenticação
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import RegistrationSuccess from './components/auth/RegistrationSuccess';

// Componentes de Perfil
import PerfilUtilizador from './components/perfil/PerfilUsuario';

// Componentes de Admin
import AdminDashboard from './components/admin/AdminDashboard';
import PendingUsers from './components/admin/PendingUsers';
import ProdutosPendentes from './components/admin/ProdutosPendentes';
import AllUsers from './components/admin/AllUsers';
import AllAnuncios from './components/admin/AllAnuncios';

// Componentes de Produtos
import ListaProdutos from './components/produtos/ListaProdutos';
import DetalhesProduto from './components/produtos/DetalhesProduto';
import CriarProduto from './components/produtos/CriarProduto';
import MeusAnuncios from './components/perfil/MeusAnuncios';
import HomePage from './components/home/HomePage';
import Footer from './components/layout/Footer';
import HomeButton from './components/layout/HomeButton';

// Componentes de Informação
import About from './components/about/About';
import FAQ from './components/faq/FAQ';
import Privacy from './components/legal/Privacy';
import Terms from './components/legal/Terms';
import Security from './components/legal/Security';

// Componentes de Reclamações
import MinhasReclamacoes from './components/perfil/MinhasReclamacoes';
import GestaoReclamacoes from './components/admin/GestaoReclamacoes';
import DetalhesReclamacao from './components/reclamacao/DetalhesReclamacao';
import AdminReclamacaoDetail from './components/admin/AdminReclamacaoDetail';

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
  
  // Verificar se há um usuário no localStorage
  const userStr = localStorage.getItem('user');
  const localUser = userStr ? JSON.parse(userStr) : null;
  
  if (loading) {
    return <div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"></div></div>;
  }
  
  // Verificar se o usuário é administrador (usando currentUser ou localUser)
  const isAdmin = (currentUser && currentUser.TipoUserID_TipoUser === 1) || 
                 (localUser && localUser.TipoUserID_TipoUser === 1);
  
  if (!isAdmin) {
    console.log('Utilizador não é administrador, redirecionando para home');
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="App d-flex flex-column min-vh-100">
            <HomeButton />
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registar" element={<Register />} />
              <Route path="/registration-success" element={<RegistrationSuccess />} />
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
              <Route path="/meus-anuncios" element={<ProtectedRoute><MeusAnuncios /></ProtectedRoute>} />
              <Route path="/minhas-reclamacoes" element={<ProtectedRoute><MinhasReclamacoes /></ProtectedRoute>} />
              <Route path="/reclamacoes/:id" element={<ProtectedRoute><DetalhesReclamacao /></ProtectedRoute>} />
              
              {/* Rotas de Admin */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/produtos-pendentes" element={<AdminRoute><ProdutosPendentes /></AdminRoute>} />
              <Route path="/admin/users-pendentes" element={<AdminRoute><PendingUsers /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AllUsers /></AdminRoute>} />
              <Route path="/admin/anuncios" element={<AdminRoute><AllAnuncios /></AdminRoute>} />
              <Route path="/admin/reclamacoes" element={<AdminRoute><GestaoReclamacoes /></AdminRoute>} />
              <Route path="/admin/reclamacoes/:id" element={<AdminRoute><AdminReclamacaoDetail /></AdminRoute>} />
              
              {/* Rota para URLs não encontrados */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
