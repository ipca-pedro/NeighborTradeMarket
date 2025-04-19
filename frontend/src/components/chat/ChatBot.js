import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useChat } from '../../contexts/ChatContext';
import './ChatBot.css';

const ChatBot = () => {
    const { isChatOpen, toggleChat, closeChat } = useChat();
    const chatRef = useRef(null);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Olá! Sou o assistente virtual do NeighborTrade. Como posso ajudar?',
            options: [
                'Como criar um anúncio?',
                'Como funciona a compra?',
                'Políticas de devolução',
                'Outro assunto'
            ]
        }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target) && 
                !event.target.closest('.chat-toggle-button')) {
                closeChat();
            }
        };

        if (isChatOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isChatOpen, closeChat]);

    const handleSendMessage = (text) => {
        // Adiciona mensagem do usuário
        setMessages(prev => [...prev, { type: 'user', text }]);

        // Simula resposta do bot
        setTimeout(() => {
            let botResponse = {
                type: 'bot',
                text: '',
                options: []
            };

            // Respostas pré-definidas baseadas na entrada do usuário
            if (text.toLowerCase().includes('criar anúncio') || text === 'Como criar um anúncio?') {
                botResponse.text = 'Para criar um anúncio, siga estes passos:\n1. Faça login na sua conta\n2. Clique no botão "Criar Anúncio"\n3. Preencha os detalhes do produto\n4. Adicione fotos\n5. Clique em "Publicar"';
                botResponse.options = ['Como fazer login?', 'Tipos de anúncios permitidos', 'Voltar ao início'];
            } else if (text.toLowerCase().includes('compra') || text === 'Como funciona a compra?') {
                botResponse.text = 'O processo de compra é simples:\n1. Encontre o produto desejado\n2. Clique em "Ver Detalhes"\n3. Entre em contato com o vendedor\n4. Combine o pagamento e a entrega';
                botResponse.options = ['Métodos de pagamento', 'Segurança na compra', 'Voltar ao início'];
            } else if (text.toLowerCase().includes('devolução') || text === 'Políticas de devolução') {
                botResponse.text = 'Nossa política de devolução:\n- 7 dias para desistência da compra\n- Produto deve estar nas condições originais\n- Entre em contato com o vendedor primeiro';
                botResponse.options = ['Como solicitar devolução', 'Prazos de devolução', 'Voltar ao início'];
            } else if (text === 'Voltar ao início') {
                botResponse.text = 'Como posso ajudar?';
                botResponse.options = [
                    'Como criar um anúncio?',
                    'Como funciona a compra?',
                    'Políticas de devolução',
                    'Outro assunto'
                ];
            } else {
                botResponse.text = 'Para esse assunto, recomendo entrar em contacto com nossa equipe por email: info@neighbortrade.com';
                botResponse.options = ['Voltar ao início'];
            }

            setMessages(prev => [...prev, botResponse]);
        }, 1000);

        setInputText('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            handleSendMessage(inputText.trim());
        }
    };

    const handleOptionClick = (option) => {
        handleSendMessage(option);
    };

    return (
        <div className={`chat-widget ${isChatOpen ? 'expanded' : ''}`} ref={chatRef}>
            {!isChatOpen ? (
                <Button 
                    className="chat-toggle-button"
                    onClick={toggleChat}
                    variant="primary"
                >
                    <i className="fas fa-robot me-2"></i>
                    Assistente Virtual
                </Button>
            ) : (
                <div className="chat-container">
                    <div className="chat-header bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-center p-3">
                            <div>
                                <i className="fas fa-robot me-2"></i>
                                Apoio ao Cliente
                            </div>
                            <Button 
                                variant="link" 
                                className="text-white p-0" 
                                onClick={closeChat}
                            >
                                <i className="fas fa-times"></i>
                            </Button>
                        </div>
                    </div>
                    <div className="chat-body p-0">
                        <div className="messages-container p-3">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.type}`}>
                                    {msg.type === 'bot' && (
                                        <div className="bot-avatar">
                                            <i className="fas fa-robot"></i>
                                        </div>
                                    )}
                                    <div className="message-content">
                                        <p>{msg.text.split('\\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}</p>
                                        {msg.options && msg.type === 'bot' && (
                                            <div className="options-container">
                                                {msg.options.map((option, i) => (
                                                    <Button
                                                        key={i}
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2 mb-2"
                                                        onClick={() => handleOptionClick(option)}
                                                    >
                                                        {option}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <Form onSubmit={handleSubmit} className="chat-input-form">
                            <Form.Group className="d-flex p-3 border-top">
                                <Form.Control
                                    type="text"
                                    placeholder="Digite sua mensagem..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="me-2"
                                />
                                <Button type="submit" variant="primary">
                                    <i className="fas fa-paper-plane"></i>
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
