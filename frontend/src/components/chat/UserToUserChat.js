import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import './ChatBot.css'; // Reutiliza estilos do ChatBot

const UserToUserChat = ({ show, onClose, anuncioId, vendedorId, vendedorNome }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [minimized, setMinimized] = useState(false);
    const chatRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (show && !minimized) {
            // Carregar mensagens existentes do backend (API)
            // Exemplo: fetch(`/api/chat/${anuncioId}/${vendedorId}`)
            // setMessages([...])
            if (messages.length === 0 && vendedorNome) {
                setMessages([
                    { sender: 'vendedor', text: `Olá, sou o vendedor ${vendedorNome}, está interessado/a no produto?` }
                ]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, anuncioId, vendedorId, vendedorNome, minimized]);

    useEffect(() => {
        if (show && !minimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        // Enviar mensagem para backend (API)
        // Exemplo: await fetch(`/api/chat/send`, { ... })
        setMessages(prev => [...prev, { sender: 'me', text: inputText }]);
        setInputText('');
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
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.sender === 'me' ? 'user' : ''}`}> 
                                <div className="message-content">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
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
