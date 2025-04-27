import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Alert, Spinner, Row, Col, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { formatarData } from '../../utils/dataUtils';
import Header from '../layout/Header';
import { buscarReclamacao, buscarMensagensReclamacao, enviarMensagem } from '../../services/reclamacaoService';

const DetalhesReclamacao = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reclamacao, setReclamacao] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [enviandoMensagem, setEnviandoMensagem] = useState(false);

    useEffect(() => {
        carregarDetalhes();
    }, [id]);

    const carregarDetalhes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Carregar detalhes da reclamação
            const detalhes = await buscarReclamacao(id);
            setReclamacao(detalhes);
            
            // Carregar mensagens
            const msgs = await buscarMensagensReclamacao(id);
            setMensagens(msgs.mensagens || []);
        } catch (err) {
            console.error('Erro ao carregar detalhes:', err);
            setError(err.response?.data?.message || 'Erro ao carregar detalhes. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 1: return 'warning';  // Pendente
            case 3: return 'success';  // Resolvida
            case 4: return 'danger';   // Rejeitada
            default: return 'secondary';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1: return 'Pendente';
            case 3: return 'Resolvida';
            case 4: return 'Rejeitada';
            default: return 'Desconhecido';
        }
    };

    const podeEnviarMensagem = (status) => {
        // Pode enviar mensagem se estiver pendente
        return status === 1;
    };

    const handleEnviarMensagem = async (e) => {
        e.preventDefault();
        if (!novaMensagem.trim() || !podeEnviarMensagem(reclamacao.Status_ReclamacaoID_Status_Reclamacao)) return;

        try {
            setEnviandoMensagem(true);
            await enviarMensagem(id, novaMensagem);
            setNovaMensagem('');
            // Recarregar mensagens
            const msgs = await buscarMensagensReclamacao(id);
            setMensagens(msgs.mensagens || []);
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err);
            setError('Erro ao enviar mensagem. Por favor, tente novamente.');
        } finally {
            setEnviandoMensagem(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <Container className="py-4">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Carregando detalhes da reclamação...</p>
                    </div>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <Container className="py-4">
                    <Alert variant="danger">
                        <Alert.Heading>Erro ao carregar detalhes</Alert.Heading>
                        <p>{error}</p>
                    </Alert>
                </Container>
            </>
        );
    }

    if (!reclamacao) {
        return (
            <>
                <Header />
                <Container className="py-4">
                    <Alert variant="warning">
                        <Alert.Heading>Reclamação não encontrada</Alert.Heading>
                        <p>A reclamação solicitada não foi encontrada.</p>
                    </Alert>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Detalhes da Reclamação</h4>
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                        Voltar
                    </Button>
                </div>

                <Card className="mb-4">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5>Produto: {reclamacao.compras?.[0]?.anuncio?.Titulo || 'N/A'}</h5>
                                <p className="text-muted mb-0">
                                    Data: {formatarData(reclamacao.DataReclamacao)}
                                </p>
                            </div>
                            <Badge 
                                bg={getStatusBadgeVariant(reclamacao.Status_ReclamacaoID_Status_Reclamacao)}
                                className="status-badge"
                            >
                                {getStatusText(reclamacao.Status_ReclamacaoID_Status_Reclamacao)}
                            </Badge>
                        </div>

                        <div className="mb-4">
                            <h6>Motivo da Reclamação:</h6>
                            <p>{reclamacao.Descricao}</p>
                        </div>

                        <div className="mb-4">
                            <h6>Histórico de Mensagens:</h6>
                            {mensagens.length === 0 ? (
                                <p className="text-muted">Nenhuma mensagem trocada ainda.</p>
                            ) : (
                                <div className="mensagens-lista">
                                    {mensagens.map((msg, index) => (
                                        <div key={index} className="mensagem-item p-3 mb-2 bg-light rounded">
                                            <div className="d-flex justify-content-between">
                                                <strong>{msg.usuario}</strong>
                                                <small className="text-muted">{formatarData(msg.data)}</small>
                                            </div>
                                            <p className="mb-0 mt-1">{msg.mensagem}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {podeEnviarMensagem(reclamacao.Status_ReclamacaoID_Status_Reclamacao) ? (
                            <Form onSubmit={handleEnviarMensagem}>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Digite sua mensagem..."
                                        value={novaMensagem}
                                        onChange={(e) => setNovaMensagem(e.target.value)}
                                        disabled={enviandoMensagem}
                                    />
                                </Form.Group>
                                <Button 
                                    type="submit" 
                                    variant="primary"
                                    disabled={!novaMensagem.trim() || enviandoMensagem}
                                >
                                    {enviandoMensagem ? 'Enviando...' : 'Enviar Mensagem'}
                                </Button>
                            </Form>
                        ) : (
                            <Alert variant="info">
                                Esta reclamação já foi {reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3 ? 'resolvida' : 'rejeitada'} pelo administrador e não aceita mais mensagens.
                            </Alert>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default DetalhesReclamacao; 