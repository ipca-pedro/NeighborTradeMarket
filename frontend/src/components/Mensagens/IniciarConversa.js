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
    <div className="iniciar-conversa">
      {erro && (
        <div className="erro-mensagem">
          {erro}
        </div>
      )}
      <div className="mensagem-input">
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={enviando}
        />
        <button
          onClick={handleEnviarMensagem}
          disabled={!mensagem.trim() || enviando}
        >
          {enviando ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

export default IniciarConversa; 