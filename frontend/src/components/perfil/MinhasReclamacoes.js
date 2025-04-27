import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Alert, Spinner, Row, Col, Button } from 'react-bootstrap';
import { buscarMinhasReclamacoes } from '../../services/reclamacaoService';
import { formatarData } from '../../utils/dataUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import './MinhasReclamacoes.css';

const MinhasReclamacoes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isStandalone = location.pathname === '/minhas-reclamacoes';
    const [reclamacoes, setReclamacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        carregarReclamacoes();
    }, []);

    const carregarReclamacoes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await buscarMinhasReclamacoes();
            console.log('Reclamações carregadas:', data);
            setReclamacoes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Erro ao carregar reclamações:', err);
            setError(err.response?.data?.message || 'Erro ao carregar reclamações. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 1: return 'warning';  // Pendente
            case 2: return 'info';     // Em análise
            case 3: return 'success';  // Resolvida
            case 4: return 'danger';   // Rejeitada
            default: return 'secondary';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1: return 'Pendente';
            case 2: return 'Em Análise';
            case 3: return 'Resolvida';
            case 4: return 'Rejeitada';
            default: return status?.Descricao_status_reclamacao || 'Desconhecido';
        }
    };

    const verDetalhes = (id) => {
        navigate(`/reclamacoes/${id}`);
    };

    // Renderiza o conteúdo principal
    if (loading && reclamacoes.length === 0) {
        return (
            <>
                {isStandalone && <Header />}
                <Container className={isStandalone ? "py-4" : ""}>
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Carregando suas reclamações...</p>
                    </div>
                </Container>
            </>
        );
    }

    if (error && reclamacoes.length === 0) {
        return (
            <>
                {isStandalone && <Header />}
                <Container className={isStandalone ? "py-4" : ""}>
                    <Alert variant="danger" className="mb-4">
                        <Alert.Heading>Ocorreu um erro</Alert.Heading>
                        <p>{error}</p>
                    </Alert>
                </Container>
            </>
        );
    }

    return (
        <>
            {isStandalone && <Header />}
            <Container className={isStandalone ? "py-4" : ""}>
                <div className="reclamacoes-simples">
                    <h4 className="mb-4">Minhas Reclamações</h4>
                    
                    {reclamacoes.length === 0 ? (
                        <div className="empty-state py-4 text-center">
                            <p className="text-muted mb-0">
                                Você não possui reclamações registradas.
                                <br/>
                                Para fazer uma reclamação, acesse a seção "Minhas Compras".
                            </p>
                        </div>
                    ) : (
                        <div className="reclamacoes-lista">
                            {reclamacoes.map((reclamacao) => (
                                <Card key={reclamacao.ID_Reclamacao} className="mb-3 reclamacao-card-simples">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">Produto: {reclamacao.compras?.[0]?.anuncio?.Titulo || 'N/A'}</h5>
                                            <Badge 
                                                bg={getStatusBadgeVariant(reclamacao.Status_ReclamacaoID_Status_Reclamacao)}
                                                className="status-badge"
                                            >
                                                {getStatusText(reclamacao.Status_ReclamacaoID_Status_Reclamacao)}
                                            </Badge>
                                        </div>
                                        
                                        <Row>
                                            <Col>
                                                <p className="text-muted small mb-2">
                                                    <strong>Data:</strong> {formatarData(reclamacao.DataReclamacao)}
                                                </p>
                                                <p className="mb-2">
                                                    <strong>Motivo:</strong> {reclamacao.Descricao}
                                                </p>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => verDetalhes(reclamacao.ID_Reclamacao)}
                                                >
                                                    Ver Detalhes
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default MinhasReclamacoes; 