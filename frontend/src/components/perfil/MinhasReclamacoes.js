import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { buscarMinhasReclamacoes, enviarMensagem, buscarMensagens } from '../../services/reclamacaoService';
import { formatarData } from '../../utils/dataUtils';
import './MinhasReclamacoes.css';

const MinhasReclamacoes = () => {
    const [reclamacoes, setReclamacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMensagens, setShowMensagens] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [reclamacaoSelecionada, setReclamacaoSelecionada] = useState(null);
    const [novaMensagem, setNovaMensagem] = useState('');

    useEffect(() => {
        carregarReclamacoes();
    }, []);

    const carregarReclamacoes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await buscarMinhasReclamacoes();
            console.log('Reclamações carregadas:', data);
            setReclamacoes(data);
        } catch (err) {
            console.error('Erro ao carregar reclamações:', err);
            setError(err.response?.data?.message || 'Erro ao carregar reclamações. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerMensagens = async (reclamacao) => {
        setReclamacaoSelecionada(reclamacao);
        try {
            const mensagensData = await buscarMensagens(reclamacao.ID_Reclamacao);
            console.log('Mensagens recebidas:', mensagensData);
            // Extract messages from the response
            const mensagensArray = mensagensData.mensagens || [];
            console.log('Array de mensagens:', mensagensArray);
            setMensagens(mensagensArray);
            setShowMensagens(true);
        } catch (err) {
            console.error('Erro ao carregar mensagens:', err);
            setError('Erro ao carregar mensagens');
        }
    };

    const handleEnviarMensagem = async () => {
        if (!novaMensagem.trim()) return;

        try {
            await enviarMensagem(reclamacaoSelecionada.ID_Reclamacao, novaMensagem);
            const mensagensData = await buscarMensagens(reclamacaoSelecionada.ID_Reclamacao);
            console.log('Mensagens após envio:', mensagensData);
            // Extract messages from the response
            const mensagensArray = mensagensData.mensagens || [];
            console.log('Array de mensagens após envio:', mensagensArray);
            setMensagens(mensagensArray);
            setNovaMensagem('');
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err);
            setError('Erro ao enviar mensagem');
        }
    };

    const getStatusBadgeVariant = (status) => {
        // Handle numeric status IDs
        switch (status) {
            case 1:
                return 'warning';  // Pendente
            case 2:
                return 'info';     // Em análise
            case 3:
                return 'success';  // Resolvida
            case 4:
                return 'danger';   // Rejeitada
            default:
                return 'secondary';
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="my-3">
                <Alert.Heading>Erro ao carregar reclamações</Alert.Heading>
                <p>{error}</p>
                <div className="d-flex justify-content-end">
                    <Button variant="outline-danger" onClick={carregarReclamacoes}>
                        Tentar Novamente
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="minhas-reclamacoes">
            <h2 className="mb-4">Minhas Reclamações</h2>
            {reclamacoes.length === 0 ? (
                <p>Você não possui reclamações registradas.</p>
            ) : (
                reclamacoes.map((reclamacao) => (
                    <Card key={reclamacao.ID_Reclamacao} className="mb-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <Card.Title>
                                        Reclamação #{reclamacao.ID_Reclamacao}
                                        <Badge 
                                            bg={getStatusBadgeVariant(reclamacao.Status_ReclamacaoID_Status_Reclamacao)} 
                                            className="ms-2"
                                        >
                                            {reclamacao.status?.Descricao_status_reclamacao || 'Pendente'}
                                        </Badge>
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        {formatarData(reclamacao.DataReclamacao)}
                                    </Card.Subtitle>
                                </div>
                            </div>
                            <Card.Text>{reclamacao.Descricao}</Card.Text>
                            <Button 
                                variant="outline-primary" 
                                onClick={() => handleVerMensagens(reclamacao)}
                            >
                                Ver Mensagens
                            </Button>
                        </Card.Body>
                    </Card>
                ))
            )}

            <Modal show={showMensagens} onHide={() => setShowMensagens(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Mensagens da Reclamação #{reclamacaoSelecionada?.ID_Reclamacao}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mensagens-container mb-3">
                        {mensagens.length === 0 ? (
                            <p>Nenhuma mensagem encontrada.</p>
                        ) : (
                            mensagens.map((mensagem, index) => (
                                <div 
                                    key={index} 
                                    className={`mensagem ${mensagem.usuario === 'admin' ? 'admin' : 'user'}`}
                                >
                                    <div className="mensagem-content">
                                        <p>{mensagem.mensagem}</p>
                                        <small className="text-muted">
                                            {formatarData(mensagem.data)}
                                        </small>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={novaMensagem}
                            onChange={(e) => setNovaMensagem(e.target.value)}
                            placeholder="Digite sua mensagem..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMensagens(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleEnviarMensagem}>
                        Enviar Mensagem
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MinhasReclamacoes; 