import React, { useState } from 'react';
import api from '../../services/api';
import './Mensagens.css';

const IniciarConversa = ({ anuncioId, onConversaIniciada }) => {
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleEnviarMensagem = async () => {
    if (!mensagem.trim()) return;
    
    setEnviando(true);
    setErro(null);

    try {
      const response = await api.post(`/mensagens/${anuncioId}/iniciar`, {
        conteudo: mensagem
      });

      console.log('Conversa iniciada:', response.data);
      setMensagem('');
      if (onConversaIniciada) {
        onConversaIniciada(response.data);
      }
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
      if (error.response?.data?.error) {
        setErro(error.response.data.error);
      } else {
        setErro('Erro ao enviar mensagem. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32, minWidth: 350, maxWidth: 500, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#1976d2' }}>Conversar com o Vendedor</h2>
        {erro && (
          <div className="erro-mensagem" style={{ marginBottom: 16, color: 'red', textAlign: 'center' }}>
            {erro}
          </div>
        )}
        <div className="mensagem-input" style={{ flexDirection: 'column', gap: 16 }}>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={enviando}
            style={{ minHeight: 80, fontSize: 16, marginBottom: 16 }}
          />
          <button
            onClick={handleEnviarMensagem}
            disabled={!mensagem.trim() || enviando}
            style={{ width: '100%', padding: '12px 0', fontSize: 16 }}
          >
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IniciarConversa; 