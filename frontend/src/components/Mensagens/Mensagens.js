import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { pt } from 'date-fns/locale';
import api from '../../services/api';
import './Mensagens.css';

// Configurar o Axios para incluir o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Mensagens = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesListRef = useRef(null);
  const [conversationPage, setConversationPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [conversationPagination, setConversationPagination] = useState(null);
  const [messagePagination, setMessagePagination] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [conversationPage]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.ID_Anuncio);
    }
  }, [selectedConversation, messagePage]);

  const loadConversations = async () => {
    try {
      const response = await api.get('/conversas', {
        params: {
          page: conversationPage,
          per_page: 15
        }
      });
      if (conversationPage === 1) {
        setConversations(response.data.data);
      } else {
        setConversations(prev => [...prev, ...response.data.data]);
      }
      setConversationPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total
      });
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  const loadMessages = async (anuncioId) => {
    try {
      setLoadingMore(true);
      const response = await api.get(`/mensagens/${anuncioId}`, {
        params: {
          page: messagePage,
          per_page: 50
        }
      });
      
      const newMessages = response.data.messages;
      if (messagePage === 1) {
        setMessages(newMessages);
      } else {
        setMessages(prev => [...prev, ...newMessages]);
      }
      
      setMessagePagination(response.data.pagination);
      if (messagePage === 1) {
        scrollToBottom();
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop === 0 && !loadingMore && messagePagination?.current_page < messagePagination?.last_page) {
      setMessagePage(prev => prev + 1);
    }
  };

  const loadMoreConversations = () => {
    if (conversationPagination?.current_page < conversationPagination?.last_page) {
      setConversationPage(prev => prev + 1);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await api.post(`/mensagens/${selectedConversation.ID_Anuncio}/responder`, {
        conteudo: newMessage
      });

      if (response.data) {
        console.log('Mensagem enviada:', response.data);
        setNewMessage('');
        loadMessages(selectedConversation.ID_Anuncio);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      if (error.response) {
        // O servidor respondeu com um status de erro
        console.error('Erro do servidor:', error.response.data);
        if (error.response.status === 401) {
          // Não autorizado - problema com autenticação
          console.error('Erro de autenticação. Por favor, faça login novamente.');
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Sem resposta do servidor');
      } else {
        // Erro na configuração da requisição
        console.error('Erro ao configurar requisição:', error.message);
      }
    }
  };

  const scrollToBottom = () => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  };

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: pt });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mensagens-wrapper">
      <div className="mensagens-container">
        <div className="conversas-lista">
          <h2>Conversas</h2>
          {conversations.length === 0 ? (
            <div className="empty-state">
              <p>Não tem mensagens ainda</p>
            </div>
          ) : (
            <>
              <div className="conversas">
                {conversations.map(conversa => (
                  <div
                    key={conversa.ID_Anuncio}
                    className={`conversa-item ${conversa.unread_count > 0 ? 'has-unread' : ''}`}
                    onClick={() => {
                      setSelectedConversation(conversa);
                      setMessagePage(1);
                    }}
                  >
                    <div className="anuncio-info">
                      <h3>{conversa.Titulo}</h3>
                      <p className="last-message">
                        {formatDate(conversa.last_message_date)}
                      </p>
                    </div>
                    {conversa.unread_count > 0 && (
                      <div className="meta-info">
                        <span className="unread-badge">
                          {conversa.unread_count}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {conversationPagination?.current_page < conversationPagination?.last_page && (
                <button 
                  className="load-more-btn"
                  onClick={loadMoreConversations}
                >
                  Carregar mais conversas
                </button>
              )}
            </>
          )}
        </div>

        {selectedConversation ? (
          <div className="mensagens-detalhe">
            <div className="anuncio-header">
              <a href={`/anuncios/${selectedConversation.ID_Anuncio}`} className="anuncio-link">
                <h3>{selectedConversation.Titulo}</h3>
              </a>
              <span className="owner-name">{selectedConversation.OwnerName}</span>
            </div>

            <div 
              className="mensagens-lista" 
              ref={messagesListRef}
              onScroll={handleScroll}
            >
              {loadingMore && (
                <div className="loading-messages">
                  Carregando mensagens anteriores...
                </div>
              )}
              {messages.map(message => (
                <div
                  key={message.ID_Mensagem}
                  className={`mensagem ${message.isMine ? 'mine' : ''}`}
                >
                  <div className="mensagem-content">
                    {!message.isMine && (
                      <div className="sender-info">
                        {message.SenderImage && (
                          <img
                            src={`/api/files/id/${message.SenderImage}`}
                            className="sender-avatar"
                            alt={message.SenderName}
                          />
                        )}
                        <span className="sender-name">{message.SenderName}</span>
                      </div>
                    )}
                    <div className="message-bubble">
                      {message.Conteudo}
                    </div>
                    <span className="message-time">
                      {formatTime(message.Data_mensagem)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mensagem-input">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button onClick={sendMessage} disabled={!newMessage.trim()}>
                Enviar
              </button>
            </div>
          </div>
        ) : (
          <div className="no-conversation-selected">
            Selecione uma conversa para ver as mensagens
          </div>
        )}
      </div>
    </div>
  );
};

export default Mensagens; 