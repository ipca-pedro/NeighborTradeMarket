import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Não exibe o botão na página principal
  if (location.pathname === '/') return null;

  return (
    <button
      onClick={() => navigate('/')}
      style={{
        position: 'fixed',
        top: 20,
        left: 24,
        zIndex: 9999,
        background: '#fff',
        border: '1px solid #e3e3e3',
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
        padding: '10px 14px',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      title="Voltar à página principal"
    >
      <i className="fas fa-home" style={{ fontSize: 22, color: '#007bff' }}></i>
    </button>
  );
};

export default HomeButton;
