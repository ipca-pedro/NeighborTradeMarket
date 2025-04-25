import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image, Badge, Button, Alert, Card, Spinner, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { anuncioService, favoritoService, getImageUrl } from '../../services/api';
import trocaService from '../../services/trocaService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Header from '../layout/Header';
import UserToUserChat from '../chat/UserToUserChat';
import IniciarCompra from '../Compras/IniciarCompra';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaExchangeAlt, FaDollarSign, FaWhatsapp, FaEnvelope, FaImage } from 'react-icons/fa';
import './DetalhesProduto.css';

// Fallback image if image loading fails
const fallbackImage = 'data:image/png;base64,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';

const DetalhesProduto = () => {
    const [showUserChat, setShowUserChat] = useState(false);
    const [showTrocaModal, setShowTrocaModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, isAuthenticated } = useAuth();
    const [anuncio, setAnuncio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imagemPrincipal, setImagemPrincipal] = useState(0);
    const [showImgModal, setShowImgModal] = useState(false);
    const [meusAnuncios, setMeusAnuncios] = useState([]);
    const [loadingMeusAnuncios, setLoadingMeusAnuncios] = useState(false);
    const [selectedImg, setSelectedImg] = useState(0);

    useEffect(() => {
        carregarAnuncio();
    }, [id]);

    useEffect(() => {
        console.log('Status de autenticação:', isAuthenticated);
        console.log('Utilizador atual:', currentUser);
    }, [currentUser, isAuthenticated]);

    const carregarAnuncio = async () => {
        try {
            setLoading(true);
            const data = await anuncioService.getAnuncio(id);
            setAnuncio(data);
            console.log('Anúncio carregado:', data);
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

    const carregarMeusAnuncios = async () => {
        try {
            setLoadingMeusAnuncios(true);
            const response = await anuncioService.getMeusAnuncios();
            console.log('Resposta getMeusAnuncios:', response);
            
            // Filtra apenas anúncios ativos e exclui o anúncio atual
            const anunciosAtivos = response.filter(anuncio => 
                anuncio.Status_AnuncioID_Status_Anuncio === 1 && 
                anuncio.ID_Anuncio !== parseInt(id)
            );
            console.log('Anúncios filtrados:', anunciosAtivos);
            setMeusAnuncios(anunciosAtivos);
        } catch (error) {
            console.error('Erro ao carregar anúncios:', error);
            toast.error('Erro ao carregar seus anúncios');
        } finally {
            setLoadingMeusAnuncios(false);
        }
    };

    // Carregar anúncios quando o modal for aberto
    useEffect(() => {
        if (showTrocaModal) {
            carregarMeusAnuncios();
        }
    }, [showTrocaModal]);

    const handleProporTroca = async (meuAnuncioId) => {
        try {
            await trocaService.proporTroca(id, meuAnuncioId);
            toast.success('Proposta de troca enviada com sucesso!');
            setShowTrocaModal(false);
            // Navegar para a página de propostas após enviar
            navigate('/perfil/propostas');
        } catch (error) {
            console.error('Erro ao propor troca:', error);
            toast.error('Erro ao enviar proposta de troca. Por favor, tente novamente.');
        }
    };

    // Function to render Images in Carousel
    const renderCarouselImages = () => {
        if (!anuncio || !anuncio.item_imagems || anuncio.item_imagems.length === 0) {
            return (
                <div className="placeholder-img d-flex align-items-center justify-content-center bg-light" style={{ height: '400px' }}>
                    <FaImage size={60} className="text-secondary" />
                </div>
            );
        }

        return anuncio.item_imagems.map((img, index) => (
            <div 
                key={index} 
                className={`carousel-image ${selectedImg === index ? 'active' : ''}`}
                onClick={() => setSelectedImg(index)}
            >
                <img 
                    src={getImageUrl(img)} 
                    alt={`Imagem ${index + 1} do produto`} 
                    onError={(e) => {
                        console.log('Erro ao carregar imagem:', e);
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                    }}
                />
            </div>
        ));
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
                                                src={getImageUrl(anuncio.item_imagems[imagemPrincipal])}
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
                                                            src={getImageUrl(item)}
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
                                        {/* Botões de compra e mensagem */}
                                        {!currentUser ? (
                                            <Alert variant="info" className="text-center mb-3">
                                                <Link to="/login" className="alert-link">Faça login</Link> para interagir com este anúncio
                                            </Alert>
                                        ) : anuncio.UtilizadorID_User !== currentUser.ID_User ? (
                                            <div className="d-flex gap-2 mb-3 justify-content-center">
                                                <IniciarCompra
                                                    anuncioId={anuncio.ID_Anuncio}
                                                    titulo={anuncio.Titulo}
                                                    preco={anuncio.Preco}
                                                    onSuccess={(compra) => {
                                                        toast.success('Compra iniciada com sucesso!');
                                                        setAnuncio(prev => ({
                                                            ...prev,
                                                            Status_AnuncioID_Status_Anuncio: 3
                                                        }));
                                                    }}
                                                    onCancel={() => {
                                                        // Opcional: fazer algo quando a compra for cancelada
                                                        console.log('Compra cancelada');
                                                    }}
                                                />
                                                <Button 
                                                    variant="success" 
                                                    size="lg" 
                                                    onClick={() => setShowTrocaModal(true)}
                                                >
                                                    <i className="fas fa-exchange-alt me-2"></i> Trocar
                                                </Button>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="lg" 
                                                    onClick={() => setShowUserChat(true)}
                                                >
                                                    <i className="fas fa-comments me-2"></i> Conversar com Vendedor
                                                </Button>
                                            </div>
                                        ) : (
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
            <div style={{ height: '20mm' }}></div>
            {/* Modal para ampliar imagem com carrossel */}
            {anuncio && (
                <Modal show={showImgModal} onHide={() => setShowImgModal(false)} centered size="lg">
                    <Modal.Body className="p-0 bg-dark">
                        <div className="position-relative">
                            <Image 
                                src={getImageUrl(anuncio.item_imagems[selectedImg])}
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
                                        onClick={() => setSelectedImg(prev => prev > 0 ? prev - 1 : anuncio.item_imagems.length - 1)}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </Button>
                                    <Button 
                                        variant="light" 
                                        className="position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle"
                                        style={{ opacity: 0.7 }}
                                        onClick={() => setSelectedImg(prev => prev < anuncio.item_imagems.length - 1 ? prev + 1 : 0)}
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
                                                        backgroundColor: index === selectedImg ? '#fff' : 'rgba(255,255,255,0.5)',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => setSelectedImg(index)}
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
            {/* Chat comprador-vendedor */}
            {anuncio && (
                <UserToUserChat 
                    show={showUserChat} 
                    onClose={() => setShowUserChat(false)} 
                    anuncioId={anuncio.ID_Anuncio} 
                    vendedorId={anuncio.UtilizadorID_User} 
                    vendedorNome={anuncio.utilizador?.Name}
                />
            )}
            {/* Modal de Troca */}
            <Modal show={showTrocaModal} onHide={() => setShowTrocaModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Propor Troca</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="mb-3">Selecione um dos seus anúncios para trocar</h5>
                    {loadingMeusAnuncios ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Carregando seus anúncios...</p>
                        </div>
                    ) : meusAnuncios.length === 0 ? (
                        <Alert variant="info">
                            Você não possui anúncios ativos para propor uma troca.
                            <br />
                            <Link to="/anuncios/criar" className="alert-link">Criar um anúncio</Link>
                        </Alert>
                    ) : (
                        <Row xs={1} md={2} className="g-4">
                            {meusAnuncios.map((meuAnuncio) => (
                                <Col key={meuAnuncio.ID_Anuncio}>
                                    <Card>
                                        <Card.Img 
                                            variant="top" 
                                            src={meuAnuncio.item_imagems?.[0]?.Caminho 
                                                ? `http://localhost:8000/storage/${meuAnuncio.item_imagems[0].Caminho.replace(/^public\//, '')}`
                                                : '/images/no-image.jpg'} 
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <Card.Body>
                                            <Card.Title>{meuAnuncio.Titulo}</Card.Title>
                                            <Card.Text>
                                                <Badge bg="secondary" className="me-2">
                                                    {meuAnuncio.categorium?.Descricao_Categoria || 'Categoria N/A'}
                                                </Badge>
                                                <Badge bg="info">
                                                    €{meuAnuncio.Preco?.toFixed(2) || '0.00'}
                                                </Badge>
                                            </Card.Text>
                                            <Button 
                                                variant="primary" 
                                                className="w-100"
                                                onClick={() => handleProporTroca(meuAnuncio.ID_Anuncio)}
                                            >
                                                Propor Troca
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};
export default DetalhesProduto;
