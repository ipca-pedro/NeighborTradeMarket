import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { anuncioService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const MeusAnuncios = () => {
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');

    useEffect(() => {
        fetchAnuncios();
    }, []);

    const fetchAnuncios = async () => {
        try {
            setLoading(true);
            const data = await anuncioService.getMeusAnuncios();
            setAnuncios(data);
            setError('');
        } catch (err) {
            console.error('Erro ao carregar anúncios:', err);
            setError('Não foi possível carregar seus anúncios. Por favor, tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarcarVendido = async (id) => {
        try {
            await anuncioService.marcarComoVendido(id);
            setActionSuccess('Anúncio marcado como vendido com sucesso!');
            
            // Atualizar a lista de anúncios
            fetchAnuncios();
            
            // Limpar mensagem de sucesso após 3 segundos
            setTimeout(() => {
                setActionSuccess('');
            }, 3000);
        } catch (err) {
            console.error('Erro ao marcar anúncio como vendido:', err);
            setError('Não foi possível marcar o anúncio como vendido. Por favor, tente novamente.');
            
            // Limpar mensagem de erro após 3 segundos
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    const handleExcluir = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.')) {
            try {
                await anuncioService.excluirAnuncio(id);
                setActionSuccess('Anúncio excluído com sucesso!');
                
                // Atualizar a lista de anúncios
                fetchAnuncios();
                
                // Limpar mensagem de sucesso após 3 segundos
                setTimeout(() => {
                    setActionSuccess('');
                }, 3000);
            } catch (err) {
                console.error('Erro ao excluir anúncio:', err);
                setError('Não foi possível excluir o anúncio. Por favor, tente novamente.');
                
                // Limpar mensagem de erro após 3 segundos
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
        }
    };

    const getStatusBadge = (statusId) => {
        switch (statusId) {
            case 1: // Pendente
                return <Badge bg="warning" text="dark">Pendente</Badge>;
            case 2: // Aprovado
                return <Badge bg="success">Aprovado</Badge>;
            case 3: // Vendido
                return <Badge bg="info">Vendido</Badge>;
            case 4: // Rejeitado
                return <Badge bg="danger">Rejeitado</Badge>;
            default:
                return <Badge bg="secondary">Desconhecido</Badge>;
        }
    };

    return (
        <>
            <Header />
            <Container className="py-5">
                <h2 className="mb-4">Meus Anúncios</h2>
                
                {actionSuccess && (
                    <Alert variant="success" className="mb-4">
                        {actionSuccess}
                    </Alert>
                )}
                
                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button as={Link} to="/anuncios/novo" variant="primary">
                        <i className="fas fa-plus me-2"></i> Criar Novo Anúncio
                    </Button>
                </div>
                
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                        <p className="mt-3">Carregando seus anúncios...</p>
                    </div>
                ) : anuncios.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-box-open fa-4x mb-3 text-muted"></i>
                        <h4>Você ainda não tem anúncios</h4>
                        <p className="text-muted">Crie seu primeiro anúncio para começar a vender!</p>
                        <Button as={Link} to="/anuncios/novo" variant="primary" className="mt-3">
                            Criar Anúncio
                        </Button>
                    </div>
                ) : (
                    <Row>
                        {anuncios.map(anuncio => (
                            <Col md={4} className="mb-4" key={anuncio.ID_Anuncio}>
                                <Card className="h-100 shadow-sm">
                                    <div className="position-relative">
                                        {anuncio.imagens && anuncio.imagens.length > 0 ? (
                                            <Card.Img 
                                                variant="top" 
                                                src={`/storage/${anuncio.imagens[0].Caminho.replace('public/', '')}`} 
                                                style={{ height: '200px', objectFit: 'cover' }} 
                                            />
                                        ) : (
                                            <div 
                                                className="bg-light d-flex justify-content-center align-items-center"
                                                style={{ height: '200px' }}
                                            >
                                                <i className="fas fa-image fa-3x text-muted"></i>
                                            </div>
                                        )}
                                        <div className="position-absolute top-0 end-0 m-2">
                                            {getStatusBadge(anuncio.Status_AnuncioID_Status_Anuncio)}
                                        </div>
                                    </div>
                                    
                                    <Card.Body>
                                        <Card.Title>{anuncio.Titulo}</Card.Title>
                                        <Card.Text className="text-primary fw-bold">
                                            {anuncio.Preco ? `€${anuncio.Preco.toFixed(2)}` : 'Preço não definido'}
                                        </Card.Text>
                                        <Card.Text className="text-truncate">
                                            {anuncio.Descricao}
                                        </Card.Text>
                                    </Card.Body>
                                    
                                    <Card.Footer className="bg-white">
                                        <div className="d-flex justify-content-between">
                                            <Button 
                                                as={Link} 
                                                to={`/anuncios/${anuncio.ID_Anuncio}`} 
                                                variant="outline-primary" 
                                                size="sm"
                                            >
                                                Ver Detalhes
                                            </Button>
                                            
                                            <div>
                                                {anuncio.Status_AnuncioID_Status_Anuncio === 2 && (
                                                    <Button 
                                                        variant="outline-info" 
                                                        size="sm" 
                                                        className="me-2"
                                                        onClick={() => handleMarcarVendido(anuncio.ID_Anuncio)}
                                                    >
                                                        Marcar Vendido
                                                    </Button>
                                                )}
                                                
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleExcluir(anuncio.ID_Anuncio)}
                                                >
                                                    Excluir
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </>
    );
};

export default MeusAnuncios;
