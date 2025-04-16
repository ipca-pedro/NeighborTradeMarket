import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Badge, Button, Alert, Card, Spinner, Modal } from 'react-bootstrap';
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
    const [showImgModal, setShowImgModal] = useState(false);

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
            setError('Não foi possível carregar as informações do anúncio. Por favor, tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleImagemClick = (index) => {
        setImagemPrincipal(index);
    };

    // Helper para obter URL da imagem
    const getImgUrl = (item) => {
        if (!item?.imagem?.Caminho) return '/images/no-image.jpg';
        // Garante que o caminho não tem 'public/' e monta o URL absoluto
        const caminho = item.imagem.Caminho.replace(/^public\//, '');
        return `http://localhost:8000/storage/${caminho}`;
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
                        <Row className="justify-content-center align-items-stretch g-4">
                            <Col xs={12} md={6} lg={6} className="d-flex align-items-center justify-content-center">
                                <Card className="shadow-sm border-0 w-100" style={{ maxWidth: 500 }}>
                                    {anuncio.item_imagems && anuncio.item_imagems.length > 0 ? (
                                        <div className="position-relative bg-white" style={{borderRadius: '0.5rem 0.5rem 0 0'}}>
                                            <Image 
                                                src={getImgUrl(anuncio.item_imagems[imagemPrincipal])}
                                                fluid 
                                                className="w-100"
                                                style={{ maxHeight: '480px', objectFit: 'contain', borderRadius: '0.5rem 0.5rem 0 0', background: '#f8f9fa', cursor: 'zoom-in' }}
                                                onClick={() => setShowImgModal(true)}
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
                                            style={{ height: '400px', borderRadius: '0.5rem 0.5rem 0 0' }}
                                        >
                                            <i className="fas fa-image fa-4x text-muted"></i>
                                        </div>
                                    )}
                                    {anuncio.item_imagems && anuncio.item_imagems.length > 1 && (
                                        <Card.Footer className="bg-white border-0 pt-3 pb-2">
                                            <Row className="g-2 justify-content-center">
                                                {anuncio.item_imagems.map((item, index) => (
                                                    <Col key={index} xs={3} sm={2} md={2} lg={2} className="mb-2">
                                                        <Image 
                                                            src={getImgUrl(item)}
                                                            thumbnail
                                                            className={`cursor-pointer ${imagemPrincipal === index ? 'border-primary' : ''}`}
                                                            style={{ 
                                                                height: '70px', 
                                                                objectFit: 'cover',
                                                                cursor: 'pointer',
                                                                borderWidth: imagemPrincipal === index ? '2px' : '1px',
                                                                borderColor: imagemPrincipal === index ? '#0d6efd' : '#dee2e6',
                                                                borderStyle: 'solid',
                                                                borderRadius: '0.4rem'
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
                            <Col xs={12} md={6} lg={6} className="d-flex align-items-center">
                                <Card className="shadow-sm border-0 w-100" style={{ minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24 }}>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h2 className="mb-0" style={{fontWeight: 700}}>{anuncio.Titulo}</h2>
                                            <Badge 
                                                bg={anuncio.Status_AnuncioID_Status_Anuncio === 1 ? 'success' : anuncio.Status_AnuncioID_Status_Anuncio === 3 ? 'info' : 'secondary'}
                                                className="p-2 fs-6"
                                            >
                                                {anuncio.status_anuncio?.Descricao_status_anuncio || 'Status Desconhecido'}
                                            </Badge>
                                        </div>
                                        <div className="mb-3">
                                            <Badge bg="secondary" className="me-2">
                                                {anuncio.categorium?.Descricao_Categoria || 'Categoria N/A'}
                                            </Badge>
                                            <Badge bg="info">
                                                {anuncio.tipo_item?.Descricao_TipoItem || 'Tipo N/A'}
                                            </Badge>
                                        </div>
                                        <h3 className="text-primary mb-4" style={{fontWeight: 800, fontSize: '2.2rem'}}>
                                            €{anuncio.Preco?.toFixed(2) || '0.00'}
                                        </h3>
                                        <div className="mb-4">
                                            <h5 className="mb-1">Descrição</h5>
                                            <p className="mb-0 text-muted" style={{fontSize: '1.1rem'}}>{anuncio.Descricao}</p>
                                        </div>
                                        <div className="mb-4">
                                            <h5 className="mb-1">Vendedor</h5>
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="fas fa-user-circle fa-lg text-primary"></i>
                                                <span style={{fontWeight: 500}}>{anuncio.utilizador?.Name || 'Não disponível'}</span>
                                                {/* Avaliação em estrelas (placeholder) */}
                                                <span title="Avaliação do vendedor">
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star-half-alt text-warning"></i>
                                                    <i className="far fa-star text-warning"></i>
                                                    <span className="ms-2 text-muted" style={{fontSize: '0.95rem'}}>(4.5)</span>
                                                </span>
                                            </div>
                                        </div>
                                        {/* Botões de compra e mensagem (agora sempre visíveis para teste) */}
                                        <div className="d-flex gap-2 mb-3 justify-content-center">
                                            <Button variant="success" size="lg" onClick={() => alert('Funcionalidade de compra em breve!')}>
                                                <i className="fas fa-shopping-cart me-2"></i> Comprar
                                            </Button>
                                            <Button variant="outline-primary" size="lg" as={Link} to={`/mensagens?anuncio=${anuncio.ID_Anuncio}&vendedor=${anuncio.UtilizadorID_User}`}>
                                                <i className="fas fa-comments me-2"></i> Conversar com Vendedor
                                            </Button>
                                        </div>
                                        {currentUser && anuncio.UtilizadorID_User === currentUser.ID_User && (
                                            <div className="d-flex gap-2 mb-3 justify-content-center">
                                                <Button 
                                                    as={Link} 
                                                    to={`/anuncios/editar/${anuncio.ID_Anuncio}`} 
                                                    variant="outline-primary" 
                                                    size="lg"
                                                >
                                                    <i className="fas fa-edit me-2"></i> Editar Anúncio
                                                </Button>
                                                {anuncio.Status_AnuncioID_Status_Anuncio === 1 && (
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
                                        <div className="mb-4">
                                            <h5 className="mb-1">Localização</h5>
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="fas fa-map-marker-alt text-primary"></i>
                                                <span>{anuncio.utilizador?.morada?.Rua || 'Localização não disponível'}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
            <Footer />
            {/* Modal para ampliar imagem com carrossel */}
            {anuncio && (
                <Modal show={showImgModal} onHide={() => setShowImgModal(false)} centered size="lg">
                    <Modal.Body className="p-0 bg-dark">
                        <div className="position-relative">
                            <Image 
                                src={getImgUrl(anuncio.item_imagems[imagemPrincipal])}
                                fluid
                                style={{ maxHeight: '80vh', width: '100%', objectFit: 'contain' }}
                                onClick={() => setShowImgModal(false)}
                            />
                            {anuncio.item_imagems && anuncio.item_imagems.length > 1 && (
                                <>
                                    <Button 
                                        variant="light" 
                                        className="position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle"
                                        style={{ opacity: 0.7 }}
                                        onClick={() => setImagemPrincipal(prev => prev > 0 ? prev - 1 : anuncio.item_imagems.length - 1)}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </Button>
                                    <Button 
                                        variant="light" 
                                        className="position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle"
                                        style={{ opacity: 0.7 }}
                                        onClick={() => setImagemPrincipal(prev => prev < anuncio.item_imagems.length - 1 ? prev + 1 : 0)}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </Button>
                                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                                        <div className="d-flex gap-2 bg-dark bg-opacity-50 rounded-pill px-3 py-2">
                                            {anuncio.item_imagems.map((_, index) => (
                                                <div 
                                                    key={index}
                                                    className="rounded-circle"
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        backgroundColor: index === imagemPrincipal ? '#fff' : 'rgba(255,255,255,0.5)',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => setImagemPrincipal(index)}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
}
export default DetalhesProduto;
