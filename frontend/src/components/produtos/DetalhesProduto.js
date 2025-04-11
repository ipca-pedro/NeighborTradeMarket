import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Badge, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { anuncioService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const DetalhesProduto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [anuncio, setAnuncio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imagemPrincipal, setImagemPrincipal] = useState(0);

    useEffect(() => {
        carregarAnuncio();
    }, [id]);

    const carregarAnuncio = async () => {
        try {
            setLoading(true);
            const data = await anuncioService.getAnuncio(id);
            setAnuncio(data);
            setError('');
        } catch (err) {
            console.error('Erro ao carregar anúncio:', err);
            setError('Não foi possível carregar as informações do anúncio. Por favor, tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleImagemClick = (index) => {
        setImagemPrincipal(index);
    };



    return (
        <>
            <Header />
            <Container className="py-5">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Carregando...</span>
                        </Spinner>
                        <p className="mt-3">Carregando informações do anúncio...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : !anuncio ? (
                    <Alert variant="warning">Anúncio não encontrado</Alert>
                ) : (
                    <>
                        <div className="mb-4">
                            <Link to="/anuncios" className="text-decoration-none">
                                <i className="fas fa-arrow-left me-2"></i> Voltar para anúncios
                            </Link>
                        </div>
                        
                        <Row>
                            <Col lg={7} className="mb-4">
                                <Card className="shadow-sm">
                                    {anuncio.item_imagems && anuncio.item_imagems.length > 0 ? (
                                        <div className="position-relative">
                                            <Image 
                                                src={`/storage/${anuncio.item_imagems[imagemPrincipal]?.imagem?.Caminho.replace('public/', '')}`}
                                                fluid 
                                                className="w-100"
                                                style={{ maxHeight: '500px', objectFit: 'contain' }}
                                            />
                                            {anuncio.Status_AnuncioID_Status_Anuncio === 3 && (
                                                <div className="position-absolute top-0 end-0 m-3">
                                                    <Badge bg="info" className="p-2 fs-6">VENDIDO</Badge>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div 
                                            className="bg-light d-flex justify-content-center align-items-center"
                                            style={{ height: '400px' }}
                                        >
                                            <i className="fas fa-image fa-4x text-muted"></i>
                                        </div>
                                    )}
                                    
                                    {anuncio.item_imagems && anuncio.item_imagems.length > 1 && (
                                        <Card.Footer className="bg-white">
                                            <Row>
                                                {anuncio.item_imagems.map((item, index) => (
                                                    <Col key={index} xs={3} className="mb-2">
                                                        <Image 
                                                            src={`/storage/${item.imagem.Caminho.replace('public/', '')}`}
                                                            thumbnail
                                                            className={`cursor-pointer ${imagemPrincipal === index ? 'border-primary' : ''}`}
                                                            style={{ 
                                                                height: '80px', 
                                                                objectFit: 'cover',
                                                                cursor: 'pointer',
                                                                borderWidth: imagemPrincipal === index ? '2px' : '1px'
                                                            }}
                                                            onClick={() => handleImagemClick(index)}
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card.Footer>
                                    )}
                                </Card>
                            </Col>
                            
                            <Col lg={5}>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h2 className="mb-0">{anuncio.Titulo}</h2>
                                            <Badge 
                                                bg={anuncio.Status_AnuncioID_Status_Anuncio === 2 ? 'success' : 'secondary'}
                                                className="p-2"
                                            >
                                                {anuncio.status_anuncio?.Nome || 'Status Desconhecido'}
                                            </Badge>
                                        </div>
                                        
                                        <h3 className="text-primary mb-4">€{anuncio.Preco?.toFixed(2) || '0.00'}</h3>
                                        
                                        <div className="mb-4">
                                            <h5>Categoria</h5>
                                            <p className="mb-0">{anuncio.categorium?.Nome || 'Não especificada'}</p>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h5>Tipo</h5>
                                            <p className="mb-0">{anuncio.tipo_item?.Nome || 'Não especificado'}</p>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h5>Descrição</h5>
                                            <p className="mb-0">{anuncio.Descricao}</p>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h5>Vendedor</h5>
                                            <p className="mb-0">{anuncio.utilizador?.Name || 'Não disponível'}</p>
                                        </div>
                                        
                                        {currentUser && anuncio.UtilizadorID_User !== currentUser.ID_User && anuncio.Status_AnuncioID_Status_Anuncio === 2 && (
                                            <div className="d-grid gap-2">
                                                <Button variant="success" size="lg">
                                                    <i className="fas fa-shopping-cart me-2"></i> Comprar
                                                </Button>
                                                <Button variant="outline-primary" size="lg">
                                                    <i className="fas fa-comments me-2"></i> Conversar com Vendedor
                                                </Button>
                                            </div>
                                        )}
                                        
                                        {currentUser && anuncio.UtilizadorID_User === currentUser.ID_User && (
                                            <div className="d-grid gap-2">
                                                <Button 
                                                    as={Link} 
                                                    to={`/anuncios/editar/${anuncio.ID_Anuncio}`} 
                                                    variant="outline-primary" 
                                                    size="lg"
                                                >
                                                    <i className="fas fa-edit me-2"></i> Editar Anúncio
                                                </Button>
                                                {anuncio.Status_AnuncioID_Status_Anuncio === 2 && (
                                                    <Button 
                                                        variant="outline-info" 
                                                        size="lg"
                                                        onClick={() => anuncioService.marcarComoVendido(anuncio.ID_Anuncio).then(() => carregarAnuncio())}
                                                    >
                                                        <i className="fas fa-check-circle me-2"></i> Marcar como Vendido
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                                
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <h5 className="mb-3">Localização</h5>
                                        <p className="mb-0">
                                            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                            {anuncio.utilizador?.morada?.Rua || 'Localização não disponível'}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
            <Footer />
        </>
    );
}
export default DetalhesProduto;
