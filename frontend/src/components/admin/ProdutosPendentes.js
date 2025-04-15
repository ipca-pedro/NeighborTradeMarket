import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Card, Badge, Spinner, Row, Col, Image, Carousel } from 'react-bootstrap';
import { adminService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const ProdutosPendentes = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProdutoId, setSelectedProdutoId] = useState(null);
    const [comentario, setComentario] = useState('');
    const [selectedProduto, setSelectedProduto] = useState(null);

    useEffect(() => {
        loadProdutosPendentes();
    }, []);

    const loadProdutosPendentes = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await adminService.getAnunciosPendentes();
            console.log('Resposta completa:', response);
            
            // Verificar se temos dados na resposta
            if (response.data) {
                setProdutos(Array.isArray(response.data) ? response.data : []);
            } else {
                setProdutos([]);
            }
            
            setError('');
        } catch (err) {
            console.error('Erro ao carregar produtos pendentes:', err);
            setError(err.message || 'Erro ao carregar produtos pendentes. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleAprovar = async (produtoId) => {
        try {
            setError(''); // Limpar erro anterior
            setMessage(''); // Limpar mensagem anterior
            setLoading(true); // Indicar que está carregando
            
            console.log('Iniciando aprovação do anúncio:', produtoId);
            const response = await adminService.aprovarAnuncio(produtoId);
            console.log('Resposta da aprovação:', response);
            
            setMessage('Anúncio aprovado com sucesso!');
            // Remover o produto da lista
            setProdutos(produtos.filter(p => p.ID_Anuncio !== produtoId));
        } catch (err) {
            console.error('Erro ao aprovar anúncio:', err);
            setError(err.message || 'Erro ao aprovar anúncio. Por favor, tente novamente.');
            
            // Se for erro de autenticação, redirecionar para login
            if (err.response?.status === 401) {
                // Aqui você pode adicionar lógica para redirecionar para a página de login
                setError('Sessão expirada. Por favor, faça login novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRejeitar = (produto) => {
        setSelectedProdutoId(produto.ID_Anuncio);
        setSelectedProduto(produto);
        setComentario('');
        setShowModal(true);
    };

    const confirmRejeitar = async () => {
        if (!comentario.trim()) {
            return;
        }

        try {
            await adminService.rejeitarAnuncio(selectedProdutoId, comentario);
            setMessage('Anúncio rejeitado com sucesso!');
            // Remover o produto da lista
            setProdutos(produtos.filter(p => p.ID_Anuncio !== selectedProdutoId));
            setShowModal(false);
        } catch (err) {
            console.error('Erro ao rejeitar anúncio:', err);
            setError('Erro ao rejeitar anúncio. Por favor, tente novamente.');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };

    const renderImages = (images) => {
        if (!images || images.length === 0) {
            return (
                <div className="text-center p-4 bg-light" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
                </div>
            );
        }

        if (images.length === 1) {
            return (
                <div style={{ height: '300px', backgroundColor: '#f8f9fa' }}>
                    <img
                        src={`/storage/${images[0].imagem}`}
                        alt="Imagem do produto"
                        className="card-img-top"
                        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                    />
                </div>
            );
        }

        return (
            <Carousel style={{ height: '300px', backgroundColor: '#f8f9fa' }}>
                {images.map((img, index) => (
                    <Carousel.Item key={index}>
                        <img
                            src={`/storage/${img.imagem}`}
                            alt={`Imagem ${index + 1} do produto`}
                            style={{ height: '300px', width: '100%', objectFit: 'contain' }}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        );
    };

    return (
        <>
            <Header />
            <Container className="my-5">
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h2 className="mb-0">Anúncios Pendentes</h2>
                    </Card.Header>
                    <Card.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">Carregando anúncios pendentes...</p>
                            </div>
                        ) : produtos.length === 0 ? (
                            <Alert variant="info">Não há anúncios pendentes de aprovação.</Alert>
                        ) : (
                            <Row xs={1} md={2} className="g-4">
                                {produtos.map(produto => (
                                    <Col key={produto.ID_Anuncio}>
                                        <Card className="h-100 shadow-sm">
                                            {renderImages(produto.item_imagems)}
                                            <Card.Body>
                                                <Card.Title className="h5 mb-3">{produto.Titulo}</Card.Title>
                                                <Card.Subtitle className="mb-3 text-primary fw-bold">
                                                    {formatCurrency(produto.Preco)}
                                                </Card.Subtitle>
                                                <Card.Text className="mb-3">
                                                    {produto.Descricao}
                                                </Card.Text>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <Badge bg="info" pill>
                                                        {produto.categorium?.Nome || 'Sem categoria'}
                                                    </Badge>
                                                    <Badge bg="secondary" pill>
                                                        {produto.tipo_item?.Nome || 'Não especificado'}
                                                    </Badge>
                                                </div>
                                                <div className="border-top pt-3">
                                                    <p className="mb-2">
                                                        <strong>Utilizador:</strong> {produto.utilizador?.Name || 'Desconhecido'}
                                                    </p>
                                                    <p className="mb-2">
                                                        <small className="text-muted">
                                                            Email: {produto.utilizador?.Email || 'N/A'}
                                                        </small>
                                                    </p>
                                                    <p className="mb-0">
                                                        <small className="text-muted">
                                                            Data: {produto.aprovacao?.Data_Submissao ? new Date(produto.aprovacao.Data_Submissao).toLocaleDateString() : 'Pendente'}
                                                        </small>
                                                    </p>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer className="bg-white">
                                                <div className="d-flex justify-content-between">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-2 px-4"
                                                        onClick={() => handleAprovar(produto.ID_Anuncio)}
                                                    >
                                                        <i className="fas fa-check me-2"></i> Aprovar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="px-4"
                                                        onClick={() => handleRejeitar(produto)}
                                                    >
                                                        <i className="fas fa-times me-2"></i> Rejeitar
                                                    </Button>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal de Rejeição */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Rejeitar Anúncio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduto && (
                        <Row className="mb-4">
                            <Col md={4}>
                                {renderImages(selectedProduto.item_imagems, { height: '200px' })}
                            </Col>
                            <Col md={8}>
                                <h5>{selectedProduto.Titulo}</h5>
                                <p className="text-muted">{selectedProduto.Descricao}</p>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Badge bg="info">{selectedProduto.categorium?.Nome || 'Sem categoria'}</Badge>
                                    <span className="fw-bold">{formatCurrency(selectedProduto.Preco)}</span>
                                </div>
                                <small className="text-muted d-block">
                                    Anunciante: {selectedProduto.utilizador?.Name}
                                </small>
                            </Col>
                        </Row>
                    )}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Motivo da rejeição</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                placeholder="Informe o motivo da rejeição do anúncio"
                                required
                            />
                            <Form.Text className="text-muted">
                                Este comentário será enviado ao utilizador para que ele possa corrigir o anúncio.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={confirmRejeitar}
                        disabled={!comentario.trim()}
                    >
                        Confirmar Rejeição
                    </Button>
                </Modal.Footer>
            </Modal>
            <Footer />
        </>
    );
};

export default ProdutosPendentes;
