import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaPaperPlane } from 'react-icons/fa';
import { buscarMinhasReclamacoes, enviarMensagem, buscarMensagens } from '../../services/reclamacaoService';
import './MinhasReclamacoes.css';

const MinhasReclamacoes = () => {
    const [reclamacoes, setReclamacoes] = useState([]);
    const [selectedReclamacao, setSelectedReclamacao] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        carregarReclamacoes();
    }, []);

    useEffect(() => {
        if (selectedReclamacao) {
            carregarMensagens(selectedReclamacao.ID_Reclamacao);
        }
    }, [selectedReclamacao]);

    useEffect(() => {
        scrollToBottom();
    }, [mensagens]);

    const carregarReclamacoes = async () => {
        try {
            setLoading(true);
            const data = await buscarMinhasReclamacoes();
            setReclamacoes(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const carregarMensagens = async (reclamacaoId) => {
        try {
            const data = await buscarMensagens(reclamacaoId);
            setMensagens(data);
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar mensagens:', err);
            setError('Erro ao carregar mensagens. Por favor, tente novamente.');
        }
    };

    const handleEnviarMensagem = async (e) => {
        e.preventDefault();
        if (!novaMensagem.trim() || !selectedReclamacao) return;

        try {
            const novaMensagemData = await enviarMensagem(selectedReclamacao.ID_Reclamacao, novaMensagem);
            setMensagens([...mensagens, novaMensagemData]);
            setNovaMensagem('');
            setError(null);
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err);
            setError('Erro ao enviar mensagem. Por favor, tente novamente.');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'aberta':
                return 'warning';
            case 'em análise':
                return 'info';
            case 'resolvida':
                return 'success';
            case 'fechada':
                return 'secondary';
            default:
                return 'primary';
        }
    };

    const filteredReclamacoes = reclamacoes.filter(reclamacao =>
        reclamacao.Descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="search-box mb-4">
                <FaSearch className="search-icon" />
                <Form.Control
                    type="text"
                    placeholder="Pesquisar reclamações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="reclamacoes-grid">
                <div className="reclamacoes-lista">
                    {filteredReclamacoes.map(reclamacao => (
                        <Card
                            key={reclamacao.ID_Reclamacao}
                            className={`reclamacao-card mb-3 ${selectedReclamacao?.ID_Reclamacao === reclamacao.ID_Reclamacao ? 'selected' : ''}`}
                            onClick={() => setSelectedReclamacao(reclamacao)}
                        >
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <Card.Title className="h6 mb-2">
                                            Reclamação #{reclamacao.ID_Reclamacao}
                                        </Card.Title>
                                        <Card.Text className="text-muted small mb-2">
                                            {new Date(reclamacao.DataReclamacao).toLocaleDateString()}
                                        </Card.Text>
                                    </div>
                                    <Badge bg={getStatusColor(reclamacao.status)}>
                                        {reclamacao.status}
                                    </Badge>
                                </div>
                                <Card.Text className="mb-0 text-truncate">
                                    {reclamacao.Descricao}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                <div className="chat-container">
                    {selectedReclamacao ? (
                        <>
                            <div className="chat-header">
                                <h5 className="mb-0">Reclamação #{selectedReclamacao.ID_Reclamacao}</h5>
                                <Badge bg={getStatusColor(selectedReclamacao.status)}>
                                    {selectedReclamacao.status}
                                </Badge>
                            </div>
                            <div className="messages-container">
                                {mensagens.map((mensagem, index) => (
                                    <div
                                        key={index}
                                        className={`message ${mensagem.isUser ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            <p>{mensagem.conteudo}</p>
                                            <small>
                                                {new Date(mensagem.data).toLocaleString()}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <Form onSubmit={handleEnviarMensagem} className="message-form">
                                <div className="d-flex form-group">
                                    <Form.Control
                                        type="text"
                                        value={novaMensagem}
                                        onChange={(e) => setNovaMensagem(e.target.value)}
                                        placeholder="Digite sua mensagem..."
                                        disabled={selectedReclamacao.status === 'fechada'}
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={!novaMensagem.trim() || selectedReclamacao.status === 'fechada'}
                                    >
                                        <FaPaperPlane />
                                    </Button>
                                </div>
                            </Form>
                        </>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <p className="text-muted">Selecione uma reclamação para ver os detalhes</p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default MinhasReclamacoes; 