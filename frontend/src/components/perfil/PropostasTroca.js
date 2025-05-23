import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import trocaService from '../../services/trocaService';
import { toast } from 'react-toastify';
import { formatarPreco } from '../../utils/formatUtils';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';

const PropostasTroca = () => {
    const [propostasRecebidas, setPropostasRecebidas] = useState([]);
    const [propostasEnviadas, setPropostasEnviadas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarPropostas();
    }, []);

    const carregarPropostas = async () => {
        try {
            setLoading(true);
            console.log('Carregando propostas de troca...');
            
            const recebidas = await trocaService.getTodasPropostasRecebidas();
            const enviadas = await trocaService.getTodasPropostasEnviadas();
            
            console.log('Propostas recebidas:', recebidas.data);
            console.log('Propostas enviadas:', enviadas.data);
            
            setPropostasRecebidas(recebidas.data || []);
            setPropostasEnviadas(enviadas.data || []);
        } catch (error) {
            console.error('Erro ao carregar propostas de troca:', error);
            toast.error('Erro ao carregar propostas de troca');
        } finally {
            setLoading(false);
        }
    };

    const handleAceitar = async (trocaId) => {
        try {
            await trocaService.aceitarProposta(trocaId);
            toast.success('Proposta de troca aceite com sucesso!');
            carregarPropostas();
        } catch (error) {
            console.error('Erro ao aceitar proposta:', error);
            toast.error('Erro ao aceitar proposta de troca');
        }
    };

    const handleRejeitar = async (trocaId) => {
        try {
            await trocaService.rejeitarProposta(trocaId);
            toast.success('Proposta de troca rejeitada com sucesso!');
            carregarPropostas();
        } catch (error) {
            console.error('Erro ao rejeitar proposta:', error);
            toast.error('Erro ao rejeitar proposta de troca');
        }
    };

    const handleCancelar = async (trocaId) => {
        try {
            await trocaService.cancelarProposta(trocaId);
            toast.success('Proposta de troca cancelada com sucesso!');
            carregarPropostas();
        } catch (error) {
            console.error('Erro ao cancelar proposta:', error);
            toast.error('Erro ao cancelar proposta de troca');
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Carregando propostas de troca...</p>
            </Container>
        );
    }

    // Auxiliar para renderizar o status
    const renderStatus = (statusId) => {
        switch (statusId) {
            case 1: return <span className="badge bg-warning">Pendente</span>;
            case 2: return <span className="badge bg-success">Aceite</span>;
            case 3: return <span className="badge bg-danger">Rejeitada</span>;
            case 4: return <span className="badge bg-secondary">Cancelada</span>;
            default: return <span className="badge bg-info">Desconhecido</span>;
        }
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Propostas de Troca</h2>
            
            <h3 className="mb-3">Propostas Recebidas</h3>
            <Row className="g-4 mb-5">
                {propostasRecebidas.length > 0 ? (
                    propostasRecebidas.map((proposta) => (
                        <Col md={4} key={proposta.ID_Troca}>
                            <Card className="h-100 shadow-sm">
                                {/* Imagem do anúncio oferecido */}
                                {proposta.item_oferecido?.item_imagems?.[0]?.imagem && (
                                    <Card.Img 
                                        variant="top" 
                                        src={getImageUrl({ imagem: proposta.item_oferecido.item_imagems[0].imagem })}
                                        style={{ height: '180px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title className="fs-5">Troca Proposta</Card.Title>
                                    <div className="mb-2 small">
                                        {renderStatus(proposta.Status_TrocaID_Status_Troca)}
                                        <span className="ms-2 text-muted">{new Date(proposta.DataTroca).toLocaleDateString()}</span>
                                    </div>
                                    <Card.Text>
                                        <div className="mb-2">
                                            <strong>Anúncio solicitado:</strong><br/>
                                            <Link to={`/anuncios/${proposta.ItemID_Solicitado}`}>
                                                {proposta.item_solicitado?.Titulo || "Anúncio indisponível"}
                                            </Link>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Em troca de:</strong><br/>
                                            <Link to={`/anuncios/${proposta.ItemID_ItemOferecido}`}>
                                                {proposta.item_oferecido?.Titulo || "Anúncio indisponível"} {proposta.item_oferecido?.Preco && `(${formatarPreco(proposta.item_oferecido.Preco)})`}
                                            </Link>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Proposto por:</strong><br/>
                                            {proposta.item_oferecido?.utilizador?.Name || "Usuário desconhecido"}
                                        </div>
                                    </Card.Text>
                                    {proposta.Status_TrocaID_Status_Troca === 1 && (
                                        <div className="d-flex gap-2 mt-3">
                                            <Button 
                                                variant="success" 
                                                className="flex-grow-1" 
                                                onClick={() => handleAceitar(proposta.ID_Troca)}
                                            >
                                                Aceitar
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                className="flex-grow-1" 
                                                onClick={() => handleRejeitar(proposta.ID_Troca)}
                                            >
                                                Rejeitar
                                            </Button>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info">
                            Você não tem propostas de troca recebidas.
                        </Alert>
                    </Col>
                )}
            </Row>

            <h3 className="mb-3">Propostas Enviadas</h3>
            <Row className="g-4">
                {propostasEnviadas.length > 0 ? (
                    propostasEnviadas.map((proposta) => (
                        <Col md={4} key={proposta.ID_Troca}>
                            <Card className="h-100 shadow-sm">
                                {/* Imagem do anúncio solicitado */}
                                {proposta.item_solicitado?.item_imagems?.[0]?.imagem && (
                                    <Card.Img 
                                        variant="top" 
                                        src={getImageUrl({ imagem: proposta.item_solicitado.item_imagems[0].imagem })}
                                        style={{ height: '180px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title className="fs-5">Troca Solicitada</Card.Title>
                                    <div className="mb-2 small">
                                        {renderStatus(proposta.Status_TrocaID_Status_Troca)}
                                        <span className="ms-2 text-muted">{new Date(proposta.DataTroca).toLocaleDateString()}</span>
                                    </div>
                                    <Card.Text>
                                        <div className="mb-2">
                                            <strong>Anúncio desejado:</strong><br/>
                                            <Link to={`/anuncios/${proposta.ItemID_Solicitado}`}>
                                                {proposta.item_solicitado?.Titulo || "Anúncio indisponível"} {proposta.item_solicitado?.Preco && `(${formatarPreco(proposta.item_solicitado.Preco)})`}
                                            </Link>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Oferecendo:</strong><br/>
                                            <Link to={`/anuncios/${proposta.ItemID_ItemOferecido}`}>
                                                {proposta.item_oferecido?.Titulo || "Anúncio indisponível"}
                                            </Link>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Proprietário:</strong><br/>
                                            {proposta.item_solicitado?.utilizador?.Name || "Usuário desconhecido"}
                                        </div>
                                    </Card.Text>
                                    {proposta.Status_TrocaID_Status_Troca === 1 && (
                                        <Button 
                                            variant="danger" 
                                            className="w-100 mt-2" 
                                            onClick={() => handleCancelar(proposta.ID_Troca)}
                                        >
                                            Cancelar Proposta
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info">
                            Você não enviou nenhuma proposta de troca.
                        </Alert>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default PropostasTroca; 