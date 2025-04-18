import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Spinner, Alert, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaImage, FaCalendarAlt } from 'react-icons/fa';
import { anuncioService } from '../../services/api';
import Header from '../layout/Header';
import './MeusAnuncios.css';

// Fallback image as base64 - light gray placeholder
const fallbackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN88R8AAtUB6S/lhm4AAAAASUVORK5CYII=';

const MeusAnuncios = () => {
    const location = useLocation();
    const isStandalone = location.pathname === '/meus-anuncios';
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        carregarMeusAnuncios();
    }, []);

    const carregarMeusAnuncios = async () => {
        try {
            setLoading(true);
            const response = await anuncioService.getMeusAnuncios();
            
            if (Array.isArray(response)) {
                const anunciosValidos = response.filter(anuncio => 
                    anuncio && anuncio.ID_Anuncio && typeof anuncio.Titulo === 'string'
                );
                setAnuncios(anunciosValidos);
                setError('');
            } else {
                console.error('Resposta inválida do servidor:', response);
                setAnuncios([]);
                setError('Formato de dados inválido. Por favor, tente novamente.');
            }
        } catch (err) {
            console.error('Erro ao carregar anúncios:', err);
            setAnuncios([]);
            setError('Erro ao carregar seus anúncios. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };

    const getStatusBadge = (statusId) => {
        const statusConfig = {
            1: { text: 'Aprovado', bg: 'success' },
            2: { text: 'Inativo', bg: 'secondary' },
            3: { text: 'Vendido', bg: 'info' },
            4: { text: 'Pendente', bg: 'warning' },
            7: { text: 'Rejeitado', bg: 'danger' }
        };

        const status = statusConfig[statusId] || { text: 'Desconhecido', bg: 'secondary' };
        return <Badge bg={status.bg}>{status.text}</Badge>;
    };

    if (loading) {
        return (
            <>
                {isStandalone && <Header />}
                <Container>
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Carregando seus anúncios...</p>
                    </div>
                </Container>
            </>
        );
    }

    return (
        <>
            {isStandalone && <Header />}
            <Container>
                <div className="anuncios-container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">Meus Anúncios</h5>
                        <Link to="/anuncios/novo">
                            <Button variant="primary" className="btn-add-anuncio">
                                <FaPlus className="me-2" />
                                Novo Anúncio
                            </Button>
                        </Link>
                    </div>

                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                    {anuncios.length === 0 ? (
                        <div className="empty-state">
                            <FaImage className="mb-3" />
                            <h5>Você ainda não tem anúncios</h5>
                            <p>Comece a vender ou trocar seus itens agora mesmo!</p>
                            <Link to="/anuncios/novo">
                                <Button variant="primary">
                                    <FaPlus className="me-2" />
                                    Criar Anúncio
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={isStandalone ? 3 : 2} className="g-4">
                            {anuncios.map(anuncio => (
                                <Col key={anuncio.ID_Anuncio}>
                                    <Card className="anuncio-card">
                                        <div className="position-relative">
                                            {anuncio.item_imagems && anuncio.item_imagems.length > 0 && anuncio.item_imagems[0]?.imagem ? (
                                                <Card.Img 
                                                    variant="top" 
                                                    src={`http://localhost:8000/storage/${anuncio.item_imagems[0].imagem.Caminho}`}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = fallbackImage;
                                                    }}
                                                    alt={anuncio.Titulo}
                                                />
                                            ) : (
                                                <div className="placeholder-img d-flex align-items-center justify-content-center bg-light" style={{ height: '200px' }}>
                                                    <FaImage size={40} className="text-secondary" />
                                                </div>
                                            )}
                                            <div className="anuncio-status">
                                                {getStatusBadge(anuncio.Status_AnuncioID_Status_Anuncio)}
                                            </div>
                                        </div>
                                        <Card.Body>
                                            <Card.Title>{anuncio.Titulo}</Card.Title>
                                            <Card.Text>
                                                {anuncio.Descricao ? (
                                                    anuncio.Descricao.length > 100 
                                                        ? `${anuncio.Descricao.substring(0, 100)}...`
                                                        : anuncio.Descricao
                                                ) : (
                                                    <span className="fst-italic">Sem descrição</span>
                                                )}
                                            </Card.Text>
                                            <div className="d-flex flex-wrap gap-2 mb-3">
                                                <span className="categoria-badge">
                                                    {anuncio.categorium?.Descricao_Categoria || 'Sem categoria'}
                                                </span>
                                                <span className="tipo-item-badge">
                                                    {anuncio.tipo_item?.Descricao_TipoItem || 'Não especificado'}
                                                </span>
                                            </div>
                                            <div className="anuncio-preco">
                                                {anuncio.Preco ? formatCurrency(anuncio.Preco) : 'Preço não definido'}
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="anuncio-footer">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted">
                                                    <FaCalendarAlt className="me-1" />
                                                    {anuncio.aprovacao?.Data_Aprovacao 
                                                        ? new Date(anuncio.aprovacao.Data_Aprovacao).toLocaleDateString()
                                                        : anuncio.Status_AnuncioID_Status_Anuncio === 1 
                                                            ? 'Aprovado' 
                                                            : 'Pendente'
                                                    }
                                                </small>
                                                <div className="anuncio-actions">
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        as={Link}
                                                        to={`/anuncios/${anuncio.ID_Anuncio}/editar`}
                                                    >
                                                        Editar
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </Container>
        </>
    );
};

export default MeusAnuncios;
