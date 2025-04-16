import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import api from '../../services/api';
import './ChatBot.css'; // Reutiliza estilos do ChatBot

const UserToUserChat = ({ show, onClose, anuncioId, vendedorId, vendedorNome }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [minimized, setMinimized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [conversaExistente, setConversaExistente] = useState(false);
    const chatRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Verificar se já existe uma conversa
    useEffect(() => {
        if (show) {
            verificarConversaExistente();
        }
    }, [show, anuncioId]);

    const verificarConversaExistente = async () => {
        try {
            setLoading(true);
            const response = await api.get('/conversas');
            const conversaEncontrada = response.data.data.some(
                conversa => conversa.ID_Anuncio === parseInt(anuncioId)
            );
            setConversaExistente(conversaEncontrada);
            if (conversaEncontrada) {
                loadMessages();
            }
        } catch (error) {
            console.error('Erro ao verificar conversa:', error);
        } finally {
            setLoading(false);
        }
    };

    // Carregar mensagens existentes
    const loadMessages = async () => {
        try {
            const response = await api.get(`/mensagens/${anuncioId}`);
            setMessages(response.data.messages);
            scrollToBottom();
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        }
    };

    useEffect(() => {
        if (show && !minimized) {
            scrollToBottom();
        }
    }, [messages, show, minimized]);

    // Minimizar ao clicar fora do chat
    useEffect(() => {
        if (!show || minimized) return;
        function handleClickOutside(event) {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setMinimized(true);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [show, minimized]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        try {
            const endpoint = conversaExistente 
                ? `/mensagens/${anuncioId}/responder`
                : `/mensagens/${anuncioId}/iniciar`;

            const response = await api.post(endpoint, {
                conteudo: inputText
            });

            if (!conversaExistente) {
                setConversaExistente(true);
            }

            setInputText('');
            await loadMessages();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (!show) return null;

    // Minimizado: mostrar botão flutuante
    if (minimized) {
        return (
            <div 
                className="chat-widget"
                style={{ zIndex: 1060, bottom: 100, right: 20, position: 'fixed' }}
            >
                <Button 
                    variant="primary" 
                    style={{ borderRadius: 20, padding: '10px 24px', boxShadow: '0 2px 6px rgba(0,0,0,0.14)' }}
                    onClick={() => setMinimized(false)}
                >
                    <i className="fas fa-comments me-2"></i> Chat Vendedor
                </Button>
            </div>
        );
    }

    // Chat expandido
    return (
        <div className="chat-widget" style={{ zIndex: 1060, bottom: 100, right: 20, position: 'fixed' }}>
            <div className="chat-container" ref={chatRef}>
                <div className="chat-header bg-primary text-white d-flex justify-content-between align-items-center p-3">
                    <div>
                        <i className="fas fa-user me-2"></i>
                        Conversa com {vendedorNome || 'Vendedor'}
                    </div>
                    <Button variant="link" className="text-white p-0" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </Button>
                </div>
                <div className="chat-body">
                    <div className="messages-container" style={{ height: 330, overflowY: 'auto' }}>
                        {loading ? (
                            <div className="text-center p-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Carregando...</span>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center p-3 text-muted">
                                <i className="fas fa-comments fa-2x mb-2"></i>
                                <p>Nenhuma mensagem ainda. Comece a conversa!</p>
                            </div>
                        ) : (
                            messages.map((message, idx) => (
                                <div key={idx} className={`message ${message.isMine ? 'user' : ''}`}> 
                                    <div className="message-content">
                                        {!message.isMine && message.SenderName && (
                                            <small className="text-muted d-block mb-1">{message.SenderName}</small>
                                        )}
                                        {message.Conteudo}
                                        <small className="text-muted d-block mt-1">
                                            {new Date(message.Data_mensagem).toLocaleTimeString()}
                                        </small>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <Form className="chat-input-form mt-2" onSubmit={handleSendMessage} autoComplete="off">
                        <Form.Group className="d-flex align-items-center mb-0">
                            <Form.Control
                                type="text"
                                placeholder="Digite sua mensagem..."
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                autoFocus
                            />
                            <Button variant="primary" type="submit" disabled={!inputText.trim()}>
                                <i className="fas fa-paper-plane"></i>
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default UserToUserChat;
