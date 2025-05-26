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
    <div className="mensagens-wrapper">
      <div className="mensagens-container">
        <div className="mensagens-detalhe">
          <div className="anuncio-header">
            <h3>Nova Conversa</h3>
          </div>
          
          <div className="mensagens-lista">
            {erro && (
              <div className="message error">
                <div className="message-content">
                  <div className="message-bubble error">
                    {erro}
                  </div>
                </div>
              </div>
            )}
          </div>

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
      </div>
    </div>
  );
};

export default IniciarConversa; 